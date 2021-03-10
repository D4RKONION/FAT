import { mapKeys, isEqual } from 'lodash';

/**
 * Renames the moves in the character frame data to reflect the user's desired naming convention
 * @param {string} rawFrameData The frame data for the current character
 * @param {string} moveNameType The naming convention
 * @param {string} inputNotationType If the user selected "inputs" for their naming convention, the input notation displayed
 * @returns The frame data JSON object with renamed moves
 */
export function renameData(rawFrameData, moveNameType, inputNotationType) {
  const bulkRenameFrameData = (rawData, renameKey) => {
    return mapKeys(rawData, (moveValue, moveKey) => moveValue[renameKey] ? moveValue[renameKey] : moveKey);
  }

  const shorthandRename = (rawData) => {

  }

  switch (moveNameType) {
    case "official":
      return bulkRenameFrameData(rawFrameData, "moveName");
    case "common":
      return bulkRenameFrameData(rawFrameData, "cmnName");
    case "shorthand":
      return shorthandRename(rawFrameData);
    case "inputs":
      return bulkRenameFrameData(rawFrameData, inputNotationType);
    default:
      break;
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
export function helpCreateFrameDataJSON(rawFrameData, moveNameType, inputNotationType, normalNotationType, vtState) {
  
  const dataToRename = vtState === "normal"
    ? rawFrameData.normal
    : vTriggerMerge(rawFrameData, vtState);

  return moveNameType === "official" ? dataToRename : renameData(dataToRename, moveNameType, inputNotationType);

}