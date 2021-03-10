import { IonContent, IonPage, IonItem, IonLabel, IonSelect, IonSelectOption, IonIcon, IonFab, IonFabButton, IonItemGroup, IonItemDivider, IonGrid } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PageHeader from '../../components/PageHeader';
import '../../../style/pages/Calculators.scss';
import '../../../style/components/FAB.scss'
import { setModalVisibility } from '../../actions';
import { person, checkmark, warning } from 'ionicons/icons';


const StringInterrupter = () => {

  const selectedCharacters = useSelector(state => state.selectedCharactersState);
  const activeGame = useSelector(state => state.activeGameState);
  
  const dispatch = useDispatch();

  const [firstMove, setFirstMove] = useState(null);
  const [secondMove, setSecondMove] = useState(null);
  const [processedResults, setProcessedResults] = useState({"trades": {}, "wins": {}})

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

    if (playerTwoMoves[firstMove] && playerTwoMoves[secondMove]) {
      let tempResults = {"trades": {}, "wins": {}}
      let defenderPriority;
      let attackerPriority;

      let frameGap = playerTwoMoves[secondMove]["startup"] - playerTwoMoves[firstMove]["onBlock"];

      if (playerTwoMoves[secondMove]["moveType"] === "normal") {
        switch(playerTwoMoves[secondMove].moveButton[0]) {
          case("L"):
            attackerPriority = 1;
            break;
          case("M"):
            attackerPriority = 2;
            break;
          case("H"):
            attackerPriority = 3;
            break;
          default:
            console.log("A normal move without an L, M or H as the first character has been selected");
        }
      } else {
        attackerPriority = "nonNormal";
      }

      for (let currentMoveName in playerOneMoves) {
        let currentMoveData = playerOneMoves[currentMoveName];
        if (currentMoveData.moveType === "normal" && currentMoveData.moveButton) {
          switch(currentMoveData.moveButton[0]) {
            case("L"):
              defenderPriority = 1;
              break;
            case("M"):
              defenderPriority = 2;
              break;
            case("H"):
              defenderPriority = 3;
              break;
            default:
            console.log("A normal move without an L, M or H as the first character has been selected")
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


        if (!isNaN(currentMoveData["startup"])
          && currentMoveData.moveType !== "movement-special"
          && !currentMoveData.airmove
          && !currentMoveData.followUp
          && !currentMoveData.nonHittingMove
          && !currentMoveData.antiAirMove
        ) {
          if ( (defenderPriority === "nonNormal" || attackerPriority === "nonNormal") && currentMoveData["startup"] === frameGap) {
            tempResults["trades"][currentMoveName] = (frameGap - currentMoveData["startup"] + 1);
          } else if ( (defenderPriority === "nonNormal" || attackerPriority === "nonNormal") && currentMoveData["startup"] < frameGap) {
            tempResults["wins"][currentMoveName] = (frameGap - currentMoveData["startup"] + 1);
          } else if (currentMoveData["startup"] < frameGap && attackerPriority > defenderPriority) {
            tempResults["wins"][currentMoveName] = (frameGap - currentMoveData["startup"]);
          }  else if (currentMoveData["startup"] < frameGap) {
            tempResults["wins"][currentMoveName] = (frameGap - currentMoveData["startup"] + 1);
          } else if (currentMoveData["startup"] === frameGap && attackerPriority === defenderPriority) {
            tempResults["trades"][currentMoveName] = (frameGap - currentMoveData["startup"] + 1);
          } else if (currentMoveData["startup"] === frameGap && attackerPriority < defenderPriority) {
            tempResults["wins"][currentMoveName] = (frameGap - currentMoveData["startup"] + 1);
          }
        }
      }
      
      // This sorter from https://stackoverflow.com/a/1069840
      const arraySorted = Object.entries(tempResults.wins)
        .sort(([,a],[,b]) => a-b)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
      
      const winsObj = {};

      Object.keys(arraySorted).forEach(moveName => {
          if ( !Object.keys(winsObj).includes(arraySorted[moveName].toString()) ) {
            winsObj[arraySorted[moveName]] = [];
          }
          winsObj[arraySorted[moveName]].push(moveName);
      })
      tempResults.wins = winsObj;
      console.log(tempResults.wins)
      setProcessedResults(tempResults);


    }


  },[playerOneMoves, playerTwoMoves, firstMove, secondMove, selectedCharacters, activeGame]);

  return (
    <IonPage>
      <PageHeader
        componentsToShow={{back: true, popover: true}}
        title={`Str-Int - ${selectedCharacters.playerOne.name} vs  ${selectedCharacters.playerTwo.name}`}
      />


      <IonContent className="calculators">
        <IonGrid fixed>
          <IonItem lines="full">
            <IonLabel>
              <h2>{selectedCharacters.playerTwo.name}'s 1st Move</h2>
            </IonLabel>
            <IonSelect
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
                  !playerTwoMoves[move].airMove &&
                  !playerTwoMoves[move].nonHittingMove &&
                  !playerTwoMoves[move].antiAirMove &&
                  !isNaN(playerTwoMoves[move].onBlock)
                ).map(move =>
                  <IonSelectOption key={`firstMove-${move}`} value={move}>{move}</IonSelectOption>
                )}
            </IonSelect>
          </IonItem>

          <IonItem lines="full">
            <IonLabel>
              <h2>{selectedCharacters.playerTwo.name}'s 2nd Move</h2>
            </IonLabel>
            <IonSelect
              interfaceOptions={{ header: "Second Move" }}
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
                !isNaN(playerTwoMoves[move].startup)
              ).map(move =>
                <IonSelectOption key={`secondMove-${move}`} value={move}>{move}</IonSelectOption>
              )
            }
          </IonSelect>
          </IonItem>
          {playerTwoMoves[firstMove] && playerTwoMoves[secondMove] &&
            <>
              <IonItem lines="full" class="selected-move-info">
                <IonLabel>
                  <h3>First Move</h3>
                  <h2>{firstMove}</h2>
                  <p><b>{playerTwoMoves[firstMove].onBlock > 0 && "+"}{playerTwoMoves[firstMove].onBlock}</b> On Block</p>
                </IonLabel>
                <IonLabel>
                  <h3>Second Move</h3>
                  <h2>{secondMove}</h2>
                  <p><b>{playerTwoMoves[secondMove].startup}</b> Startup</p>
                </IonLabel>
              </IonItem>

              <IonItem lines="full">
                {playerTwoMoves[secondMove].startup - playerTwoMoves[firstMove].onBlock > 0
                  ? <p>There is a gap of <b>{playerTwoMoves[secondMove].startup - playerTwoMoves[firstMove].onBlock}</b> frame{(playerTwoMoves[secondMove].startup - playerTwoMoves[firstMove].onBlock) > 1 && "s"} between {firstMove} and {secondMove}.</p>
                  : <p>There is <b>no gap</b> between {firstMove} and {secondMove}. It is a true blockstring</p>
                }
              </IonItem>

              {Object.keys(processedResults.wins).length > 0 &&
                <IonItemGroup>
                  <IonItem className="color-subheader" lines="full" color="success">
                    <IonLabel>
                      <p>{selectedCharacters["playerOne"].name} can interrupt {selectedCharacters["playerTwo"].name}'s string cleanly using the following moves</p>
                    </IonLabel>
                    <IonIcon icon={checkmark} slot="start" />
                  </IonItem>
                  {Object.keys(processedResults.wins).map(framesToInterrupt =>
                    <IonItemGroup key={`winning-at-frame-${framesToInterrupt}-group`}>
                      <IonItemDivider>
                        <IonLabel>
                          <p><strong>{framesToInterrupt} frame{framesToInterrupt > 1 && "s"}</strong> to interrupt</p>
                        </IonLabel>
                      </IonItemDivider>
                    {Object.keys(processedResults.wins[framesToInterrupt]).map(winMove =>
                      <IonItem key={`win-${processedResults.wins[framesToInterrupt][winMove]}`} lines="full">
                        <IonLabel><b>{processedResults.wins[framesToInterrupt][winMove]}</b> <i>({playerOneMoves[processedResults.wins[framesToInterrupt][winMove]] && playerOneMoves[processedResults.wins[framesToInterrupt][winMove]].startup}f startup)</i></IonLabel>
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
                      <p>{selectedCharacters["playerOne"].name} can interrupt {selectedCharacters["playerTwo"].name}'s string by trading with the following moves (all 1 frame)</p>
                    </IonLabel>
                    <IonIcon className="warning-icon" icon={warning} slot="start" />
                  </IonItem>
                  {Object.keys(processedResults.trades).map(tradeMove =>
                    <IonItem key={`trade-${tradeMove}`} lines="full">
                      <IonLabel><b>{tradeMove}</b> <i>({playerOneMoves[tradeMove] && playerOneMoves[tradeMove].startup}f startup)</i></IonLabel>
                    </IonItem>
                  )}
                </IonItemGroup>
              }

            </>

          }

        </IonGrid>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => { dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true})) } }>
            <IonIcon icon={person} />
          </IonFabButton>
        </IonFab>
        
      </IonContent>
    </IonPage>
  );
};

export default StringInterrupter;
