type advantageModifiersReducerAction = {
  type: "SET_COUNTER_HIT" | "SET_RAW_DRIVE_RUSH" | "SET_VS_BURNTOUT_OPPONENT" | "RESET_ADVANTAGE_MODIFIERS";
  counterHitActive: boolean;
  rawDriveRushActive: boolean;
  vsBurntoutOpponentActive: boolean
};

const defaultState = {
  counterHitActive: false,
  rawDriveRushActive: false,
  vsBurntoutOpponentActive: false,
};

export const advantageModifiersReducer = (state = defaultState, action: advantageModifiersReducerAction) => {
  switch (action.type) {
    case "SET_COUNTER_HIT":
      return {
        ...state,
        counterHitActive: action.counterHitActive,
      };

    case "SET_RAW_DRIVE_RUSH":
      return {
        ...state,
        rawDriveRushActive: action.rawDriveRushActive,
      };

    case "SET_VS_BURNTOUT_OPPONENT":
      return {
        ...state,
        vsBurntoutOpponentActive: action.vsBurntoutOpponentActive,
      };

    case "RESET_ADVANTAGE_MODIFIERS":
      return defaultState;
      
    default:
      return state;
  }
};
