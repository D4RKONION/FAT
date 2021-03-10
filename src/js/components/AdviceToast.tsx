import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { IonToast } from "@ionic/react";
import ADVICE from '../constants/Advice';
import { setAdviceToastDismissed, setAdviceToastPrevRead } from '../actions'
import { settingsOutline, star, thumbsUpOutline } from 'ionicons/icons';
import { useHistory } from 'react-router'; 

const AdviceToast = ({ modeName, adviceToastShown, adviceToastDismissed, setAdviceToastDismissed, adviceToastPrevRead, setAdviceToastPrevRead }) => {
  
  const history = useHistory();
  const toastRef = useRef();

  const icons = { settingsOutline, star, thumbsUpOutline }
  const getIcon = (iconAsString) => {
    return icons[iconAsString]
  }

  if (toastRef.current) {
    toastRef.current.dismiss();
    return false;
  } else if (!ADVICE[modeName] || !adviceToastShown || adviceToastDismissed ) {
    return false;
  } else if (Math.floor(Math.random() * 10) < 7) {
    return false;
  }
  
  const toastData = {};
  if (ADVICE[modeName]) {

    if (typeof adviceToastPrevRead[modeName] === "undefined") {
      // it's the first time advice has been shown for this mode
      toastData.message = ADVICE[modeName][0].message;
      toastData.icon = getIcon(ADVICE[modeName][0].icon);
      toastData.handler = ADVICE[modeName][0].handler;
    } else if (ADVICE[modeName][adviceToastPrevRead[modeName] + 1]) {
      // it's NOT the first time advice has been shown for this mode
      toastData.message = ADVICE[modeName][adviceToastPrevRead[modeName] + 1].message;
      toastData.icon = getIcon(ADVICE[modeName][adviceToastPrevRead[modeName] + 1].icon);
      toastData.handler = ADVICE[modeName][adviceToastPrevRead[modeName] + 1].handler;
    } else {
      // you've read all the advice for this mode
      return false;
    }
  }	
  
  return(
    <IonToast
      ref={toastRef}
      isOpen={true}
      onWillDismiss={() => {
        setAdviceToastDismissed(true);
        if (typeof adviceToastPrevRead[modeName] !== "undefined" ) {
          setAdviceToastPrevRead({ ...adviceToastPrevRead, [modeName]: adviceToastPrevRead[modeName] + 1 })
        } else {
          setAdviceToastPrevRead({ ...adviceToastPrevRead, [modeName]: 0 })
        }
      }}
      header="Did you know?"
      message={toastData.message}
      position="bottom"
      buttons={
        toastData.handler ? [
          {
            side: "end",
            icon: toastData.icon,
            text: '',
            handler: () => {toastData.handler(history);}
          }
        ] : [
          {
            side:"end",
            icon: thumbsUpOutline,
            text: '',
            role: 'cancel',
          }
        ]
      }
    />
  )
}

const mapStateToProps = state => ({
  modeName: state.modeNameState,
  adviceToastShown: state.adviceToastShownState,
  adviceToastDismissed: state.adviceToastDismissedState,
  adviceToastPrevRead: state.adviceToastPrevReadState,
})

const mapDispatchToProps = dispatch => ({
  setAdviceToastDismissed: (adviceToastDismissed) => dispatch(setAdviceToastDismissed(adviceToastDismissed)),
  setAdviceToastPrevRead: (newPrevReadToasts) => dispatch(setAdviceToastPrevRead(newPrevReadToasts))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
(AdviceToast);
