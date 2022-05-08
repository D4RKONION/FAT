import { Plugins } from '@capacitor/core';

import { helpCreateFrameDataJSON } from '../utils';
import GAME_DETAILS from '../constants/GameDetails';
import type { AdviceToastPrevRead, AppModal, NormalNotationType, GameName, InputNotationType, MoveNameType, Orientation, PlayerData, PlayerId, ThemeAlias, ThemeBrightness, ThemeShortId, VtState, ThemeAccessibility } from '../types'

import AppSFVFrameData from '../constants/framedata/SFVFrameData.json';
import USF4FrameData from '../constants/framedata/USF4FrameData.json';
import SF3FrameData from '../constants/framedata/3SFrameData.json';
import AppGGSTFrameData from '../constants/framedata/GGSTFrameData.json';
import { APP_SFV_FRAME_DATA_CODE, APP_GGST_FRAME_DATA_CODE } from '../constants/VersionLogs';
import { RootState } from '../reducers';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

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

const getFrameData = (gameName: GameName, stateReset?: Boolean) => {
  return async function(dispatch, getState) {
    const { selectedCharactersState } = getState();

    if (gameName === "SFV") {

      const LS_FRAME_DATA_CODE = parseInt(localStorage.getItem("lsSFVFrameDataCode"));
      let lsSFVFrameData: string;
      try {
        lsSFVFrameData = JSON.parse((await Plugins.Storage.get({ key: 'lsSFVFrameData' })).value);
      } catch {
        lsSFVFrameData = '';
      }

      if (!lsSFVFrameData || !LS_FRAME_DATA_CODE || LS_FRAME_DATA_CODE <= APP_SFV_FRAME_DATA_CODE) {
        dispatch(setFrameData(AppSFVFrameData));
      } else {
        dispatch(setFrameData(lsSFVFrameData))
      }

    } else if (gameName === "USF4") {
      dispatch(setFrameData(USF4FrameData));
    } else if (gameName === "3S") {
      dispatch(setFrameData(SF3FrameData));
    } else if (gameName === "GGST") {

      const LS_FRAME_DATA_CODE = parseInt(localStorage.getItem("lsGGSTFrameDataCode"));
      let lsGGSTFrameData: string;
      try {
        lsGGSTFrameData = JSON.parse((await Plugins.Storage.get({ key: 'lsGGSTFrameData' })).value);
      } catch {
        lsGGSTFrameData = '';
      }

      if (!lsGGSTFrameData || !LS_FRAME_DATA_CODE || LS_FRAME_DATA_CODE <= APP_GGST_FRAME_DATA_CODE) {
        dispatch(setFrameData(AppGGSTFrameData));
      } else {
        dispatch(setFrameData(lsGGSTFrameData))
      }

    }

    const gameCharList = GAME_DETAILS[gameName].characterList as any;
    dispatch(setPlayerAttr("playerOne", gameCharList.includes(selectedCharactersState.playerOne.name) ? selectedCharactersState.playerOne.name : gameCharList[0], {vtState: "normal"}) );
    dispatch(setPlayerAttr("playerTwo", gameCharList.includes(selectedCharactersState.playerTwo.name) ? selectedCharactersState.playerTwo.name : gameCharList[2], {vtState: "normal"}) );
  }
}

export const setActiveGame = (gameName: GameName, colReset: Boolean): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    if (colReset) {
      dispatch(setLandscapeCols(GAME_DETAILS[gameName].defaultLandscapeCols))
    }
    dispatch(setGameName(gameName));
    await dispatch(getFrameData(gameName, true));
  }
}

// andle frame data page stuff
export const setActiveFrameDataPlayer = (oneOrTwo: PlayerId) => ({
  type: 'SET_ACTIVE_PLAYER',
  oneOrTwo
})
export const setLandscapeCols = (listOfCols: {[key: string]: string}) => ({
  type: 'SET_LANDSCAPE_COLS',
  listOfCols
})
export const setOnBlockColours = (coloursOn: Boolean) => ({
  type: 'SET_ON_BLOCK_COLOURS',
  coloursOn,
})
export const setCounterHit = (counterHitOn: Boolean) => ({
  type: 'SET_COUNTER_HIT',
  counterHitOn,
})
export const setAutoSetSpecificCols = (autoSetColsOn: Boolean) => ({
  type: 'SET_AUTO_SET_SPECIFIC_COLS',
  autoSetColsOn,
})

// handle player frame data json stuff
export const  setPlayer = (playerId: PlayerId, charName: PlayerData["name"]) => {
  return function(dispatch, getState) {
    const { frameDataState, dataDisplaySettingsState, selectedCharactersState, activeGameState }: RootState  = getState();
    const stateToSet: VtState =
      activeGameState === "SFV" || (activeGameState === "GGST" && selectedCharactersState[playerId].name === charName)
        ? selectedCharactersState[playerId].vtState
        : "normal"
    const playerData: PlayerData = {
      name: charName,
      frameData: helpCreateFrameDataJSON(frameDataState[charName].moves, dataDisplaySettingsState, stateToSet, activeGameState),
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
  return function(dispatch) {
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

export const setThemeColor = (themeColor: ThemeShortId) => ({
  type: 'SET_THEME_COLOR',
  themeColor,
})

export const setThemeOwned = (themeToAdd: ThemeAlias) => ({
  type: 'SET_THEME_OWNED',
  themeToAdd,
})

//handle turning advice toast on and off
export const setAdviceToastShown = (adviceToastShown: Boolean) => ({
  type: 'SET_ADVICE_TOAST_SHOWN',
  adviceToastShown,
})

//handle remembering that the user has seen a toast this session
export const setAdviceToastDismissed = (adviceToastDismissed: Boolean) => ({
  type: 'SET_ADVICE_TOAST_DISMISSED',
  adviceToastDismissed,
})

//handle remembering which toasts have been seen in total
export const setAdviceToastPrevRead = (listOfPrevReadToasts: AdviceToastPrevRead) => ({
  type: 'SET_ADVICE_TOAST_PREV_READ',
  listOfPrevReadToasts
})
