import axios from "axios";

import { makeAutoObservable, autorun, runInAction } from "mobx";

class Settings {
  darkMode: boolean;
  loadedUsers: boolean;

  constructor() {
    this.darkMode = false;
    this.loadedUsers = false;
  }
}

class SettingsStore {
  darkMode: boolean = false;
  loadedUsersCount: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get usersLoadCompleted() {
    return this.loadedUsersCount > 0;
  }

  resetSettings() {
    runInAction(() => {
      this.darkMode = false;
      this.loadedUsersCount = 0;
    });
  }

  async loadUsers() {
    const url = "https://jsonplaceholder.typicode.com/users";

    const result = await axios.get(url);
    const persons = result.data;

    console.log(`Loaded ${persons.length} users from jsonplaceholder api call`);
    setTimeout(() => {
      runInAction(() => {
        this.loadedUsersCount = persons.length;
      });
    }, 2000);
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
