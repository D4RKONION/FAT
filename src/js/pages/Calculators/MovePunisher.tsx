import "../../../style/pages/Calculators.scss";
import "../../../style/components/FAB.scss";

import { IonContent, IonPage, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonList, IonSelect, IonSelectOption, IonGrid, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonToggle } from "@ionic/react";
import { person } from "ionicons/icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setModalVisibility } from "../../actions";
import PopoverButton from "../../components/PopoverButton";
import { selectedCharactersSelector } from "../../selectors";
import { canParseBasicFrames, parseBasicFrames } from "../../utils/ParseFrameData";

const MovePunisher = () => {
  const selectedCharacters = useSelector(selectedCharactersSelector);

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
              label={`${selectedCharacters["playerOne"].name} blocks ${selectedCharacters["playerTwo"].name}'s:`}
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

          {playerTwoMoves[blockedMove] ?
            <IonItem lines="full" className="selected-move-info">
              <IonLabel>
                <h3>Blocked Move</h3>
                <h2>{blockedMove}</h2>
                <p><b>{parseBasicFrames(playerTwoMoves[blockedMove].onBlock)}</b> On Block</p>
              </IonLabel>
            </IonItem>
            : <p style={{fontStyle: "italic", display: "flex", justifyContent: "center", textAlign: "center", margin: "50px 10px"}}>{selectedCharacters["playerOne"].name} can punish -{playerOneFastestStartup} on block moves</p>
          }

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

export default MovePunisher;
