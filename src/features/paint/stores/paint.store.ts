import { makeAutoObservable, runInAction, spy } from "mobx";
import { createMobxDebugger } from "mobx-flipper";
import { CanvasMode } from "../types/canvas.types";
import { SvgElement } from "../types/svg.types";
import { toSvgFormat } from "../utils/svg-serialization.utils";
import zoomPanInfoStore from "./zoom-pan.store";

class PaintStore {
  zoomAndPanInfo = zoomPanInfoStore;

  canvasMode: CanvasMode = CanvasMode.DRAW;
  elements: SvgElement[] = [];
  selectedElementIDs: number[] = [];
  undoHistory: SvgElement[][] = [];

  isDrawGestureDirty = false;

  isSaved = true;
  isSaving = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isDrawMode(): boolean {
    return this.canvasMode === CanvasMode.DRAW;
  }

  get isZoomPanMode(): boolean {
    return this.canvasMode === CanvasMode.TRANSFORM;
  }

  get isSelectorMode(): boolean {
    return this.canvasMode === CanvasMode.SELECTOR;
  }

  get isTransformMode(): boolean {
    return this.canvasMode === CanvasMode.TRANSFORM;
  }

  get hasSelectedElements(): boolean {
    return this.selectedElementIDs.length > 0;
  }

  get elementsCount(): number {
    return this.elements.length;
  }

  get isCanvasEmpty(): boolean {
    return this.elementsCount === 0;
  }

  get hasUndoHistory(): boolean {
    return this.undoHistory.length > 0;
  }

  async save(base64Snapshot: string) {
    runInAction(() => {
      this.isSaving = true;
      console.info("saving simulation");
      console.info("\t base64 snapshot", base64Snapshot.substring(0, 200) + "...");
      console.info("\t *.svg content", toSvgFormat({ elements: this.elements }).substring(0, 200) + "...");
    });

    setTimeout(() => {
      runInAction(() => {
        this.isSaved = true;
        this.isSaving = false;
        console.info("saving simulation completed");
      });
    }, 3000);
  }

  reset(elements: SvgElement[] = []) {
    this.zoomAndPanInfo.reset();

    runInAction(() => {
      this.canvasMode = CanvasMode.DRAW;
      this.elements = elements;
      this.selectedElementIDs = [];
      this.undoHistory = [];

      this.isDrawGestureDirty = false;
      this.isSaved = true;
    });
  }

  addDrawElement(newElement: SvgElement) {
    runInAction(() => {
      this.undoHistory = [...this.undoHistory, this.elements];
      this.elements = [...this.elements, newElement];
      this.isSaved = false;
    });
  }

  undo() {
    if (!this.hasUndoHistory) {
      return;
    }

    runInAction(() => {
      const lastElements = this.undoHistory[this.undoHistory.length - 1];

      this.undoHistory = this.undoHistory.slice(0, -1);
      this.elements = lastElements;
      this.isSaved = false;
    });
  }

  deleteSelectedElements() {
    runInAction(() => {
      this.undoHistory = [...this.undoHistory, this.elements];
      this.elements = this.elements.filter(elem => !this.selectedElementIDs.includes(elem.id));
      this.isSaved = false;
    });
  }

  updateDrawElement(updated: SvgElement) {
    runInAction(() => {
      this.undoHistory = [...this.undoHistory, this.elements];
      this.elements = this.elements.map(elem => (elem.id === updated.id ? updated : elem));
      this.isSaved = false;
    });
  }

  selectElement(element: SvgElement) {
    // multiple elements selection not supported (yet)
    runInAction(() => {
      this.selectedElementIDs = [];
    });

    this.toggleElementSelection(element);
    this.changeCanvasMode(CanvasMode.TRANSFORM);
  }

  toggleElementSelection(element: SvgElement) {
    const elementID = element.id;
    const selections = this.selectedElementIDs;

    const newSelectedElementIDs = selections.includes(elementID)
      ? selections.filter(id => id !== elementID)
      : [...selections, elementID];

    runInAction(() => {
      this.selectedElementIDs = newSelectedElementIDs;
    });
  }

  changeCanvasMode(newCanvasMode: CanvasMode) {
    runInAction(() => {
      // if we switch to draw mode, we reset the selected elements
      if (newCanvasMode === CanvasMode.DRAW) {
        this.selectedElementIDs = [];
      }
      this.canvasMode = newCanvasMode;
    });
  }

  setCanvasModeToDraw() {
    this.changeCanvasMode(CanvasMode.DRAW);
  }

  setCanvasModeToTransform() {
    this.changeCanvasMode(CanvasMode.TRANSFORM);
  }

  setCanvasModeToSelector() {
    this.changeCanvasMode(CanvasMode.SELECTOR);
  }

  setCanvasModeToZoomPan() {
    this.changeCanvasMode(CanvasMode.ZOOM_PAN);
  }
}

const paintStore = new PaintStore();

if (__DEV__) {
  spy(createMobxDebugger(paintStore) as any);
}

export default paintStore;
