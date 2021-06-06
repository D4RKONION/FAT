import { mapKeys, isEqual } from 'lodash';

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

  const skipFormattingMove = (moveData) => {
    const TARGET_COMBO: string[] = ["(TC)", "Target Combo"];
    const COMMAND_NORMAL: string[] = ["4", "6"];
    const SYMBOLIC_CMD_NORMAL: string[] = [">", "(air)", "(run)", "(lvl"];
    const RASHID_WIND: string = "(wind)";
    const MOVE_NAME: string = moveData.moveName;
    
    if (TARGET_COMBO.some(indicator => MOVE_NAME.includes(indicator))) {
      return true;
    }

    // Other languages have a cleaner way of representing this: if any of the values in the
    // designated array is in the numCmd, just return the move name since it's a command normal
    if (COMMAND_NORMAL.some(indicator => moveData.numCmd.includes(indicator))) {
      return true;
    }

    // If the above check doesn't find anything, check for some other common indicators; if
    // nothing comes back here, we're good and don't need to skip formatting
    if (SYMBOLIC_CMD_NORMAL.some(indicator => moveData.plnCmd.includes(indicator))) {
      return true;
    }

    // Rashid should be the only one (for now) to trigger this condition for his mixers
    if (MOVE_NAME.includes(RASHID_WIND)) {
      return true;
    }

    return false;
  }

  const formatMoveName = (moveData) => {   
    const strengths: string[] = ["lp", "mp", "hp", "lk", "mk", "hk"];
    const Y_ZEKU_LATE_HIT: string = "late";
    const MENAT_ORB: string = "orb";
    const wordToAbbreviationMap: Map<string, string> = new Map([
      ["stand", "st."],
      ["crouch", "cr."],
      ["jump", "j."],
      ["neutral", "nj."]
    ]);

    let truncatedMoveName: string = "";

    const extractInput = (splitMove: string[]) => {
      let input: string[] = []; 
      
      // Menat orb needs special attention
      if (splitMove.some(x => x.toLocaleLowerCase().includes(MENAT_ORB))) {
        let orb: string = splitMove.find(x => x === "orb");
        let button: string = splitMove.find(x => strengths.some(y => y === x));

        input.push(button.toUpperCase());
        input.push(orb);
        // Young Zeku's crouch HK also need special attention since it has a "late hit"
        // state that gives it different properties and is listed as such in FAT.
      } else if (splitMove.some(x => x.toLocaleLowerCase().includes(Y_ZEKU_LATE_HIT))) {
        // Index 3 contains "late", index 4 contains "hit"
        let lateHit: string = `${splitMove[2]} ${splitMove[3]}`;

        input.push(splitMove[1].toUpperCase());
        input.push(lateHit);
      } else {
        input.push(splitMove[splitMove.length - 1].toUpperCase());
      }

      return input;
    }

    if (!skipFormattingMove(moveData)) {
      if (!moveData.moveName.includes('(')) {
        let splitMoveName: string[] = moveData.moveName.toLowerCase().split(' ');
        let abbr: string = wordToAbbreviationMap.get(splitMoveName[0]);
        let input: string[] = extractInput(splitMoveName);

        if (input.length > 1) {
          truncatedMoveName = `${abbr}${input[0]} ${input[1]}`;
        } else {
          truncatedMoveName = `${abbr}${input[0]}`;
        }
      } else {
        /*
        Regex documentation:
          Lead with \s to account for the leading space, i.e, " (Hold)", but we don't want to include it in the captured result
          The outermost parentheses start the capture group of characters we DO want to capture
          The character combo of \( means that we want to find an actual opening parenthesis
          [a-z\s]* = Within the parenthesis, we want to find any combination of letters and spaces to account for cases like "(crouch large)"
          Then we want to find the closing parenthesis with \)
          The capture group is closed, and the "i" at the end sets a "case insensitive" flag for the regex expression
        */
        let splitMoveFromExtraParens: string[] = moveData.moveName.split(/\s(\([a-z\s]*\))/i).filter((x: string) => x !== "");
        let splitMove: string[] = splitMoveFromExtraParens[0].split(' ');
        let modifierParens: string[] = splitMoveFromExtraParens.slice(1);
        let abbr: string = wordToAbbreviationMap.get(splitMove[0].toLowerCase());
        let input: string = splitMove[splitMove.length - 1].toUpperCase();
        truncatedMoveName = `${abbr}${input} ${modifierParens.join(' ')}`;
      }
    }
        
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