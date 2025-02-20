import "../../../style/pages/Calculators.scss";
import "../../../style/components/FAB.scss";

import { IonContent, IonPage, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonList, IonSelect, IonSelectOption, IonGrid, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonToggle } from "@ionic/react";
import { person } from "ionicons/icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setActiveFrameDataPlayer, setModalVisibility } from "../../actions";
import DataTableHeader from "../../components/DataTableHeader";
import DataTableRow from "../../components/DataTableRow";
import PopoverButton from "../../components/PopoverButton";
import { gameDetailsSelector, selectedCharactersSelector } from "../../selectors";
import { canParseBasicFrames, parseBasicFrames } from "../../utils/ParseFrameData";
import { useCalcCharacterSelect } from "../../utils/useCalcCharacterSelect";

const MovePunisher = () => {
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const gameDetails = useSelector(gameDetailsSelector);

  const onCharacterSelect = useCalcCharacterSelect();

  const dispatch = useDispatch();

  const [blockedMove, setBlockedMove] = useState(null);
  const [punishWithNormal, setPunishWithNormal] = useState(false);
  const [onlyPerfectPunishes, setOnlyPerfectPunishes] = useState(false);

  const playerOneMoves = selectedCharacters["playerOne"].frameData;
  let playerOneFastestStartup = 100;
  Object.keys(playerOneMoves).forEach(move => {
    if (
      typeof playerOneMoves[move].startup === "number" &&
      !playerOneMoves[move].followUp &&
      !playerOneMoves[move].airmove &&
      !playerOneMoves[move].nonHittingMove &&
      !playerOneMoves[move].antiAirMove &&
      playerOneMoves[move].moveType !== "alpha" &&
      playerOneMoves[move].startup < playerOneFastestStartup
    ) {
      playerOneFastestStartup = playerOneMoves[move].startup;
    }
  });
  const playerTwoMoves = selectedCharacters["playerTwo"].frameData;

  useEffect(() => {
    // If player two changes and either the selected move doesn't exist OR the selected move is no longer a punishable move, set to null
    if (!(canParseBasicFrames(playerTwoMoves[blockedMove]?.onBlock) && playerOneFastestStartup <= parseBasicFrames(playerTwoMoves[blockedMove].onBlock) * -1)) {
      setBlockedMove(null);
    }
  },[blockedMove, playerOneFastestStartup, playerTwoMoves, selectedCharacters]);

  useEffect(() => {
    // If player one changes and their fastest possible move is a different number, set to null
    setBlockedMove(null);
  },[playerOneFastestStartup]);

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/calculators" />
          </IonButtons>
          <IonTitle>{`MP - ${selectedCharacters.playerOne.name} vs ${selectedCharacters.playerTwo.name}`}</IonTitle>
          <IonButtons slot="end">
            <PopoverButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="calculators">
        <IonGrid fixed>
          <IonItem lines="full">
            <IonSelect
              label={"Character attacking you"}
              interface="modal"
              interfaceOptions={{ header: "Character Attacking You" }}
              value={selectedCharacters.playerTwo.name}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => onCharacterSelect(e.detail.value)}
            >
              {gameDetails.characterList.map(charName =>
                <IonSelectOption key={`char-name-${charName}`} value={charName}>{charName}</IonSelectOption>
              )}
            </IonSelect>
          </IonItem>
          <IonItem lines="full">
            <IonSelect
              label={`You block ${selectedCharacters["playerTwo"].name}'s`}
              interface="modal"
              interfaceOptions={{ header: "Punishable Moves" }}
              value={blockedMove}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => setBlockedMove(e.detail.value)}
            >
              <IonSelectOption key="blockedMove-select" value={null}>Select a move</IonSelectOption>
              {Object.keys(playerTwoMoves).filter(move =>
                playerTwoMoves[move].onBlock && canParseBasicFrames(playerTwoMoves[move].onBlock) && playerOneFastestStartup <= parseBasicFrames(playerTwoMoves[move].onBlock) * -1
              ).map(move =>
                <IonSelectOption key={`blockedMove-${move}`} value={move}>{move}</IonSelectOption>
              )}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonToggle checked={punishWithNormal} onIonChange={() => setPunishWithNormal(!punishWithNormal)}>Only punish with normals</IonToggle>
          </IonItem>
          <IonItem>
            <IonToggle checked={onlyPerfectPunishes} onIonChange={() => setOnlyPerfectPunishes(!onlyPerfectPunishes)}>Only perfect punishes</IonToggle>
          </IonItem>

          {!playerTwoMoves[blockedMove] ? (
            // Mandatory dropdowns are falsey
            <div className="nothing-chosen-message">
              <h4>Select a Blocked Move</h4>
              <button onClick={() => dispatch(setModalVisibility({ currentModal: "help", visible: true })) }>Get help with Move Punisher</button>
            </div>
          ) : (
            <>
              <table>
                <tbody>                        
                  <DataTableHeader
                    colsToDisplay={{startup: "S", active: "A", onBlock: "oB"}}
                    moveType="Blocked Move"
                    xScrollEnabled={false}
                    noPlural
                    noStick
                  />
                  <DataTableRow
                    moveName={blockedMove}
                    moveData={playerTwoMoves[blockedMove]}
                    colsToDisplay={{startup: "S", active: "A", onBlock: "oB"}}
                    xScrollEnabled={false}
                    displayOnlyStateMoves={false}
                    activePlayerOverwrite="playerTwo"
                  />                          
                </tbody>
              </table>

              <IonList>
                {playerTwoMoves[blockedMove] && Object.keys(playerOneMoves).filter(move =>
                  playerOneMoves[move].startup <= parseBasicFrames(playerTwoMoves[blockedMove]["onBlock"]) * -1 &&
                  !playerOneMoves[move].followUp &&
                  !playerOneMoves[move].airmove &&
                  !playerOneMoves[move].nonHittingMove &&
                  !playerOneMoves[move].antiAirMove &&
                  playerOneMoves[move].moveType !== "alpha" &&
                  (!punishWithNormal || playerOneMoves[move].moveType === "normal") &&
                  (!onlyPerfectPunishes || playerOneMoves[move].startup === parseBasicFrames(playerTwoMoves[blockedMove]["onBlock"]) * -1)
                ).map(move =>
                  <IonItem key={`${move}-punishable`}>
                    <IonLabel>
                      <h5>{move} is a <strong>{(parseBasicFrames(playerTwoMoves[blockedMove]["onBlock"]) * -1) - playerOneMoves[move].startup + 1}</strong> frame punish</h5>
                    </IonLabel>
                  </IonItem>
                )}
              </IonList>
            </>
          )}
          
        </IonGrid>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => { dispatch(setActiveFrameDataPlayer("playerOne")); dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true})); } }>
            <IonIcon icon={person} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default MovePunisher;
