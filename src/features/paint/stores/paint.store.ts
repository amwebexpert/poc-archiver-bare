import { autorun, makeAutoObservable, runInAction, spy } from "mobx";
import { createMobxDebugger } from "mobx-flipper";
import { CanvasMode } from "../types/canvas.types";
import { SvgElement } from "../types/svg.types";
import { toSvgFormat } from "../utils/svg-serialization.utils";
import zoomPanInfoStore from "./zoom-pan.store";

class PaintStore {
  zoomAndPanInfo = zoomPanInfoStore;

  _canvasMode: CanvasMode = CanvasMode.DRAW;
  _elements: SvgElement[] = [];
  _selectedElementIDs: number[] = [];
  _undoHistory: SvgElement[][] = [];

  _isDrawGestureDirty = false;

  _isSaved = true;
  _isSaving = false;

  constructor() {
    makeAutoObservable(this);
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
    return this._elements;
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

  async save(base64Snapshot: string) {
    runInAction(() => {
      this.isSaving = true;
      console.info("saving simulation");
      console.info("\t base64 snapshot", base64Snapshot.substring(0, 200) + "...");
      console.info("\t *.svg content", toSvgFormat({ elements: this._elements }).substring(0, 200) + "...");
    });

    setTimeout(() => {
      runInAction(() => {
        this._isSaved = true;
        this.isSaving = false;
        console.info("saving simulation completed");
      });
    }, 3000);
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
    });
  }

  deleteSelectedElements() {
    runInAction(() => {
      this._undoHistory = [...this._undoHistory, this._elements];
      this._elements = this._elements.filter(elem => !this._selectedElementIDs.includes(elem.id));
      this._isSaved = false;
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
  console.info("elements", paintStore.elements.length);
  //console.info("_isDrawGestureDirty", paintStore._isDrawGestureDirty);
});

if (__DEV__) {
  spy(createMobxDebugger(paintStore) as any);
}

export default paintStore;
