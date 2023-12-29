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
  zoomLevel = DEFAULT_ZOOM_LEVEL;
  offsetX = 0; // offset from the zoomed subject center (@see openspacelabs/react-native-zoomable-view doc)
  offsetY = 0;
  translateX = 0; // <View> style "transform" attributes
  translateY = 0;

  constructor() {
    makeAutoObservable(this);
  }

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
