import { SET_ADVICE_TOAST_PREV_READ } from '../actions';

export default function adviceToastPrevReadReducer(state = {}, action) {
  switch(action.type) {
    case SET_ADVICE_TOAST_PREV_READ:
      return action.listOfPrevReadToasts;
    default:
      return state;
  }
}
