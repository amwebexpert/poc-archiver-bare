import AsyncStorage from "@react-native-async-storage/async-storage";
import { autorun, makeAutoObservable, runInAction } from "mobx";
import { AppTheme, darkTheme, lightTheme } from "../../theme";

class SettingsStore {
  darkMode: boolean = true;

  constructor() {
    makeAutoObservable(this);
    this.loadSettings();
  }

  async loadSettings() {
    const persistedValue = await AsyncStorage.getItem("darkMode");
    console.info("darkMode persisted loaded value:", persistedValue);
    runInAction(() => (this.darkMode = persistedValue !== "false"));
  }

  async toggleDarkMode() {
    const toggledValue = !this.darkMode;
    await AsyncStorage.setItem("darkMode", `${toggledValue}`);
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
