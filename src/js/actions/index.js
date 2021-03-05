import { helpCreateFrameDataJSON } from '../helpers';
import GAME_DETAILS from '../constants/GameDetails';

import AppSFVFrameData from '../constants/framedata/SFVFrameData.json';
import USF4FrameData from '../constants/framedata/USF4FrameData.json';
import SF3FrameData from '../constants/framedata/3SFrameData.json';
import { APP_FRAME_DATA_CODE } from '../constants/VersionLogs';

// ACTION TYPES
// (Note: All actions are named SET (when they change the state) or GET (when they fetch data))
export const SET_ORIENTATION = "SET_ORIENTATION";
export const SET_MODE_NAME = "SET_MODE_NAME";

export const SET_GAME_NAME = "SET_GAME_NAME";
export const SET_FRAME_DATA = "SET_FRAME_DATA";
export const GET_FRAME_DATA = "GET_FRAME_DATA";

export const SET_ACTIVE_PLAYER = "SET_ACTIVE_PLAYER";
export const SET_LANDSCAPE_COLS = "SET_LANDSCAPE_COLS";
export const SET_ON_BLOCK_COLOURS = "SET_ON_BLOCK_COLOURS";
export const SET_COUNTER_HIT = "SET_COUNTER_HIT";

export const SET_PLAYER = "SET_PLAYER";
export const SET_PLAYER_ATTR = "SET_PLAYER_ATTR";

export const SET_MODAL_VISIBILITY = "SET_MODAL_VISIBILITY";

export const SET_DATA_DISPLAY_SETTINGS = "SET_DATA_DISPLAY_SETTINGS";

export const SET_THEME_BRIGHTNESS = "SET_THEME_BRIGHTNESS";
export const SET_THEME_COLOR = "SET_THEME_COLOR";
export const SET_THEME_OWNED = "SET_THEME_OWNED";

export const SET_ADVICE_TOAST_SHOWN = "SET_ADVICE_TOAST_SHOWN"
export const SET_ADVICE_TOAST_PREV_READ = "SET_ADVICE_TOAST_PREV_READ";
export const SET_ADVICE_TOAST_DISMISSED = "SET_ADVICE_TOAST_DISMISSED";

// ACTION CREATORS
//handle global things
export function setOrientation(orientation) {
  return {
    type: SET_ORIENTATION,
    orientation,
  }
}
export function setModeName(modeName) {
  return {
    type: SET_MODE_NAME,
    modeName,
  }
}

//handle setting game details and data
export function setGameName(gameName) {
  return {
    type: SET_GAME_NAME,
    gameName,
  }
}
export function setFrameData(frameData) {
  return {
    type: SET_FRAME_DATA,
    frameData
  }
}
export function getFrameData(gameName) {
  return async function(dispatch, getState) {
    const { selectedCharactersState } = getState();
    const LS_FRAME_DATA_CODE = localStorage.getItem("lsFrameDataCode");
    const lsSFVFrameData = JSON.parse(localStorage.getItem("lsSFVFrameData"))

    if (gameName === "SFV") {
      if (!lsSFVFrameData || !LS_FRAME_DATA_CODE || LS_FRAME_DATA_CODE <= APP_FRAME_DATA_CODE) {
        dispatch(setFrameData(AppSFVFrameData));
      } else {
        dispatch(setFrameData(lsSFVFrameData))
      }
    } else if (gameName === "USF4") {
      dispatch(setFrameData(USF4FrameData));
    } else if (gameName === "3S") {
      dispatch(setFrameData(SF3FrameData));
    }

    const gameCharList = GAME_DETAILS[gameName].characterList;
    dispatch(setPlayer("playerOne", gameCharList.includes(selectedCharactersState.playerOne.name) ? selectedCharactersState.playerOne.name : gameCharList[0]) );
    dispatch(setPlayer("playerTwo", gameCharList.includes(selectedCharactersState.playerTwo.name) ? selectedCharactersState.playerTwo.name : gameCharList[1]) );
  }
}

export function setActiveGame(gameName) {
  return function (dispatch) {
    dispatch(setGameName(gameName));
    dispatch(getFrameData(gameName));
  }
}

//handle frame data page stuff
export function setActiveFrameDataPlayer(oneOrTwo) {
  return {
    type: SET_ACTIVE_PLAYER,
    oneOrTwo
  }
}
export function setLandscapeCols(listOfCols) {
  return {
    type: SET_LANDSCAPE_COLS,
    listOfCols
  }
}
export function setOnBlockColours(coloursOn) {
  return {
    type: SET_ON_BLOCK_COLOURS,
    coloursOn,
  }
}
export function setCounterHit(counterHitOn) {
  return {
    type: SET_COUNTER_HIT,
    counterHitOn,
  }
}


export function setPlayer(playerId, charName) {
  return function(dispatch, getState) {
    const { frameDataState, dataDisplaySettingsState, selectedCharactersState, activeGameState }  = getState();
    const stateToSet = activeGameState !== "SFV" ? "normal" : selectedCharactersState[playerId].vtState
    const playerData = {
      name: charName,
      frameData: helpCreateFrameDataJSON(frameDataState[charName].moves, dataDisplaySettingsState.moveNameType, dataDisplaySettingsState.inputNotationType, stateToSet),
      stats: frameDataState[charName].stats,
      vtState: stateToSet,
    }
    dispatch({
      type: SET_PLAYER,
      playerId,
      playerData,
    })
  }
}
export function setPlayerAttr(playerId, charName, playerData) {
  return function(dispatch) {
    dispatch({
      type: SET_PLAYER_ATTR,
      playerId,
      playerData
    });
    if (playerData.vtState) {
      dispatch(setPlayer(playerId, charName));
    }
  }
}


// handle showing modals
export function setModalVisibility(data) {
  return {
      type: SET_MODAL_VISIBILITY,
      data
  }
}

// handle setting frame data display types
export function setDataDisplaySettings(settings) {
  return {
    type: SET_DATA_DISPLAY_SETTINGS,
    settings
  }
}

//handle setting the current theme
export function setThemeBrightness(themeBrightness) {
  return {
    type: SET_THEME_BRIGHTNESS,
    themeBrightness,
  }
}
export function setThemeColor(themeColor) {
  return {
    type: SET_THEME_COLOR,
    themeColor,
  }
}
export function setThemeOwned(themeToAdd) {
  return {
    type: SET_THEME_OWNED,
    themeToAdd,
  }
}

//handle turning advice toast on and off
export function setAdviceToastShown(adviceToastShown) {
  return {
    type: SET_ADVICE_TOAST_SHOWN,
    adviceToastShown,
  }
}

//handle remembering that the user has seen a toast this session
export function setAdviceToastDismissed(adviceToastDismissed) {
  return {
    type: SET_ADVICE_TOAST_DISMISSED,
    adviceToastDismissed,
  }
}

//handle remembering which toasts have been seen in total
export function setAdviceToastPrevRead(listOfPrevReadToasts) {
  return {
    type: SET_ADVICE_TOAST_PREV_READ,
    listOfPrevReadToasts
  }
}
