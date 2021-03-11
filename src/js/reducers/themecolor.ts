import { ThemeShortId } from "../types";

type ThemeColorReducerState = ThemeShortId;

type ThemeColorReducerAction = {
  type: 'SET_THEME_COLOR';
  themeColor: ThemeShortId;
}

const defaultState: ThemeColorReducerState = "classic";


export const themeColorReducer = (state = defaultState, action: ThemeColorReducerAction) => {
  switch(action.type) {
    case 'SET_THEME_COLOR':
      return action.themeColor;
    default:
      return state;
  }
}
