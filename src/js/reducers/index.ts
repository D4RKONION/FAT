import { combineReducers } from 'redux';

import { orientationReducer } from './orientation';
import { modeNameReducer } from './modename';
import { activeGameReducer } from './activegame';
import { frameDataReducer } from './framedata';
import { activePlayerReducer } from './activeplayer';
import { landscapeColsReducer } from './landscapecols';
import { onBlockColoursReducer } from './onblockcolours';
import { counterHitReducer } from './counterhit';
import modalVisibilityReducer from './modalvisibility';
import selectedCharactersReducer from './selectedcharacters';
import dataDisplaySettingsReducer from './datadisplaysettings';
import themeColorReducer from './themecolor';
import themeBrightnessReducer from './themebrightness';
import themesOwnedReducer from './themesowned'
import adviceToastShownReducer from './adivcetoastshown';
import adviceToastDismissedReducer from './adivcetoastdismissed';
import adviceToastPrevReadReducer from './advicetoastprevread';


const rootReducer = combineReducers({
  orientationState: orientationReducer,
  modeNameState: modeNameReducer,
  activeGameState: activeGameReducer,
  frameDataState: frameDataReducer,
  activePlayerState: activePlayerReducer,
  landscapeColsState: landscapeColsReducer,
  modalVisibilityState: modalVisibilityReducer,
  selectedCharactersState: selectedCharactersReducer,
  dataDisplaySettingsState: dataDisplaySettingsReducer,
  themeBrightnessState: themeBrightnessReducer,
  themeColorState: themeColorReducer,
  themesOwnedState: themesOwnedReducer,
  onBlockColoursState: onBlockColoursReducer,
  counterHitState: counterHitReducer,
  adviceToastShownState: adviceToastShownReducer,
  adviceToastDismissedState: adviceToastDismissedReducer,
  adviceToastPrevReadState: adviceToastPrevReadReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;