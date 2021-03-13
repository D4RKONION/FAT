type counterHitReducerState = Boolean;

type counterHitReducerAction = {
  type: 'SET_COUNTER_HIT';
  counterHitOn: Boolean;
}

const defaultState: counterHitReducerState = false;

export const counterHitReducer = (state = defaultState, action: counterHitReducerAction) => {
  switch(action.type) {
    case 'SET_COUNTER_HIT':
      return action.counterHitOn;
    default:
      return state;
  }
}
