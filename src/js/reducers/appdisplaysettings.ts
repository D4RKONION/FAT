import { CharacterSelectLayout, FrameMeterLayout, SubheaderStatsCollapsed, ThemeAccessibility, ThemeBrightness, ThemeColor } from "../types";

type AppDisplaySettingsReducerAction = {
  type: "SET_THEME_BRIGHTNESS" | "SET_THEME_COLOR" | "SET_THEME_ACCESSIBILITY" | "SET_CHARACTER_SELECT_LAYOUT" | "SET_FRAME_METER_LAYOUT" | "SET_SUBHEADER_STATS_COLLAPSED";
  themeBrightness: ThemeBrightness;
  themeColor: ThemeColor;
  themeAccessibility: ThemeAccessibility;
  characterSelectLayout: CharacterSelectLayout,
  frameMeterLayout: FrameMeterLayout,
  subheaderStatsCollapsed: SubheaderStatsCollapsed,
};

const defaultState = {
  themeBrightness: "unset" as ThemeBrightness,
  themeColor: "classic" as ThemeColor,
  themeAccessibility: "none" as ThemeAccessibility,
  characterSelectLayout: "largePortraits" as CharacterSelectLayout,
  frameMeterLayout: "wrap" as FrameMeterLayout,
  subheaderStatsCollapsed: true as SubheaderStatsCollapsed,
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

    case "SET_CHARACTER_SELECT_LAYOUT":
      return {
        ...state,
        characterSelectLayout: action.characterSelectLayout,
      };
    
    case "SET_FRAME_METER_LAYOUT":
      return {
        ...state,
        frameMeterLayout: action.frameMeterLayout,
      };
    
    case "SET_SUBHEADER_STATS_COLLAPSED":
      return {
        ...state,
        subheaderStatsCollapsed: action.subheaderStatsCollapsed,
      };

    default:
      return state;
  }
};
