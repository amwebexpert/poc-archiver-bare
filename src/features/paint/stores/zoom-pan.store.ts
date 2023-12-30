import { makeAutoObservable, runInAction, spy } from "mobx";
import { createMobxDebugger } from "mobx-flipper";

export type ZoomPanInfoType = {
  zoomLevel: number;
  offsetX: number;
  offsetY: number;
  translateX: number;
  translateY: number;
};

const DEFAULT_ZOOM_LEVEL = 0.95;

class ZoomPanInfoStore {
  _zoomLevel = DEFAULT_ZOOM_LEVEL;
  _offsetX = 0; // offset from the zoomed subject center (@see openspacelabs/react-native-zoomable-view doc)
  _offsetY = 0;
  _translateX = 0; // <View> style "transform" attributes
  _translateY = 0;

  constructor() {
    makeAutoObservable(this);
  }

  // getters and setters
  // ------------------------------
  get zoomLevel(): number {
    return this._zoomLevel;
  }

  set zoomLevel(zoomLevel: number) {
    runInAction(() => {
      this._zoomLevel = zoomLevel;
    });
  }

  get offsetX(): number {
    return this._offsetX;
  }

  set offsetX(offsetX: number) {
    runInAction(() => {
      this._offsetX = offsetX;
    });
  }

  get offsetY(): number {
    return this._offsetY;
  }

  set offsetY(offsetY: number) {
    runInAction(() => {
      this._offsetY = offsetY;
    });
  }

  get translateX(): number {
    return this._translateX;
  }

  set translateX(translateX: number) {
    runInAction(() => {
      this._translateX = translateX;
    });
  }

  get translateY(): number {
    return this._translateY;
  }

  set translateY(translateY: number) {
    runInAction(() => {
      this._translateY = translateY;
    });
  }

  // actions
  // ------------------------------
  reset() {
    runInAction(() => {
      this.zoomLevel = DEFAULT_ZOOM_LEVEL;
      this.offsetX = 0;
      this.offsetY = 0;
      this.translateX = 0;
      this.translateY = 0;
    });
  }
}

const zoomPanInfoStore = new ZoomPanInfoStore();

if (__DEV__) {
  spy(createMobxDebugger(zoomPanInfoStore) as any);
}

export default zoomPanInfoStore;
