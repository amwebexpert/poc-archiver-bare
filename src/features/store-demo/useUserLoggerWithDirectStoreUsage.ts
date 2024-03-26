import { useEffect } from "react";
import usersStore from "./Users.store";

export const useUserLoggerWithDirectStoreUsage = () => {
  const { users } = usersStore;

  useEffect(() => {
    console.log(`useUserLoggerWithDirectStoreUsage.useEffect. users: ${users.length}`, { firstUser: users[0] });
  }, [users]);
};
