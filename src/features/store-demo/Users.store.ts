import axios from "axios";

import { autorun, makeAutoObservable, runInAction } from "mobx";
import { USERS_API_URL } from "@env";
import { sleep } from "../../utils/platform.utils";

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
      await sleep(2000); // simulate network latency

      const users = result.data;

      console.log(`Loaded ${users.length} users from jsonplaceholder http api call`);

      runInAction(() => (this.users = users));
    } catch (error) {
      console.error(`Error while calling [${USERS_API_URL}]...`, error);
      runInAction(() => (this.isError = true));
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  }
}

const observableUsersStore = new UsersStore();

autorun(() => {
  console.info("usersLoadCompleted: ", observableUsersStore.usersLoadCompleted);
});

export default observableUsersStore;
