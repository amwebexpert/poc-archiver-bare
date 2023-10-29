import axios from "axios";

import { observable, computed, autorun, action } from "mobx";

class Settings {
  darkMode: boolean;
  loadedUsers: boolean;

  constructor() {
    this.darkMode = false;
    this.loadedUsers = false;
  }
}

class SettingsStore {
  @observable darkMode: boolean = false;
  @observable loadedUsersCount: number = 0;

  @computed get usersLoadCompleted() {
    return this.loadedUsersCount > 0;
  }

  constructor() {
    this.resetSettings();
  }

  @action resetSettings() {
    this.darkMode = false;
    this.loadedUsersCount = 0;
  }

  @action async loadUsers() {
    const url = "https://jsonplaceholder.typicode.com/users";

    const result = await axios.get(url);
    const persons = result.data;

    console.log(`Loaded ${persons.length} users from jsonplaceholder api call`);
    this.loadedUsersCount = persons.length;
  }
}

const observableSettingsStore = new SettingsStore();

autorun(() => {
  console.info(
    "Loaded users count: ",
    observableSettingsStore.loadedUsersCount,
    observableSettingsStore.usersLoadCompleted,
  );
});

export default observableSettingsStore;
