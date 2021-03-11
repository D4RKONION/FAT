import { GameName } from "../types";

type ActiveGameReducerState = GameName

type ActiveGameReducerAction = {
  type: 'SET_GAME_NAME';
  gameName: GameName
}

const defaultState: ActiveGameReducerState = "SFV";

export const activeGameReducer = (state = defaultState, action: ActiveGameReducerAction) => {
  switch(action.type) {
    case 'SET_GAME_NAME':
      return action.gameName;
    default:
      return state;
  }
}
