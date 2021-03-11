type OrientationReducerState = string;

type OrientationReducerAction = {
  type: 'SET_ORIENTATION';
  orientation: "landscape" | "portrait";
}

const defaultState: OrientationReducerState = "portrait";

export const orientationReducer = (state = defaultState, action: OrientationReducerAction) => {
  switch(action.type) {
    case 'SET_ORIENTATION':
      return action.orientation;
    default:
      return state;
  }
}