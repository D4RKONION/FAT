import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import thunk from 'redux-thunk';

import rootReducer, { RootState } from '../reducers';

import { composeWithDevTools } from "redux-devtools-extension";
import * as actionCreators from "../actions";
import createTransform from 'redux-persist/es/createTransform';

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


const persistConfig = {
  key: "root",
  storage,
  blacklist: ["modeNameState", "activePlayerState", "frameDataState", "counterHitState", "vsBurntoutOpponentState", "rawDriveRush", "adviceToastDismissedState"],
  transforms: [dataDisplaySettingsTransform]
}


const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer)


const composeEnhancers = composeWithDevTools({
    actionCreators,
    trace: true,
    traceLimit: 25,
  })

const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk)));

const persistor = persistStore(store);

export { persistor, store };
