import { combineReducers } from 'redux';

import { orientationReducer } from './orientation';
import { modeNameReducer } from './modename';
import { activeGameReducer } from './activegame';
import { frameDataReducer } from './framedata';
import { gameDetailsReducer } from './gamedetails';
import { activePlayerReducer } from './activeplayer';
import { landscapeColsReducer } from './landscapecols';
import { compactViewReducer } from './compactview';
import { onBlockColoursReducer } from './onblockcolours';
import { selectedCharactersReducer } from './selectedcharacters';
import { modalVisibilityReducer } from './modalvisibility';
import { dataDisplaySettingsReducer } from './datadisplaysettings';
import { themesOwnedReducer } from './themesowned'
import { adviceToastShownReducer } from './adivcetoastshown';
import { adviceToastDismissedReducer } from './adivcetoastdismissed';
import { adviceToastPrevReadReducer } from './advicetoastprevread';
import { autoSetSpecificColsReducer } from './autospecificcols';
import { advantageModifiersReducer } from './advantagemodifiers';
import { appDisplaySettingsReducer } from './appdisplaysettings';


const rootReducer = combineReducers({
  orientationState: orientationReducer,
  modeNameState: modeNameReducer,
  activeGameState: activeGameReducer,
  frameDataState: frameDataReducer,
  gameDetailsState: gameDetailsReducer,
  activePlayerState: activePlayerReducer,
  landscapeColsState: landscapeColsReducer,
  modalVisibilityState: modalVisibilityReducer,
  selectedCharactersState: selectedCharactersReducer,
  dataDisplaySettingsState: dataDisplaySettingsReducer,
  appDisplaySettingsState: appDisplaySettingsReducer,
  themesOwnedState: themesOwnedReducer,
  compactViewState: compactViewReducer,
  onBlockColoursState: onBlockColoursReducer,
  advantageModifiersState: advantageModifiersReducer,
  autoSetSpecificColsState: autoSetSpecificColsReducer,
  adviceToastShownState: adviceToastShownReducer,
  adviceToastDismissedState: adviceToastDismissedReducer,
  adviceToastPrevReadState: adviceToastPrevReadReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;