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

const persistor = persistStore(store, null, () => {
  // Having this inside App.jsx was causing strange side effects.
  // https://stackoverflow.com/a/55571554

  // G says: remove this check and the blacklister?
  if (!store.getState().frameDataState) {
    store.dispatch(actionCreators.getFrameData(store.getState().activeGameState));
  }

})

export { persistor, store };
