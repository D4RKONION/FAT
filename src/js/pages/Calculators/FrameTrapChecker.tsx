import "../../../style/pages/Calculators.scss";
import "../../../style/components/FAB.scss";

import { IonContent, IonPage, IonItem, IonLabel, IonSelect, IonSelectOption, IonIcon, IonFab, IonFabButton, IonGrid, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { person } from "ionicons/icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setActiveFrameDataPlayer, setModalVisibility } from "../../actions";
import PopoverButton from "../../components/PopoverButton";
import SegmentSwitcher from "../../components/SegmentSwitcher";
import { selectedCharactersSelector } from "../../selectors";
import { canParseBasicFrames, parseBasicFrames } from "../../utils/ParseFrameData";

const FrameTrapChecker = () => {
  const selectedCharacters = useSelector(selectedCharactersSelector);

  const dispatch = useDispatch();

  const [linkOrCancel, setLinkOrCancel] = useState("link");
  const [firstMove, setFirstMove] = useState(null);
  const [secondMove, setSecondMove] = useState(null);

  const playerOneMoves = selectedCharacters["playerOne"].frameData;
  
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

  const firstMoveOnBlock = playerOneMoves[firstMove] && parseBasicFrames(playerOneMoves[firstMove].onBlock);
  const secondMoveStartup = playerOneMoves[secondMove] && parseBasicFrames(playerOneMoves[secondMove].startup);
  const secondMoveRecovery = playerOneMoves[secondMove] && parseBasicFrames(playerOneMoves[secondMove].recovery);
  const firstMoveBlockStun = playerOneMoves[firstMove] && ((canParseBasicFrames(playerOneMoves[firstMove].blockstun) && parseBasicFrames(playerOneMoves[firstMove].blockstun)) ?? parseBasicFrames(playerOneMoves[firstMove].active) + parseBasicFrames(playerOneMoves[firstMove].recovery) + parseBasicFrames(playerOneMoves[firstMove].onBlock));

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/calculators" />
          </IonButtons>
          <IonTitle>{`FTC - ${selectedCharacters.playerOne.name}`}</IonTitle>
          <IonButtons slot="end">
            <PopoverButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

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
            <IonSelect
              label="First Move"
              interface="modal"
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
                    playerOneMoves[move].onBlock && 
                    canParseBasicFrames(playerOneMoves[move].onBlock) &&
                    parseBasicFrames(playerOneMoves[move].onBlock)
                ).map(move =>
                  <IonSelectOption key={`firstMove-${move}`} value={move}>{move}</IonSelectOption>
                )
                : Object.keys(playerOneMoves).filter(move =>
                  playerOneMoves[move].xx &&
                  playerOneMoves[move].moveType !== "movement-special" &&
                  playerOneMoves[move].moveType !== "throw" &&
                  playerOneMoves[move].moveType !== "command-grab" &&
                  !playerOneMoves[move].airMove &&
                  !isNaN(playerOneMoves[move].onBlock) &&
                  !playerOneMoves[move].nonHittingMove &&
                  !playerOneMoves[move].antiAirMove &&
                  !(playerOneMoves[move].xx.includes("su") && (playerOneMoves[move].moveButton === "2P" || playerOneMoves[move].moveButton === "2K")) &&
                  !playerOneMoves[move].xx.every(entry => entry === "vt1") &&
                  !playerOneMoves[move].xx.every(entry => entry === "vt2") &&
                  !playerOneMoves[move].xx.every(entry => entry === "FADC") &&
                  !(isNaN(playerOneMoves[move].recovery))
                ).map(move =>
                  <IonSelectOption key={`firstMove-${move}`} value={move}>{move}</IonSelectOption>
                )
              }
            </IonSelect>
          </IonItem>

          <IonItem lines="full">
            <IonSelect
              label="Second Move"
              interface="modal"
              interfaceOptions={{ header: "Second Move" }}
              value={secondMove}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => setSecondMove(e.detail.value)}
              disabled={linkOrCancel === "cancel" && !firstMove && true}
            >
              <IonSelectOption key="secondMove-select" value={null}>Select a move</IonSelectOption>
              {linkOrCancel === "cancel" && firstMove && playerOneMoves[firstMove].xx
                ? Object.keys(playerOneMoves).filter(move =>
                  !playerOneMoves[move].airmove &&
                    !playerOneMoves[move].followUp &&
                    playerOneMoves[move].startup && 
                    canParseBasicFrames(playerOneMoves[move].startup) &&
                    parseBasicFrames(playerOneMoves[move].startup) &&
                    (
                      (playerOneMoves[move].moveType === "super" && playerOneMoves[firstMove].xx.map(cancelType => cancelType.includes("su"))) ||
                        (playerOneMoves[move].moveType === "vskill" && (playerOneMoves[firstMove].xx.includes("vs1") || playerOneMoves[firstMove].xx.includes("vs2"))) ||
                        (playerOneMoves[move].moveType === "vtrigger" && (playerOneMoves[firstMove].xx.includes("vt1") || playerOneMoves[firstMove].xx.includes("vt2"))) ||
                        ((playerOneMoves[move].moveType === "special" || playerOneMoves[move].moveType === "movement-special" ) && playerOneMoves[firstMove].xx.includes("sp"))
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
                    playerOneMoves[move].startup && 
                    canParseBasicFrames(playerOneMoves[move].startup) &&
                    parseBasicFrames(playerOneMoves[move].startup)
                ).map(move =>
                  <IonSelectOption key={`secondMove-${move}`} value={move}>{move}</IonSelectOption>
                )

              }
            </IonSelect>
          </IonItem>
          {playerOneMoves[firstMove] && playerOneMoves[secondMove] &&
            <>
              <IonItem lines="full" className="selected-move-info">
                <IonLabel>
                  <h3>First Move</h3>
                  <h2>{firstMove}</h2>
                  {linkOrCancel === "link"
                    ? <p><b>{firstMoveOnBlock > 0 && "+"}{firstMoveOnBlock}</b> On Block</p>
                    : <p><b>{firstMoveBlockStun}</b> frames of blockstun</p>
                  }
                </IonLabel>
                <IonLabel>
                  <h3>Second Move</h3>
                  <h2>{secondMove}</h2>
                  <p><b>{secondMoveStartup}</b> Startup</p>
                </IonLabel>
              </IonItem>
              {linkOrCancel === "link" &&
                <IonItem lines="full">
                  {secondMoveStartup - playerOneMoves[firstMove].onBlock > 0
                    ? <p>There is a gap of <b>{secondMoveStartup - playerOneMoves[firstMove].onBlock}</b> frame{(secondMoveStartup - firstMoveOnBlock) > 1 && "s"} between {firstMove} and {secondMove}.</p>
                    : <p>There is <b>no gap</b> between {firstMove} and {secondMove}. It is a true blockstring</p>
                  }
                </IonItem>
              }
              {linkOrCancel === "cancel" &&
                <IonItem lines="full">
                  {
                    (-1 * (firstMoveBlockStun + (1 - 3) - secondMoveStartup) > 0) && secondMoveStartup
                      ? <p>There is a <b>gap of {-1 * (firstMoveBlockStun + (1 - 3) - secondMoveStartup)} frames </b> in the string {firstMove} xx {secondMove} when {firstMove} coonnects on active frame 1 and is cancelled immediately.</p>
                      : (-1 * (firstMoveBlockStun + (1 - 3) - secondMoveRecovery) > 0) && !secondMoveStartup && secondMoveRecovery
                        ? <p>There is a <b>gap of {-1 * (firstMoveBlockStun + (1 - 3) - secondMoveRecovery)} frames </b> in the string {firstMove} xx {secondMove} when {firstMove} connects on active frame 1 and is cancelled immediately.</p>
                        : (-1 * (firstMoveBlockStun + (1 - 3) - secondMoveStartup) <= 0)
                          ? <p>There is <b>no gap</b> between {firstMove} xx {secondMove}. It is a true blockstring.</p>
                          : <p>You broke the calculator, congratulations! Please email me with the inputted data so I can fix this :)</p>
                  }
                </IonItem>
              }

            </>

          }
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

export default FrameTrapChecker;
