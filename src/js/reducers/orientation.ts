import { SET_ORIENTATION } from '../actions';

export default function orientationReducer(state = "portrait", action) {
  switch(action.type) {
    case SET_ORIENTATION:
      return action.orientation;
    default:
      return state;
  }
}
