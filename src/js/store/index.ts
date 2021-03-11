import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import thunk from 'redux-thunk';

import rootReducer from '../reducers';

import { composeWithDevTools } from "redux-devtools-extension";
import * as actionCreators from "../actions";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["modeNameState", "activePlayerState", "frameDataState", "counterHitState", "adviceToastDismissedState"]
}


const persistedReducer = persistReducer(persistConfig, rootReducer)


const composeEnhancers = composeWithDevTools({
    actionCreators,
    trace: true,
    traceLimit: 25,
  })

const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk)));

const persistor = persistStore(store);

export { persistor, store };
