import { autorun, makeAutoObservable, runInAction } from "mobx";
import { AppTheme, darkTheme, lightTheme } from "../../theme";

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

  get getCurrentTheme(): AppTheme {
    return this.darkMode ? darkTheme : lightTheme;
  }
}

const observableSettingsStore = new SettingsStore();

autorun(() => {
  console.info("DarkMode: ", observableSettingsStore.darkMode);
});

export default observableSettingsStore;
