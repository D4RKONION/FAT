import { SET_THEME_BRIGHTNESS } from '../actions';

export default function themeBrightnessReducer(state = "light", action) {
  switch(action.type) {
    case SET_THEME_BRIGHTNESS:
      return action.themeBrightness;
    default:
      return state;
  }
}
