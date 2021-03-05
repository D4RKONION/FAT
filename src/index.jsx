import React from 'react';
import ReactDOM from 'react-dom';
import AppComponent from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux'
import { persistor, store } from './js/store'

import { PersistGate } from 'redux-persist/integration/react';
import { setupConfig } from '@ionic/react';

setupConfig({
  hardwareBackButton: false,
});



ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppComponent />
    </PersistGate>
  </Provider>,
  document.getElementById('root')

)



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
