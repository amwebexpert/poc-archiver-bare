import { autorun, makeAutoObservable, runInAction } from "mobx";

export const DEFAULT_STROKE_WIDTH = 3;
export const DEFAULT_STROKE_COLOR = "black";
export const DEFAULT_FILL_COLOR = "none";

class BrushStore {
  _size = DEFAULT_STROKE_WIDTH;
  _color = DEFAULT_STROKE_COLOR;
  _fill = DEFAULT_FILL_COLOR;

  constructor() {
    makeAutoObservable(this);
  }

  // getters and setters
  // ------------------------------
  get size(): number {
    return this._size;
  }

  set size(value: number) {
    runInAction(() => (this._size = value));
  }

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    runInAction(() => (this._color = value));
  }

  get fill(): string {
    return this._fill;
  }

  set fill(value: string) {
    runInAction(() => (this._fill = value));
  }
}

const brushStore = new BrushStore();

autorun(() => {
  console.info("size", brushStore.size);
});

export default brushStore;
