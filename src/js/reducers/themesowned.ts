import { ThemeAlias } from "../types";

type ThemesOwnedReducerState = string[];

type ThemesOwnedReducerAction = {
  type: 'SET_THEME_OWNED';
  themeToAdd: ThemeAlias;
}

const defaultState: ThemesOwnedReducerState = ["Red Dragon", "Second in Command", "Delta Green", "Poisonous Pink"];

export const themesOwnedReducer = (state = defaultState, action: ThemesOwnedReducerAction) => {
  switch(action.type) {
    case 'SET_THEME_OWNED':
      return [...state, action.themeToAdd];
    default:
      return state;
  }
}
