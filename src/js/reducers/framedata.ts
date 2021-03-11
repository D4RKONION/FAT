type FrameDataReducerState = any;

type FrameDataReducerAction = {
  type: 'SET_FRAME_DATA';
  frameData: any;
}

export const frameDataReducer = (state: FrameDataReducerState = null, action: FrameDataReducerAction) => {
  switch(action.type) {
    case 'SET_FRAME_DATA':
      return action.frameData;
    default:
      return state;
  }
}
