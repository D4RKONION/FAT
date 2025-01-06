import { GAME_NAMES } from "../constants/ImmutableGameDetails";
import THEMES from "../constants/Themes";

export type PlayerId = "playerOne" | "playerTwo";

export type AppModal = "characterSelect" | "help" | "landscapeOptions" | "whatsNew" | "tableSettings" | "bookmarks";

export type MoveNameType = "official" | "common" | "inputs";

export type InputNotationType = "plnCmd" | "numCmd" | "ezCmd";

export type NormalNotationType = "fullWord" | "shorthand";

export type GameName = typeof GAME_NAMES[number];

export type VtState = string;

export type Orientation = "landscape" | "portrait";

export type TableType = "fixed" | "scrolling";

export type MoveAdvantageIndicator = "background" | "text";

export type ThemeBrightness = "light" | "dark" | "unset";

export type ThemeAccessibility = "none" | "colorBlind";

export type ThemeColor = "classic" | "purple" | "pink" | "red" | "green";

export type ThemeAlias = typeof THEMES[number]["alias"];

export type CharacterSelectLayout = "largePortraits" | "smallPortraits" | "simpleList" | "detailedList";

export type FrameMeterLayout = "wrap" | "nowrap";

export type SubheaderStatsCollapsed = boolean;

export type Bookmark = {
  modeName: "framedata" | "moveslist" | "combos" | "movedetail",
  gameName: GameName,
  characterName: PlayerData["name"],
  vtState?: VtState,
  moveName?: string,
};

export type FrameDataSlug = {
  gameSlug?: GameName,
  characterSlug?: PlayerData["name"],
  vtStateSlug?: VtState,
  moveNameSlug?: string,
};

export type AdviceToastPrevRead = {
  [key: string]: number,
};

export type PlayerData = {
  name?: string;
  vtState?: VtState,
  frameData?: {
    [key: string]: any,
  },
  stats?: {
    [key: string]: number | string;
  },
  selectedMove?: string,
};