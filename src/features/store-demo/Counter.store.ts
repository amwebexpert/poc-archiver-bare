import { autorun, makeAutoObservable, runInAction } from "mobx";

class CounterStore {
  counter = 0;

  constructor() {
    makeAutoObservable(this);
  }

  reset(): void {
    runInAction(() => (this.counter = 0));
  }

  increment() {
    runInAction(() => this.counter++);
  }
}

const observableCounterStore = new CounterStore();

autorun(() => {
  //console.info("observableCounterStore.counter: ", observableCounterStore.counter);
});

export default observableCounterStore;

const timerId = setInterval(() => observableCounterStore.increment(), 1000);
console.info("====>>> started counter", timerId);
