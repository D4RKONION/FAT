type ModeNameReducerState = string;

type ModeNameReducerAction = {
  type: "SET_MODE_NAME";
  modeName: string;
};

const defaultState: ModeNameReducerState = "";

export const modeNameReducer = (state = defaultState, action: ModeNameReducerAction) => {
  switch (action.type) {
    case "SET_MODE_NAME":
      return action.modeName;
    default:
      return state;
  }
};
