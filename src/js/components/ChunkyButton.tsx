import { IonRippleEffect } from "@ionic/react";
import "../../style/components/ChunkyButton.scss";

type Props = {
  extraText?: string,
  onClick: () => void,
  children: string | string[],
};

const ChunkyButton = ({extraText, onClick, children}: Props) => {
  return (
    <div className={`chunky-button ion-activatable ${extraText ? "two-line" : "one-line"}`} onClick={() => onClick()}>
      <h1>{children}</h1>
      {extraText && <h5>{extraText}</h5>}
      <IonRippleEffect></IonRippleEffect>
    </div>
  );
};

export default ChunkyButton;