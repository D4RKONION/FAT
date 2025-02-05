import "../../style/components/ThemeSwitcher.scss";

import { Capacitor } from "@capacitor/core";
import { IonIcon } from "@ionic/react";
import { diamondSharp } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { setModalVisibility, setThemeAccessibility, setThemeColor } from "../actions";
import { appDisplaySettingsSelector, modalVisibilitySelector, premiumSelector } from "../selectors";
import { ThemeColor } from "../types";

type Props = {
  premiumPreview?: boolean;
  lines: boolean;
};

const ThemeSwitcher = ({premiumPreview, lines}: Props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const themeColor = useSelector(appDisplaySettingsSelector).themeColor;
  const premiumIsPurchased = useSelector(premiumSelector).lifetimePremiumPurchased;
  const modalVisibility = useSelector(modalVisibilitySelector);
  const colourBlindModeActive = useSelector(appDisplaySettingsSelector).themeAccessibility === "colorBlind";

  const THEMES: Record<ThemeColor, string> = {
    classic: "#3498db",
    purple: "#573bac",
    red: "#e73c3c",
    green: "#27ae60",
    pink: "#D83F87",
  };

  if (premiumPreview || Capacitor.isNativePlatform()) {
    return (
      <div id="ThemeSwitcher" className={!lines ? "no-lines" : null}>
        {Object.keys(THEMES).map(themeName =>
          <span
            key={`color-option-${themeName}`}
            onClick={() => {
              if (premiumIsPurchased) {
                dispatch(setThemeColor(themeName as ThemeColor));
                if (colourBlindModeActive && themeName !== "classic") {
                  dispatch(setThemeAccessibility("none"));
                }
              } else if (!premiumPreview) {
                modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "tableSettings", visible: false }));
                history.push("/settings/premium");
              }
            }}
            style={{backgroundColor: THEMES[themeName]}}
            className={`color-option ${themeName === themeColor && !premiumPreview && "selected"}`}>
            {((!premiumIsPurchased || premiumPreview) && themeName !== "classic") && <IonIcon icon={diamondSharp} size="large"></IonIcon>}
          </span>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default ThemeSwitcher;