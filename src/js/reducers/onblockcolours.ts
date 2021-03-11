type onBlockColoursReducerState = Boolean;

type onBlockColoursReducerAction = {
  type: 'SET_ON_BLOCK_COLOURS';
  coloursOn: Boolean;
}

const defaultState: onBlockColoursReducerState = true;

export const onBlockColoursReducer = (state = defaultState, action: onBlockColoursReducerAction) => {
  switch(action.type) {
    case 'SET_ON_BLOCK_COLOURS':
      return action.coloursOn;
    default:
      return state;
  }
}
