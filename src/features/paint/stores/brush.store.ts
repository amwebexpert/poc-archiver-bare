import { autorun, makeAutoObservable, runInAction } from "mobx";
import { DEFAULT_STROKE_COLOR, DEFAULT_STROKE_WIDTH } from "../constants";

class BrushStore {
  _size = DEFAULT_STROKE_WIDTH;
  _color = DEFAULT_STROKE_COLOR;

  constructor() {
    makeAutoObservable(this);
  }

  // getters and setters
  // ------------------------------
  get size(): number {
    return this._size;
  }

  set size(value: number) {
    runInAction(() => {
      this._size = value;
    });
  }

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    runInAction(() => {
      this._color = value;
    });
  }
}

const brushStore = new BrushStore();

autorun(() => {
  console.info("size", brushStore.size);
});

export default brushStore;
