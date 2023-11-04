import AsyncStorage from "@react-native-async-storage/async-storage";

export enum StorageKey {
  language = "settings.language",
  darkMode = "settings.darkMode",
}

export const storeData = async <DataType>(key: StorageKey, data: DataType) => {
  console.info("Storing data:", key, data);
  const stringifiedData = JSON.stringify(data);
  AsyncStorage.setItem(key as string, stringifiedData);
};

export const loadData = async <DataType>(key: StorageKey, defaultValue: DataType): Promise<DataType> => {
  const stringifiedData = await AsyncStorage.getItem(key);
  console.info("Loading data:", key, stringifiedData);
  if (stringifiedData === null || stringifiedData === undefined) {
    return defaultValue;
  }

  return JSON.parse(stringifiedData);
};

export const removeData = async (key: StorageKey) => AsyncStorage.removeItem(key);
