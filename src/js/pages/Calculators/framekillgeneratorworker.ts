/* Helper Functions for the oki loop */

import { GameName } from "../../types";
import { canParseBasicFrames, parseBasicFrames, parseMultiActiveFrames } from "../../utils/ParseFrameData";

const EXCLUDED_SETUP_MOVES: { [key in GameName]?: { [characterName: string]: string[] } } = {
  SF6: {
    Jamie: ["The Devil Inside (DR4 activation)"],
  },
};

// https://stackoverflow.com/questions/12487422/take-a-value-1-31-and-convert-it-to-ordinal-date-w-javascript
// This allows us to quickly create ordinal strings using active frame numbers
const getOrdinal = (n) => {
  const s=["th","st","nd","rd"],
    v=n%100;
  return n+(s[(v-20)%10]||s[v]||s[0]);
};

// This is used in isDuplicateSetup to compare arrays
const arraysAreEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();
  return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

const isDuplicateSetup = (setupArray, moves): boolean => {
  // If this specific setup array doesn't exist this must not be a dupe
  if (!setupArray) return false;

  return setupArray.some(previousSetup => 
    arraysAreEqual(previousSetup.split(", "), moves)
  );    
};

const getTotalFramesForMove = (moveEntry) => {
  if (!isNaN(moveEntry["total"])) {
    // if we have a total value, just use that
    return moveEntry["total"];
  } else if (moveEntry["multiActive"]) {
    // If we have multiActive, last active frame + recovery to calculate total
    return moveEntry["multiActive"][(moveEntry["multiActive"].length - 1)] + parseBasicFrames(moveEntry["recovery"]);
  } else {
    // otherwise add s, a & r (-1 because last s and first a are the same)
    return (parseBasicFrames(moveEntry["startup"]) - 1) + parseBasicFrames(moveEntry["active"]) + parseBasicFrames(moveEntry["recovery"]); //
  }
};

const isValidMove = (move) => {
  return (
    (
      typeof move["total"] === "number" || // has a total duration OR
      (canParseBasicFrames(move["startup"]) && // has a valid s,a,r
        (canParseBasicFrames(move["active"]) || move["multiActive"]) &&
        canParseBasicFrames(move["recovery"]))
    ) &&
    (!move["followUp"] || typeof move["total"] === "number") && //if it's followup, we need a valid total
    (!move["alpha"] || move["moveType"] !== "alpha") && // no moves that happen out of blockstun
    move["moveType"] !== "super" && // no supers
    !move["airmove"] && // no airmoves
    move["movesList"] !== "Target Combo" // no target combos (would need to be whiff cancellable)
  );
};

const handlePossibleOkiSetup = (processedResults, ordinalName, numberOfSetupMovesKey, firstOkiMove, secondOkiMove, thirdOkiMove) => {
  // Discard if it's a dupe setup
  if (isDuplicateSetup(processedResults[numberOfSetupMovesKey][ordinalName], [firstOkiMove, secondOkiMove, thirdOkiMove].filter(Boolean))) return;

  // If this specific setup array doesn't exist, create it
  if (!processedResults[numberOfSetupMovesKey][ordinalName]) {
    processedResults[numberOfSetupMovesKey][ordinalName] = [];
  }
  
  const setupArray = processedResults[numberOfSetupMovesKey][ordinalName];
  const setupInstructions = `${firstOkiMove}${secondOkiMove ? `, ${secondOkiMove}` : ""}${thirdOkiMove ? `, ${thirdOkiMove}` : ""}`;
  
  setupArray.push(setupInstructions);
};

// The loop which does all the work
const moveSetLoop = (currentLateByFramesSearch, targetMeatyFrames, currentActiveFrame, knockdownFrames, specificSetupMove, processedResults, firstOkiMoveModel, playerOneMoves, activeGame, selectedCharacters, setupLength) => {
  // Get ordinal name for the current late frame
  let ordinalName = getOrdinal(currentActiveFrame);
  if (currentLateByFramesSearch === 1) {
    ordinalName = `1st (${currentLateByFramesSearch} frame late)`;
  } else if (currentLateByFramesSearch > 1) {
    ordinalName = `1st (${currentLateByFramesSearch} frames late)`;
  }

  // Before we begin the loop, and "setupContains" is not a specific move, check for natural meaties
  if (knockdownFrames - targetMeatyFrames + currentLateByFramesSearch === 0 && (specificSetupMove === "Anything" || specificSetupMove === "Nothing (Natural Meaty)")) {
    if (!processedResults["Natural Setups"][ordinalName]) {
      processedResults["Natural Setups"][ordinalName] = [];
    }
    processedResults["Natural Setups"][ordinalName].push(">");
  }

  // Loop through first oki move
  for (const firstOkiMove in firstOkiMoveModel) {
    const firstSetupMove = firstOkiMoveModel[firstOkiMove];
    // Exlude specific moves which make no sense as oki setups, but which are hard to quantify generically
    if (EXCLUDED_SETUP_MOVES?.[activeGame]?.[selectedCharacters?.playerOne?.name]?.includes(firstSetupMove?.moveName)) {
      continue;
    }

    // Parse the move's active frames if it has non-number active amount of them
    if (typeof firstSetupMove["active"] === "string" && (firstSetupMove["active"].includes("(") || firstSetupMove["active"].includes("*")) && canParseBasicFrames(firstSetupMove["startup"])) {
      firstSetupMove.multiActive = parseMultiActiveFrames(firstSetupMove.startup, firstSetupMove.active);
    }

    if (isValidMove(firstSetupMove)) {
      const firstOkiMoveTotalFrames = getTotalFramesForMove(firstSetupMove);

      // Check if the setup move would allow target meaty to overlap with the knockdown
      if (firstOkiMoveTotalFrames === (knockdownFrames - targetMeatyFrames + currentLateByFramesSearch)) {
        if (!processedResults["One Move Setups"][ordinalName]) {
          processedResults["One Move Setups"][ordinalName] = [];
        }
        processedResults["One Move Setups"][ordinalName].push(firstOkiMove);
      }

      // Loop through second oki move
      if (setupLength < 2) continue;
      for (const secondOkiMove in playerOneMoves) {
        const secondSetupMove = playerOneMoves[secondOkiMove];
        if (EXCLUDED_SETUP_MOVES?.[activeGame]?.[selectedCharacters?.playerOne?.name]?.includes(secondSetupMove?.moveName)) {
          continue;
        }

        if (typeof secondSetupMove["active"] === "string" && (secondSetupMove["active"].includes("(") || secondSetupMove["active"].includes("*")) && canParseBasicFrames(secondSetupMove["startup"])) {
          secondSetupMove.multiActive = parseMultiActiveFrames(secondSetupMove.startup, secondSetupMove.active);
        }
        
        if (isValidMove(secondSetupMove) && firstOkiMove !== "Drive Rush >") {
          const secondOkiMoveTotalFrames = getTotalFramesForMove(secondSetupMove);
          
          // Check if the setup move would allow target meaty to overlap with the knockdown
          if ((firstOkiMoveTotalFrames + secondOkiMoveTotalFrames) === (knockdownFrames - targetMeatyFrames + currentLateByFramesSearch)) {
            handlePossibleOkiSetup(processedResults, ordinalName, "Two Move Setups", firstOkiMove, secondOkiMove, null);
          }
          
          // Loop through third oki move
          if (setupLength < 3) continue;
          for (const thirdOkiMove in playerOneMoves) {
            const thirdSetupMove = playerOneMoves[thirdOkiMove];

            if (EXCLUDED_SETUP_MOVES?.[activeGame]?.[selectedCharacters?.playerOne?.name]?.includes(thirdSetupMove?.moveName)) {
              continue;
            }
            
            if (typeof thirdSetupMove["active"] === "string" && (thirdSetupMove["active"].includes("(") || thirdSetupMove["active"].includes("*")) && canParseBasicFrames(thirdSetupMove["startup"])) {
              thirdSetupMove.multiActive = parseMultiActiveFrames(thirdSetupMove.startup, thirdSetupMove.active);
            }

            if (isValidMove(thirdSetupMove) && firstOkiMove !== "Drive Rush >" && secondOkiMove !== "Drive Rush >") {
              const thirdOkiMoveTotalFrames = getTotalFramesForMove(thirdSetupMove);
              if ((firstOkiMoveTotalFrames + secondOkiMoveTotalFrames + thirdOkiMoveTotalFrames) === (knockdownFrames - targetMeatyFrames + currentLateByFramesSearch)) {
                handlePossibleOkiSetup(processedResults, ordinalName, "Three Move Setups", firstOkiMove, secondOkiMove, thirdOkiMove);
              }
            }
          }
        }
      }
    }
  }
};

const findMeatySetups = (lateFrames, isMultiActive, playerOneMoves, targetMeaty, knockdownFrames, specificSetupMove, firstOkiMoveModel, selectedCharacters, activeGame, setupLength) => {
  const meatyResults = { "Natural Setups": {}, "One Move Setups": {}, "Two Move Setups": {}, "Three Move Setups": {} };

  for (let currentLateByFramesSearch = 0; currentLateByFramesSearch <= lateFrames; currentLateByFramesSearch++) {
    let targetMeatyFrames;
    if (currentLateByFramesSearch === 0) {
      if (isMultiActive) {
        for (const [currentActiveFrame, frameinTotalMove] of playerOneMoves[targetMeaty]["multiActive"].entries()) {
          targetMeatyFrames = frameinTotalMove;
          moveSetLoop(currentLateByFramesSearch, targetMeatyFrames, currentActiveFrame + 1, knockdownFrames, specificSetupMove, meatyResults, firstOkiMoveModel, playerOneMoves, activeGame, selectedCharacters, setupLength);
        }
      } else {
        for (let currentActiveFrame = 1; currentActiveFrame <= playerOneMoves[targetMeaty]["active"]; currentActiveFrame++) {
          targetMeatyFrames = parseBasicFrames(playerOneMoves[targetMeaty]["startup"]) - 1 + currentActiveFrame;
          moveSetLoop(currentLateByFramesSearch, targetMeatyFrames, currentActiveFrame, knockdownFrames, specificSetupMove, meatyResults, firstOkiMoveModel, playerOneMoves, activeGame, selectedCharacters, setupLength);
        }
      }
    } else {
      targetMeatyFrames = parseBasicFrames(playerOneMoves[targetMeaty]["startup"]);
      moveSetLoop(currentLateByFramesSearch, targetMeatyFrames, 0, knockdownFrames, specificSetupMove, meatyResults, firstOkiMoveModel, playerOneMoves, activeGame, selectedCharacters, setupLength);
    }
  }
  return meatyResults;
};

// This is for use with games where knockdowns have 2 get-up options
// It compares kdr and kdrb results for duplicates and then combines them into one result
// Some day I might need to refactor this to allow for more than 2. I'll cross that bridge when I get to it :)
const handleMultipleKDAs = (processedResults, playerOneMoves, knockdownMove, targetMeaty, lateByFrames, specificSetupMove, firstOkiMoveModel, selectedCharacters, activeGame, setupLength) => {
  const kdrResults = { ...processedResults };

  let knockdownFrames = parseBasicFrames(playerOneMoves[knockdownMove]["kdrb"]) + 1;
  if (playerOneMoves[targetMeaty]["atkLvl"] === "T") {
    knockdownFrames += 2;
  }

  const kdrbResults = findMeatySetups(lateByFrames, isNaN(playerOneMoves[targetMeaty]["active"]), playerOneMoves, targetMeaty, knockdownFrames, specificSetupMove, firstOkiMoveModel, selectedCharacters, activeGame, setupLength);

  const combinedResults = { "Natural Setups": {}, "One Move Setups": {}, "Two Move Setups": {}, "Three Move Setups": {} };
  
  for (const obj1 in kdrResults) {
    for (const ordinal1 in kdrResults[obj1]) {
      for (const setup1 in kdrResults[obj1][ordinal1]) {
        for (const obj2 in kdrbResults) {
          for (const ordinal2 in kdrbResults[obj2]) {
            for (const setup2 in kdrbResults[obj2][ordinal2]) {
              if (kdrResults[obj1][ordinal1][setup1] === kdrbResults[obj2][ordinal2][setup2]) {
                if (typeof combinedResults[obj1][ordinal1 + " & " + ordinal2] === "undefined") {
                  combinedResults[obj1][ordinal1 + " & " + ordinal2] = [];
                }
                combinedResults[obj1][ordinal1 + " & " + ordinal2].push(kdrResults[obj1][ordinal1][setup1]);
              }
            }
          }
        }
      }
    }
  }

  return combinedResults;
};

onmessage = (e) => {
  const { allKnockdownMovesToTry, recoveryType, activeGame, customKDA, playerOneMoves, targetMeaty, firstOkiMoveModel, lateByFrames, specificSetupMove, selectedCharacters, setupLength } = e.data;

  const result = heavyCalculation(allKnockdownMovesToTry, recoveryType, activeGame, customKDA, playerOneMoves, targetMeaty, firstOkiMoveModel, lateByFrames, specificSetupMove, selectedCharacters, setupLength);
  postMessage(result);
};

function heavyCalculation(allKnockdownMovesToTry, recoveryType, activeGame, customKDA, playerOneMoves, targetMeaty, firstOkiMoveModel, lateByFrames, specificSetupMove, selectedCharacters, setupLength) {
  // set up the processed data container
  const processedResults = {};

  for (const knockdownMove in allKnockdownMovesToTry) {
    const knockdownMoveName = allKnockdownMovesToTry[knockdownMove];

    let thisMoveProcessedResults;

    // Set up the number of frames the opponent is knocked down for.
    // We add plus 1 because that is the frame the opponent is vunerable again
    let knockdownFrames = 1;
    let coverBothKDs = false;

    if (knockdownMoveName === "Custom KDA") {
      knockdownFrames += customKDA;
    } else if (recoveryType === "all") {
      knockdownFrames += parseBasicFrames(playerOneMoves[knockdownMoveName]["kdr"]);
      coverBothKDs = true;
    } else if (activeGame === "SFV") {
      knockdownFrames += parseBasicFrames(playerOneMoves[knockdownMoveName][recoveryType]);
    } else {
      knockdownFrames += parseBasicFrames(playerOneMoves[knockdownMoveName][recoveryType]);
    }

    if (playerOneMoves[targetMeaty]["atkLvl"] === "T" ) {
      if (activeGame === "SFV") {
        knockdownFrames +=2;
      } else if (activeGame === "SF6") {
        knockdownFrames +=1;
      }
      // TODO how many extra frames do you need to make throw meaty on the other games?
    }
 
    // Find setups
    if (isNaN(playerOneMoves[targetMeaty]["active"]) && canParseBasicFrames(playerOneMoves[targetMeaty]["startup"])) {
      // if the move has no active frames, but it has startup frames (and it must not be nonhitting
      // because they can't be selected in the dropdown), then give it 1 active frame
      if (!playerOneMoves[targetMeaty].active) {
        playerOneMoves[targetMeaty].multiActive = parseMultiActiveFrames(playerOneMoves[targetMeaty].startup, "1");
      // otherwise, we parse its multiactive frames
      } else {
        playerOneMoves[targetMeaty].multiActive = parseMultiActiveFrames(playerOneMoves[targetMeaty].startup, playerOneMoves[targetMeaty].active);
      }
   
      thisMoveProcessedResults = findMeatySetups(lateByFrames, true, playerOneMoves, targetMeaty, knockdownFrames, specificSetupMove, firstOkiMoveModel, selectedCharacters, activeGame, setupLength); 
    } else {
      thisMoveProcessedResults = findMeatySetups(lateByFrames, false, playerOneMoves, targetMeaty, knockdownFrames, specificSetupMove, firstOkiMoveModel, selectedCharacters, activeGame, setupLength);
    }

    if (coverBothKDs) {
      thisMoveProcessedResults = handleMultipleKDAs(thisMoveProcessedResults, playerOneMoves, knockdownMoveName, targetMeaty, lateByFrames, specificSetupMove, firstOkiMoveModel, selectedCharacters, activeGame, setupLength);
    }
 
    // Remove any empty objects
    for (const obj in thisMoveProcessedResults) {
      if (Object.keys(thisMoveProcessedResults[obj]).length === 0 && thisMoveProcessedResults[obj].constructor === Object) {
        delete thisMoveProcessedResults[obj];
      }
    }

    processedResults[knockdownMoveName] = thisMoveProcessedResults;
  }
  return processedResults; // Return the result
}