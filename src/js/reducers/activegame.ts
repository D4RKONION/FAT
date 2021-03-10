import { SET_GAME_NAME } from '../actions';

export default function activeGameReducer(state = "SFV", action) {
  switch(action.type) {
    case SET_GAME_NAME:
      return action.gameName;
    default:
      return state;
  }
}
