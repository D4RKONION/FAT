type compactViewReducerState = Boolean;

type compactViewReducerAction = {
  type: 'SET_COMPACT_VIEW';
  compactViewOn: Boolean;
}

const defaultState: compactViewReducerState = true;

export const compactViewReducer = (state = defaultState, action: compactViewReducerAction) => {
  switch(action.type) {
    case 'SET_COMPACT_VIEW':
      return action.compactViewOn;
    default:
      return state;
  }
}
