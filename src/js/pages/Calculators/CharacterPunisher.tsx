import { IonContent, IonPage, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonList, IonSelect, IonSelectOption, IonItemDivider, IonGrid } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import '../../../style/pages/Calculators.scss';
import '../../../style/components/FAB.scss'
import { setActiveFrameDataPlayer, setPlayerAttr, setModalVisibility } from '../../actions';
import { connect } from 'react-redux';
import { person } from 'ionicons/icons';


const CharacterPunisher = ({ activePlayer, selectedCharacters, modalVisibility, activeGame, setModalVisibility, setPlayerAttr, setActiveFrameDataPlayer	}) => {

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
      <PageHeader
        componentsToShow={{back: true, popover: true}}
        title={`C-Punish - ${selectedCharacters.playerOne.name}`}
      />


      <IonContent className="calculators">
        <IonGrid fixed>
          <IonItem lines="full">
            <IonLabel>
              <h2>Try to punish <strong>{selectedCharacters["playerTwo"].name}</strong> with <strong>{selectedCharacters["playerOne"].name}'s</strong></h2>
            </IonLabel>
            <IonSelect
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
                !isNaN(playerOneMoves[move].startup)
              ).map(move =>
                <IonSelectOption key={`punishingMove-${move}`} value={move}>{move}</IonSelectOption>
              )}
            </IonSelect>
          </IonItem>



            {playerOneMoves[punishingMove] &&
              <>
                <IonItem lines="full" class="selected-move-info">
                  <IonLabel>
                    <h3>Punish With</h3>
                    <h2>{punishingMove}</h2>
                    <p><b>{playerOneMoves[punishingMove].startup}</b> Startup</p>
                  </IonLabel>
                </IonItem>
                <IonItemDivider><p>{selectedCharacters["playerOne"].name}'s <strong>{punishingMove}</strong> can punish {selectedCharacters["playerTwo"].name}'s</p></IonItemDivider>
                <IonList>
                {
                  Object.keys(playerTwoMoves).filter(blockedMove =>
                    playerTwoMoves[blockedMove].onBlock * -1 >= playerOneMoves[punishingMove].startup
                  ).map(blockedMove =>
                    <IonItem key={`${selectedCharacters["playerTwo"].name}, ${blockedMove}`}>
                        <p><em>{blockedMove}</em>: <strong>{(playerTwoMoves[blockedMove].onBlock * -1) - playerOneMoves[punishingMove].startup + 1}</strong> frame punish</p>
                    </IonItem>
                  )
                }

                </IonList>
              </>
            }

        </IonGrid>
        
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => {if (!modalVisibility.visible) {setModalVisibility({ currentModal: "characterSelect", visible: true })} else {setActiveFrameDataPlayer("playerOne")}; setModalVisibility({ currentModal: "characterSelect", visible: true })}}>
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
(CharacterPunisher)
