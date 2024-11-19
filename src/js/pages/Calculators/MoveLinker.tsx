import { IonContent, IonPage, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonList, IonSelect, IonSelectOption, IonToggle, IonGrid, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../../style/pages/Calculators.scss';
import '../../../style/components/FAB.scss'
import { setActiveFrameDataPlayer, setModalVisibility } from '../../actions';
import { person } from 'ionicons/icons';
import { activeGameSelector, selectedCharactersSelector } from '../../selectors';
import PopoverButton from '../../components/PopoverButton';


const MoveLinker = () => {

  const activeGame = useSelector(activeGameSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  
  const dispatch = useDispatch();

  const [firstMove, setFirstMove] = useState(null);
  const [counterHitState, setCounterHitState] = useState(false);
  const [punishCounterState, setPunishCounterState] = useState(false);
  const [counterHitBonus, setCounterHitBonus] = useState(0);

  const playerOneMoves = selectedCharacters["playerOne"].frameData;

  useEffect(() => {
    if (playerOneMoves[firstMove]) {
        if ((counterHitState || punishCounterState) && playerOneMoves[firstMove]) {
          if (activeGame === "SF6" && punishCounterState && playerOneMoves[firstMove].onPC) {
            setCounterHitBonus(playerOneMoves[firstMove].onPC - playerOneMoves[firstMove].onHit)
          } else if (activeGame === "SF6" && (!!parseInt(playerOneMoves[firstMove].onHit) || playerOneMoves[firstMove].onHit === 0)) {
            setCounterHitBonus(2)
          } else if (activeGame === "SFV" && playerOneMoves[firstMove].ccAdv) {
            setCounterHitBonus(playerOneMoves[firstMove].ccAdv - playerOneMoves[firstMove].onHit)
          } else if (activeGame === "SFV" && (!!parseInt(playerOneMoves[firstMove].onHit) || playerOneMoves[firstMove].onHit === 0)) {
            setCounterHitBonus(2)
          } else if (activeGame === "USF4" && (!!parseInt(playerOneMoves[firstMove].onHit) || playerOneMoves[firstMove].onHit === 0) && playerOneMoves[firstMove].moveType === "normal" && playerOneMoves[firstMove].moveButton.includes("L")) {
            setCounterHitBonus(1)
          } else if (activeGame === "USF4" && (!!parseInt(playerOneMoves[firstMove].onHit) || playerOneMoves[firstMove].onHit === 0)) {
            setCounterHitBonus(3)
          } else {
             setCounterHitBonus(0)
          }
        } else (
          setCounterHitBonus(0)
        )
    } else {
      setFirstMove(null);
    }
  },[playerOneMoves, firstMove, selectedCharacters, counterHitState, punishCounterState, activeGame]);




  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref='/calculators' />
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
              !playerOneMoves[move].airmove &&
              !playerOneMoves[move].followUp &&
              !playerOneMoves[move].antiAirMove &&
              !isNaN(playerOneMoves[move].onHit)
              ).map(move =>
                <IonSelectOption key={`firstMove-${move}`} value={move}>{move}</IonSelectOption>
              )}
            </IonSelect>
          </IonItem>
          {
            activeGame !== "3S" &&
            <IonItem lines="full">
              <IonToggle checked={counterHitState} onIonChange={e => setCounterHitState(e.detail.checked)}>Counter Hit</IonToggle>
            </IonItem>
          }
          {
            activeGame === "SF6" &&
            <IonItem lines="full">
              <IonToggle checked={punishCounterState} onIonChange={e => setPunishCounterState(e.detail.checked)}>Punish Counter</IonToggle>
            </IonItem>
          }



            {playerOneMoves[firstMove] &&
              <>
                <IonItem lines="full" className="selected-move-info">
                  <IonLabel>
                    <h3>First Move</h3>
                    <h2>{firstMove}</h2>
                    <p><b>{playerOneMoves[firstMove].onHit + counterHitBonus}</b> On Hit <em>{(counterHitState || punishCounterState) && `(inc. CH +${counterHitBonus})`}</em></p>
                  </IonLabel>
                </IonItem>
                <IonList>
                {
                  Object.keys(playerOneMoves).filter(secondMove =>
                    !isNaN(playerOneMoves[firstMove].onHit) &&
                    playerOneMoves[secondMove].startup <= (playerOneMoves[firstMove].onHit + counterHitBonus) &&
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
                    <IonItem key={`${firstMove}, ${secondMove}`}>
                        <p>{firstMove}, {secondMove} (s: {playerOneMoves[secondMove].startup}) is a {playerOneMoves[firstMove].onHit - playerOneMoves[secondMove].startup + counterHitBonus + 1} frame link</p>
                    </IonItem>
                  )
                }

                </IonList>
              </>
            }
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

export default MoveLinker;
