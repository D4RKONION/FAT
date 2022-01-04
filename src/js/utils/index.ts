import { mapKeys, isEqual } from 'lodash';
import { DataDisplaySettingsReducerState } from '../reducers/datadisplaysettings';
import { VtState } from '../types';
import MoveFormatter from './moveformatter';

/**
 * Renames the moves in the character frame data to reflect the user's desired naming convention
 * @param {string} rawFrameData The frame data for the current character
 * @param {DataDisplaySettingsReducerState} dataDisplayState The Redux state containing various move text render settings
 * @returns The frame data JSON object with renamed moves
 */
export function renameData(rawFrameData, dataDisplayState: DataDisplaySettingsReducerState) {
  const renameFrameData = (rawData, renameKey, notationDisplay) => {
    switch (notationDisplay) {
      case "fullWord":
        return mapKeys(rawData, (moveValue, moveKey) => moveValue[renameKey] ? moveValue[renameKey] : moveKey);
      case "shorthand":
        return renameFrameDataToShorthand(rawData, renameKey);
      default:
        break;
    }
  }

  const renameFrameDataToShorthand = (rawData: string, nameTypeKey: string) => {
    const HELD_NORMAL: string = "Held Normal"; 
    let rename = mapKeys(rawData, (moveValue, moveKey) => {
      const DEFAULT_MOVE_NAME = () => {
        if (moveValue[nameTypeKey]) {
          return moveValue[nameTypeKey];
        } else {
          return moveKey;
        }
      }
      
      if ((moveValue.moveType === "normal")) {
        if (moveValue.movesList) {
          if (moveValue.movesList === HELD_NORMAL) {
            return formatMoveName(moveValue);
          } else {
            return DEFAULT_MOVE_NAME();
          }
        } else {
          let formatted: string = formatMoveName(moveValue);
          if (formatted !== "") {
            return formatted;
          } else {
            return DEFAULT_MOVE_NAME();
          }
        }
      } else {
        return DEFAULT_MOVE_NAME();
      }
    });

    return rename;
  }

  const formatMoveName = (moveData) => {   
    let truncatedMoveName: string = "";
    let moveFormatter = new MoveFormatter();

    truncatedMoveName = moveFormatter.formatToShorthand(moveData);
        
    return truncatedMoveName;
  }

  switch (dataDisplayState.moveNameType) {
    case "official":
      return renameFrameData(rawFrameData, "moveName", dataDisplayState.normalNotationType);
    case "common":
      return renameFrameData(rawFrameData, "cmnName", dataDisplayState.normalNotationType);
    case "inputs":
      return renameFrameData(rawFrameData, dataDisplayState.inputNotationType, "fullWord");
    default:
      return rawFrameData;
  }
}


// Each move in the displayed frame data object needs to have an array that keeps track of any values
// which change when the character activates V-Trigger
function vTriggerMerge(rawFrameData, vtState) {

  const vtMergedData = {
    ...rawFrameData.normal, ...rawFrameData[vtState]
  }

  Object.keys(rawFrameData[vtState]).forEach(vtMove => {
    let changedValues = [];
    Object.keys(rawFrameData[vtState][vtMove]).forEach(detail => {
      if (!rawFrameData.normal[vtMove]) {
        vtMergedData[vtMove]["uniqueInVt"] = true;
      } else if (rawFrameData.normal[vtMove] && !isEqual(rawFrameData.normal[vtMove][detail], rawFrameData[vtState][vtMove][detail])) {
        changedValues = [...changedValues, detail]
      }
    })
    vtMergedData[vtMove] = { ...vtMergedData[vtMove], changedValues }
  }
  )

  // based on https://stackoverflow.com/a/39442287
  return (
    Object.entries(vtMergedData)
      .sort((moveOne: any, moveTwo: any) => {
        return moveOne[1].i - moveTwo[1].i
      })
      .reduce((_sortedObj, [k, v]) => ({
        ..._sortedObj,
        [k]: v
      }), {})
  )


}

// this allow me to build the JSON for the setPlayer action creator in selectCharacter, SegmentSwitcher and ____ componenet
export function helpCreateFrameDataJSON(rawFrameData, dataDisplayState: DataDisplaySettingsReducerState, vtState: VtState) {

  const dataToRename = (vtState === "normal") ? rawFrameData.normal : vTriggerMerge(rawFrameData, vtState);

  return renameData(dataToRename, dataDisplayState);
}