import { SET_ADVICE_TOAST_DISMISSED } from '../actions';

export default function adviceToastDismissedReducer(state = false, action) {
  switch(action.type) {
    case SET_ADVICE_TOAST_DISMISSED:
      return action.adviceToastDismissed;
    default:
      return state;
  }
}
