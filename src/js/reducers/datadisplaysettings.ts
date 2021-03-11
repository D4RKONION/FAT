import { InputNotationType, MoveNameType } from "../types";

type DataDisplaySettingsReducerState = {moveNameType?: MoveNameType , inputNotationType?: InputNotationType}

type DataDisplaySettingsReducerAction = {
  type: 'SET_DATA_DISPLAY_SETTINGS';
  settings: {
    moveNameType?: MoveNameType , inputNotationType?: InputNotationType
  };
}

const defaultState: DataDisplaySettingsReducerState = {moveNameType: "common", inputNotationType: "plnCmd"};

export const dataDisplaySettingsReducer = (state = defaultState, action: DataDisplaySettingsReducerAction) => {
  switch(action.type) {
    case 'SET_DATA_DISPLAY_SETTINGS': {
      return {
        ...state,
          ...action.settings
      }
    }
    default:
      return state
  }
}
