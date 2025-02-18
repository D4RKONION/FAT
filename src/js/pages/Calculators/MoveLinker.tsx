import "../../../style/pages/Calculators.scss";
import "../../../style/components/FAB.scss";

import { IonContent, IonPage, IonItem, IonIcon, IonFab, IonFabButton, IonList, IonSelect, IonSelectOption, IonToggle, IonGrid, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, useIonViewDidLeave } from "@ionic/react";
import { link } from "fs";
import { person } from "ionicons/icons";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setActiveFrameDataPlayer, setCounterHit, setModalVisibility } from "../../actions";
import DataTableHeader from "../../components/DataTableHeader";
import DataTableRow from "../../components/DataTableRow";
import PopoverButton from "../../components/PopoverButton";
import { activeGameSelector, advantageModifiersSelector, selectedCharactersSelector } from "../../selectors";
import { canParseBasicFrames, parseBasicFrames } from "../../utils/ParseFrameData";

const MoveLinker = () => {
  const activeGame = useSelector(activeGameSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const counterHitEnabled = useSelector(advantageModifiersSelector).counterHitActive;

  const dispatch = useDispatch();

  const [firstMove, setFirstMove] = useState(null);
  const [punishCounterState, setPunishCounterState] = useState(false);
  const [counterHitBonus, setCounterHitBonus] = useState(0);
  const [listOfLinks, setListOfLinks] = useState([]);

  const playerOneMoves = selectedCharacters["playerOne"].frameData;

  useEffect(() => {
    if (canParseBasicFrames(playerOneMoves[firstMove]?.onHit) && !(typeof playerOneMoves[firstMove].onHit === "string" && playerOneMoves[firstMove].onHit.toLowerCase().includes("kd"))) {
      if ((counterHitEnabled || punishCounterState)) {
        if (activeGame === "SF6" && punishCounterState && canParseBasicFrames(playerOneMoves[firstMove].onPC)) {
          setCounterHitBonus(parseBasicFrames(playerOneMoves[firstMove].onPC) - parseBasicFrames(playerOneMoves[firstMove].onHit));
        } else if (activeGame === "SF6") {
          setCounterHitBonus(2);
        } else if (activeGame === "SFV" && playerOneMoves[firstMove].ccAdv) {
          setCounterHitBonus(playerOneMoves[firstMove].ccAdv - parseBasicFrames(playerOneMoves[firstMove].onHit));
        } else if (activeGame === "SFV") {
          setCounterHitBonus(2);
        } else if (activeGame === "USF4" && playerOneMoves[firstMove].moveType === "normal" && playerOneMoves[firstMove].moveButton.includes("L")) {
          setCounterHitBonus(1);
        } else if (activeGame === "USF4") {
          setCounterHitBonus(3);
        } else {
          setCounterHitBonus(0);
        }
      } else (
        setCounterHitBonus(0)
      );
    } else {
      setFirstMove(null);
    }
  },[playerOneMoves, firstMove, selectedCharacters, counterHitEnabled, punishCounterState, activeGame]);

  useEffect(() => {
    if (!playerOneMoves[firstMove]) return;
    const list = [];
    Object.keys(playerOneMoves).filter(secondMove =>
      canParseBasicFrames(playerOneMoves[secondMove].startup) &&
        parseBasicFrames(playerOneMoves[secondMove].startup) <= (parseBasicFrames(playerOneMoves[firstMove].onHit) + counterHitBonus) &&
        playerOneMoves[secondMove].moveType !== "movement-special" &&
        playerOneMoves[secondMove].moveType !== "throw" &&
        playerOneMoves[secondMove].moveType !== "command-grab" &&
        playerOneMoves[secondMove].moveType !== "combo grab" &&
        !playerOneMoves[secondMove].airmove &&
        !playerOneMoves[secondMove].followUp &&
        !playerOneMoves[secondMove].nonHittingMove &&
        !playerOneMoves[secondMove].antiAirMove &&
        !playerOneMoves[secondMove].throwMove
    ).map(secondMove => 
      list.push(`${firstMove}, ${secondMove} (s: ${parseBasicFrames(playerOneMoves[secondMove].startup)}) is a ${parseBasicFrames(playerOneMoves[firstMove].onHit) - parseBasicFrames(playerOneMoves[secondMove].startup) + counterHitBonus + 1} frame link`
      ));

    setListOfLinks(list);
  }, [counterHitBonus, firstMove, playerOneMoves]);

  useIonViewDidLeave(() => {
    dispatch(setCounterHit(false));
  }, []);

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/calculators" />
          </IonButtons>
          <IonTitle>{`MLinker - ${selectedCharacters.playerOne.name}`}</IonTitle>
          <IonButtons slot="end">
            <PopoverButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="calculators">
        <IonGrid fixed>
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

              {Object.keys(playerOneMoves).filter(move =>
                playerOneMoves[move].moveType !== "movement-special" &&
                playerOneMoves[move].moveType !== "throw" &&
                playerOneMoves[move].moveType !== "command-grab" &&
                !playerOneMoves[move].followUp &&
                !playerOneMoves[move].antiAirMove &&
                canParseBasicFrames(playerOneMoves[move].onHit) &&
                !(typeof playerOneMoves[move].onHit === "string" && playerOneMoves[move].onHit.toLowerCase().includes("kd")) // remove kd moves as they can't be linked from
              ).map(move =>
                <IonSelectOption key={`firstMove-${move}`} value={move}>{move}</IonSelectOption>
              )}
            </IonSelect>
          </IonItem>
          {
            activeGame !== "3S" &&
            <IonItem lines="full">
              <IonToggle checked={!!counterHitEnabled} onIonChange={e => dispatch(setCounterHit(e.detail.checked))}>Counter Hit</IonToggle>
            </IonItem>
          }
          {
            activeGame === "SF6" &&
            <IonItem lines="full">
              <IonToggle checked={punishCounterState} onIonChange={e => setPunishCounterState(e.detail.checked)}>Punish Counter</IonToggle>
            </IonItem>
          }
          {!playerOneMoves[firstMove] ? (
            // Mandatory dropdowns are falsey
            <div className="nothing-chosen-message">
              <h4>Select a First Move</h4>
              <button onClick={() => dispatch(setModalVisibility({ currentModal: "help", visible: true })) }>Get help with Move Linker</button>
            </div>
          ) : listOfLinks.length > 0 ? (
            <>
              <table>
                <tbody>                                       
                  <DataTableHeader
                    colsToDisplay={
                      punishCounterState ?
                        {startup: "S", active: "A", onPC: "onPC"}
                        : {startup: "S", active: "A", onPC: "oH"}}
                    moveType="First Move"
                    xScrollEnabled={false}
                    noPlural
                    noStick
                  />
                  <DataTableRow
                    moveName={firstMove}
                    moveData={playerOneMoves[firstMove]}
                    colsToDisplay={
                      punishCounterState ?
                        {startup: "S", active: "A", onPC: "onPC"}
                        : {startup: "S", active: "A", onHit: "oH"}}
                    xScrollEnabled={false}
                    displayOnlyStateMoves={false}
                    activePlayerOverwrite="playerOne"
                  />                                     
                </tbody>
              </table>
              <IonList>
                {
                  listOfLinks.map(linkEntry =>
                    <IonItem key={`${linkEntry}`}>
                      <p>{linkEntry}</p>
                    </IonItem>
                  )
                }

              </IonList>
            </>
          ) : (
            <h4>No links for {firstMove} fround!<br/>Try adjusting the CH properties</h4>
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

export default MoveLinker;
