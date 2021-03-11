import { ThemeBrightness } from "../types";

type ThemeBrightnessState = ThemeBrightness;

type ThemeBrightnessAction = {
  type: 'SET_THEME_BRIGHTNESS';
  themeBrightness: ThemeBrightness;
}

const defaultState: ThemeBrightnessState = "light";

export const themeBrightnessReducer = (state = defaultState, action: ThemeBrightnessAction) => {
  switch(action.type) {
    case 'SET_THEME_BRIGHTNESS':
      return action.themeBrightness;
    default:
      return state;
  }
}
