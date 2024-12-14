
import "../../style/components/AdviceToast.scss";
import { IonToast } from "@ionic/react";
import { settingsOutline, star, thumbsUpOutline } from "ionicons/icons";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { setAdviceToastShown, setAdviceToastPrevRead } from "../actions";
import ADVICE from "../constants/Advice";
import { adviceToastSelector, modeNameSelector } from "../selectors";

type ToastData = {
  message: string;
  /** The imported icon from Ionicons */
  icon?: any;
  handler?: (arg?) => void;
}; 

const AdviceToast = () => {
  const modeName = useSelector(modeNameSelector);
  const adviceToastsOn = useSelector(adviceToastSelector).adviceToastsOn;
  const adviceToastShown = useSelector(adviceToastSelector).adviceToastShown;
  const adviceToastPrevRead = useSelector(adviceToastSelector).listOfPrevReadToasts;

  const dispatch = useDispatch();

  const history = useHistory();
  const toastRef = useRef<HTMLIonToastElement>(null);

  const icons = { settingsOutline, star, thumbsUpOutline };
  const getIcon = (iconName: ToastData["icon"]) => {
    return icons[iconName];
  };

  if (!ADVICE[modeName] || !adviceToastsOn || adviceToastShown ) {
    return null;
  } else if (Math.floor(Math.random() * 10) < 7) {
    // return null;
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

  dispatch(setAdviceToastShown(true));
  
  return (
    <IonToast
      className="adviceToast"
      ref={toastRef}
      isOpen={true}
      duration={250000}
      onWillDismiss={() => {
        if (typeof adviceToastPrevRead[modeName] !== "undefined" ) {
          dispatch(setAdviceToastPrevRead({ ...adviceToastPrevRead, [modeName]: adviceToastPrevRead[modeName] + 1 }));
        } else {
          dispatch(setAdviceToastPrevRead({ ...adviceToastPrevRead, [modeName]: 0 }));
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
            text: "",
            handler: () => toastData.handler(history),
          },
        ] : [
          {
            side: "end",
            icon: thumbsUpOutline,
            text: "",
            role: "cancel",
          },
        ]
      }
    />
  );
};

export default AdviceToast;
