import { mapKeys, isEqual } from 'lodash';

/**
 * Renames the moves in the character frame data to reflect the user's desired naming convention
 * @param {string} rawFrameData The frame data for the current character
 * @param {DataDisplaySettingsReducerState} displayState The Redux state containing various move text render settings
 * @returns The frame data JSON object with renamed moves
 */
export function renameData(rawFrameData, displayState: DataDisplaySettingsReducerState) {
  const renameFrameData = (rawData, renameKey, notationDisplay) => {
    switch (notationDisplay) {
      case "fullWord":
        return mapKeys(rawData, (moveValue, moveKey) => moveValue[renameKey] ? moveValue[renameKey] : moveKey);
      case "shorthand":
        return renameFrameDataToShorthand(rawData);
      default:
        break;
    }
  }

  const renameFrameDataToShorthand = (rawData) => {
    let rename = mapKeys(rawData, (moveValue, moveKey) => {
      if (moveValue.moveType === "normal" && !moveValue.movesList) {
        return formatMoveName(moveValue);
      } else {
        return moveKey;
      }
    });

    return rename;
  }

  const formatMoveName = (moveData) => {
    let truncatedMoveName: string = "";
    const numberToDirectionMap: Map<string, string> = new Map([
      ["2", "cr."],
      ["5", "st."],
      ["8", "nj."]
    ]);

    if (moveData.numCmd.includes("j")) {
      truncatedMoveName = moveData.numCmd;
    } else {
      let [direction, input]: string[] = moveData.numCmd.split(/(\d)/).filter((x: string) => x !== "");
      truncatedMoveName = `${numberToDirectionMap.get(direction)}${input}`;
    }

    return truncatedMoveName;
  }

  switch (displayState.moveNameType) {
    case "official":
      return renameFrameData(rawFrameData, "moveName", displayState.normalNotationType);
    case "common":
      return renameFrameData(rawFrameData, "cmnName", displayState.normalNotationType);
    case "inputs":
      return renameFrameData(rawFrameData, displayState.inputNotationType, displayState.normalNotationType);
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
export function helpCreateFrameDataJSON(rawFrameData, displayState: DataDisplaySettingsReducerState, vtState: VtState) {
  
  const dataToRename = (vtState === "normal") ? rawFrameData.normal : vTriggerMerge(rawFrameData, vtState);

  return (displayState.moveNameType === "official") ? dataToRename : renameData(dataToRename, displayState);
}