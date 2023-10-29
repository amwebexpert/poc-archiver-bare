import axios from "axios";

import { makeAutoObservable, autorun, runInAction } from "mobx";

class SettingsStore {
  darkMode: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  resetSettings() {
    runInAction(() => {
      this.darkMode = true;
    });
  }

  async toggleDarkMode() {
    runInAction(() => {
      this.darkMode = !this.darkMode;
    });
  }
}

const observableSettingsStore = new SettingsStore();

autorun(() => {
  console.info("DarkMode: ", observableSettingsStore.darkMode);
});

export default observableSettingsStore;
