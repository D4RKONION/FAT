type AdviceToastDismissedReducerState = Boolean;

type AdviceToastDismissedReducerAction = {
  type: 'SET_ADVICE_TOAST_DISMISSED';
  adviceToastDismissed: Boolean;
}

const defaultState: AdviceToastDismissedReducerState = false;

export const adviceToastDismissedReducer = (state = defaultState, action: AdviceToastDismissedReducerAction) => {
  switch(action.type) {
    case 'SET_ADVICE_TOAST_DISMISSED':
      return action.adviceToastDismissed;
    default:
      return state;
  }
}
