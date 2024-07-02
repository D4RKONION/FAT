import { Storage, Drivers } from "@ionic/storage";

let storage;

export const createStorage = (name = "__mydb") => {
    storage = new Storage({
        
        name,
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    });

    storage.create();
}

export const storageSet = (key, val) => {

  storage.set(key, val);
}

export const storageGet = async key => {
  
  const val = await storage.get(key);
  return val;
}

export const storageRemove = async key => {

  await storage.remove(key);
}

export const storageClear = async () => {

  await storage.clear();
}