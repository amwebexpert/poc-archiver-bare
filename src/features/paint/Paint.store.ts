import { makeAutoObservable, runInAction, spy } from "mobx";
import { createMobxDebugger } from "mobx-flipper";
import { CanvasMode } from "./constants";
import { SvgElement } from "./utils/svg.types";

type ZoomAndPanInfoType = {
  zoomLevel: number;
  offsetX: number;
  offsetY: number;
  translateX: number;
  translateY: number;
};

class PaintStore {
  zoomAndPanInfo: ZoomAndPanInfoType = {
    zoomLevel: 0.95,
    offsetX: 0, // offset from the zoomed subject center (@see openspacelabs/react-native-zoomable-view doc)
    offsetY: 0,
    translateX: 0, // <View> style "transform" attributes
    translateY: 0,
  };

  canvasMode: CanvasMode = CanvasMode.DRAW;
  elements: SvgElement[] = [];
  selectedElementIDs: number[] = [];
  undoHistory: SvgElement[][] = [];

  isDrawGestureDirty = false;
  isSaved = true;

  constructor() {
    makeAutoObservable(this);
  }
}

const paintStore = new PaintStore();

if (__DEV__) {
  spy(createMobxDebugger(paintStore) as any);
}

export default paintStore;
