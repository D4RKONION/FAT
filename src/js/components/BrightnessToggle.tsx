import { IonToggle } from "@ionic/react";
import { useSelector, useDispatch } from "react-redux";

import styles from "../../style/components/BrightnessToggle.module.scss";
import { setThemeBrightness } from "../actions";
import { appDisplaySettingsSelector } from "../selectors";

const BrightnessToggle = () => {
  const dispatch = useDispatch();
  const themeBrightness = useSelector(appDisplaySettingsSelector).themeBrightness;

  return (
    <IonToggle
      aria-label={`Switch to ${themeBrightness === "light" ? "dark" : "light"} mode`}
      mode="md"
      className={`${styles.brightnessToggle} widescreenMode`}
      checked={themeBrightness === "light" ? false : true}
      onIonChange={e => {dispatch(setThemeBrightness(e.detail.checked ? "dark" : "light"));}}
      slot="end"
    />
  );
};

export default BrightnessToggle;