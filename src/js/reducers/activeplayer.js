import { SET_ACTIVE_PLAYER } from '../actions';

export default function activePlayerReducer(state = "playerOne", action) {
  switch(action.type) {
    case SET_ACTIVE_PLAYER:
      return action.oneOrTwo;
    default:
      return state;
  }
}
