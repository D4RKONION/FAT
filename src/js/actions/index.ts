import { helpCreateFrameDataJSON } from '../utils';
import type { AdviceToastPrevRead, AppModal, NormalNotationType, GameName, InputNotationType, MoveNameType, Orientation, PlayerData, PlayerId, ThemeBrightness, ThemeColor, VtState, ThemeAccessibility, TableType, MoveAdvantageIndicator, Bookmark } from '../types'

import AppSFVFrameData from '../constants/framedata/SFVFrameData.json';
import AppUSF4FrameData from '../constants/framedata/USF4FrameData.json';
import AppSF3FrameData from '../constants/framedata/3SFrameData.json';
import AppGGSTFrameData from '../constants/framedata/GGSTFrameData.json';
import AppSF6FrameData from '../constants/framedata/SF6FrameData.json';

import AppSFVGameDetails from '../constants/gamedetails/SFVGameDetails.json';
import USF4GameDetails from '../constants/gamedetails/USF4GameDetails.json';
import SF3GameDetails from '../constants/gamedetails/3SGameDetails.json';
import AppGGSTGameDetails from '../constants/gamedetails/GGSTGameDetails.json';
import AppSF6GameDetails from '../constants/gamedetails/SF6GameDetails.json';

import { UPDATABLE_GAMES, UPDATABLE_GAMES_APP_CODES } from '../constants/VersionLogs';
import { RootState } from '../reducers';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Preferences } from '@capacitor/preferences';

// ACTION CREATORS
//handle global things
export const setOrientation = (orientation: Orientation) => ({
  type: 'SET_ORIENTATION',
  orientation,
})

export const setModeName = (modeName: string) => ({
  type: 'SET_MODE_NAME',
  modeName,
})

// handle setting game details and data
// this is all really bad and I'm sorry. Someday I'll refactor this to be
// not horrendous and style breaking
const setGameName = (gameName: GameName) => ({
  type: 'SET_GAME_NAME',
  gameName,
})

const setFrameData = (frameData) => ({
  type: 'SET_FRAME_DATA',
  frameData,
})

const getFrameData = (gameName: GameName) => {
  return async function(dispatch, getState) {
    const { selectedCharactersState, gameDetailsState } = getState();
    const appFrameData = 
      gameName === "SFV" ? AppSFVFrameData
      : gameName === "GGST" ? AppGGSTFrameData
      : gameName === "SF6" ? AppSF6FrameData
      : gameName === "3S" ? AppSF3FrameData
      : gameName === "USF4" ? AppUSF4FrameData
      : {};
    
    if (UPDATABLE_GAMES.includes(gameName)) {

      const LS_FRAME_DATA_CODE = parseInt((await Preferences.get({ key: `ls${gameName}FrameDataCode`})).value);
      
      const APP_FRAME_DATA_CODE = UPDATABLE_GAMES_APP_CODES[gameName]["FrameData"]
      
      let lsFrameData: string;

      try {
        lsFrameData = JSON.parse((await Preferences.get({ key: `ls${gameName}FrameData`})).value);
      } catch (error) {
        console.log(error)
        lsFrameData = '';
      }

      if (!lsFrameData || !LS_FRAME_DATA_CODE || LS_FRAME_DATA_CODE <= APP_FRAME_DATA_CODE) {
        dispatch(setFrameData(appFrameData));
      } else {
        dispatch(setFrameData(lsFrameData));
      }
    } else {
      //every other game
      dispatch(setFrameData(appFrameData));
    }
    
    const gameCharList = gameDetailsState.characterList as any;
    dispatch(setPlayerAttr("playerOne", gameCharList.includes(selectedCharactersState.playerOne.name) ? selectedCharactersState.playerOne.name : gameCharList[0], {vtState: "normal"}) );
    dispatch(setPlayerAttr("playerTwo", gameCharList.includes(selectedCharactersState.playerTwo.name) ? selectedCharactersState.playerTwo.name : gameCharList[1], {vtState: "normal"}) );
  }
}

const setGameDetails = (gameDetails) => ({
  type: 'SET_GAME_DETAILS',
  gameDetails,
})

const getGameDetails = (gameName: GameName) => {
  return async function(dispatch) {
    const appGameDetails = 
      gameName === "SFV" ? AppSFVGameDetails
      : gameName === "GGST" ? AppGGSTGameDetails
      : gameName === "SF6" ? AppSF6GameDetails
      : gameName === "3S" ? SF3GameDetails
      : gameName === "USF4" ? USF4GameDetails
      : {};
      
    if (UPDATABLE_GAMES.includes(gameName)) {

      const LS_GAME_DETAILS_CODE = parseInt((await Preferences.get({ key: `ls${gameName}GameDetailsCode`})).value);
      const APP_GAME_DETAILS_CODE = UPDATABLE_GAMES_APP_CODES[gameName]["GameDetails"]
      
      
      let lsGameDetails: string;

      try {
        lsGameDetails = JSON.parse((await Preferences.get({ key: `ls${gameName}GameDetails`})).value)
      } catch (error) {
        console.log(error)
        lsGameDetails = '';
      }

      if (!lsGameDetails || !LS_GAME_DETAILS_CODE || LS_GAME_DETAILS_CODE <= APP_GAME_DETAILS_CODE) {
        dispatch(setGameDetails(appGameDetails));
      } else {
        dispatch(setGameDetails(lsGameDetails));
      }
    } else {
      //every other game
      dispatch(setGameDetails(appGameDetails));
    }
  }
  
}

export const setActiveGame = (gameName: GameName, colReset: Boolean, characterToSet?: PlayerData["name"], stateToSet?: VtState, moveToSet?: PlayerData["selectedMove"]): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(resetAdvantageModifiers())
    await dispatch(getGameDetails(gameName))
    
    const { gameDetailsState, dataDisplaySettingsState } = getState();
    if (colReset) {
      dispatch(setDataTableColumns(gameDetailsState.defaultLandscapeCols))
    }
    if (gameName === "GGST") {
      dispatch(setDataDisplaySettings({inputNotationType: "numCmd"}));
    } else if (dataDisplaySettingsState.inputNotationType === "ezCmd") {
      dispatch(setDataDisplaySettings({inputNotationType: "plnCmd"}));
    }
    dispatch(setGameName(gameName));
    await dispatch(getFrameData(gameName));

    if (stateToSet || moveToSet) {
      dispatch(setPlayerAttr("playerOne", characterToSet, {selectedMove: moveToSet, vtState: stateToSet}))
    } else if (characterToSet && characterToSet !== "unset") {
      dispatch(setPlayer("playerOne", characterToSet))
    }
  }
}

// handle frame data page stuff
export const setActiveFrameDataPlayer = (oneOrTwo: PlayerId) => ({
  type: 'SET_ACTIVE_PLAYER',
  oneOrTwo
})
export const setDataTableColumns = (tableColumns: {[key: string]: string}) => ({
  type: 'SET_DATA_TABLE_COLUMNS',
  tableColumns
})
export const setCompactView = (compactViewOn: boolean) => ({
  type: 'SET_COMPACT_VIEW',
  compactViewOn,
})
export const setTableType = (tableType: TableType) => ({
  type: 'SET_TABLE_TYPE',
  tableType,
})
export const setAutoScrollEnabled = (autoScrollEnabled: boolean) => ({
  type: 'SET_AUTO_SCROLL_ENABLED',
  autoScrollEnabled,
})
export const setMoveTypeHeadersOn = (moveTypeHeadersOn: boolean) => ({
  type: 'SET_MOVE_TYPE_HEADERS_ON',
  moveTypeHeadersOn,
})
export const setMoveAdvantageColorsOn = (moveAdvantageColorsOn: boolean) => ({
  type: 'SET_MOVE_ADVANTAGE_COLORS',
  moveAdvantageColorsOn,
})
export const setMoveAdvantageIndicator = (moveAdvantageIndicator: MoveAdvantageIndicator) => ({
  type: 'SET_MOVE_ADVANTAGE_INDICATOR',
  moveAdvantageIndicator,
})
export const setAutoSetSpecificCols = (autoSetCharacterSpecificColumnsOn: boolean) => ({
  type: 'SET_AUTO_SET_CHARACTER_SPECIFIC_COLUMNS',
  autoSetCharacterSpecificColumnsOn,
})

// handle advantage modifiers
export const setCounterHit = (counterHitActive: boolean) => ({
  type: 'SET_COUNTER_HIT',
  counterHitActive,
})
export const setRawDriveRush = (rawDriveRushActive: boolean) => ({
  type: 'SET_RAW_DRIVE_RUSH',
  rawDriveRushActive,
})
export const setVsBurntoutOpponent = (vsBurntoutOpponentActive: boolean) => ({
  type: 'SET_VS_BURNTOUT_OPPONENT',
  vsBurntoutOpponentActive,
})
export const resetAdvantageModifiers = () => ({
  type: 'RESET_ADVANTAGE_MODIFIERS',
})



// handle player frame data json stuff
export const  setPlayer = (playerId: PlayerId, charName: PlayerData["name"]) => {
  return async function(dispatch, getState) {
    const { frameDataState, dataDisplaySettingsState, selectedCharactersState, activeGameState }: RootState  = getState();
    const stateToSet: VtState =
      activeGameState === "SFV" || ((activeGameState === "GGST" || activeGameState === "SF6")  && selectedCharactersState[playerId].name === charName)
        ? selectedCharactersState[playerId].vtState
        : "normal"
    const playerData: PlayerData = {
      name: charName,
      frameData: helpCreateFrameDataJSON(frameDataState[charName].moves, dataDisplaySettingsState.moveNameType, dataDisplaySettingsState.inputNotationType, dataDisplaySettingsState.normalNotationType, stateToSet, activeGameState),
      stats: frameDataState[charName].stats,
      vtState: stateToSet,
    }
    dispatch({
      type: 'SET_PLAYER',
      playerId,
      playerData,
    })
  }
}

export const setPlayerAttr = (playerId: PlayerId, charName: PlayerData["name"], playerData: PlayerData) => {
  return async function(dispatch) {
    dispatch({
      type: 'SET_PLAYER_ATTR',
      playerId,
      playerData
    });
    if (playerData.vtState) {
      dispatch(setPlayer(playerId, charName));
    }
  }
}


// handle showing modals
export const setModalVisibility = (data: {currentModal: AppModal, visible: Boolean}) => ({
  type: 'SET_MODAL_VISIBILITY',
  data,
})

// handle setting frame data display types
export const setDataDisplaySettings = (settings: {moveNameType?: MoveNameType , inputNotationType?: InputNotationType, normalNotationType?: NormalNotationType}) => ({
    type: 'SET_DATA_DISPLAY_SETTINGS',
    settings,
})

//handle setting the current theme
export const setThemeBrightness = (themeBrightness: ThemeBrightness) => ({
  type: 'SET_THEME_BRIGHTNESS',
  themeBrightness,
})

export const setThemeAccessibility = (themeAccessibility: ThemeAccessibility) => ({
  type: 'SET_THEME_ACCESSIBILITY',
  themeAccessibility,
})

export const setThemeColor = (themeColor: ThemeColor) => ({
  type: 'SET_THEME_COLOR',
  themeColor,
})

export const purchaseLifetimePremium = () => ({
  type: 'SET_LIFETIME_PREMIUM_PURCHASED',
})
export const resetPremium = () => ({
  type: 'RESET_PREMIUM',
})

//handle turning advice toast on and off
export const setAdviceToastsOn = (adviceToastsOn: boolean) => ({
  type: 'SET_ADVICE_TOASTS_ON',
  adviceToastsOn,
})

//remember if an advice toast has been shown this session
export const setAdviceToastShown = (adviceToastShown: Boolean) => ({
  type: 'SET_ADVICE_TOAST_SHOWN',
  adviceToastShown,
})

//handle remembering which toasts have been seen in total
export const setAdviceToastPrevRead = (listOfPrevReadToasts: AdviceToastPrevRead) => ({
  type: 'SET_ADVICE_TOAST_PREV_READ',
  listOfPrevReadToasts
})


export const addBookmark = (bookmarkToAdd: Bookmark) => ({
  type: 'ADD_BOOKMARK',
  bookmarkToAdd
})

export const removeBookmark = (bookmarkToRemove: number) => ({
  type: 'REMOVE_BOOKMARK',
  bookmarkToRemove
})

export const reorderBookmarks = (reorderedBookmarkArray: Bookmark[]) => ({
  type: 'REORDER_BOOKMARKS',
  reorderedBookmarkArray
})

export const clearAllBookmarks = () => ({
  type: 'CLEAR_ALL_BOOKMARKS',
})
