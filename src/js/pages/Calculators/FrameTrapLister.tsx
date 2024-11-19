import { IonContent, IonPage, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonInput, IonList, IonGrid, IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../../style/pages/Calculators.scss';
import '../../../style/components/FAB.scss'
import { setActiveFrameDataPlayer, setModalVisibility } from '../../actions';
import { person } from 'ionicons/icons';
import { selectedCharactersSelector } from '../../selectors';
import PopoverButton from '../../components/PopoverButton';


const FrameTrapLister = () => {
  
  const selectedCharacters = useSelector(selectedCharactersSelector);
  
  const dispatch = useDispatch();
  
  const [frameGap, setFrameGap] = useState(null);

  const playerOneMoves = selectedCharacters["playerOne"].frameData;


  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref='/calculators' />
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
            <IonInput slot="end" type="number" value={frameGap} placeholder="Enter Number" onIonInput={e => setFrameGap(!!parseInt(e.detail.value) &&  parseInt(e.detail.value))}></IonInput>
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
          <IonFabButton onClick={() => { dispatch(setActiveFrameDataPlayer("playerOne")); dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true})) } }>
            <IonIcon icon={person} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default FrameTrapLister;
