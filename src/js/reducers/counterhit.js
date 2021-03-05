import { SET_COUNTER_HIT } from '../actions';

export default function counterHitReducer(state = false, action) {
  switch(action.type) {
    case SET_COUNTER_HIT:
      return action.counterHitOn;
    default:
      return state;
  }
}
