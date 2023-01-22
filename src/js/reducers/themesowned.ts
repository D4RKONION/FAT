import { ThemeAlias } from "../types";

type ThemesOwnedReducerState = ThemeAlias[];

type ThemesOwnedReducerAction = {
  type: 'SET_THEME_OWNED';
  themeToAdd: ThemeAlias;
} | {
  type: 'RESET_THEMES_OWNED'
}

const defaultState: ThemesOwnedReducerState = [];

export const themesOwnedReducer = (state = defaultState, action: ThemesOwnedReducerAction) => {
  switch(action.type) {
    case 'SET_THEME_OWNED':
      return [...state, action.themeToAdd];
    case 'RESET_THEMES_OWNED':
      return defaultState;
    default:
      return state;
  }
}
