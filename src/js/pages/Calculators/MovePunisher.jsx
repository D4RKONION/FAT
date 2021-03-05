import { IonContent, IonPage, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonList, IonSelect, IonSelectOption, IonGrid } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import '../../../style/pages/Calculators.scss';
import '../../../style/components/FAB.scss'
import { setActiveFrameDataPlayer, setPlayerAttr, setModalVisibility } from '../../actions';
import { connect } from 'react-redux';
import { person } from 'ionicons/icons';


const MovePunisher = ({ activePlayer, selectedCharacters, modalVisibility, activeGame, setModalVisibility, setPlayerAttr, setActiveFrameDataPlayer	}) => {
  const [blockedMove, setBlockedMove] = useState(null);

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
  })
  const playerTwoMoves = selectedCharacters["playerTwo"].frameData;

  useEffect(() => {
    // If player two changes and either the selected move doesn't exist OR the selected move is no longer a punishable move, set to null
    if (!playerTwoMoves[blockedMove] || !(playerOneFastestStartup <=  playerTwoMoves[blockedMove]["onBlock"] * -1)) {
      setBlockedMove(null);
    }
  },[blockedMove, playerOneFastestStartup, playerTwoMoves, selectedCharacters]);

  useEffect(() => {
    // If player one changes and their fastest possible move is a different number, set to null
    setBlockedMove(null);
  },[playerOneFastestStartup]);



  return (
    <IonPage>
      <PageHeader
        componentsToShow={{back: `/calculators`, popover: true}}
        title={`MP - ${selectedCharacters.playerOne.name} vs ${selectedCharacters.playerTwo.name}`}
      />


      <IonContent className="calculators">
        <IonGrid fixed>
          <IonItem lines="full">
            <IonLabel>
              <h2>{selectedCharacters["playerOne"].name} blocks {selectedCharacters["playerTwo"].name}'s:</h2>
              <p>{selectedCharacters["playerOne"].name} can punish -{playerOneFastestStartup} on block moves</p>
            </IonLabel>
            <IonSelect
              interfaceOptions={{ header: "Punishable Moves" }}
              value={blockedMove}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => setBlockedMove(e.detail.value)}
            >
              <IonSelectOption key="blockedMove-select" value={null}>Select a move</IonSelectOption>
              {Object.keys(playerTwoMoves).filter(move =>
                playerOneFastestStartup <= playerTwoMoves[move].onBlock * -1
              ).map(move =>
                <IonSelectOption key={`blockedMove-${move}`} value={move}>{move}</IonSelectOption>
              )}
            </IonSelect>
          </IonItem>

          {playerTwoMoves[blockedMove] &&
              <IonItem lines="full" class="selected-move-info">
                <IonLabel>
                  <h3>Blocked Move</h3>
                  <h2>{blockedMove}</h2>
                  <p><b>{playerTwoMoves[blockedMove].onBlock}</b> On Block</p>
                </IonLabel>
              </IonItem>
          }

          <IonList>
            {playerTwoMoves[blockedMove] && Object.keys(playerOneMoves).filter(move =>
              playerOneMoves[move].startup <=  playerTwoMoves[blockedMove]["onBlock"] * -1 &&
              !playerOneMoves[move].followUp &&
              !playerOneMoves[move].airmove &&
              !playerOneMoves[move].nonHittingMove &&
              !playerOneMoves[move].antiAirMove &&
              playerOneMoves[move].moveType !== "alpha"
            ).map(move =>
              <IonItem key={`${move}-punishable`}>
                <IonLabel>
                  <h5>{move} is a <strong>{(playerTwoMoves[blockedMove]["onBlock"] * -1 ) - playerOneMoves[move].startup + 1}</strong> frame punish</h5>
                </IonLabel>
              </IonItem>
            )}
          </IonList>
        </IonGrid>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => {setModalVisibility({ currentModal: "characterSelect", visible: true})} }>
            <IonIcon icon={person} />
          </IonFabButton>
        </IonFab>
        
      </IonContent>
    </IonPage>
  );
};

const mapStateToProps = state => ({
  modalVisibility: state.modalVisibilityState,
  selectedCharacters: state.selectedCharactersState,
  activePlayer: state.activePlayerState,
  activeGame: state.activeGameState,
})

const mapDispatchToProps = dispatch => ({
  setActiveFrameDataPlayer: (oneOrTwo) => dispatch(setActiveFrameDataPlayer(oneOrTwo)),
  setPlayerAttr: (playerId, charName, playerData) => dispatch(setPlayerAttr(playerId, charName, playerData)),
  setModalVisibility: (data)  => dispatch(setModalVisibility(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
(MovePunisher)
