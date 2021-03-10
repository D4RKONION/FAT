import { SET_DATA_DISPLAY_SETTINGS } from '../actions';

export const SET_MOVE_NAMING_TYPE = "SET_MOVE_NAMING_TYPE"
export const SET_INPUT_TYPE = "SET_INPUT_TYPE"

export default function dataDisplaySettingsReducer(state = {moveNameType: "common", inputNotationType: "plnCmd"}, action) {
  switch(action.type) {
    case SET_DATA_DISPLAY_SETTINGS: {
      return {
        ...state,
          ...action.settings
      }
    }
    default:
      return state
  }
}
