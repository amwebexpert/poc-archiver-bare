import { makeAutoObservable, runInAction, spy } from "mobx";
import { createMobxDebugger } from "mobx-flipper";

class PaintStore {
  zoomLevel: number = 1;

  constructor() {
    makeAutoObservable(this);
  }
}

const paintStore = new PaintStore();

if (__DEV__) {
  spy(createMobxDebugger(paintStore) as any);
}

export default paintStore;
