import GAME_DETAILS from "../constants/GameDetails";
import { GameName, PlayerData } from "../types";

export const createSegmentSwitcherObject = (gameName: GameName, charName: PlayerData["name"]) => {
  const segmentSwitcherObject = {
    normal: "Normal"
  }
  GAME_DETAILS[gameName].specificCharacterStates[charName] &&
    GAME_DETAILS[gameName].specificCharacterStates[charName].forEach(stateName => {
      segmentSwitcherObject[stateName] = stateName
    })
  

	return segmentSwitcherObject;
}