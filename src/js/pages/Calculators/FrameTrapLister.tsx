import "../../../style/pages/Calculators.scss";
import "../../../style/components/FAB.scss";

import { IonContent, IonPage, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonInput, IonList, IonGrid, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar, IonListHeader, IonToggle } from "@ionic/react";
import { person } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setActiveFrameDataPlayer, setModalVisibility } from "../../actions";
import PopoverButton from "../../components/PopoverButton";
import { selectedCharactersSelector } from "../../selectors";
import { canParseBasicFrames, parseBasicFrames } from "../../utils/ParseFrameData";

const FrameTrapLister = () => {
  const selectedCharacters = useSelector(selectedCharactersSelector);

  const dispatch = useDispatch();

  const [frameGap, setFrameGap] = useState(null);
  const [firstMoveIsSafe, setFirstMoveIsSafe] = useState(true);
  const [secondMoveIsSafe, setSecondMoveIsSafe] = useState(true);
  const [firstMoveIsNormal, setFirstMoveIsNormal] = useState(false);
  const [secondMoveIsNormal, setSecondMoveIsNormal] = useState(false);
  
  const [listOfFrameTraps, setListOfFrameTraps] = useState([]);

  const playerOneMoves = selectedCharacters["playerOne"].frameData;

  useEffect(() => {
    const list = [];
    
    Object.keys(playerOneMoves).filter(firstMove =>
      playerOneMoves[firstMove].moveType !== "movement-special" &&
      playerOneMoves[firstMove].moveType !== "throw" &&
      playerOneMoves[firstMove].moveType !== "command-grab" &&
      !playerOneMoves[firstMove].airmove &&
      !playerOneMoves[firstMove].nonHittingMove &&
      !playerOneMoves[firstMove].antiAirMove &&
      (!firstMoveIsNormal || playerOneMoves[firstMove].moveType === "normal") &&
      canParseBasicFrames(playerOneMoves[firstMove].onBlock) &&
      (!firstMoveIsSafe || parseBasicFrames(playerOneMoves[firstMove].onBlock) > -4)
    ).map(firstMove =>
      Object.keys(playerOneMoves).filter(secondMove =>
        (canParseBasicFrames(playerOneMoves[secondMove].startup) && parseBasicFrames(playerOneMoves[secondMove].startup)) - (parseBasicFrames(playerOneMoves[firstMove].onBlock)) === frameGap &&
      (!secondMoveIsSafe || canParseBasicFrames(playerOneMoves[secondMove].onBlock) && parseBasicFrames(playerOneMoves[secondMove].onBlock) > -4) &&
      (!secondMoveIsNormal || playerOneMoves[secondMove].moveType === "normal") &&  
      playerOneMoves[secondMove].moveType !== "throw" &&
      playerOneMoves[secondMove].startup !== "~" &&
      playerOneMoves[secondMove].moveType !== "combo grab" &&
      !playerOneMoves[secondMove].antiAirMove &&
      !playerOneMoves[secondMove].nonHittingMove &&
      !playerOneMoves[secondMove].airmove &&
      !playerOneMoves[secondMove].followUp &&
      !(firstMove.includes("Stand ") && secondMove.includes("Close ")) &&
      !(playerOneMoves[firstMove].moveType === "super" && secondMove.startsWith("EX ")) &&
      !(playerOneMoves[secondMove].moveType === "super" && firstMove.startsWith("EX ")) &&
      !(playerOneMoves[firstMove].moveType === "super" && secondMove.includes("FADC")) &&
      !(playerOneMoves[firstMove].moveType === "super" && playerOneMoves[secondMove].moveType === "super") &&
      !(firstMove.includes("FADC") && playerOneMoves[secondMove].moveType === "super")
      ).map(secondMove => 
        list.push(`${firstMove}, ${secondMove}`)
      ));

    setListOfFrameTraps(list);
  }, [frameGap, firstMoveIsNormal, firstMoveIsSafe, secondMoveIsNormal, secondMoveIsSafe, playerOneMoves]);

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/calculators" />
          </IonButtons>
          <IonTitle>{`FTL - ${selectedCharacters.playerOne.name}`}</IonTitle>
          <IonButtons slot="end">
            <PopoverButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="calculators">
        <IonGrid fixed>
          <IonItem>
            <IonLabel position="fixed">Frame Gap*</IonLabel>
            <IonInput slot="end" type="number" value={frameGap} placeholder="Enter Number" onIonInput={e => setFrameGap(!!parseInt(e.detail.value) && parseInt(e.detail.value))}></IonInput>
          </IonItem>
          <IonItem>
            <IonToggle checked={firstMoveIsSafe} onIonChange={() => setFirstMoveIsSafe(!firstMoveIsSafe)}>First move is safe</IonToggle>
          </IonItem>
          <IonItem>
            <IonToggle checked={firstMoveIsNormal} onIonChange={() => setFirstMoveIsNormal(!firstMoveIsNormal)}>First move is a normal</IonToggle>
          </IonItem>
          <IonItem>
            <IonToggle checked={secondMoveIsSafe} onIonChange={() => setSecondMoveIsSafe(!secondMoveIsSafe)}>Second move is safe</IonToggle>
          </IonItem>
          <IonItem>
            <IonToggle checked={secondMoveIsNormal} onIonChange={() => setSecondMoveIsNormal(!secondMoveIsNormal)}>Second move is a normal</IonToggle>
          </IonItem>
          {!frameGap || frameGap < 0 ? (
            // Mandatory framegap is falsey
            <div className="nothing-chosen-message">
              <h4>Enter a {frameGap < 0 ? "positive" : ""} Frame Gap<br/>to get started</h4>
              <button onClick={() => dispatch(setModalVisibility({ currentModal: "help", visible: true })) }>Get help with Frame Trap Lister</button>
            </div>
          ) : listOfFrameTraps.length > 0 ? (
            <IonList>
              <h6>Strings with a gap of {frameGap}</h6>
              {listOfFrameTraps.map(string =>
                <IonItem key={`${string}`}>{string}</IonItem>
              )}
            </IonList>
          ) : (
            <h4>No frame traps with<br/>a gap of {frameGap} found<br/><br/>Sorry!</h4>
          )
            
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

export default FrameTrapLister;
