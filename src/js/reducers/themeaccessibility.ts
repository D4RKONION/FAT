import { ThemeAccessibility } from "../types";

type ThemeAccessibilityState = ThemeAccessibility;

type ThemeAccessibilityAction = {
  type: 'SET_THEME_ACCESSIBILITY';
  themeAccessibility: ThemeAccessibility;
}

const defaultState: ThemeAccessibilityState = "none";

export const themeAccessibilityReducer = (state = defaultState, action: ThemeAccessibilityAction) => {
  switch(action.type) {
    case 'SET_THEME_ACCESSIBILITY':
      return action.themeAccessibility;
    default:
      return state;
  }
}
