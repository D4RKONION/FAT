import "../../../style/pages/Calculators.scss";
import "../../../style/components/FAB.scss";

import { IonContent, IonPage, IonItem, IonLabel, IonSelect, IonSelectOption, IonIcon, IonFab, IonFabButton, IonItemGroup, IonItemDivider, IonGrid, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonToggle } from "@ionic/react";
import { person, warning, checkmarkSharp } from "ionicons/icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setModalVisibility } from "../../actions";
import DataTableHeader from "../../components/DataTableHeader";
import DataTableRow from "../../components/DataTableRow";
import PopoverButton from "../../components/PopoverButton";
import { activeGameSelector, selectedCharactersSelector } from "../../selectors";
import { canParseBasicFrames, parseBasicFrames } from "../../utils/ParseFrameData";

const StringInterrupter = () => {
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activeGame = useSelector(activeGameSelector);

  const dispatch = useDispatch();

  const [firstMove, setFirstMove] = useState(null);
  const [secondMove, setSecondMove] = useState(null);

  const [interruptionIsSafe, setInterruptionIsSafe] = useState(true);
  const [interruptionIsNormal, setInterruptionIsNormal] = useState(false);

  type WinsAndTrades = {trades: {[key: number]: string[]}, wins: {[key: number]: string[]}};
  const initialState: WinsAndTrades = {trades: {}, wins: {}};
  const [processedResults, setProcessedResults] = useState(initialState);

  const playerOneMoves = selectedCharacters["playerOne"].frameData;
  const playerTwoMoves = selectedCharacters["playerTwo"].frameData;

  // When we change characters, we want to reset the dropdowns to null if the new character doesn't have
  // one of the selected moves. This leaves most generic normals in tact in the dropdown.

  useEffect(() => {
    if (!playerTwoMoves[firstMove]) {
      setFirstMove(null);
    }
    if (!playerTwoMoves[secondMove]) {
      setSecondMove(null);
    }

    if (canParseBasicFrames(playerTwoMoves[firstMove]?.onBlock) && canParseBasicFrames(playerTwoMoves[secondMove]?.startup)) {
      const tempResults:WinsAndTrades = {trades: {}, wins: {}};
      let defenderPriority;
      let attackerPriority;

      const frameGap = parseBasicFrames(playerTwoMoves[secondMove]["startup"]) - parseBasicFrames(playerTwoMoves[firstMove]["onBlock"]);

      if (playerTwoMoves[secondMove]["moveType"] === "normal" && activeGame === "SFV") {
        switch (playerTwoMoves[secondMove].moveButton[0]) {
          case ("L"):
            attackerPriority = 1;
            break;
          case ("M"):
            attackerPriority = 2;
            break;
          case ("H"):
            attackerPriority = 3;
            break;
          default:
            console.log("A normal move without an L, M or H as the first character has been selected");
        }
      } else {
        attackerPriority = "nonNormal";
      }

      for (const currentMoveName in playerOneMoves) {
        const currentMoveData = playerOneMoves[currentMoveName];
        if (currentMoveData.moveType === "normal" && currentMoveData.moveButton) {
          switch (currentMoveData.moveButton[0]) {
            case ("L"):
              defenderPriority = 1;
              break;
            case ("M"):
              defenderPriority = 2;
              break;
            case ("H"):
              defenderPriority = 3;
              break;
            default:
              console.log("A normal move without an L, M or H as the first character has been selected");
          }
        } else if (currentMoveData.moveType === "throw" || currentMoveData.moveType === "command-grab") {
          defenderPriority = 10;
        } else {
          defenderPriority = "nonNormal";
        }

        if (activeGame === "USF4") {
          attackerPriority = 10;
          defenderPriority = 10;
        }

        if (canParseBasicFrames(currentMoveData["startup"])
          && currentMoveData.moveType !== "movement-special"
          && !currentMoveData.airmove
          && !currentMoveData.followUp
          && !currentMoveData.nonHittingMove
          && !currentMoveData.antiAirMove
          && (!interruptionIsSafe || (canParseBasicFrames(currentMoveData["onBlock"]) && parseBasicFrames(currentMoveData["onBlock"]) > -4))
          && (!interruptionIsNormal || currentMoveData.moveType === "normal")
        ) {
          const currentMoveStartup = parseBasicFrames(currentMoveData["startup"]);
          if ( (defenderPriority === "nonNormal" || attackerPriority === "nonNormal") && currentMoveStartup === frameGap) {
            tempResults["trades"][currentMoveName] = (frameGap - currentMoveStartup + 1);
          } else if ( (defenderPriority === "nonNormal" || attackerPriority === "nonNormal") && currentMoveStartup < frameGap) {
            tempResults["wins"][currentMoveName] = (frameGap - currentMoveStartup + 1);
          } else if (currentMoveStartup < frameGap && attackerPriority > defenderPriority) {
            tempResults["wins"][currentMoveName] = (frameGap - currentMoveStartup);
          } else if (currentMoveStartup < frameGap) {
            tempResults["wins"][currentMoveName] = (frameGap - currentMoveStartup + 1);
          } else if (currentMoveStartup === frameGap && attackerPriority === defenderPriority) {
            tempResults["trades"][currentMoveName] = (frameGap - currentMoveStartup + 1);
          } else if (currentMoveStartup === frameGap && attackerPriority < defenderPriority) {
            tempResults["wins"][currentMoveName] = (frameGap - currentMoveStartup + 1);
          }
        }
      }

      const winsObj = {};

      Object.keys(tempResults.wins).forEach(moveName => {
        if ( !Object.keys(winsObj).includes(tempResults.wins[moveName].toString()) ) {
          winsObj[tempResults.wins[moveName]] = [];
        }
        winsObj[tempResults.wins[moveName]].push(moveName);
      });
      tempResults.wins = winsObj;

      setProcessedResults(tempResults);
    }
  },[playerOneMoves, playerTwoMoves, firstMove, secondMove, selectedCharacters, activeGame, interruptionIsSafe, interruptionIsNormal]);

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/calculators" />
          </IonButtons>
          <IonTitle>{`Str-Int - ${selectedCharacters.playerOne.name} vs  ${selectedCharacters.playerTwo.name}`}</IonTitle>
          <IonButtons slot="end">
            <PopoverButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="calculators">
        <IonGrid fixed>
          <IonItem lines="full">

            <IonSelect
              label={`${selectedCharacters.playerTwo.name}'s 1st Move`}
              interface="modal"
              interfaceOptions={{ header: "First Move" }}
              value={firstMove}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => setFirstMove(e.detail.value)}
            >
              <IonSelectOption key="firstMove-select" value={null}>Select a move</IonSelectOption>
              {Object.keys(playerTwoMoves).filter(move =>
                playerTwoMoves[move].moveType !== "movement-special" &&
                  playerTwoMoves[move].moveType !== "throw" &&
                  playerTwoMoves[move].moveType !== "command-grab" &&
                  !playerTwoMoves[move].nonHittingMove &&
                  !playerTwoMoves[move].antiAirMove &&
                  canParseBasicFrames(playerTwoMoves[move].onBlock)
              ).map(move =>
                <IonSelectOption key={`firstMove-${move}`} value={move}>{move}</IonSelectOption>
              )}
            </IonSelect>
          </IonItem>

          <IonItem lines="full">
            <IonSelect
              label={`${selectedCharacters.playerTwo.name}'s 2nd Move`}
              interfaceOptions={{ header: "Second Move" }}
              interface="modal"
              value={secondMove}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => setSecondMove(e.detail.value)}
            >

              <IonSelectOption key="secondMove-select" value={null}>Select a move</IonSelectOption>
              {Object.keys(playerTwoMoves).filter(move =>
                playerTwoMoves[move].moveType !== "throw" &&
                playerTwoMoves[move].moveType !== "combo-grab" &&
                !playerTwoMoves[move].nonHittingMove &&
                !playerTwoMoves[move].antiAirMove &&
                !playerTwoMoves[move].airmove &&
                !playerTwoMoves[move].followUp &&
                canParseBasicFrames(playerTwoMoves[move].startup)
              ).map(move =>
                <IonSelectOption key={`secondMove-${move}`} value={move}>{move}</IonSelectOption>
              )
              }
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonToggle checked={interruptionIsSafe} onIonChange={() => setInterruptionIsSafe(!interruptionIsSafe)}>Interrupting move is safe</IonToggle>
          </IonItem>
          <IonItem>
            <IonToggle checked={interruptionIsNormal} onIonChange={() => setInterruptionIsNormal(!interruptionIsNormal)}>Interrupting move is normal</IonToggle>
          </IonItem>
          {playerTwoMoves[firstMove] && playerTwoMoves[secondMove] &&
            <>
              <table>
                <tbody>               
                  <DataTableHeader
                    colsToDisplay={{startup: "S", active: "A", onBlock: "oB"}}
                    moveType={`${selectedCharacters.playerTwo.name}'s 1st Move`}
                    xScrollEnabled={false}
                    noPlural
                    noStick
                  />
                  <DataTableRow
                    moveName={firstMove}
                    moveData={playerTwoMoves[firstMove]}
                    colsToDisplay={{startup: "S", active: "A", onBlock: "oB"}}
                    xScrollEnabled={false}
                    displayOnlyStateMoves={false}
                    activePlayerOverwrite="playerTwo"
                  />
                                                  
                  <DataTableHeader
                    colsToDisplay={{startup: "S", onBlock: "oB", onHit: "oH"}}
                    moveType={`${selectedCharacters.playerTwo.name}'s 2nd Move`}
                    xScrollEnabled={false}
                    noPlural
                    noStick
                  />
                  <DataTableRow
                    moveName={secondMove}
                    moveData={playerTwoMoves[secondMove]}
                    colsToDisplay={{startup: "S", onBlock: "oB", onHit: "oH"}}
                    xScrollEnabled={false}
                    displayOnlyStateMoves={false}
                    activePlayerOverwrite="playerTwo"
                  />            
                </tbody>
              </table>

              <IonItem lines="full">
                {parseBasicFrames(playerTwoMoves[secondMove].startup) - parseBasicFrames(playerTwoMoves[firstMove].onBlock) > 0
                  ? <p>There is a gap of <b>{parseBasicFrames(playerTwoMoves[secondMove].startup) - parseBasicFrames(playerTwoMoves[firstMove].onBlock)}</b> frame{(parseBasicFrames(playerTwoMoves[secondMove].startup) - parseBasicFrames(playerTwoMoves[firstMove].onBlock)) > 1 && "s"} between {firstMove} and {secondMove}.</p>
                  : <p>There is <b>no gap</b> between {firstMove} and {secondMove}. It is a true blockstring</p>
                }
              </IonItem>

              {Object.keys(processedResults.wins).length > 0 &&
                <IonItemGroup>
                  <IonItem className="color-subheader" lines="full" color="success">
                    <IonLabel>
                      <p className="success">{selectedCharacters["playerOne"].name} can interrupt {selectedCharacters["playerTwo"].name}'s string cleanly using the following moves</p>
                    </IonLabel>
                    <IonIcon icon={checkmarkSharp} slot="start" />
                  </IonItem>
                  {Object.keys(processedResults.wins).map(framesToInterrupt =>
                    <IonItemGroup key={`winning-at-frame-${framesToInterrupt}-group`}>
                      <IonItemDivider>
                        <IonLabel>
                          <p><strong>{framesToInterrupt} frame{parseInt(framesToInterrupt) > 1 && "s"}</strong> to interrupt</p>
                        </IonLabel>
                      </IonItemDivider>
                      {Object.keys(processedResults.wins[framesToInterrupt]).map(winMove =>
                        <IonItem key={`win-${processedResults.wins[framesToInterrupt][winMove]}`} lines="full">
                          <IonLabel><b>{processedResults.wins[framesToInterrupt][winMove]}</b> <i>({playerOneMoves[processedResults.wins[framesToInterrupt][winMove]] && parseBasicFrames(playerOneMoves[processedResults.wins[framesToInterrupt][winMove]].startup)}f startup)</i></IonLabel>
                        </IonItem>
                      )}
                    </IonItemGroup>
                  )}
                </IonItemGroup>
              }

              {Object.keys(processedResults.trades).length > 0 &&
                <IonItemGroup>
                  <IonItem className="color-subheader" lines="full" color="warning">
                    <IonLabel>
                      <p className="warn">{selectedCharacters["playerOne"].name} can interrupt {selectedCharacters["playerTwo"].name}'s string by trading with the following moves (all 1 frame)</p>
                    </IonLabel>
                    <IonIcon className="warning-icon" icon={warning} slot="start" />
                  </IonItem>
                  {Object.keys(processedResults.trades).map(tradeMove =>
                    <IonItem key={`trade-${tradeMove}`} lines="full">
                      <IonLabel><b>{tradeMove}</b> <i>({playerOneMoves[tradeMove] && parseBasicFrames(playerOneMoves[tradeMove].startup)}f startup)</i></IonLabel>
                    </IonItem>
                  )}
                </IonItemGroup>
              }

            </>

          }

        </IonGrid>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => { dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true})); } }>
            <IonIcon icon={person} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default StringInterrupter;
