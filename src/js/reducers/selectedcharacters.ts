import { PlayerData, PlayerId } from "../types";

type SelectedCharactersReducerState = {
  'playerOne': PlayerData,
  'playerTwo': PlayerData
}

type SelectedCharactersReducerAction = {
  type: 'SET_PLAYER' | 'SET_PLAYER_ATTR';
  playerId: PlayerId;
  playerData: PlayerData
}

const defaultState: SelectedCharactersReducerState = {
  "playerOne": {
    name: "Ryu",
    vtState: "normal",
    frameData: {},
    stats: {},
    selectedMove: "Stand LP"
  },
  "playerTwo": {
    name: "Cammy",
    vtState: "normal",
    frameData: {},
    stats: {},
  }
};

export const selectedCharactersReducer = (state = defaultState, action: SelectedCharactersReducerAction) => {
  switch(action.type) {
    case 'SET_PLAYER':
    case 'SET_PLAYER_ATTR': {
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
