import { GAME_NAMES } from "../constants/ImmutableGameDetails";
import THEMES from "../constants/Themes";

export type PlayerId = 'playerOne' | 'playerTwo';

export type AppModal = 'characterSelect' | 'help' | 'landscapeOptions' | 'whatsNew';

export type MoveNameType = 'official' | 'common' | 'inputs';

export type InputNotationType = 'plnCmd' | 'numCmd' | 'ezCmd';

export type NormalNotationType = 'fullWord' | 'shorthand';

export type GameName = typeof GAME_NAMES[number];

export type VtState = string;

export type Orientation = 'landscape' | 'portrait';

export type TableType = 'fixed' | 'scrolling';

export type MoveAdvantageIndicator = 'background' | 'text';

export type ThemeBrightness = 'light' | 'dark';

export type ThemeAccessibility = 'none' | 'colorBlind';

export type ThemeShortId = 'classic' | typeof THEMES[number]["shortId"];

export type ThemeAlias = typeof THEMES[number]["alias"];

export type FrameDataSlug = {
  gameSlug?: GameName,
  characterSlug?: PlayerData["name"],
  vtStateSlug?: VtState,
  moveNameSlug?: string,
}

export type AdviceToastPrevRead = {
  [key: string]: number,
}

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
}