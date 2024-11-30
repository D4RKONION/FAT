import { ThemeAccessibility, ThemeBrightness, ThemeColor } from "../types";

type AppDisplaySettingsReducerAction = {
  type: "SET_THEME_BRIGHTNESS" | "SET_THEME_COLOR" | "SET_THEME_ACCESSIBILITY";
  themeBrightness: ThemeBrightness;
  themeColor: ThemeColor;
  themeAccessibility: ThemeAccessibility;
};

const defaultState = {
  themeBrightness: "light" as ThemeBrightness,
  themeColor: "classic" as ThemeColor,
  themeAccessibility: "none" as ThemeAccessibility,
};

export const appDisplaySettingsReducer = (state = defaultState, action: AppDisplaySettingsReducerAction) => {
  switch (action.type) {
    case "SET_THEME_BRIGHTNESS":
      return {
        ...state,
        themeBrightness: action.themeBrightness,
      };

    case "SET_THEME_COLOR":
      return {
        ...state,
        themeColor: action.themeColor,
      };
      
    case "SET_THEME_ACCESSIBILITY":
      return {
        ...state,
        themeAccessibility: action.themeAccessibility,
      };

    default:
      return state;
  }
};
