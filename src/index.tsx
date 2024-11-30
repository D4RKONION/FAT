import { setupIonicReact } from "@ionic/react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import AppComponent from "./App";
import FrameDataGate from "./js/components/FrameDataGate";
import { persistor, store } from "./js/store";
import * as serviceWorker from "./serviceWorker";

setupIonicReact({
  hardwareBackButton: false,
});

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <FrameDataGate>
        <AppComponent />
      </FrameDataGate>
    </PersistGate>
  </Provider>,
  document.getElementById("root")

);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
