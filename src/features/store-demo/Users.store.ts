import axios from "axios";

import { autorun, makeAutoObservable, runInAction } from "mobx";
import { spy } from "mobx";
import { createMobxDebugger } from "mobx-flipper";
import { USERS_API_URL } from "@env";

export type User = {
  id: number;
  email: string;
};

class UsersStore {
  users: User[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get usersLoadCompleted(): boolean {
    return this.users.length > 0;
  }

  get usersCount(): number {
    return this.users.length;
  }

  resetUsers(): void {
    runInAction(() => {
      this.users = [];
    });
  }

  async loadUsers(): Promise<void> {
    this.resetUsers();

    const url = USERS_API_URL;
    console.log(`Loading users from [${url}]...`);
    const result = await axios.get(url);
    const users = result.data;

    console.log(`Loaded ${users.length} users from jsonplaceholder http api call`);

    setTimeout(() => {
      runInAction(() => {
        this.users = users;
      });
    }, 2000);
  }
}

const observableUsersStore = new UsersStore();

autorun(() => {
  console.info("Loaded users count: ", observableUsersStore.usersLoadCompleted);
});

if (__DEV__) {
  spy(createMobxDebugger(observableUsersStore) as any);
}

export default observableUsersStore;
