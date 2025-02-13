import "../../../style/pages/Calculators.scss";
import "../../../style/components/FAB.scss";

import { IonContent, IonPage, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonList, IonSelect, IonSelectOption, IonItemDivider, IonGrid, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { person } from "ionicons/icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setModalVisibility } from "../../actions";
import PopoverButton from "../../components/PopoverButton";
import { selectedCharactersSelector } from "../../selectors";
import { canParseBasicFrames, parseBasicFrames } from "../../utils/ParseFrameData";

const CharacterPunisher = () => {
  const selectedCharacters = useSelector(selectedCharactersSelector);

  const dispatch = useDispatch();

  const [punishingMove, setPunishingMove] = useState(null);

  const playerOneMoves = selectedCharacters["playerOne"].frameData;
  const playerTwoMoves = selectedCharacters["playerTwo"].frameData;

  useEffect(() => {
    if (!playerOneMoves[punishingMove]) {
      setPunishingMove(null);
    }
  },[playerOneMoves, punishingMove, selectedCharacters]);

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/calculators" />
          </IonButtons>
          <IonTitle>{`C-Punish - ${selectedCharacters.playerOne.name}`}</IonTitle>
          <IonButtons slot="end">
            <PopoverButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="calculators">
        <IonGrid fixed>
          <IonItem lines="full">
            <IonSelect
              label={`Try to punish ${selectedCharacters["playerTwo"].name} with ${selectedCharacters["playerOne"].name}'s`}
              interface="modal"
              interfaceOptions={{ header: "Punishing Move" }}
              value={punishingMove}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => setPunishingMove(e.detail.value)}
            >
              <IonSelectOption key="punishingMove-select" value={null}>Select a move</IonSelectOption>

              {Object.keys(playerOneMoves).filter(move =>
                playerOneMoves[move].moveType !== "movement-special" &&
                !playerOneMoves[move].followUp &&
                !playerOneMoves[move].airmove &&
                !playerOneMoves[move].nonHittingMove &&
                !playerOneMoves[move].antiAirMove &&
                canParseBasicFrames(playerOneMoves[move].startup)
              ).map(move =>
                <IonSelectOption key={`punishingMove-${move}`} value={move}>{move}</IonSelectOption>
              )}
            </IonSelect>
          </IonItem>

          {playerOneMoves[punishingMove] &&
              <>
                <IonItem lines="full" className="selected-move-info">
                  <IonLabel>
                    <h3>Punish With</h3>
                    <h2>{punishingMove}</h2>
                    <p><b>{parseBasicFrames(playerOneMoves[punishingMove].startup)}</b> Startup</p>
                  </IonLabel>
                </IonItem>
                <IonItemDivider><p>{selectedCharacters["playerOne"].name}'s <strong>{punishingMove}</strong> can punish {selectedCharacters["playerTwo"].name}'s</p></IonItemDivider>
                <IonList>
                  {
                    Object.keys(playerTwoMoves).filter(blockedMove =>
                      canParseBasicFrames(playerTwoMoves[blockedMove].onBlock) && (parseBasicFrames(playerTwoMoves[blockedMove].onBlock) * -1) >= parseBasicFrames(playerOneMoves[punishingMove].startup)
                    ).map(blockedMove =>
                      <IonItem key={`${selectedCharacters["playerTwo"].name}, ${blockedMove}`}>
                        <p><em>{blockedMove}</em>: <strong>{parseBasicFrames(playerTwoMoves[blockedMove].onBlock) * -1 - parseBasicFrames(playerOneMoves[punishingMove].startup) + 1}</strong> frame punish</p>
                      </IonItem>
                    )
                  }

                </IonList>
              </>
          }

        </IonGrid>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => { dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true })); } }>
            <IonIcon icon={person} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default CharacterPunisher;