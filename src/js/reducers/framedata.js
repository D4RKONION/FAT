import { SET_FRAME_DATA } from '../actions';

export default function frameDataReducer(state = null, action) {
  switch(action.type) {
    case SET_FRAME_DATA:
      return action.frameData;
    default:
      return state;
  }
}
