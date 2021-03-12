type autoSetSpecificColsReducerState = Boolean;

type autoSetSpecificColsReducerAction = {
  type: 'SET_AUTO_SET_SPECIFIC_COLS';
  autoSetColsOn: Boolean;
}

const defaultState: autoSetSpecificColsReducerState = true;

export const autoSetSpecificColsReducer = (state = defaultState, action: autoSetSpecificColsReducerAction) => {
  switch(action.type) {
    case 'SET_AUTO_SET_SPECIFIC_COLS':
      return action.autoSetColsOn;
    default:
      return state;
  }
}
