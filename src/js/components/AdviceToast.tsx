import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IonToast } from "@ionic/react";
import ADVICE from '../constants/Advice';
import styles from '../../style/components/AdviceToast.module.scss'
import { setAdviceToastDismissed, setAdviceToastPrevRead } from '../actions'
import { settingsOutline, star, thumbsUpOutline } from 'ionicons/icons';
import { useHistory } from 'react-router'; 
import { adviceToastDismissedSelector, adviceToastPrevReadSelector, adviceToastShownSelector, modeNameSelector } from '../selectors';

type ToastData = {
  message: string;
  /** The imported icon from Ionicons */
  icon?: any;
  handler?: (arg?) => void;
} 

const AdviceToast = () => {
  
  const modeName = useSelector(modeNameSelector);
  const adviceToastShown = useSelector(adviceToastShownSelector);
  const adviceToastDismissed = useSelector(adviceToastDismissedSelector);
  const adviceToastPrevRead = useSelector(adviceToastPrevReadSelector);

  const dispatch = useDispatch();

  const history = useHistory();
  const toastRef = useRef<HTMLIonToastElement>();

  const icons = { settingsOutline, star, thumbsUpOutline };
  const getIcon = (iconName: ToastData["icon"]) => {
    return icons[iconName];
  }

  if (toastRef.current) {
    toastRef.current.dismiss();
    return null;
  } else if (!ADVICE[modeName] || !adviceToastShown || adviceToastDismissed ) {
    return null;
  } else if (Math.floor(Math.random() * 10) < 7) {
    return null;
  }
  

  
  const toastData = {} as ToastData;

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
      return null;
    }
  }	
  
  return(
    <IonToast
      ref={toastRef}
      cssClass={styles.adviceToast}
      isOpen={true}
      onWillDismiss={() => {
        dispatch(setAdviceToastDismissed(true));
        if (typeof adviceToastPrevRead[modeName] !== "undefined" ) {
          dispatch(setAdviceToastPrevRead({ ...adviceToastPrevRead, [modeName]: adviceToastPrevRead[modeName] + 1 }))
        } else {
          dispatch(setAdviceToastPrevRead({ ...adviceToastPrevRead, [modeName]: 0 }))
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
            handler: () => {dispatch(setAdviceToastDismissed(true)); toastData.handler(history);}
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

export default AdviceToast;
