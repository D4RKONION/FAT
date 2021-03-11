type ActivePlayerReducerState = "playerOne" | "playerTwo";

type ActivePlayerReducerAction = {
  type: 'SET_ACTIVE_PLAYER';
  oneOrTwo: "playerOne" | "playerTwo";
}

const defaultState: ActivePlayerReducerState = "playerOne";

export const activePlayerReducer = (state = defaultState, action: ActivePlayerReducerAction) => {
  switch(action.type) {
    case 'SET_ACTIVE_PLAYER':
      return action.oneOrTwo;
    default:
      return state;
  }
}
