import { SET_MODE_NAME } from '../actions';

export default function modeNameReducer(state = "", action) {
  switch(action.type) {
    case SET_MODE_NAME:
      return action.modeName;
    default:
      return state;
  }
}
