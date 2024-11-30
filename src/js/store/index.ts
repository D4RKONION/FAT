import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import createTransform from "redux-persist/es/createTransform";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

import * as actionCreators from "../actions";
import rootReducer, { RootState } from "../reducers";

// automerge2-ing state causes too many unwanted sideeffects,
// so we'll make sure that dataDisplaySettings has everything here
const dataDisplaySettingsTransform = createTransform(
  (dataDisplaySettingsState: RootState["dataDisplaySettingsState"]) => dataDisplaySettingsState, // no transform on persist
  (dataDisplaySettingsState: RootState["dataDisplaySettingsState"]) => { // about to be rehyrdated
    if (!dataDisplaySettingsState.normalNotationType) {
      return {...dataDisplaySettingsState, normalNotationType: "fullWord"};
    } else {
      return dataDisplaySettingsState;
    }
  },
  {whitelist: ["dataDisplaySettingsState"]}
);

const rootPersistConfig = {
  key: "root",
  storage,
  blacklist: ["modeNameState", "activePlayerState", "frameDataState", "advantageModifiersState", "adviceToastState"], // some persist config takes place in reducers/index.ts
  transforms: [dataDisplaySettingsTransform],
};

const persistedReducer = persistReducer<RootState>(rootPersistConfig, rootReducer);

const composeEnhancers = composeWithDevTools({
  actionCreators,
  trace: true,
  traceLimit: 25,
});

const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk)));

const persistor = persistStore(store);

export { persistor, store };
