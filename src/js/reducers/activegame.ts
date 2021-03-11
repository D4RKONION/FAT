type ActiveGameReducerState = "SFV" | "USF4" | "3S";

type ActiveGameReducerAction = {
  type: 'SET_GAME_NAME';
  gameName: "SFV" | "USF4" | "3S";
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
