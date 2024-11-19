import { isPlatform } from "@ionic/core";
import { useDispatch, useSelector } from "react-redux";
import { setModalVisibility, setThemeColor } from "../actions";
import { ThemeColor } from "../types";
import { IonIcon } from "@ionic/react";
import { diamondSharp } from "ionicons/icons";
import { appDisplaySettingsSelector, modalVisibilitySelector, premiumSelector } from "../selectors";
import '../../style/components/ThemeSwitcher.scss';
import { useHistory } from "react-router";

type Props = {
  premiumPreview?: boolean;
}

const ThemeSwitcher = ({premiumPreview}: Props) => {

  let history = useHistory();
  const dispatch = useDispatch();
  const themeColor = useSelector(appDisplaySettingsSelector).themeColor;
  const premiumIsPurchased = useSelector(premiumSelector).lifetimePremiumPurchased;
  const modalVisibility = useSelector(modalVisibilitySelector);

  const THEMES: Record<ThemeColor, string> = {
    "classic": "#3498db",
    "purple": "#4f3bac",
    "red": "#E0181F",
    "green": "#12801D",
    "pink": "#c435ac",
  }

  if (premiumPreview || isPlatform("capacitor") || true) {
    return(
      <div id="ThemeSwitcher" className={premiumPreview && "no-lines"}>
        {Object.keys(THEMES).map(themeName => 
          <span
            key={`color-option-${themeName}`}
            onClick={() => {
              if (premiumIsPurchased) {
                dispatch(setThemeColor(themeName as ThemeColor))
              } else if (!premiumPreview) {
                modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "tableSettings", visible: false }))
                history.push("/settings/premium")
              }
            }}
            style={{backgroundColor: THEMES[themeName]}}
            className={`color-option ${themeName === themeColor && !premiumPreview && "selected"}`}>
            {((!premiumIsPurchased || premiumPreview) && themeName !== "classic") && <IonIcon icon={diamondSharp} size='large'></IonIcon>}
          </span>
        )}
      </div>
    )
  } else {
    return null
  }
  
}

export default ThemeSwitcher;