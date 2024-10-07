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

export const appDisplaySettingsSelector =  (state: RootState) => state.appDisplaySettingsState;

export const themesOwnedSelector =  (state: RootState) => state.themesOwnedState;

export const compactViewSelector =  (state: RootState) => state.compactViewState;

export const onBlockColoursSelector =  (state: RootState) => state.onBlockColoursState;

export const advantageModifiersSelector =  (state: RootState) => state.advantageModifiersState;

export const autoSetSpecificColsSelector =  (state: RootState) => state.autoSetSpecificColsState;

export const adviceToastSelector =  (state: RootState) => state.adviceToastState;
