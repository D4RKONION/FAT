import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IonButton, IonButtons, IonIcon, IonItem, IonList, IonPopover, IonToggle } from '@ionic/react';
import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import '../../style/components/PopoverButton.scss';
import { setModalVisibility, setOnBlockColours, setCounterHit, setRawDriveRush, setVsBurntoutOpponent, setCompactView } from '../actions';
import { activeGameSelector, compactViewSelector, counterHitSelector, modeNameSelector, onBlockColoursSelector, rawDriveRushSelector, vsBurntoutOpponentSelector } from '../selectors';




const PopoverButton = () => {

  const modeName = useSelector(modeNameSelector);
  const compactView = useSelector(compactViewSelector);
  const onBlockColours = useSelector(onBlockColoursSelector);
  const counterHit = useSelector(counterHitSelector);
  const rawDriveRush = useSelector(rawDriveRushSelector);
  const vsBurntoutOpponent = useSelector(vsBurntoutOpponentSelector);
  const activeGame = useSelector(activeGameSelector);

  const dispatch = useDispatch();

  const [showPopover, setPopoverVisible] = useState({open: false, event: undefined});
  return(
    <>
      <IonButtons slot="end">
        <IonButton onClick={(e) => {setPopoverVisible({open: true, event: e.nativeEvent})}}>
          <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
        </IonButton>
      </IonButtons>

      <IonPopover id="threeDotPopover"
        isOpen={showPopover.open}
        onDidDismiss={ e => setPopoverVisible({open: false, event: undefined}) }
        event={showPopover.event}
        showBackdrop={true}
      >
        <IonList>
          <IonItem lines="none" onClick={() => { dispatch(setModalVisibility({ currentModal: "help", visible: true })); setPopoverVisible({open: false, event: undefined})}} button>
            Help
          </IonItem>
          {modeName === "framedata" &&
            <>
            <IonItem lines="none"  onClick={() => { dispatch(setModalVisibility({ currentModal: "landscapeOptions", visible: true })); setPopoverVisible({open: false, event: undefined})}} button>
              Landscape Columns
            </IonItem>

            <IonItem lines="none">
              <IonToggle checked={!!compactView} onIonChange={e => dispatch(setCompactView(e.detail.checked)) } >Compact</IonToggle>
            </IonItem>

            <IonItem lines="none">  
              <IonToggle checked={!!onBlockColours} onIonChange={e => dispatch(setOnBlockColours(e.detail.checked)) } >oB Colours</IonToggle>
            </IonItem>
            {
              activeGame !== "3S" &&
              <IonItem lines="none">
                <IonToggle checked={!!counterHit} onIonChange={e => dispatch(setCounterHit(e.detail.checked)) } >Counter Hit</IonToggle>
              </IonItem>
            }
            {
              activeGame === "SF6" &&
              <>
              <IonItem lines="none">
                <IonToggle checked={!!rawDriveRush} onIonChange={e => dispatch(setRawDriveRush(e.detail.checked)) } >Raw DR</IonToggle>
              </IonItem>

              <IonItem lines="none">
                <IonToggle checked={!!vsBurntoutOpponent} onIonChange={e => dispatch(setVsBurntoutOpponent(e.detail.checked)) }>VS Burnout</IonToggle>
              </IonItem>
            </>
            }


            </>
          }
        </IonList>
      </IonPopover>
    </>
  )
}

export default PopoverButton;