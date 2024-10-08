import { autorun, makeAutoObservable, runInAction } from "mobx";
import { exists, readFile, writeFile } from "react-native-fs";
import { askConfirmation } from "../../../utils/alert.utils";
import {
  BoundingBox,
  CanvasDimensions,
  CanvasMode,
  CanvasSurface,
  DEFAULT_CANVAS_DIMENSIONS,
} from "../types/canvas.types";
import { SvgElement } from "../types/svg.types";
import { computeBoundingBox, computeMaxDimensionsForAspectRatio } from "../utils/canvas.utils";
import { fromSvgFormat, toSvgFormat } from "../utils/svg-serialization.utils";
import brushStore from "./brush.store";
import { newPaintFile, parsePaintFile, pickFile } from "./paint.store.utils";
import zoomPanInfoStore from "./zoom-pan.store";

class PaintStore {
  zoomAndPanInfo = zoomPanInfoStore;
  brushStore = brushStore;

  _canvasMode: CanvasMode = CanvasMode.DRAW;
  _elements: SvgElement[] = [];
  _selectedElementIDs: number[] = [];
  _undoHistory: SvgElement[][] = [];

  _isDrawGestureDirty = false;

  _isSaved = true;
  _isSaving = false;
  _isOpening = false;

  _canvasDimensions: CanvasDimensions = DEFAULT_CANVAS_DIMENSIONS;
  _paintFile = newPaintFile("test");

  constructor() {
    makeAutoObservable(this);
  }

  // helpers
  // ------------------------------
  isElementSelected(element: SvgElement) {
    return this._selectedElementIDs.includes(element.id);
  }

  // getters and setters
  // ------------------------------
  get canvasMode(): CanvasMode {
    return this._canvasMode;
  }

  get elements(): SvgElement[] {
    return this._elements.map(elem => ({ ...elem, isSelected: this.isElementSelected(elem) }));
  }

  get selectedElementIDs(): number[] {
    return this._selectedElementIDs;
  }

  get isDrawGestureDirty(): boolean {
    return this._isDrawGestureDirty;
  }

  set isDrawGestureDirty(isDirty: boolean) {
    runInAction(() => (this._isDrawGestureDirty = isDirty));
  }

  get isSaved(): boolean {
    return this._isSaved;
  }

  get isSaving(): boolean {
    return this._isSaving;
  }

  get isOpening(): boolean {
    return this._isOpening;
  }

  get canvasDimensions(): CanvasDimensions {
    return this._canvasDimensions;
  }

  get isCanvasDimensionsAvailable(): boolean {
    return !!this._canvasDimensions;
  }

  // computed values
  // ------------------------------
  get isDrawMode(): boolean {
    return this._canvasMode === CanvasMode.DRAW;
  }

  get isZoomPanMode(): boolean {
    return this._canvasMode === CanvasMode.ZOOM_PAN;
  }

  get isSelectorMode(): boolean {
    return this._canvasMode === CanvasMode.SELECTOR;
  }

  get isTransformMode(): boolean {
    return this._canvasMode === CanvasMode.TRANSFORM;
  }

  get hasSelectedElements(): boolean {
    return this._selectedElementIDs.length > 0;
  }

  get elementsCount(): number {
    return this._elements.length;
  }

  get isCanvasEmpty(): boolean {
    return this.elementsCount === 0;
  }

  get hasUndoHistory(): boolean {
    return this._undoHistory.length > 0;
  }

  get paintFile(): string {
    return this._paintFile;
  }

  get paintFilename(): string {
    return parsePaintFile(this.paintFile).filename;
  }

  get selectedElements(): SvgElement[] {
    return this.elements.filter(({ id }) => this.selectedElementIDs.includes(id));
  }

  get unselectedElements(): SvgElement[] {
    return this.elements.filter(({ id }) => !this.selectedElementIDs.includes(id));
  }

  get selectionBoundingBox(): BoundingBox {
    return computeBoundingBox(this.selectedElements[0]); // TODO Support multiple elements
  }

  // actions
  // ------------------------------
  setCanvasModeToDraw() {
    runInAction(() => {
      this._selectedElementIDs = [];
      this._canvasMode = CanvasMode.DRAW;
    });
  }

  setCanvasModeToTransform() {
    runInAction(() => (this._canvasMode = CanvasMode.TRANSFORM));
  }

  setCanvasModeToSelector() {
    runInAction(() => (this._canvasMode = CanvasMode.SELECTOR));
  }

  setCanvasModeToZoomPan() {
    runInAction(() => (this._canvasMode = CanvasMode.ZOOM_PAN));
  }

  onCanvasParentLayoutDimensions({ width, height }: CanvasSurface) {
    runInAction(() => {
      this._canvasDimensions = computeMaxDimensionsForAspectRatio({ width, height });
    });
  }

  setColor(selectedColor: string) {
    if (!this.isSelectorMode) {
      this.isDrawGestureDirty = true;
      this.brushStore.color = selectedColor;
    }

    runInAction(() => {
      this._undoHistory = [...this._undoHistory, this._elements];
      this._elements = this._elements.map(elem =>
        this._selectedElementIDs.includes(elem.id) ? { ...elem, strokeColor: selectedColor } : elem,
      );
      this._isSaved = false;
    });
  }

  async open() {
    const paintFile = await pickFile();
    if (!paintFile) {
      return;
    }

    try {
      runInAction(() => {
        this._isOpening = true;
        this._paintFile = paintFile;
      });

      const { screenScale } = this.canvasDimensions;
      const content = await readFile(paintFile, "utf8");
      const elements: SvgElement[] = fromSvgFormat({ content, screenScale });

      paintStore.reset(elements);
    } catch (err: unknown) {
      console.error("error opening file", err);
    } finally {
      runInAction(() => (this._isOpening = false));
    }
  }

  async save(base64Snapshot: string): Promise<boolean> {
    if (this._isSaving) {
      return false;
    }

    runInAction(() => (this._isSaving = true));

    const isFileExists = await exists(this.paintFile);
    const { filename, fullFilenamePreview } = parsePaintFile(this.paintFile);
    if (isFileExists) {
      const shouldReplaceExisting = await askConfirmation(`Override "${filename}" file?`);
      if (!shouldReplaceExisting) {
        runInAction(() => (this._isSaving = false));
        return false;
      }
    }

    try {
      const { screenScale } = this.canvasDimensions;
      const data = toSvgFormat({ elements: this.elements, screenScale });

      await writeFile(this.paintFile, data, "utf8");
      await writeFile(fullFilenamePreview, base64Snapshot, "base64");

      runInAction(() => (this._isSaved = true));
      return true;
    } catch (err: unknown) {
      console.error("error saving file", err);
      return false;
    } finally {
      runInAction(() => (this._isSaving = false));
    }
  }

  reset(elements: SvgElement[] = []) {
    this.zoomAndPanInfo.reset();

    runInAction(() => {
      this._canvasMode = CanvasMode.DRAW;
      this._elements = elements;
      this._selectedElementIDs = [];
      this._undoHistory = [];

      this._isDrawGestureDirty = true;
      this._isSaved = true;
    });
  }

  addDrawElement(newElement: SvgElement) {
    runInAction(() => {
      this._undoHistory = [...this._undoHistory, this._elements];
      this._elements = [...this._elements, newElement];
      this._isSaved = false;
    });
  }

  undo() {
    if (!this.hasUndoHistory) {
      return;
    }

    runInAction(() => {
      const lastElements = this._undoHistory[this._undoHistory.length - 1];

      this._undoHistory = this._undoHistory.slice(0, -1);
      this._elements = lastElements;
      this._isSaved = false;
      this._isDrawGestureDirty = true;
      this._selectedElementIDs = [];
    });
  }

  deleteSelectedElements() {
    runInAction(() => {
      this._undoHistory = [...this._undoHistory, this._elements];
      this._elements = this._elements.filter(elem => !this._selectedElementIDs.includes(elem.id));
      this._isSaved = false;
      this._selectedElementIDs = [];
      this._canvasMode = CanvasMode.SELECTOR;
    });
  }

  updateDrawElement(updated: SvgElement) {
    runInAction(() => {
      this._undoHistory = [...this._undoHistory, this._elements];
      this._elements = this._elements.map(elem => (elem.id === updated.id ? updated : elem));
      this._isSaved = false;
    });
  }

  selectElement(element: SvgElement) {
    // multiple _elements selection not supported (yet)
    runInAction(() => {
      this._selectedElementIDs = [];
      this._canvasMode = CanvasMode.TRANSFORM;
    });

    this.toggleElementSelection(element);
  }

  toggleElementSelection(element: SvgElement) {
    const elementID = element.id;
    const selections = this._selectedElementIDs;

    const newSelectedElementIDs = selections.includes(elementID)
      ? selections.filter(id => id !== elementID)
      : [...selections, elementID];

    runInAction(() => (this._selectedElementIDs = newSelectedElementIDs));
  }

  generateSvg() {
    // const instructions = "draw a house with 2 trees besise";
    // const instructions = "draw a square with green border";
    // const instructions = "draw a square with green border and a red circle inside";
    // const instructions = "draw a blue triangle without Z command";
    // const instructions = "draw a small green ellipse at top left corner of the viewBox";

    // console.log("====>>> instructions", instructions);

    // chatGptService.sendMessage(instructions).then(content => {
    //   console.log("====>>> content", content);
    //   const elements = fromSvgFormat({ content, screenScale: paintStore.canvasDimensions.screenScale });
    //   elements.forEach((element, index) => (element.id = index));
    //   this.reset(elements);
    // });

    const content = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1600">
        <ellipse cx="50" cy="50" rx="30" ry="20" stroke="green" stroke-width="3" fill="none" />
      </svg>
    `;
    console.info("====>>> content", content);

    const elements = fromSvgFormat({ content, screenScale: paintStore.canvasDimensions.screenScale });
    elements.forEach((element, index) => (element.id = index));
    this.reset(elements);
  }
}

const paintStore = new PaintStore();

autorun(() => {
  console.info("paintStore.paintFile", paintStore.paintFile);
  // console.info("elements", paintStore.elements.length);
  //console.info("_isDrawGestureDirty", paintStore._isDrawGestureDirty);
});

export default paintStore;
