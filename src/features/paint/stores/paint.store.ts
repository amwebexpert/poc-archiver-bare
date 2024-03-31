import { pick, types } from "react-native-document-picker";
import { DocumentDirectoryPath, DownloadDirectoryPath, readFile, writeFile } from "react-native-fs";
import { format } from "date-fns";
import { autorun, makeAutoObservable, runInAction } from "mobx";
import { CanvasDimensions, CanvasMode, DEFAULT_CANVAS_DIMENSIONS } from "../types/canvas.types";
import { SvgElement } from "../types/svg.types";
import { fromSvgFormat, toSvgFormat } from "../utils/svg-serialization.utils";
import zoomPanInfoStore from "./zoom-pan.store";
import { Platform } from "react-native";

class PaintStore {
  zoomAndPanInfo = zoomPanInfoStore;

  _canvasMode: CanvasMode = CanvasMode.DRAW;
  _elements: SvgElement[] = [];
  _selectedElementIDs: number[] = [];
  _undoHistory: SvgElement[][] = [];

  _isDrawGestureDirty = false;

  _isSaved = true;
  _isSaving = false;
  _isOpening = false;

  _canvasDimensions: CanvasDimensions = DEFAULT_CANVAS_DIMENSIONS;

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

  async open() {
    this.isOpening = true;

    try {
      const [pickResult] = await pick({ type: types.allFiles, mode: "import" });
      const file = Platform.OS === "ios" ? pickResult.uri.replace("file://", "") : pickResult.uri;
      // const file = "/data/user/0/com.pocarchiverbare/files/test-2024-03-31-07-51-33.svg";

      const { screenScale } = this.canvasDimensions;
      const content = await readFile(file, "utf8");
      const elements: SvgElement[] = fromSvgFormat({ content, screenScale });

      paintStore.reset(elements);
    } catch (err: unknown) {
      console.error("error opening file", err);
    } finally {
      this.isOpening = false;
    }
  }

  async save(base64Snapshot: string) {
    this.isSaving = true;

    try {
      const data = toSvgFormat({ elements: this._elements });
      // console.info("\t base64 snapshot", base64Snapshot.substring(0, 200) + "...");
      console.info("Saving svg content", data.substring(0, 200) + "...");

      const timestamp = format(new Date(), "yyyy-MM-dd-HH-mm-ss");
      const filename = `test-${timestamp}.svg`;
      const directory = Platform.OS === "ios" ? DocumentDirectoryPath : DownloadDirectoryPath;
      const fullFilename = `${directory}/${filename}`;

      await writeFile(fullFilename, data, "utf8");

      this.isSaved = true;
    } catch (err: unknown) {
      console.error("error saving file", err);
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

      this._isDrawGestureDirty = false;
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
  // console.info("elements", paintStore.elements.length);
  //console.info("_isDrawGestureDirty", paintStore._isDrawGestureDirty);
});

export default paintStore;
