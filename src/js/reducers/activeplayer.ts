import { PlayerId } from "../types";

type ActivePlayerReducerState = PlayerId;

type ActivePlayerReducerAction = {
  type: "SET_ACTIVE_PLAYER";
  oneOrTwo: PlayerId;
};

const defaultState: ActivePlayerReducerState = "playerOne";

export const activePlayerReducer = (state = defaultState, action: ActivePlayerReducerAction) => {
  switch (action.type) {
    case "SET_ACTIVE_PLAYER":
      return action.oneOrTwo;
    default:
      return state;
  }
};
