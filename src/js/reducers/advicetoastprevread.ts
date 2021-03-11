import { AdviceToastPrevRead } from "../types";

type AdviceToastPrevReadState = AdviceToastPrevRead;

type AdviceToastPrevReadAction = {
  type: 'SET_ADVICE_TOAST_PREV_READ';
  listOfPrevReadToasts: AdviceToastPrevRead;
}

const defaultState: AdviceToastPrevReadState = {};

export const adviceToastPrevReadReducer = (state = defaultState, action: AdviceToastPrevReadAction) => {
  switch(action.type) {
    case 'SET_ADVICE_TOAST_PREV_READ':
      return action.listOfPrevReadToasts;
    default:
      return state;
  }
}
