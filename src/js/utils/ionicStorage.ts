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

export const storageSetObject = async (key, id, val) => {

  const all = await storage.get(key);
  const objIndex = await all.findIndex(a => parseInt(a.id) === parseInt(id));

  all[objIndex] = val;
  storageSet(key, all);
}


export const storagegetObject = async (key, id) => {

  const all = await storage.get(key);
  const obj = await all.filter(a => parseInt(a.id) === parseInt(id))[0];
  return obj;
}

export const storageremoveObject = async (key, id) => {

  const all = await storage.get(key);
  const objIndex = await all.findIndex(a => parseInt(a.id) === parseInt(id));

  all.splice(objIndex, 1);
  storageSet(key, all);
}