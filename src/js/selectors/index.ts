import type { RootState } from '../reducers';

export const orientationSelector =  (state: RootState) => state.orientationState;

export const modeNameSelector =  (state: RootState) => state.modeNameState;

export const activeGameSelector =  (state: RootState) => state.activeGameState;

export const frameDataSelector =  (state: RootState) => state.frameDataState;

export const gameDetailsSelector =  (state: RootState) => state.gameDetailsState;

export const activePlayerSelector =  (state: RootState) => state.activePlayerState;

export const landscapeColsSelector =  (state: RootState) => state.landscapeColsState;

export const modalVisibilitySelector =  (state: RootState) => state.modalVisibilityState;

export const selectedCharactersSelector =  (state: RootState) => state.selectedCharactersState;

export const dataDisplaySettingsSelector =  (state: RootState) => state.dataDisplaySettingsState;

export const themeBrightnessSelector =  (state: RootState) => state.themeBrightnessState;

export const themeAccessibilitySelector =  (state: RootState) => state.themeAccessibilityState;

export const themeColorSelector =  (state: RootState) => state.themeColorState;

export const themesOwnedSelector =  (state: RootState) => state.themesOwnedState;

export const onBlockColoursSelector =  (state: RootState) => state.onBlockColoursState;

export const counterHitSelector =  (state: RootState) => state.counterHitState;

export const vsBurntoutOpponentSelector =  (state: RootState) => state.vsBurntoutOpponentState;

export const autoSetSpecificColsSelector =  (state: RootState) => state.autoSetSpecificColsState;

export const adviceToastShownSelector =  (state: RootState) => state.adviceToastShownState;

export const adviceToastDismissedSelector =  (state: RootState) => state.adviceToastDismissedState;

export const adviceToastPrevReadSelector =  (state: RootState) => state.adviceToastPrevReadState;
