import { mapKeys, isEqual } from 'lodash';

export function renameData(rawFrameData, moveNameType, inputNotationType) {

  let renameKey = "";
  if (moveNameType === "official") {
    renameKey = "moveName"
  } else if (moveNameType === "common") {
    renameKey = "cmnName";
  } else if (moveNameType === "inputs" && inputNotationType) {
      renameKey = inputNotationType;
  }

  const renamedFrameData = mapKeys(rawFrameData,
    (moveData, moveKey) =>
      moveData[renameKey] ? moveData[renameKey] : moveKey
  );

  return renamedFrameData;
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
          changedValues = [ ...changedValues, detail ]
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
      .reduce((_sortedObj, [k,v]) => ({
        ..._sortedObj,
        [k]: v
      }), {})
  )
}

const paddingValues = {
  SF6: {
    jugLimit: {
      affects: ["normal"],
      value: 0
    },
    jugIncr: {
      affects: ["normal"],
      value: 1
    },
    jugStart: {
      affects: ["normal"],
      value: 1
    },
  }
}

const padWithDefaultValues = (frameDataMerged, gameName) => {
  if (!paddingValues[gameName]) {
    return frameDataMerged
  }

  Object.keys(frameDataMerged).forEach(moveName => {
    Object.keys(paddingValues[gameName]).forEach(dataPoint => {
      if (!frameDataMerged[moveName][dataPoint] && paddingValues[gameName][dataPoint].affects.includes(frameDataMerged[moveName].moveType)) {
        frameDataMerged[moveName][dataPoint] = paddingValues[gameName][dataPoint].value
      }
    })
  }) 
  return frameDataMerged
}

// this allow me to build the JSON for the setPlayer action creator in selectCharacter, SegmentSwitcher and ____ componenet
export function helpCreateFrameDataJSON(rawFrameData, moveNameType, inputNotationType, normalNotationType, vtState, gameName) {

  const frameDataMerged = vtState === "normal"
    ? {...rawFrameData.normal}
    : vTriggerMerge(rawFrameData, vtState);
    

  if (inputNotationType === "ezCmd") {
    Object.keys(frameDataMerged).forEach(moveName => {
      if (!frameDataMerged[moveName].ezCmd) {
        delete frameDataMerged[moveName]
    }}) 
  }

  const frameDataPadded = padWithDefaultValues(frameDataMerged, gameName)

  return moveNameType === "official" ? frameDataPadded : renameData(frameDataPadded, moveNameType, inputNotationType);

}