import { autorun, makeAutoObservable, runInAction, spy } from "mobx";
import { AppTheme, darkTheme, lightTheme } from "../../theme";
import { loadData, storeData, StorageKey } from "../../utils/storage";

class SettingsStore {
  darkMode: boolean = true;

  constructor() {
    makeAutoObservable(this);
    this.loadSettings();
  }

  async loadSettings() {
    const persistedValue = await loadData(StorageKey.darkMode, true);
    console.info("darkMode persisted loaded value:", persistedValue);
    runInAction(() => (this.darkMode = persistedValue));
  }

  async toggleDarkMode() {
    const toggledValue = !this.darkMode;
    await storeData(StorageKey.darkMode, toggledValue);
    runInAction(() => (this.darkMode = toggledValue));
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
