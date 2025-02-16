import "../../../style/pages/Calculators.scss";
import "../../../style/pages/FrameKillGenerator.scss";
import "../../../style/components/FAB.scss";

import { IonContent, IonPage, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonList, IonSelect, IonSelectOption, IonListHeader, IonItemDivider, IonItemGroup, IonGrid, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonInput, IonButton } from "@ionic/react";
import { helpSharp, person } from "ionicons/icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setActiveFrameDataPlayer, setModalVisibility } from "../../actions";
import SegmentSwitcher from "../../components/SegmentSwitcher";
import { activeGameSelector, selectedCharactersSelector } from "../../selectors";
import { GameName } from "../../types";
import { canParseBasicFrames, parseBasicFrames, parseMultiActiveFrames } from "../../utils/ParseFrameData";

const EXCLUDED_SETUP_MOVES: { [key in GameName]?: { [characterName: string]: string[] } } = {
  SF6: {
    Jamie: ["The Devil Inside (DR4 activation)"],
  },
};

const GAME_KNOCKDOWN_LABELS = {
  "3S": {disabled: "disabled"},
  USF4: {disabled: "disabled"},
  SFV: {kdr: "Quick", kdrb: "Back", all: "Q&B", kd: "None"},
  SF6: {onHit: "Normal Hit", onPC: "Punish Counter"},
  GGST: {disabled: "disabled"},
};

const SETUP_CONTAINS_LABELS = {
  universal: {anything: "Anything", "Forward Dash": "Forward Dash"},
  SF6: {"Drive Rush >": "Drive Rush >"},
};

const TARGET_MEATY_LABELS = {
  SFV: {"Safe Jump": "Safe Jump"},
  SF6: {"Safe Jump": "Safe Jump"},
};

/* Helper Functions for the oki loop */

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
    !move["airmove"] // no airmoves
  );
};

const FrameKillGenerator = () => {
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activeGame = useSelector(activeGameSelector);

  const dispatch = useDispatch();

  const [recoveryType, setRecoveryType] = useState(Object.keys(GAME_KNOCKDOWN_LABELS[activeGame])[0]);
  const [knockdownMove, setKnockdownMove] = useState(null);
  const [customKDA, setCustomKDA] = useState(0);
  const [lateByFrames, setLateByFrames] = useState(0);
  const [specificSetupMove, setSpecificSetupMove] = useState("anything");
  const [targetMeaty, setTargetMeaty] = useState(null);

  const [okiResults, setOkiResults] = useState({});

  const playerOneMoves = selectedCharacters["playerOne"].frameData;

  useEffect(() => {
    if (
      knockdownMove !== "Custom KDA" &&
      (!playerOneMoves || !playerOneMoves[knockdownMove] ||
      !(
        (playerOneMoves[knockdownMove].kd || playerOneMoves[knockdownMove].kdr || playerOneMoves[knockdownMove].kdrb) ||
        (playerOneMoves[knockdownMove][recoveryType] && isNaN(playerOneMoves[knockdownMove][recoveryType]) && !isNaN(Number(playerOneMoves[knockdownMove][recoveryType].match(/KD \+([^\(*,\[]+)/)?.[1]) + 1))
      ))
    ) {  
      setKnockdownMove(null);
    }
    if (!(playerOneMoves[specificSetupMove] || specificSetupMove === "Forward Dash")) {
      setSpecificSetupMove("anything");
    }
    
    if (!playerOneMoves[targetMeaty] && !TARGET_MEATY_LABELS?.[activeGame]?.[targetMeaty]) {
      setTargetMeaty(null);
    }
  },[activeGame, knockdownMove, playerOneMoves, recoveryType, selectedCharacters, specificSetupMove, targetMeaty]);

  useEffect(() => {
    setRecoveryType(Object.keys(GAME_KNOCKDOWN_LABELS[activeGame])[0]);
    setSpecificSetupMove("anything");
  }, [activeGame]);

  useEffect(() => {
    //prep specific setup labels for checking
    const gameLabels = SETUP_CONTAINS_LABELS[activeGame] || {};
    const universalLabels = SETUP_CONTAINS_LABELS.universal || {};
    const allLabels = { ...universalLabels, ...gameLabels };

    // cancel the calculation if the required dropdowns have not been selected
    if (
      !knockdownMove ||
      (!playerOneMoves[knockdownMove] && knockdownMove !== "Custom KDA") ||
      !targetMeaty ||
      (!playerOneMoves[targetMeaty] && !TARGET_MEATY_LABELS?.[activeGame]?.[targetMeaty]) ||
      (!allLabels[specificSetupMove] && !playerOneMoves[specificSetupMove])
    ) { return; }

    // set up the processed data container
    let processedResults = { "Natural Setups": {}, "One Move Setups": {}, "Two Move Setups": {}, "Three Move Setups": {} };

    // Set up the number of frames the opponent is knocked down for.
    // We add plus 1 because that is the frame the opponent is vunerable again
    let knockdownFrames;
    let coverBothKDs;

    if (knockdownMove === "Custom KDA") {
      knockdownFrames = customKDA + 1;
    } else if (recoveryType === "all") {
      knockdownFrames = parseBasicFrames(playerOneMoves[knockdownMove]["kdr"]) + 1;
      coverBothKDs = true;
    } else if (activeGame === "SFV") {
      knockdownFrames = parseBasicFrames(playerOneMoves[knockdownMove][recoveryType]) + 1;
    } else {
      knockdownFrames = parseBasicFrames(playerOneMoves[knockdownMove][recoveryType]) + 1;
    }

    // Put the character's forward dash into the data model as a possible setup move. We will remove this at the end
    playerOneMoves["Forward Dash"] = {
      startup: 1,
      active: 0,
      recovery: parseInt(selectedCharacters.playerOne.stats.fDash as string),
    };

    if (activeGame === "SF6") {
      // Put Drive Rush into the data model as a possible setup move if the game is SF6. We will remove this at the end
      playerOneMoves["Drive Rush >"] = {
        startup: 1,
        active: 0,
        recovery: 11,
      };
    }
    if (targetMeaty === "Safe Jump") {
      playerOneMoves["Safe Jump"] = {
        startup: parseBasicFrames(selectedCharacters["playerOne"].stats.fJump) - Number(selectedCharacters["playerOne"].stats.fJump.match(/(?<=\+)(\d+)(?=\))/)[1]) + 1,
        active: 1,
        atkLvl: "M",
      };
    }

    if (playerOneMoves[targetMeaty]["atkLvl"] === "T" ) {
      if (activeGame === "SFV") {
        knockdownFrames +=2;
      } else if (activeGame === "SF6") {
        knockdownFrames +=1;
      }
      // TODO how many extra frames do you need to make throw meaty on the other games?
    }

    // If a specific move is required in the setup, make that the only option in firstokimove
    let firstOkiMoveModel;
    if (!specificSetupMove || specificSetupMove === "anything") {
      firstOkiMoveModel = {...playerOneMoves};
    } else {
      firstOkiMoveModel = {[specificSetupMove]: playerOneMoves[specificSetupMove]};
    }
    
    const handlePossibleOkiSetup = (ordinalName, numberOfSetupMovesKey, firstOkiMove, secondOkiMove, thirdOkiMove) => {
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
    const moveSetLoop = (currentLateByFramesSearch, targetMeatyFrames, currentActiveFrame) => {
      // Get ordinal name for the current late frame
      let ordinalName = getOrdinal(currentActiveFrame);
      if (currentLateByFramesSearch === 1) {
        ordinalName = `1st (${currentLateByFramesSearch} frame late)`;
      } else if (currentLateByFramesSearch > 1) {
        ordinalName = `1st (${currentLateByFramesSearch} frames late)`;
      }
    
      // Before we begin the loop, check for natural meaties
      if (knockdownFrames - targetMeatyFrames + currentLateByFramesSearch === 0) {
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
          return;
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
          for (const secondOkiMove in playerOneMoves) {
            const secondSetupMove = playerOneMoves[secondOkiMove];
            if (EXCLUDED_SETUP_MOVES?.[activeGame]?.[selectedCharacters?.playerOne?.name]?.includes(secondSetupMove?.moveName)) {
              return;
            }
    
            if (typeof secondSetupMove["active"] === "string" && (secondSetupMove["active"].includes("(") || secondSetupMove["active"].includes("*")) && canParseBasicFrames(secondSetupMove["startup"])) {
              secondSetupMove.multiActive = parseMultiActiveFrames(secondSetupMove.startup, secondSetupMove.active);
            }
            
            if (isValidMove(secondSetupMove) && firstOkiMove !== "Drive Rush >") {
              const secondOkiMoveTotalFrames = getTotalFramesForMove(secondSetupMove);
              
              // Check if the setup move would allow target meaty to overlap with the knockdown
              if ((firstOkiMoveTotalFrames + secondOkiMoveTotalFrames) === (knockdownFrames - targetMeatyFrames + currentLateByFramesSearch)) {
                handlePossibleOkiSetup(ordinalName, "Two Move Setups", firstOkiMove, secondOkiMove, null);
              }
              
              // Loop through third oki move
              for (const thirdOkiMove in playerOneMoves) {
                const thirdSetupMove = playerOneMoves[thirdOkiMove];

                if (EXCLUDED_SETUP_MOVES?.[activeGame]?.[selectedCharacters?.playerOne?.name]?.includes(thirdSetupMove?.moveName)) {
                  return;
                }
                
                if (typeof thirdSetupMove["active"] === "string" && (thirdSetupMove["active"].includes("(") || thirdSetupMove["active"].includes("*")) && canParseBasicFrames(thirdSetupMove["startup"])) {
                  thirdSetupMove.multiActive = parseMultiActiveFrames(thirdSetupMove.startup, thirdSetupMove.active);
                }
  
                if (isValidMove(thirdSetupMove) && firstOkiMove !== "Drive Rush >" && secondOkiMove !== "Drive Rush >") {
                  const thirdOkiMoveTotalFrames = getTotalFramesForMove(thirdSetupMove);
                  if ((firstOkiMoveTotalFrames + secondOkiMoveTotalFrames + thirdOkiMoveTotalFrames) === (knockdownFrames - targetMeatyFrames + currentLateByFramesSearch)) {
                    handlePossibleOkiSetup(ordinalName, "Three Move Setups", firstOkiMove, secondOkiMove, thirdOkiMove);
                  }
                }
              }
            }
          }
        }
      }
    };

    function findMeatySetups(lateFrames, isMultiActive) {
      for (let currentLateByFramesSearch = 0; currentLateByFramesSearch <= lateFrames; currentLateByFramesSearch++) {
        let targetMeatyFrames;
        if (currentLateByFramesSearch === 0) {
          if (isMultiActive) {
            for (const [currentActiveFrame, frameinTotalMove] of playerOneMoves[targetMeaty]["multiActive"].entries()) {
              targetMeatyFrames = frameinTotalMove;
              moveSetLoop(currentLateByFramesSearch, targetMeatyFrames, currentActiveFrame + 1);
            }
          } else {
            for (let currentActiveFrame = 1; currentActiveFrame <= playerOneMoves[targetMeaty]["active"]; currentActiveFrame++) {
              targetMeatyFrames = parseBasicFrames(playerOneMoves[targetMeaty]["startup"]) - 1 + currentActiveFrame;
              moveSetLoop(currentLateByFramesSearch, targetMeatyFrames, currentActiveFrame);
            }
          }
        } else {
          targetMeatyFrames = parseBasicFrames(playerOneMoves[targetMeaty]["startup"]);
          moveSetLoop(currentLateByFramesSearch, targetMeatyFrames, lateByFrames);
        }
      }
    }

    // This is for use with games where knockdowns have 2 get-up options
    // It compares kdr and kdrb results for duplicates and then combines them into one result
    // Some day I might need to refactor this to allow for more than 2. I'll cross that bridge when I get to it :)
    function handleMultipleKDAs() {
      const kdrResults = { ...processedResults };
      processedResults = { "Natural Setups": {}, "One Move Setups": {}, "Two Move Setups": {}, "Three Move Setups": {} };

      knockdownFrames = playerOneMoves[knockdownMove]["kdrb"] + 1;
      if (playerOneMoves[targetMeaty]["atkLvl"] === "T") {
        knockdownFrames += 2;
      }

      findMeatySetups(lateByFrames, isNaN(playerOneMoves[targetMeaty]["active"]));
      const kdrbResults = { ...processedResults };

      processedResults = { "Natural Setups": {}, "One Move Setups": {}, "Two Move Setups": {}, "Three Move Setups": {} };
      
      for (const obj1 in kdrResults) {
        for (const ordinal1 in kdrResults[obj1]) {
          for (const setup1 in kdrResults[obj1][ordinal1]) {
            for (const obj2 in kdrbResults) {
              for (const ordinal2 in kdrbResults[obj2]) {
                for (const setup2 in kdrbResults[obj2][ordinal2]) {
                  if (kdrResults[obj1][ordinal1][setup1] === kdrbResults[obj2][ordinal2][setup2]) {
                    if (typeof processedResults[obj1][ordinal1 + " & " + ordinal2] === "undefined") {
                      processedResults[obj1][ordinal1 + " & " + ordinal2] = [];
                    }
                    processedResults[obj1][ordinal1 + " & " + ordinal2].push(kdrResults[obj1][ordinal1][setup1]);
                  }
                }
              }
            }
          }
        }
      }
    }
    
    // Find setups
    if (isNaN(playerOneMoves[targetMeaty]["active"]) && canParseBasicFrames(playerOneMoves[targetMeaty]["startup"])) {
      // if the move has no active frames, but it has startup frames (and it must not be nonhitting
      // because they can't be selected in the dropdown), then give it 1 active frame
      if (!playerOneMoves[targetMeaty].active) {
        playerOneMoves[targetMeaty].multiActive = parseMultiActiveFrames(firstOkiMoveModel[targetMeaty].startup, "1");
      } else {
        playerOneMoves[targetMeaty].multiActive = parseMultiActiveFrames(firstOkiMoveModel[targetMeaty].startup, firstOkiMoveModel[targetMeaty].active);
      }

      findMeatySetups(lateByFrames, true);
      if (coverBothKDs) {
        handleMultipleKDAs();
      }
    } else {
      findMeatySetups(lateByFrames, false);
      if (coverBothKDs) {
        handleMultipleKDAs();
      }
    }
    
    // Remove any empty objects
    for (const obj in processedResults) {
      if (Object.keys(processedResults[obj]).length === 0 && processedResults[obj].constructor === Object) {
        delete processedResults[obj];
      }
    }

    // Remove the character's forward dash from the move model, so it doesn't show up elsewhere
    delete playerOneMoves["Forward Dash"];
    if (activeGame === "SF6") {
      delete playerOneMoves["Drive Rush >"];
    }

    if (targetMeaty === "Safe Jump") {
      delete playerOneMoves["Safe Jump"];
    }
    
    if (Object.keys(processedResults).length !== 0) {
      setOkiResults(processedResults);
    } else {
      setOkiResults(false);
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recoveryType, knockdownMove, lateByFrames, specificSetupMove, targetMeaty, playerOneMoves, selectedCharacters.playerOne.stats.fDash, customKDA]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/calculators" />
          </IonButtons>
          <IonTitle>{`Oki - ${selectedCharacters.playerOne.name}`}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => { dispatch(setModalVisibility({ currentModal: "help", visible: true }));}}><IonIcon slot="icon-only" icon={helpSharp} /></IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent id="FrameKillGenerator" className="calculators">
        {Object.keys(GAME_KNOCKDOWN_LABELS[activeGame])[0] === "disabled" ? (
        
          <IonGrid fixed>
            <div>
              <h4>Sorry, this calculator doesn't work with {activeGame}</h4>
            </div>
          </IonGrid>
        ) :(
          <>
            <IonGrid fixed>
              {Object.keys(GAME_KNOCKDOWN_LABELS[activeGame]).length > 1 &&
                <SegmentSwitcher
                  key={"Oki KD type"}
                  valueToTrack={recoveryType}
                  segmentType={"recovery-type"}
                  labels={GAME_KNOCKDOWN_LABELS[activeGame]}
                  clickFunc={(eventValue) => recoveryType !== eventValue && setRecoveryType(eventValue)}
                />
              }

              <IonItem lines="full">
                <IonSelect
                  label={"Knock down with"}
                  interface="modal"
                  interfaceOptions={{ header: "Knock down with" }}
                  value={knockdownMove}
                  okText="Select"
                  cancelText="Cancel"
                  onIonChange={e => setKnockdownMove(e.detail.value)}
                >
                  <IonSelectOption value={null}>Select a move</IonSelectOption>
                  <IonSelectOption value={"Custom KDA"}>Custom KDA</IonSelectOption>
                  {Object.keys(playerOneMoves).filter(move =>
                    activeGame === "SFV" ?
                      playerOneMoves[move].kd || playerOneMoves[move].kdr || playerOneMoves[move].kdrb
                      : activeGame === "SF6" ?
                        playerOneMoves[move][recoveryType] && isNaN(playerOneMoves[move][recoveryType]) && !isNaN(Number(playerOneMoves[move][recoveryType].match(/KD \+([^\(*,\[]+)/)?.[1]) + 1)
                        : null
                  ).map(move =>
                    <IonSelectOption key={`knockdownMove-${move}`} value={move}>{move}</IonSelectOption>
                  )
                  }
                </IonSelect>
              </IonItem>
          
              {knockdownMove === "Custom KDA" &&
                <IonItem lines="full">
                  <IonLabel position="fixed">Custom KDA</IonLabel>
                  <IonInput style={{textAlign: "end"}} slot="end" type="number" value={customKDA} placeholder="Enter Number" onIonInput={e => setCustomKDA(!!parseInt(e.detail.value) && parseInt(e.detail.value))}></IonInput>
                </IonItem>
              }
          
              <IonItem lines="full">
                <IonLabel style={{flex: "1 0 auto"}} slot="start">Include Late Meaties</IonLabel>
                <IonInput style={{textAlign: "end"}} slot="end" type="number" value={lateByFrames} placeholder="Enter Number" onIonInput={e => setLateByFrames(!!parseInt(e.detail.value) ? parseInt(e.detail.value) : 0)}></IonInput>
                <IonLabel slot="end">Frames</IonLabel>
              </IonItem>

              <IonItem lines="full">
                <IonSelect
                  label="Setup contains"
                  interface="modal"
                  interfaceOptions={{ header: "Setup Contains" }}
                  value={specificSetupMove}
                  okText="Select"
                  cancelText="Cancel"
                  onIonChange={e => setSpecificSetupMove(e.detail.value)}
                >
                  {Object.keys(SETUP_CONTAINS_LABELS).map(gameName =>
                    (gameName === activeGame || gameName === "universal") && (
                      Object.keys(SETUP_CONTAINS_LABELS[gameName]).map(value =>
                        <IonSelectOption key={`setup-contains-${gameName}-${value}`} value={value}>{SETUP_CONTAINS_LABELS[gameName][value]}</IonSelectOption>
                      )
                    )
                  )}
                  {Object.keys(playerOneMoves).filter(move =>
                    (
                      canParseBasicFrames(playerOneMoves[move].total) ||
                      ((canParseBasicFrames(playerOneMoves[move].startup) && canParseBasicFrames(playerOneMoves[move].active)) || canParseBasicFrames(playerOneMoves[move].multiActive)) &&
                      canParseBasicFrames(playerOneMoves[move].recovery) &&
                      !playerOneMoves[move].followUp
                    ) &&
                    playerOneMoves[move].moveType !== "alpha" &&
                    playerOneMoves[move].moveType !== "super" &&
                    !playerOneMoves[move].airmove
                  ).map(move =>
                    <IonSelectOption key={`specificSetup-${move}`} value={move}>{move}</IonSelectOption>
                  )}
                </IonSelect>
              </IonItem>

              <IonItem lines="full">
                <IonSelect
                  label="Target meaty"
                  interface="modal"
                  interfaceOptions={{ header: "Target Meaty" }}
                  value={targetMeaty}
                  okText="Select"
                  cancelText="Cancel"
                  onIonChange={e => setTargetMeaty(e.detail.value)}
                >
                  <IonSelectOption key="target-meaty-select" value={null}>Select a move</IonSelectOption>

                  {Object.keys(TARGET_MEATY_LABELS).map(gameName =>
                    (gameName === activeGame) && (
                      Object.keys(TARGET_MEATY_LABELS[gameName]).map(value =>
                        <IonSelectOption key={`target-meaty-${gameName}-${value}`} value={value}>{TARGET_MEATY_LABELS[gameName][value]}</IonSelectOption>
                      )
                    )
                  )}

                  {Object.keys(playerOneMoves).filter(move =>
                    (playerOneMoves[move].active || playerOneMoves[move].startup) &&
                    !playerOneMoves[move].airmove &&
                    !playerOneMoves[move].followUp &&
                    !playerOneMoves[move].nonHittingMove &&
                    playerOneMoves[move].moveType !== "alpha"
                  ).map(move =>
                    <IonSelectOption key={`target-meaty-${move}`} value={move}>{move}</IonSelectOption>
                  )}
                </IonSelect>
              </IonItem>

              {(playerOneMoves[knockdownMove] || knockdownMove === "Custom KDA") && (playerOneMoves[targetMeaty] || TARGET_MEATY_LABELS?.[activeGame]?.[targetMeaty]) &&
            <IonItem lines="full" className="selected-move-info">
              <IonLabel>
                <h3>Knockdown with</h3>
                <h2>{knockdownMove}</h2>
                <>
                  {recoveryType === "all"
                    ? <>
                      <p>KD Advantage (Q): <strong>{knockdownMove === "Custom KDA" ? customKDA : playerOneMoves[knockdownMove]["kdr"]}</strong></p>
                      <p>KD Advantage (B): <strong>{knockdownMove === "Custom KDA" ? customKDA : playerOneMoves[knockdownMove]["kdrb"]}</strong></p>
                    </>
                    : <p>KD Advantage: <strong>{knockdownMove === "Custom KDA" ? customKDA : playerOneMoves[knockdownMove][recoveryType]}</strong></p>
                  }
                </>

              </IonLabel>
              <IonLabel>
                <h3>Target Meaty</h3>
                <h2>{targetMeaty}</h2>
                {!TARGET_MEATY_LABELS?.[activeGame]?.[targetMeaty] &&
                  <>
                    <p>Startup: <b>{parseBasicFrames(playerOneMoves[targetMeaty].startup)}</b></p>
                    <p>Active: <b>{!playerOneMoves[targetMeaty].active ? "-" : isNaN(playerOneMoves[targetMeaty].active) ? playerOneMoves[targetMeaty].active : parseBasicFrames(playerOneMoves[targetMeaty].active)}</b></p>
                  </>
                }
              </IonLabel>
            </IonItem>
              }

              <IonList>
                {okiResults && knockdownMove && targetMeaty
                  ? Object.keys(okiResults).map(numOfMovesSetup =>
                    <IonItemGroup key={numOfMovesSetup}>
                      <IonItemDivider><p>{numOfMovesSetup}</p></IonItemDivider>
                      {Object.keys(okiResults[numOfMovesSetup]).map(activeAsOrdinal =>
                        <div key={activeAsOrdinal}>
                          <IonListHeader className="ordinal-header">
                            <IonLabel>
                              <p>Meaty on the <strong>{activeAsOrdinal}</strong> active frame{recoveryType === "all" && "s"}</p>
                            </IonLabel>
                          </IonListHeader>
                          {Object.keys(okiResults[numOfMovesSetup][activeAsOrdinal]).map((setup, index) =>
                            <IonItem key={activeAsOrdinal + index}>
                              <IonLabel>
                                <p>{knockdownMove}, <strong style={{marginLeft: "3px"}}>[{okiResults[numOfMovesSetup][activeAsOrdinal][setup]}]</strong>, {targetMeaty}</p>
                              </IonLabel>
                            </IonItem>
                          )}
                        </div>
                      )}
                    </IonItemGroup>
                  )
                  : <h4>No oki found for this setup...<br/>Sorry!</h4>
                }
              </IonList>

            </IonGrid>

            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton onClick={() => {dispatch(setActiveFrameDataPlayer("playerOne")); dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true})); } }>
                <IonIcon icon={person} />
              </IonFabButton>
            </IonFab>
          </>

        )}

      </IonContent>
      
    </IonPage>
  );
};

export default FrameKillGenerator;
