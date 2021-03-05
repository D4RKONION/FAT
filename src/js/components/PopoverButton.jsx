import { IonButton, IonButtons, IonIcon, IonItem, IonList, IonPopover, IonLabel, IonToggle } from '@ionic/react';
import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import '../../style/components/PopoverButton.scss';
import { setModalVisibility, setOnBlockColours, setCounterHit } from '../actions';




const PopoverButton = ({ activeGame, setModalVisibility, modeName, onBlockColours, setOnBlockColours, counterHit, setCounterHit }) => {
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
        onDidDismiss={e => setPopoverVisible({open: false})}
        event={showPopover.event}
        showBackdrop={true}
      >
        <IonList>
          <IonItem lines="none" onClick={() => {setModalVisibility({ currentModal: "help", visible: true }); setPopoverVisible({open: false})}} button>
            Help
          </IonItem>
          {modeName === "framedata" &&
            <>
            <IonItem lines="none"  onClick={() => {setModalVisibility({ currentModal: "landscapeOptions", visible: true }); setPopoverVisible({open: false})}} button>
              Landscape Columns
            </IonItem>
            <IonItem lines="none">
              <IonLabel>
                oB Colours
              </IonLabel>
              <IonToggle checked={onBlockColours} onIonChange={e => setOnBlockColours(e.detail.checked)} />
            </IonItem>
            {
              activeGame !== "3S" &&
              <IonItem lines="none">
                <IonLabel>
                  Counter Hit
                </IonLabel>
                <IonToggle checked={counterHit} onIonChange={e => setCounterHit(e.detail.checked)} />
              </IonItem>
            }


            </>
          }
        </IonList>
      </IonPopover>
    </>
  )
}

const mapStateToProps = state => ({
  modeName: state.modeNameState,
  onBlockColours: state.onBlockColoursState,
  counterHit: state.counterHitState,
  activeGame: state.activeGameState,
})

const mapDispatchToProps = dispatch => ({
  setModalVisibility: (data)  => dispatch(setModalVisibility(data)),
  setOnBlockColours: (coloursOn)  => dispatch(setOnBlockColours(coloursOn)),
  setCounterHit: (coloursOn)  => dispatch(setCounterHit(coloursOn)),
})


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PopoverButton)
