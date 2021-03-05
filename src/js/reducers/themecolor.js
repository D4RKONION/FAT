import { SET_THEME_COLOR } from '../actions';

export default function themeReducer(state = "classic", action) {
  switch(action.type) {
    case SET_THEME_COLOR:
      return action.themeColor;
    default:
      return state;
  }
}
