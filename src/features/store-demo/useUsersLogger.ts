import { useEffect } from "react";
import { User } from "./Users.store";

export const useUserLogger = (users: User[]) => {
  console.log(`useUserLogger hook called. Users count: ${users.length}`);

  useEffect(() => {
    console.log(`Users changed (useEffect). Count: ${users.length}`, { firstUser: users[0] });
  }, [users]);
};
