import { IonContent, IonPage, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonList, IonSelect, IonSelectOption, IonToggle, IonGrid } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PageHeader from '../../components/PageHeader';
import '../../../style/pages/Calculators.scss';
import '../../../style/components/FAB.scss'
import { setActiveFrameDataPlayer, setModalVisibility } from '../../actions';
import { person } from 'ionicons/icons';
import { activeGameSelector, selectedCharactersSelector } from '../../selectors';


const MoveLinker = () => {

  const activeGame = useSelector(activeGameSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  
  const dispatch = useDispatch();

  const [firstMove, setFirstMove] = useState(null);
  const [counterHitState, setCounterHitState] = useState(false);
  const [counterHitBonus, setCounterHitBonus] = useState(0);

  const playerOneMoves = selectedCharacters["playerOne"].frameData;

  useEffect(() => {
    if (playerOneMoves[firstMove]) {
        if (counterHitState && playerOneMoves[firstMove]) {
          if (activeGame === "SFV" && playerOneMoves.ccAdv) {
            setCounterHitBonus(playerOneMoves.ccAdv)
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
  },[playerOneMoves, firstMove, selectedCharacters, counterHitState, activeGame]);




  return (
    <IonPage>
      <PageHeader
        componentsToShow={{back: true, popover: true}}
        title={`MLinker - ${selectedCharacters.playerOne.name}`}
      />


      <IonContent className="calculators">
        <IonGrid fixed>
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



            {playerOneMoves[firstMove] &&
              <>
                <IonItem lines="full" className="selected-move-info">
                  <IonLabel>
                    <h3>First Move</h3>
                    <h2>{firstMove}</h2>
                    <p><b>{playerOneMoves[firstMove].onHit + counterHitBonus}</b> On Hit <em>{counterHitState && `(inc. CH +${counterHitBonus})`}</em></p>
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
