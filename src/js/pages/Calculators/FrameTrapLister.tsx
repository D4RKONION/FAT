import { IonContent, IonPage, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonInput, IonList, IonGrid } from '@ionic/react';
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import '../../../style/pages/Calculators.scss';
import '../../../style/components/FAB.scss'
import { setActiveFrameDataPlayer, setPlayerAttr, setModalVisibility } from '../../actions';
import { connect } from 'react-redux';
import { person } from 'ionicons/icons';


const FrameTrapLister = ({ activePlayer, selectedCharacters, modalVisibility, activeGame, setModalVisibility, setPlayerAttr, setActiveFrameDataPlayer	}) => {
  const [frameGap, setFrameGap] = useState(null);

  const playerOneMoves = selectedCharacters["playerOne"].frameData;


  return (
    <IonPage>
      <PageHeader
        componentsToShow={{back: true, popover: true}}
        title={`FTL - ${selectedCharacters.playerOne.name}`}
      />


      <IonContent className="calculators">
        <IonGrid fixed>
          <IonItem>
            <IonLabel position="fixed">Frame Gap</IonLabel>
            <IonInput slot="end" type="number" value={frameGap} placeholder="Enter Number" onIonChange={e => setFrameGap(!!parseInt(e.detail.value) &&  parseInt(e.detail.value))}></IonInput>
          </IonItem>
          {/* TODO: return a message if the array is empty */}
          <IonList>
            {frameGap && Object.keys(playerOneMoves).filter(firstMove =>
                playerOneMoves[firstMove].moveType !== "movement-special" &&
                playerOneMoves[firstMove].moveType !== "throw" &&
                playerOneMoves[firstMove].moveType !== "command-grab" &&
                !playerOneMoves[firstMove].airmove &&
                !playerOneMoves[firstMove].nonHittingMove &&
                !playerOneMoves[firstMove].antiAirMove &&
                !isNaN(playerOneMoves[firstMove].onBlock)
              ).map(firstMove =>
                Object.keys(playerOneMoves).filter(secondMove =>
                  playerOneMoves[secondMove].startup - playerOneMoves[firstMove].onBlock === frameGap &&
                  playerOneMoves[secondMove].moveType !== "throw" &&
                  playerOneMoves[secondMove].startup !== "~" &&
                  playerOneMoves[secondMove].moveType !== "combo grab" &&
                  !playerOneMoves[secondMove].antiAirMove &&
                  !playerOneMoves[secondMove].nonHittingMove &&
                  !playerOneMoves[secondMove].airmove &&
                  !playerOneMoves[secondMove].followUp &&
                  !(firstMove.includes("Stand ") && secondMove.includes("Close ")) &&
                  !(playerOneMoves[firstMove].moveType === "super" && secondMove.substr(0, 3) === "EX ") &&
                  !(playerOneMoves[secondMove].moveType === "super" && firstMove.substr(0, 3) === "EX ") &&
                  !(playerOneMoves[firstMove].moveType === "super" && secondMove.includes("FADC")) &&
                  !(playerOneMoves[firstMove].moveType === "super" && playerOneMoves[secondMove].moveType === "super") &&
                  !(firstMove.includes("FADC") && playerOneMoves[secondMove].moveType === "super")
                ).map(secondMove =>
                  <IonItem key={`${firstMove}, ${secondMove}`}>{firstMove}, {secondMove}</IonItem>
                )
              )}
          </IonList>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => {setActiveFrameDataPlayer("playerOne"); setModalVisibility({ currentModal: "characterSelect", visible: true})} }>
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
(FrameTrapLister)
