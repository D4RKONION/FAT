import "../../../style/pages/Calculators.scss";
import "../../../style/components/FAB.scss";

import { IonContent, IonPage, IonItem, IonSelect, IonSelectOption, IonIcon, IonFab, IonFabButton, IonGrid, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { person } from "ionicons/icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setActiveFrameDataPlayer, setModalVisibility } from "../../actions";
import DataTableHeader from "../../components/DataTableHeader";
import DataTableRow from "../../components/DataTableRow";
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

  const firstMoveOnBlock = playerOneMoves[firstMove] && canParseBasicFrames(playerOneMoves[firstMove].onBlock) && parseBasicFrames(playerOneMoves[firstMove].onBlock);
  const secondMoveStartup = playerOneMoves[secondMove] && canParseBasicFrames(playerOneMoves[secondMove].startup) && parseBasicFrames(playerOneMoves[secondMove].startup);
  const secondMoveRecovery = playerOneMoves[secondMove] && canParseBasicFrames(playerOneMoves[secondMove].recovery) && parseBasicFrames(playerOneMoves[secondMove].recovery);
  const firstMoveBlockStun = playerOneMoves[firstMove] && ((canParseBasicFrames(playerOneMoves[firstMove].blockstun) && parseBasicFrames(playerOneMoves[firstMove].blockstun)) ?? parseBasicFrames(playerOneMoves[firstMove].active) + parseBasicFrames(playerOneMoves[firstMove].recovery) + parseBasicFrames(playerOneMoves[firstMove].onBlock));

  if ((firstMove && !playerOneMoves[firstMove]) || (secondMove && !playerOneMoves[secondMove])) return <></>;

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
                    !playerOneMoves[move].airmove &&
                    canParseBasicFrames(playerOneMoves[move].onBlock)
                ).map(move =>
                  <IonSelectOption key={`firstMove-${move}`} value={move}>{move}</IonSelectOption>
                )
                : Object.keys(playerOneMoves).filter(move =>
                  playerOneMoves[move].xx &&
                  playerOneMoves[move].moveType !== "movement-special" &&
                  playerOneMoves[move].moveType !== "throw" &&
                  playerOneMoves[move].moveType !== "command-grab" &&
                  !playerOneMoves[move].airmove &&
                  canParseBasicFrames(playerOneMoves[move].onBlock) &&
                  !playerOneMoves[move].nonHittingMove &&
                  !playerOneMoves[move].antiAirMove &&
                  !(playerOneMoves[move].xx.includes("su") && (playerOneMoves[move].moveButton === "2P" || playerOneMoves[move].moveButton === "2K")) &&
                  !(playerOneMoves[move].xx.length === 1 && playerOneMoves[move].xx.includes("tc")) &&

                  !playerOneMoves[move].xx.every(entry => entry === "vt1") &&
                  !playerOneMoves[move].xx.every(entry => entry === "vt2") &&
                  !playerOneMoves[move].xx.every(entry => entry === "FADC") &&
                  canParseBasicFrames(playerOneMoves[move].recovery)
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
                    canParseBasicFrames(playerOneMoves[move].startup) &&
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
                  !playerOneMoves[move].airmove &&
                  !playerOneMoves[move].followUp &&
                  canParseBasicFrames(playerOneMoves[move].startup)
                 
                ).map(move =>
                  <IonSelectOption key={`secondMove-${move}`} value={move}>{move}</IonSelectOption>
                )

              }
            </IonSelect>
          </IonItem>
          {!playerOneMoves[firstMove] || !playerOneMoves[secondMove] ? (
            // Mandatory dropdowns are falsey
            <div className="nothing-chosen-message">
              <h4>Select a First Move <br/>& a Second Move</h4>
              <button onClick={() => dispatch(setModalVisibility({ currentModal: "help", visible: true })) }>Get help with Frame Trap Checker</button>
            </div>
          ) : (
            <>
              <table>
                <tbody>              
                  <DataTableHeader
                    colsToDisplay={{startup: "S", active: "A", onBlock: "oB"}}
                    moveType={"First Move"}
                    xScrollEnabled={false}
                    noPlural
                    noStick
                  />
                  <DataTableRow
                    moveName={firstMove}
                    moveData={playerOneMoves[firstMove]}
                    colsToDisplay={{startup: "S", active: "A", onBlock: "oB"}}
                    xScrollEnabled={false}
                    displayOnlyStateMoves={false}
                    activePlayerOverwrite="playerOne"
                  />
                                    
                  <DataTableHeader
                    colsToDisplay={{startup: "S", onHit: "oH", onBlock: "oB"}}
                    moveType={"Second Move"}
                    xScrollEnabled={false}
                    noPlural
                    noStick
                  />
                  <DataTableRow
                    moveName={secondMove}
                    moveData={playerOneMoves[secondMove]}
                    colsToDisplay={{startup: "S", onHit: "oH", onBlock: "oB"}}
                    xScrollEnabled={false}
                    displayOnlyStateMoves={false}
                    activePlayerOverwrite="playerOne"
                  /> 
                </tbody>
              </table>
              {linkOrCancel === "link" ? (
                <div className="answer-card">
                  {secondMoveStartup - playerOneMoves[firstMove].onBlock > 0 ? (
                    <div>
                      <p>There is a gap of <b>{secondMoveStartup - playerOneMoves[firstMove].onBlock} frame{(secondMoveStartup - firstMoveOnBlock) > 1 ? "s" : ""}</b> in the string</p>
                      <ul><li>{firstMove}, {secondMove}</li></ul>
                    </div>
                  ) : (
                    <div>
                      <p>There is <b>no gap</b> in the string</p>
                      <ul><li>{firstMove}, {secondMove}</li></ul>
                      <p>It is a true blockstring</p>
                    </div>
                  )}
                </div>
              ) : linkOrCancel === "cancel" ? (
                <div className="answer-card">
                  {(-1 * (firstMoveBlockStun - secondMoveStartup) > 0) && secondMoveStartup ? (
                    <div>
                      <p>There is a <b>gap of {-1 * (firstMoveBlockStun - secondMoveStartup)} frames</b> in the string</p>
                      <ul><li>{firstMove} xx {secondMove}</li></ul>
                      <p>when {firstMove} connects on active frame 1 and is cancelled immediately.</p>
                    </div>
                  ) : (-1 * (firstMoveBlockStun - secondMoveRecovery) > 0) && !secondMoveStartup && secondMoveRecovery ? (
                    <div>
                      <p>There is a <b>gap of {-1 * (firstMoveBlockStun - secondMoveRecovery)} frames</b> in the string</p>
                      <ul><li>{firstMove} xx {secondMove}</li></ul>
                      <p>when {firstMove} connects on active frame 1 and is cancelled immediately.</p>
                    </div>
                  ) : (
                    <div>
                      <p>There is <b>no gap</b> in the string</p>
                      <ul><li>{firstMove} xx {secondMove}</li></ul>
                      <p>It is a true blockstring</p>
                    </div>
                  )}
                </div>
              ) : (
                <p>You broke the calculator, congratulations! Please email me with the inputted data so I can fix this :)</p>
              ) }

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

export default FrameTrapChecker;
