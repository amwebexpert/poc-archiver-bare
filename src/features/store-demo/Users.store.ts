import axios from "axios";

import { autorun, makeAutoObservable, runInAction } from "mobx";

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

    const url = "https://jsonplaceholder.typicode.com/users";
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

export default observableUsersStore;
