import { SET_ON_BLOCK_COLOURS } from '../actions';

export default function onBlockColoursReducer(state = true, action) {
  switch(action.type) {
    case SET_ON_BLOCK_COLOURS:
      return action.coloursOn;
    default:
      return state;
  }
}
