import "../../../style/pages/Calculators.scss";
import "../../../style/components/FAB.scss";

import { IonContent, IonPage, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonInput, IonList, IonGrid, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar, IonCheckbox, IonListHeader } from "@ionic/react";
import { person } from "ionicons/icons";
import { useState } from "react";
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

  const playerOneMoves = selectedCharacters["playerOne"].frameData;

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
            <IonLabel position="fixed">Frame Gap</IonLabel>
            <IonInput slot="end" type="number" value={frameGap} placeholder="Enter Number" onIonInput={e => setFrameGap(!!parseInt(e.detail.value) && parseInt(e.detail.value))}></IonInput>
          </IonItem>
          <IonItem>
            <IonCheckbox checked={firstMoveIsSafe} onIonChange={(e) => setFirstMoveIsSafe(!firstMoveIsSafe)}>First move is safe</IonCheckbox>
          </IonItem>
          <IonItem>
            <IonCheckbox checked={firstMoveIsNormal} onIonChange={(e) => setFirstMoveIsNormal(!firstMoveIsNormal)}>First move is a normal</IonCheckbox>
          </IonItem>
          <IonItem>
            <IonCheckbox checked={secondMoveIsSafe} onIonChange={(e) => setSecondMoveIsSafe(!secondMoveIsSafe)}>Second move is safe</IonCheckbox>
          </IonItem>
          <IonItem>
            <IonCheckbox checked={secondMoveIsNormal} onIonChange={(e) => setSecondMoveIsNormal(!secondMoveIsNormal)}>Second move is a normal</IonCheckbox>
          </IonItem>

          <IonList>
            <IonListHeader>Strings with a gap of {frameGap}</IonListHeader>
            {frameGap && Object.keys(playerOneMoves).filter(firstMove =>
              playerOneMoves[firstMove].moveType !== "movement-special" &&
                playerOneMoves[firstMove].moveType !== "throw" &&
                playerOneMoves[firstMove].moveType !== "command-grab" &&
                !playerOneMoves[firstMove].airmove &&
                !playerOneMoves[firstMove].nonHittingMove &&
                !playerOneMoves[firstMove].antiAirMove &&
                (!firstMoveIsNormal || playerOneMoves[firstMove].moveType === "normal") &&
                playerOneMoves[firstMove].onBlock && canParseBasicFrames(playerOneMoves[firstMove].onBlock) && parseBasicFrames(playerOneMoves[firstMove].onBlock) &&
                (!firstMoveIsSafe || parseBasicFrames(playerOneMoves[firstMove].onBlock) > -4)
            ).map(firstMove =>
              Object.keys(playerOneMoves).filter(secondMove =>
                (playerOneMoves[secondMove].startup && canParseBasicFrames(playerOneMoves[secondMove].startup) && parseBasicFrames(playerOneMoves[secondMove].startup)) - (parseBasicFrames(playerOneMoves[firstMove].onBlock)) === frameGap &&
                (!secondMoveIsSafe || playerOneMoves[secondMove].onBlock && canParseBasicFrames(playerOneMoves[secondMove].onBlock) && parseBasicFrames(playerOneMoves[secondMove].onBlock) > -4) &&
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
                <IonItem key={`${firstMove}, ${secondMove}`}>{firstMove}, {secondMove}</IonItem>
              )
            )}
          </IonList>
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
