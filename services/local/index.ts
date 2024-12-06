import { MMKV } from "react-native-mmkv";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const LocalStorage = new MMKV();

const LocalServices = {
  clear: () => LocalStorage.clearAll(),
  getItem: (key: StorageKey) => LocalStorage.getString(key),
  setItem: (key: StorageKey, value: boolean | string | number | Uint8Array) =>
    LocalStorage.set(key, value),
  removeItem: (key: StorageKey) => LocalStorage.delete(key),
};

export const asyncStoragePersister = createAsyncStoragePersister({
  //@ts-expect-error use StorageKey literal instead of string type of storage for easier to maintain
  storage: LocalServices,
});

export default LocalServices;
