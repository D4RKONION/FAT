import { IonContent, IonPage, IonItem, IonLabel, IonSelect, IonSelectOption, IonIcon, IonFab, IonFabButton, IonGrid } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import '../../../style/pages/Calculators.scss';
import '../../../style/components/FAB.scss'
import SegmentSwitcher from '../../components/SegmentSwitcher';
import { setActiveFrameDataPlayer, setPlayerAttr, setModalVisibility } from '../../actions';
import { connect } from 'react-redux';
import { person } from 'ionicons/icons';


const FrameTrapChecker = ({ activePlayer, selectedCharacters, modalVisibility, activeGame, setModalVisibility, setPlayerAttr, setActiveFrameDataPlayer	}) => {
  const [linkOrCancel, setLinkOrCancel] = useState("link");
  const [firstMove, setFirstMove] = useState(null);
  const [secondMove, setSecondMove] = useState(null);

  const playerOneMoves = selectedCharacters["playerOne"].frameData;
  const firstMoveBlockStun = playerOneMoves[firstMove] && parseInt(playerOneMoves[firstMove].active) + playerOneMoves[firstMove].recovery + playerOneMoves[firstMove].onBlock

  // When we change characters, we want to reset the dropdowns to null if the new character doesn't have
  // one of the selected moves. This leaves most generic normals in tact in the dropdown.

  useEffect(() => {
    setFirstMove(null);
    setSecondMove(null);
  },[linkOrCancel]);

  useEffect(() => {
    if (!playerOneMoves[firstMove]) {
      setFirstMove(null);
    }
    if (!playerOneMoves[secondMove]) {
      setSecondMove(null);
    }
  },[firstMove, playerOneMoves, secondMove, selectedCharacters]);

  useEffect(() => {
    if (linkOrCancel === "cancel") {
      setSecondMove(null);
    }
  },[firstMove, linkOrCancel]);

  return (
    <IonPage>
      <PageHeader
        componentsToShow={{back: true, popover: true}}
        title={`FTC - ${selectedCharacters.playerOne.name}`}
      />


      <IonContent className="calculators">
        <IonGrid fixed>
          <SegmentSwitcher
            key={"FTC Link Or Cancel"}
            valueToTrack={linkOrCancel}
            segmentType={"link-or-cancel"}
            labels={ {link: "Link", cancel: "Cancel"}}
            clickFunc={ (eventValue) => linkOrCancel !== eventValue && setLinkOrCancel(eventValue)}
          />
          <IonItem lines="full">
            <IonLabel>
              <h2>First Move</h2>
            </IonLabel>
            <IonSelect
              interfaceOptions={{ header: "First Move" }}
              value={firstMove}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => setFirstMove(e.detail.value)}
            >
              <IonSelectOption key="firstMove-select" value={null}>Select a move</IonSelectOption>

              {linkOrCancel === "link"
                ? Object.keys(playerOneMoves).filter(move =>
                    playerOneMoves[move].moveType !== "throw" &&
                    playerOneMoves[move].moveType !== "command-grab" &&
                    !playerOneMoves[move].antiAirMove &&
                    !playerOneMoves[move].nonHittingMove &&
                    !playerOneMoves[move].airMove &&
                    !isNaN(playerOneMoves[move].onBlock)
                  ).map(move =>
                    <IonSelectOption key={`firstMove-${move}`} value={move}>{move}</IonSelectOption>
                  )
                : Object.keys(playerOneMoves).filter(move =>
                  playerOneMoves[move].cancelsTo &&
                  playerOneMoves[move].moveType !== "movement-special" &&
                  playerOneMoves[move].moveType !== "throw" &&
                  playerOneMoves[move].moveType !== "command-grab" &&
                  !playerOneMoves[move].airMove &&
                  !isNaN(playerOneMoves[move].onBlock) &&
                  !playerOneMoves[move].nonHittingMove &&
                  !playerOneMoves[move].antiAirMove &&
                  !(playerOneMoves[move].cancelsTo.includes("su") && (playerOneMoves[move].moveButton === "2P" || playerOneMoves[move].moveButton === "2K")) &&
                  !playerOneMoves[move].cancelsTo.every(entry => entry === "vt1") &&
                  !playerOneMoves[move].cancelsTo.every(entry => entry === "vt2") &&
                  !playerOneMoves[move].cancelsTo.every(entry => entry === "FADC") &&
                  !(isNaN(playerOneMoves[move].recovery))
                ).map(move =>
                  <IonSelectOption key={`firstMove-${move}`} value={move}>{move}</IonSelectOption>
                )
            }
            </IonSelect>
          </IonItem>

          <IonItem lines="full">
            <IonLabel>
              <h2>Second Move</h2>
            </IonLabel>
            <IonSelect
              interfaceOptions={{ header: "Second Move" }}
              value={secondMove}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => setSecondMove(e.detail.value)}
              disabled={linkOrCancel === "cancel" && !firstMove && true}
            >
              <IonSelectOption key="secondMove-select" value={null}>Select a move</IonSelectOption>
              {linkOrCancel === "cancel" && firstMove
                ? Object.keys(playerOneMoves).filter(move =>
                    !playerOneMoves[move].airmove &&
                    !playerOneMoves[move].followUp &&
                    (
                        (playerOneMoves[move].moveType === "super" && playerOneMoves[firstMove].cancelsTo.includes("su")) ||
                        (playerOneMoves[move].moveType === "vskill" && (playerOneMoves[firstMove].cancelsTo.includes("vs1") || playerOneMoves[firstMove].cancelsTo.includes("vs2"))) ||
                        (playerOneMoves[move].moveType === "vtrigger" && (playerOneMoves[firstMove].cancelsTo.includes("vt1") || playerOneMoves[firstMove].cancelsTo.includes("vt2"))) ||
                        ((playerOneMoves[move].moveType === "special" || playerOneMoves[move].moveType === "movement-special" ) && playerOneMoves[firstMove].cancelsTo.includes("sp"))
                    )
                  ).map(move =>
                    <IonSelectOption key={`secondMove-${move}`} value={move}>{move}</IonSelectOption>
                  )
                : Object.keys(playerOneMoves).filter(move =>
                    playerOneMoves[move].moveType !== "throw" &&
                    playerOneMoves[move].moveType !== "command-grab" &&
                    !playerOneMoves[move].antiAirMove &&
                    !playerOneMoves[move].nonHittingMove &&
                    !playerOneMoves[move].airMove &&
                    !playerOneMoves[move].followUp &&
                    !isNaN(playerOneMoves[move].startup)
                  ).map(move =>
                    <IonSelectOption key={`secondMove-${move}`} value={move}>{move}</IonSelectOption>
                  )

              }
            </IonSelect>
          </IonItem>
          {playerOneMoves[firstMove] && playerOneMoves[secondMove] &&
            <>
              <IonItem lines="full" class="selected-move-info">
                <IonLabel>
                  <h3>First Move</h3>
                  <h2>{firstMove}</h2>
                  {linkOrCancel === "link"
                    ? <p><b>{playerOneMoves[firstMove].onBlock > 0 && "+"}{playerOneMoves[firstMove].onBlock}</b> On Block</p>
                    : <p><b>{firstMoveBlockStun}</b> frames of blockstun</p>
                  }
                </IonLabel>
                <IonLabel>
                  <h3>Second Move</h3>
                  <h2>{secondMove}</h2>
                  <p><b>{playerOneMoves[secondMove].startup}</b> Startup</p>
                </IonLabel>
              </IonItem>
              {linkOrCancel === "link" &&
                <IonItem lines="full">
                  {playerOneMoves[secondMove].startup - playerOneMoves[firstMove].onBlock > 0
                    ? <p>There is a gap of <b>{playerOneMoves[secondMove].startup - playerOneMoves[firstMove].onBlock}</b> frame{(playerOneMoves[secondMove].startup - playerOneMoves[firstMove].onBlock) > 1 && "s"} between {firstMove} and {secondMove}.</p>
                    : <p>There is <b>no gap</b> between {firstMove} and {secondMove}. It is a true blockstring</p>
                  }
                </IonItem>
              }
              {linkOrCancel === "cancel" &&
                <IonItem lines="full">
                  {
                    (-1 * (firstMoveBlockStun + (1 - 3) - playerOneMoves[secondMove].startup) > 0) && playerOneMoves[secondMove].startup
                      ? <p>There is a <b>gap of {-1 * (firstMoveBlockStun + (1 - 3) - playerOneMoves[secondMove].startup)} frames </b> in the string {firstMove} xx {secondMove} when {firstMove} connects on active frame 1 and is cancelled immediately.</p>
                    : (-1 * (firstMoveBlockStun + (1 - 3) - playerOneMoves[secondMove].recovery) > 0) && !playerOneMoves[secondMove].startup && playerOneMoves[secondMove].recovery
                      ? <p>There is a <b>gap of {-1 * (firstMoveBlockStun + (1 - 3) - playerOneMoves[secondMove].recovery)} frames </b> in the string {firstMove} xx {secondMove} when {firstMove} connects on active frame 1 and is cancelled immediately.</p>
                    : (-1 * (firstMoveBlockStun + (1 - 3) - playerOneMoves[secondMove].startup) <= 0)
                      ? <p>There is <b>no gap</b> between {firstMove} xx {secondMove}. It is a true blockstring.</p>
                    : <p>You broke the calculator, congratulations! Please email me with the inputted data so I can fix this :)</p>
                  }
                </IonItem>
              }

            </>

          }
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
(FrameTrapChecker)
