import { combineReducers } from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";

import { activeGameReducer } from "./activegame";
import { activePlayerReducer } from "./activeplayer";
import { advantageModifiersReducer } from "./advantagemodifiers";
import { adviceToastReducer } from "./advicetoast";
import { appDisplaySettingsReducer } from "./appdisplaysettings";
import { bookmarksReducer } from "./bookmarks";
import { dataDisplaySettingsReducer } from "./datadisplaysettings";
import { dataTableSettingsReducer } from "./datatablesettings";
import { frameDataReducer } from "./framedata";
import { gameDetailsReducer } from "./gamedetails";
import { modalVisibilityReducer } from "./modalvisibility";
import { modeNameReducer } from "./modename";
import { orientationReducer } from "./orientation";
import { premiumReducer } from "./premium";
import { selectedCharactersReducer } from "./selectedcharacters";

const adviceToastPersistConfig = {
  key: "adviceToast",
  storage: storage,
  blacklist: ["adviceToastShown"],
};

const rootReducer = combineReducers({
  orientationState: orientationReducer,
  modeNameState: modeNameReducer,
  activeGameState: activeGameReducer,
  frameDataState: frameDataReducer,
  gameDetailsState: gameDetailsReducer,
  activePlayerState: activePlayerReducer,
  modalVisibilityState: modalVisibilityReducer,
  selectedCharactersState: selectedCharactersReducer,
  dataDisplaySettingsState: dataDisplaySettingsReducer,
  appDisplaySettingsState: appDisplaySettingsReducer,
  premium: premiumReducer,
  dataTableSettingsState: dataTableSettingsReducer,
  advantageModifiersState: advantageModifiersReducer,
  adviceToastState: persistReducer(adviceToastPersistConfig, adviceToastReducer),
  bookmarksState: bookmarksReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;