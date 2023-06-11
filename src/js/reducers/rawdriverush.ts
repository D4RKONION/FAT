type rawDriveRushReducerState = Boolean;

type rawDriveRushReducerAction = {
  type: 'SET_RAW_DRIVE_RUSH';
  rawDriveRushOn: Boolean;
}

const defaultState: rawDriveRushReducerState = false;

export const rawDriveRushReducer = (state = defaultState, action: rawDriveRushReducerAction) => {
  switch(action.type) {
    case 'SET_RAW_DRIVE_RUSH':
      return action.rawDriveRushOn;
    default:
      return state;
  }
}
