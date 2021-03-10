import { SET_PLAYER, SET_PLAYER_ATTR } from '../actions';
export default function selectedCharactersReducer(state = {playerOne: {name: "Ryu", vtState: "normal", frameData: {}, stats: {}, selectedMove: "Stand LP"}, playerTwo: {name: "Cammy", vtState: "normal", framedata: {}, stats: {}}}, action) {
  switch(action.type) {
    case SET_PLAYER:
    case SET_PLAYER_ATTR:{
      return {
        ...state,
        [action.playerId]: {
          ...state[action.playerId],
          ...action.playerData,
        }
      }
    }
    default:
        return state;
  }
}
