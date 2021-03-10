import { SET_ADVICE_TOAST_SHOWN } from '../actions';

export default function adviceToastShownReducer(state = true, action) {
  switch(action.type) {
    case SET_ADVICE_TOAST_SHOWN:
      return action.adviceToastShown;
    default:
      return state;
  }
}
