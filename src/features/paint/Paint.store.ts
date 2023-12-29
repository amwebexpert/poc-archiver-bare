import { makeAutoObservable, runInAction, spy } from "mobx";
import { createMobxDebugger } from "mobx-flipper";
import { CanvasMode } from "./constants";
import { SvgElement } from "./utils/svg.types";

export type ZoomPanInfoType = {
  zoomLevel: number;
  offsetX: number;
  offsetY: number;
  translateX: number;
  translateY: number;
};

const DEFAULT_ZOOM_PAN: ZoomPanInfoType = {
  zoomLevel: 0.95,
  offsetX: 0, // offset from the zoomed subject center (@see openspacelabs/react-native-zoomable-view doc)
  offsetY: 0,
  translateX: 0, // <View> style "transform" attributes
  translateY: 0,
};

class PaintStore {
  zoomAndPanInfo = DEFAULT_ZOOM_PAN;

  canvasMode: CanvasMode = CanvasMode.DRAW;
  elements: SvgElement[] = [];
  selectedElementIDs: number[] = [];
  undoHistory: SvgElement[][] = [];

  isDrawGestureDirty = false;
  isSaved = true;

  constructor() {
    makeAutoObservable(this);
  }

  reset(elements: SvgElement[] = []) {
    runInAction(() => {
      this.zoomAndPanInfo = DEFAULT_ZOOM_PAN;

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
}

const paintStore = new PaintStore();

if (__DEV__) {
  spy(createMobxDebugger(paintStore) as any);
}

export default paintStore;
