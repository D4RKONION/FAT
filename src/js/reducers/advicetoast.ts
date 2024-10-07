import { AdviceToastPrevRead } from "../types";

type AdviceToastReducerAction = {
  type: 'SET_ADVICE_TOASTS_ON' | 'SET_ADVICE_TOAST_SHOWN' | 'SET_ADVICE_TOAST_PREV_READ';
  adviceToastsOn: boolean;
  adviceToastShown: boolean;
  listOfPrevReadToasts: AdviceToastPrevRead
}

const defaultState = {
  adviceToastsOn: true,
  adviceToastShown: false,
  listOfPrevReadToasts: {},
}

export const adviceToastReducer = (state = defaultState, action: AdviceToastReducerAction) => {
  switch(action.type) {

    case 'SET_ADVICE_TOASTS_ON':
      return {
        ...state,
        "adviceToastsOn": action.adviceToastsOn
      }

    case 'SET_ADVICE_TOAST_SHOWN':
      return {
        ...state,
        "adviceToastShown": action.adviceToastShown
      }

    case 'SET_ADVICE_TOAST_PREV_READ':
      return {
        ...state,
        "listOfPrevReadToasts": action.listOfPrevReadToasts
      }

    default:
      return state;
  }
}
