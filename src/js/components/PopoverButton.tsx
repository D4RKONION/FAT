import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IonButton, IonButtons, IonIcon, IonItem, IonList, IonPopover, IonLabel, IonToggle } from '@ionic/react';
import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import '../../style/components/PopoverButton.scss';
import { setModalVisibility, setOnBlockColours, setCounterHit } from '../actions';
import { activeGameSelector, counterHitSelector, modeNameSelector, onBlockColoursSelector } from '../selectors';




const PopoverButton = () => {

  const modeName = useSelector(modeNameSelector);
  const onBlockColours = useSelector(onBlockColoursSelector);
  const counterHit = useSelector(counterHitSelector);
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
              <IonLabel>
                oB Colours
              </IonLabel>
              <IonToggle checked={onBlockColours} onIonChange={e => dispatch(setOnBlockColours(e.detail.checked)) } />
            </IonItem>
            {
              activeGame !== "3S" &&
              <IonItem lines="none">
                <IonLabel>
                  Counter Hit
                </IonLabel>
                <IonToggle checked={counterHit} onIonChange={e => dispatch(setCounterHit(e.detail.checked)) } />
              </IonItem>
            }


            </>
          }
        </IonList>
      </IonPopover>
    </>
  )
}

export default PopoverButton;