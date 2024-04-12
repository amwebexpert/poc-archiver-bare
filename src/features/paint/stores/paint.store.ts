import { autorun, makeAutoObservable, runInAction } from "mobx";
import { exists, readFile, writeFile } from "react-native-fs";
import { askConfirmation } from "../../../utils/alert.utils";
import { CanvasDimensions, CanvasMode, CanvasSurface, DEFAULT_CANVAS_DIMENSIONS } from "../types/canvas.types";
import { SvgElement } from "../types/svg.types";
import { computeMaxDimensionsForAspectRatio } from "../utils/canvas.utils";
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

  set canvasMode(mode: CanvasMode) {
    runInAction(() => {
      this._canvasMode = mode;
    });
  }

  get elements(): SvgElement[] {
    return this._elements.map(elem => ({ ...elem, isSelected: this.isElementSelected(elem) }));
  }

  set elements(elements: SvgElement[]) {
    runInAction(() => {
      this._elements = elements;
    });
  }

  get selectedElementIDs(): number[] {
    return this._selectedElementIDs;
  }

  set selectedElementIDs(ids: number[]) {
    runInAction(() => {
      this._selectedElementIDs = ids;
    });
  }

  get isDrawGestureDirty(): boolean {
    return this._isDrawGestureDirty;
  }

  set isDrawGestureDirty(isDirty: boolean) {
    runInAction(() => {
      this._isDrawGestureDirty = isDirty;
    });
  }

  get isSaved(): boolean {
    return this._isSaved;
  }

  set isSaved(isSaved: boolean) {
    runInAction(() => {
      this._isSaved = isSaved;
    });
  }

  get isSaving(): boolean {
    return this._isSaving;
  }

  set isSaving(isSaving: boolean) {
    runInAction(() => {
      this._isSaving = isSaving;
    });
  }

  get isOpening(): boolean {
    return this._isOpening;
  }

  set isOpening(isOpening: boolean) {
    runInAction(() => {
      this._isOpening = isOpening;
    });
  }

  get canvasDimensions(): CanvasDimensions {
    return this._canvasDimensions;
  }

  set canvasDimensions(dimensions: CanvasDimensions) {
    runInAction(() => {
      this._canvasDimensions = dimensions;
    });
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

  set paintFile(paintFile: string) {
    runInAction(() => {
      this._paintFile = paintFile;
    });
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
    runInAction(() => {
      this._canvasMode = CanvasMode.TRANSFORM;
    });
  }

  setCanvasModeToSelector() {
    runInAction(() => {
      this._canvasMode = CanvasMode.SELECTOR;
    });
  }

  setCanvasModeToZoomPan() {
    runInAction(() => {
      this._canvasMode = CanvasMode.ZOOM_PAN;
    });
  }

  onCanvasParentLayoutDimensions({ width, height }: CanvasSurface) {
    this.canvasDimensions = computeMaxDimensionsForAspectRatio({ width, height });
  }

  async open() {
    const paintFile = await pickFile();
    if (!paintFile) {
      return;
    }

    try {
      this.isOpening = true;
      this.paintFile = paintFile;

      const { screenScale } = this.canvasDimensions;
      const content = await readFile(paintFile, "utf8");
      const elements: SvgElement[] = fromSvgFormat({ content, screenScale });

      paintStore.reset(elements);
    } catch (err: unknown) {
      console.error("error opening file", err);
    } finally {
      this.isOpening = false;
    }
  }

  async save(base64Snapshot: string): Promise<boolean> {
    const isFileExists = await exists(this.paintFile);
    const { filename, fullFilenamePreview } = parsePaintFile(this.paintFile);
    if (isFileExists) {
      const shouldReplaceExisting = await askConfirmation(`Override "${filename}" file?`);
      if (!shouldReplaceExisting) {
        return false;
      }
    }

    this.isSaving = true;

    try {
      const { screenScale } = this.canvasDimensions;
      const data = toSvgFormat({ elements: this.elements, screenScale });

      await writeFile(this.paintFile, data, "utf8");
      await writeFile(fullFilenamePreview, base64Snapshot, "base64");

      this.isSaved = true;
      return true;
    } catch (err: unknown) {
      console.error("error saving file", err);
      return false;
    } finally {
      this.isSaving = false;
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

    runInAction(() => {
      this._selectedElementIDs = newSelectedElementIDs;
    });
  }
}

const paintStore = new PaintStore();

autorun(() => {
  console.info("paintStore.paintFile", paintStore.paintFile);
  // console.info("elements", paintStore.elements.length);
  //console.info("_isDrawGestureDirty", paintStore._isDrawGestureDirty);
});

export default paintStore;
