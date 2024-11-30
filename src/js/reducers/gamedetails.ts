import AppSF6GameDetails from "../constants/gamedetails/SF6GameDetails.json";

type GameDetailsReducerState = any;

type GameDetailsReducerAction = {
  type: "SET_GAME_DETAILS";
  gameDetails: any;
};

const defaultState = AppSF6GameDetails;

export const gameDetailsReducer = (state: GameDetailsReducerState = defaultState, action: GameDetailsReducerAction) => {
  switch (action.type) {
    case "SET_GAME_DETAILS":
      return action.gameDetails;
    default:
      return state;
  }
};
