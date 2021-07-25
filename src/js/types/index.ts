import GAME_DETAILS from "../constants/GameDetails";
import THEMES from "../constants/Themes";

export type PlayerId = 'playerOne' | 'playerTwo';

export type AppModal = 'characterSelect' | 'help' | 'landscapeOptions' | 'whatsNew';

export type MoveNameType = 'official' | 'common' | 'inputs';

export type InputNotationType = 'plnCmd' | 'numCmd';

export type NormalNotationType = 'fullWord' | 'shorthand';

export type GameName = 'SFV' | 'USF4' | '3S' | 'GGST';

export type VtState = typeof GAME_DETAILS[GameName]["characterStates"][number] | keyof typeof GAME_DETAILS["GGST"]["specificCharacterStates"];

export type Orientation = 'landscape' | 'portrait';

export type ThemeBrightness = 'light' | 'dark';

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
    [key: string]: number | string,
  },
  selectedMove?: string,
}