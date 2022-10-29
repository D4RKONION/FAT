type GameDetailsReducerState = any;

type GameDetailsReducerAction = {
  type: 'SET_GAME_DETAILS';
  gameDetails: any;
}

export const gameDetailsReducer = (state: GameDetailsReducerState = null, action: GameDetailsReducerAction) => {
  switch(action.type) {
    case 'SET_GAME_DETAILS':
      return action.gameDetails;
    default:
      return state;
  }
}
