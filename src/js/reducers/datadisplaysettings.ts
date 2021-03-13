import { InputNotationType, MoveNameType, NormalNotationType } from "../types";

export type DataDisplaySettingsReducerState = {moveNameType?: MoveNameType , inputNotationType?: InputNotationType, normalNotationType?: NormalNotationType}

type DataDisplaySettingsReducerAction = {
  type: 'SET_DATA_DISPLAY_SETTINGS';
  settings: {
    moveNameType?: MoveNameType , inputNotationType?: InputNotationType, normalNotationType?: NormalNotationType,
  };
}

const defaultState: DataDisplaySettingsReducerState = {moveNameType: "common", inputNotationType: "plnCmd", normalNotationType: "fullWord"};

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
