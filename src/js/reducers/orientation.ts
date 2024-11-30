import { Orientation } from "../types";

type OrientationReducerState = Orientation;

type OrientationReducerAction = {
  type: "SET_ORIENTATION";
  orientation: Orientation;
};

const defaultState: OrientationReducerState = "portrait";

export const orientationReducer = (state = defaultState, action: OrientationReducerAction) => {
  switch (action.type) {
    case "SET_ORIENTATION":
      return action.orientation;
    default:
      return state;
  }
};