type counterHitReducerState = Boolean;

type counterHitReducerAction = {
  type: 'SET_ON_BLOCK_COLOURS';
  counterHitOn: Boolean;
}

const defaultState: counterHitReducerState = false;

export const counterHitReducer = (state = defaultState, action: counterHitReducerAction) => {
  switch(action.type) {
    case 'SET_ON_BLOCK_COLOURS':
      return action.counterHitOn;
    default:
      return state;
  }
}
