type AdviceToastShownReducerState = Boolean;

type AdviceToastShownReducerAction = {
  type: 'SET_ADVICE_TOAST_SHOWN';
  adviceToastShown: Boolean;
}

const defaultState: AdviceToastShownReducerState = true;

export const adviceToastShownReducer = (state = defaultState, action: AdviceToastShownReducerAction) => {
  switch(action.type) {
    case 'SET_ADVICE_TOAST_SHOWN':
      return action.adviceToastShown;
    default:
      return state;
  }
}
