type vsBurntoutOpponentReducerState = Boolean;

type vsBurntoutOpponentReducerAction = {
  type: 'SET_VS_BURNTOUT_OPPONENT';
  vsBurntoutOpponentOn: Boolean;
}

const defaultState: vsBurntoutOpponentReducerState = false;

export const vsBurntoutOpponentReducer = (state = defaultState, action: vsBurntoutOpponentReducerAction) => {
  switch(action.type) {
    case 'SET_VS_BURNTOUT_OPPONENT':
      return action.vsBurntoutOpponentOn;
    default:
      return state;
  }
}
