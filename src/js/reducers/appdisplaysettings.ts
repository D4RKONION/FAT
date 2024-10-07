import { ThemeAccessibility, ThemeBrightness, ThemeShortId } from "../types";

type AppDisplaySettingsReducerAction = {
  type: 'SET_THEME_BRIGHTNESS' | 'SET_THEME_COLOR' | 'SET_THEME_ACCESSIBILITY';
  themeBrightness: ThemeBrightness;
  themeColor: ThemeShortId;
  themeAccessibility: ThemeAccessibility;
}

const defaultState = {
  themeBrightness: "light" as ThemeBrightness,
  themeColor: "classic" as ThemeShortId,
  themeAccessibility: "none" as ThemeAccessibility
}

export const appDisplaySettingsReducer = (state = defaultState, action: AppDisplaySettingsReducerAction) => {
  switch(action.type) {

    case 'SET_THEME_BRIGHTNESS':
      return {
        ...state,
        "themeBrightness": action.themeBrightness
      }

      case 'SET_THEME_COLOR':
        return {
          ...state,
          "themeColor": action.themeColor
        }
      
      case 'SET_THEME_ACCESSIBILITY':
        return {
          ...state,
          "themeAccessibility": action.themeAccessibility
        }

    default:
      return state;
  }
}
