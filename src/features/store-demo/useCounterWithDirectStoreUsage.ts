import { useEffect } from "react";
import counterStore from "./Counter.store";

export const useCounterWithDirectStoreUsage = () => {
  const { counter } = counterStore;

  useEffect(() => {
    console.log(`useCounterWithDirectStoreUsage.useEffect. count: ${counter}`);
  }, [counter]);
};
