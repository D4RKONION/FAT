import { ThemeAlias } from "../types";

type ThemesOwnedReducerState = string[];

type ThemesOwnedReducerAction = {
  type: 'SET_THEME_OWNED';
  themeToAdd: ThemeAlias;
}

const defaultState: ThemesOwnedReducerState = ["Second in Command", "Red Dragon", "Delta Green"];

export const themesOwnedReducer = (state = defaultState, action: ThemesOwnedReducerAction) => {
  switch(action.type) {
    case 'SET_THEME_OWNED':
      return [...state, action.themeToAdd];
    default:
      return state;
  }
}
