import "../../../style/pages/Calculators.scss";
import "../../../style/components/FAB.scss";

import { IonContent, IonPage, IonItem, IonIcon, IonFab, IonFabButton, IonList, IonSelect, IonSelectOption, IonItemDivider, IonGrid, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { person } from "ionicons/icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setModalVisibility } from "../../actions";
import DataTableHeader from "../../components/DataTableHeader";
import DataTableRow from "../../components/DataTableRow";
import PopoverButton from "../../components/PopoverButton";
import { activeGameSelector, selectedCharactersSelector } from "../../selectors";
import { canParseBasicFrames, parseBasicFrames } from "../../utils/ParseFrameData";

const CharacterPunisher = () => {
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activeGame = useSelector(activeGameSelector);

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
          <IonTitle>{`CPun - ${selectedCharacters.playerOne.stats.threeLetterCode} vs ${selectedCharacters.playerTwo.stats.threeLetterCode}`}</IonTitle>
          <IonButtons slot="end">
            <PopoverButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="calculators">
        <IonGrid fixed>
          <IonItem lines="full">
            <IonSelect
              label={`Punish with ${selectedCharacters["playerOne"].name}'s`}
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

          {!playerOneMoves[punishingMove] ? (
            // Mandatory dropdowns are falsey
            <div className="nothing-chosen-message">
              <h4>Select one of {selectedCharacters.playerOne.name}'s moves<br/>to punish {selectedCharacters.playerTwo.name} with</h4>
              <button onClick={() => dispatch(setModalVisibility({ currentModal: "help", visible: true })) }>Get help with Character Punisher</button>
            </div>
          ) : (
            <>
              <table>
                <tbody>                          
                  <DataTableHeader
                    colsToDisplay={
                      activeGame === "SF6" ?
                        {startup: "S", active: "A", onPC: "onPC"}
                        : {startup: "S", active: "A", onHit: "oH"}
                    }
                    moveType="Your Punish"
                    xScrollEnabled={false}
                    noPlural
                    noStick
                  />
                  <DataTableRow
                    moveName={punishingMove}
                    moveData={playerOneMoves[punishingMove]}
                    colsToDisplay={
                      activeGame === "SF6" ?
                        {startup: "S", active: "A", onPC: "onPC"}
                        : {startup: "S", active: "A", onHit: "oH"}
                    }
                    xScrollEnabled={false}
                    displayOnlyStateMoves={false}
                    activePlayerOverwrite="playerOne"
                  />                             
                </tbody>
              </table>
              <h6>{selectedCharacters["playerOne"].name}'s <strong>{punishingMove}</strong> can punish {selectedCharacters["playerTwo"].name}'s</h6>
              <IonList>
                {
                  Object.keys(playerTwoMoves).filter(blockedMove =>
                    canParseBasicFrames(playerTwoMoves[blockedMove].onBlock) && (parseBasicFrames(playerTwoMoves[blockedMove].onBlock) * -1) >= parseBasicFrames(playerOneMoves[punishingMove].startup)
                  ).map(blockedMove =>
                    <IonItem key={`${selectedCharacters["playerTwo"].name}, ${blockedMove}`}>
                      <p><strong>{blockedMove}</strong>: {parseBasicFrames(playerTwoMoves[blockedMove].onBlock) * -1 - parseBasicFrames(playerOneMoves[punishingMove].startup) + 1} frame punish</p>
                    </IonItem>
                  )
                }

              </IonList>
            </>
          )}

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