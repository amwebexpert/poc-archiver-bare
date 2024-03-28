import axios from "axios";

import { autorun, makeAutoObservable, runInAction } from "mobx";
import { USERS_API_URL } from "@env";

export type User = {
  id: number;
  email: string;
};

class UsersStore {
  users: User[] = [];
  isLoading = false;
  isError = false;

  constructor() {
    makeAutoObservable(this);
  }

  get usersLoadCompleted(): boolean {
    return !this.isLoading && this.users.length > 0;
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
    runInAction(() => {
      this.isLoading = true;
      this.isError = false;
    });

    try {
      this.resetUsers();

      console.log(`Loading users from [${USERS_API_URL}]...`);
      const result = await axios.get(USERS_API_URL);
      const users = result.data;

      console.log(`Loaded ${users.length} users from jsonplaceholder http api call`);

      setTimeout(() => {
        runInAction(() => {
          this.users = users;
          this.isLoading = false;
        });
      }, 2000);
    } catch (error) {
      console.error(`Error while calling [${USERS_API_URL}]...`, error);
      runInAction(() => {
        this.isError = true;
      });
    }
  }
}

const observableUsersStore = new UsersStore();

autorun(() => {
  console.info("usersLoadCompleted: ", observableUsersStore.usersLoadCompleted);
});

export default observableUsersStore;
