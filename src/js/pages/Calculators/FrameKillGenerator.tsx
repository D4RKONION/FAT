import "../../../style/pages/Calculators.scss";
import "../../../style/pages/FrameKillGenerator.scss";
import "../../../style/components/FAB.scss";

import { IonContent, IonPage, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonList, IonSelect, IonSelectOption, IonListHeader, IonItemDivider, IonItemGroup, IonGrid, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonInput, IonSpinner } from "@ionic/react";
import { person } from "ionicons/icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setActiveFrameDataPlayer, setModalVisibility } from "../../actions";
import DataTableHeader from "../../components/DataTableHeader";
import DataTableRow from "../../components/DataTableRow";
import PopoverButton from "../../components/PopoverButton";
import SegmentSwitcher from "../../components/SegmentSwitcher";
import { activeGameSelector, selectedCharactersSelector } from "../../selectors";
import { canParseBasicFrames, parseBasicFrames } from "../../utils/ParseFrameData";

const GAME_KNOCKDOWN_TYPES = {
  "3S": {disabled: "disabled"},
  USF4: {disabled: "disabled"},
  SFV: {kdr: "Quick", kdrb: "Back", all: "Q&B", kd: "None"},
  SF6: {onHit: "Normal Hit", onPC: "Punish Counter"},
  GGST: {disabled: "disabled"},
};

const KNOCKDOWN_WITH_LABELS = {
  universal: ["Anything", "Custom KDA"],
};

const SETUP_LENGTH_LABELS = ["One Move", "Two Moves", "Three Moves"];

const SETUP_CONTAINS_LABELS = {
  universal: ["Anything", "Nothing (Natural Meaty)", "Forward Dash"],
  SF6: ["Drive Rush >"],
};

const TARGET_MEATY_LABELS = {
  SFV: ["Safe Jump"],
  SF6: ["Safe Jump"],
};

const FrameKillGenerator = () => {
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activeGame = useSelector(activeGameSelector);

  const dispatch = useDispatch();

  const [recoveryType, setRecoveryType] = useState(Object.keys(GAME_KNOCKDOWN_TYPES[activeGame])[0]);
  const [knockdownMove, setKnockdownMove] = useState(null);
  const [customKDA, setCustomKDA] = useState(0);
  const [lateByFrames, setLateByFrames] = useState(0);
  const [setupLength, setSetupLength] = useState(3);
  const [specificSetupMove, setSpecificSetupMove] = useState("Anything");
  const [targetMeaty, setTargetMeaty] = useState(null);

  const [okiResults, setOkiResults] = useState({});

  const playerOneMoves = selectedCharacters["playerOne"].frameData;

  useEffect(() => {
    if (
      knockdownMove !== "Custom KDA" &&
      !(KNOCKDOWN_WITH_LABELS["universal"].includes(knockdownMove) || KNOCKDOWN_WITH_LABELS[activeGame]?.includes(knockdownMove)) &&
      (!playerOneMoves || !playerOneMoves[knockdownMove] ||
      !(
        (playerOneMoves[knockdownMove].kd || playerOneMoves[knockdownMove].kdr || playerOneMoves[knockdownMove].kdrb) ||
        (playerOneMoves[knockdownMove][recoveryType] && isNaN(playerOneMoves[knockdownMove][recoveryType]) && !isNaN(Number(playerOneMoves[knockdownMove][recoveryType].match(/KD \+([^\(*,\[]+)/)?.[1]) + 1))
      ))
    ) {  
      setKnockdownMove(null);
    }
    if (!(playerOneMoves[specificSetupMove] || SETUP_CONTAINS_LABELS["universal"].includes(specificSetupMove) || SETUP_CONTAINS_LABELS[activeGame]?.includes(specificSetupMove))) {
      setSpecificSetupMove("Anything");
    }
    
    if (!playerOneMoves[targetMeaty] && !TARGET_MEATY_LABELS?.[activeGame]?.includes(targetMeaty)) {
      setTargetMeaty(null);
    }
  },[activeGame, knockdownMove, playerOneMoves, recoveryType, selectedCharacters, specificSetupMove, targetMeaty]);

  useEffect(() => {
    setRecoveryType(Object.keys(GAME_KNOCKDOWN_TYPES[activeGame])[0]);
    setSpecificSetupMove("Anything");
  }, [activeGame]);

  useEffect(() => {
    //prep specific setup labels for checking
    const gameLabels = SETUP_CONTAINS_LABELS[activeGame] || [];
    const universalLabels = SETUP_CONTAINS_LABELS.universal || [];
    const allLabels = gameLabels.concat(universalLabels);

    // cancel the calculation if the required dropdowns have not been selected
    if (
      !knockdownMove ||
      !(playerOneMoves[knockdownMove] || KNOCKDOWN_WITH_LABELS["universal"].includes(knockdownMove) || KNOCKDOWN_WITH_LABELS[activeGame]?.includes(knockdownMove)) ||
      !targetMeaty ||
      (!playerOneMoves[targetMeaty] && !TARGET_MEATY_LABELS?.[activeGame]?.includes(targetMeaty)) ||
      (!allLabels.includes(specificSetupMove) && !playerOneMoves[specificSetupMove])
    ) { return; }

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

    // If a specific move is required in the setup, make that the only option in firstokimove
    let firstOkiMoveModel;
    if (!specificSetupMove || specificSetupMove === "Anything") {
      firstOkiMoveModel = {...playerOneMoves};
    } else if (specificSetupMove === "Nothing (Natural Meaty)") {
      firstOkiMoveModel = {};
    } else {
      firstOkiMoveModel = {[specificSetupMove]: playerOneMoves[specificSetupMove]};
    }

    // Create an object containing the knockdown moves to search through
    // This will be one move unless knockdown === "Anything", in which case
    // it will be every move with a valid knockdown number
    const allKnockdownMovesToTry = Object.keys(playerOneMoves).filter(moveName => {
      if (knockdownMove === "Anything") {
        if (
          (activeGame === "SFV" && (playerOneMoves[moveName][recoveryType])) ||
          playerOneMoves[moveName][recoveryType] && isNaN(playerOneMoves[moveName][recoveryType]) && !isNaN(Number(playerOneMoves[moveName][recoveryType].match(/KD \+([^\(*,\[]+)/)?.[1]) + 1)
        ) {
          return moveName;
        }
      } else if (moveName === knockdownMove) {
        return moveName;
      }
    });

    if (knockdownMove === "Custom KDA") {
      allKnockdownMovesToTry.push("Custom KDA");
    }

    // Send the calculation to a worker process to stop the page from freezing while the calculation happens
    const worker = new Worker(new URL("./framekillgeneratorworker.ts", import.meta.url));
    setOkiResults("inProgress"); //displays a thinking message
    worker.postMessage({ allKnockdownMovesToTry, recoveryType, activeGame, customKDA, playerOneMoves, targetMeaty, firstOkiMoveModel, lateByFrames, specificSetupMove, selectedCharacters, setupLength });
    worker.onmessage = (event) => {
      if (Object.keys(event.data).length !== 0) {
        setOkiResults(event.data);
      } else {
        setOkiResults(false);
      }
    };

    // Remove the character's forward dash from the move model, so it doesn't show up elsewhere
    delete playerOneMoves["Forward Dash"];
    if (activeGame === "SF6") {
      delete playerOneMoves["Drive Rush >"];
    }

    if (targetMeaty === "Safe Jump") {
      delete playerOneMoves["Safe Jump"];
    }

    return () => {
      worker.terminate();
    };
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recoveryType, knockdownMove, lateByFrames, specificSetupMove, targetMeaty, playerOneMoves, selectedCharacters.playerOne.stats.fDash, customKDA, setupLength]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/calculators" />
          </IonButtons>
          <IonTitle>{`Oki - ${selectedCharacters.playerOne.name}`}</IonTitle>
          <IonButtons slot="end">
            <PopoverButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent id="FrameKillGenerator" className="calculators">
        {Object.keys(GAME_KNOCKDOWN_TYPES[activeGame])[0] === "disabled" ? (
        
          <IonGrid fixed>
            <div>
              <h4>Sorry, this calculator doesn't work with {activeGame}</h4>
            </div>
          </IonGrid>
        ) :(
          <>
            <IonGrid fixed>
              {Object.keys(GAME_KNOCKDOWN_TYPES[activeGame]).length > 1 &&
                <SegmentSwitcher
                  key={"Oki KD type"}
                  valueToTrack={recoveryType}
                  segmentType={"recovery-type"}
                  labels={GAME_KNOCKDOWN_TYPES[activeGame]}
                  clickFunc={(eventValue) => recoveryType !== eventValue && setRecoveryType(eventValue)}
                />
              }

              <IonItem lines="full">
                <IonSelect
                  label={"Knockdown with"}
                  interface="modal"
                  interfaceOptions={{ header: "Knockdown with" }}
                  value={knockdownMove}
                  okText="Select"
                  cancelText="Cancel"
                  onIonChange={e => setKnockdownMove(e.detail.value)}
                >
                  <IonSelectOption value={null}>Select a move</IonSelectOption>
                  {Object.keys(KNOCKDOWN_WITH_LABELS).map(gameName =>
                    (gameName === activeGame || gameName === "universal") && (
                      KNOCKDOWN_WITH_LABELS[gameName].map(knockdownWithLabels =>
                        <IonSelectOption key={`knockdown-with-${gameName}-${knockdownWithLabels}`} value={knockdownWithLabels}>{knockdownWithLabels}</IonSelectOption>
                      )
                    )
                  )}
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
                <IonLabel style={{flex: "1 0 auto"}} slot="start">Include late meaties</IonLabel>
                <IonInput style={{textAlign: "end"}} slot="end" type="number" value={lateByFrames} placeholder="Enter Number" onIonInput={e => setLateByFrames(!!parseInt(e.detail.value) ? parseInt(e.detail.value) : 0)}></IonInput>
                <IonLabel slot="end">Frames</IonLabel>
              </IonItem>

              <IonItem lines="full">
                <IonSelect
                  label="Setup length"
                  interface="modal"
                  interfaceOptions={{ header: "Setup Length" }}
                  value={SETUP_LENGTH_LABELS[setupLength - 1]}
                  okText="Select"
                  cancelText="Cancel"
                  onIonChange={e => setSetupLength(SETUP_LENGTH_LABELS.indexOf(e.detail.value) + 1)}
                >
                  {SETUP_LENGTH_LABELS.map(numberOfMoves =>
                    <IonSelectOption key={`setup-contains-${numberOfMoves}-${numberOfMoves}`} value={numberOfMoves}>{numberOfMoves}</IonSelectOption> 
                  )}
                </IonSelect>
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
                      SETUP_CONTAINS_LABELS[gameName].map(setupContainsLabel =>
                        <IonSelectOption key={`setup-contains-${gameName}-${setupContainsLabel}`} value={setupContainsLabel}>{setupContainsLabel}</IonSelectOption>
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
                      TARGET_MEATY_LABELS[gameName].map(tagetMeatyLabel =>
                        <IonSelectOption key={`target-meaty-${gameName}-${tagetMeatyLabel}`} value={tagetMeatyLabel}>{tagetMeatyLabel}</IonSelectOption>
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

              {(playerOneMoves[knockdownMove] || KNOCKDOWN_WITH_LABELS["universal"].includes(knockdownMove) || KNOCKDOWN_WITH_LABELS[activeGame]?.includes(knockdownMove)) && (playerOneMoves[targetMeaty] || TARGET_MEATY_LABELS?.[activeGame]?.includes(targetMeaty)) &&
                  <table>
                    <tbody>
                      {playerOneMoves[knockdownMove] &&
                        <>
                          <DataTableHeader
                            colsToDisplay={
                              activeGame === "SFV" ? (
                                {kd: "KD", kdr: "KDR", kdrb: "KDRB"}
                              )
                                : {startup: "S", onHit: "oH"}
                            }
                            moveType={"Knockdown"}
                            xScrollEnabled={false}
                            noPlural
                            noStick
                          />
                          <DataTableRow
                            moveName={knockdownMove}
                            moveData={playerOneMoves[knockdownMove]}
                            colsToDisplay={
                              activeGame === "SFV" ? (
                                {kd: "KD", kdr: "KDR", kdrb: "KDRB"}
                              )
                                : {startup: "S", onHit: "oH"}
                            }
                            xScrollEnabled={false}
                            displayOnlyStateMoves={false}
                          />
                        </>
                      }
                      
                      {playerOneMoves[targetMeaty] &&
                        <>
                          <DataTableHeader
                            colsToDisplay={{startup: "S", active: "A", onHit: "oH", onBlock: "oB"}}
                            moveType={"Target Meaty"}
                            xScrollEnabled={false}
                            noPlural
                            noStick
                          />
                          <DataTableRow
                            moveName={targetMeaty}
                            moveData={playerOneMoves[targetMeaty]}
                            colsToDisplay={{startup: "S", active: "A", onHit: "oH", onBlock: "oB"}}
                            xScrollEnabled={false}
                            displayOnlyStateMoves={false}
                          />
                        </>
                      }
                      
                    </tbody>
                  </table>
              }
              {okiResults === "inProgress" ?
                <div className="calculating-oki-message">
                  <h3>Calculating Oki</h3>
                  {knockdownMove === "Anything" &&
                  <>
                    {setupLength === 3 && specificSetupMove === "Anything" ?
                      <>
                        <p>You can speed up the process by changing</p>
                        <p>"Setup Length" or "Setup Contains"</p>
                      </> :
                      <p>This might take a moment...</p>
                    }
                    
                  </>
                  }
                  <IonSpinner></IonSpinner>
                </div>
                : <IonList>
                  {okiResults && knockdownMove && (KNOCKDOWN_WITH_LABELS["universal"]?.includes(knockdownMove) || playerOneMoves[knockdownMove]) && targetMeaty && (TARGET_MEATY_LABELS[activeGame]?.includes(targetMeaty) || playerOneMoves[targetMeaty])
                    ? Object.keys(okiResults).map(knockdownMove => {
                      // Check if there are any valid setups for this knockdown move
                      const validSetups = Object.keys(okiResults[knockdownMove]).filter(numOfMovesSetup => okiResults[knockdownMove][numOfMovesSetup]);

                      if (validSetups.length === 0) {
                        return null; // Skip rendering if no valid setups
                      }
                      return (<>
                        <h5>{knockdownMove} (KD: +{recoveryType === "all" ? "~" : knockdownMove === "Custom KDA" ? customKDA : parseBasicFrames(playerOneMoves[knockdownMove][recoveryType])})</h5>
                        {Object.keys(okiResults[knockdownMove]).map(numOfMovesSetup => 

                          <IonItemGroup key={numOfMovesSetup}>
                            <IonItemDivider><p>{numOfMovesSetup}</p></IonItemDivider>
                            {Object.keys(okiResults[knockdownMove][numOfMovesSetup]).map(activeAsOrdinal =>
                              <div key={activeAsOrdinal}>
                                <IonListHeader className="ordinal-header">
                                  <IonLabel>
                                    <p>Meaty on <strong>{activeAsOrdinal}</strong> active frame {recoveryType === "all" && "s"} {!TARGET_MEATY_LABELS?.[activeGame]?.includes(targetMeaty) && `(${parseBasicFrames(playerOneMoves[targetMeaty].onBlock) + Number(activeAsOrdinal.match(/^\d+/)[0]) -1 > 0 ? "+" : ""}${parseBasicFrames(playerOneMoves[targetMeaty].onBlock) + Number(activeAsOrdinal.match(/^\d+/)[0]) -1} oB, ${parseBasicFrames(playerOneMoves[targetMeaty].onHit) + Number(activeAsOrdinal.match(/^\d+/)[0]) -1 > 0 ? "+" : ""}${parseBasicFrames(playerOneMoves[targetMeaty].onHit) + Number(activeAsOrdinal.match(/^\d+/)[0]) -1} oH)`}</p>
                                  </IonLabel>
                                </IonListHeader>
                                {Object.keys(okiResults[knockdownMove][numOfMovesSetup][activeAsOrdinal]).map((setup, index) =>
                                  <IonItem key={activeAsOrdinal + index} lines={Object.keys(okiResults[knockdownMove][numOfMovesSetup][activeAsOrdinal]).length === index + 1 ? "full" : "inset"}>
                                    <IonLabel>
                                      <p>{knockdownMove}, <strong style={{marginLeft: "3px"}}>[{okiResults[knockdownMove][numOfMovesSetup][activeAsOrdinal][setup]}]</strong>, {targetMeaty}</p>
                                    </IonLabel>
                                  </IonItem>
                                )}
                              </div>
                            )}
                          </IonItemGroup>
                        )}
                    
                      </>);
                    }
                  
                    )
                    : <h4>No oki found for this setup...<br/>Sorry!</h4>
                  }
                </IonList>
              }

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
