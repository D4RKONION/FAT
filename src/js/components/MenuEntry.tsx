import { IonIcon, IonRippleEffect, isPlatform, useIonRouter } from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import { activeGameSelector, modeNameSelector, selectedCharactersSelector } from "../selectors";

import { peopleOutline, settingsOutline, settingsSharp, libraryOutline, librarySharp, calculatorOutline, calculatorSharp, searchOutline, searchSharp, statsChartOutline, statsChartSharp, barbellOutline, barbellSharp, logoPaypal, phonePortraitOutline, phonePortraitSharp, cafe, diamondOutline, diamondSharp, bookmarksOutline } from 'ionicons/icons';
import framesIcon from  '../../images/icons/frames.svg';
import patreonIcon from '../../images/icons/patreon.svg';
import movesListIcon from '../../images/icons/moveslist.svg';
import { setModalVisibility } from "../actions";
import { AppModal } from "../types";

type Props = {
  menuEntryKey: string;
  wideMenuIsOpen: boolean;
}



const MenuEntry = ({menuEntryKey, wideMenuIsOpen}: Props) => {

const currentMode = useSelector(modeNameSelector);
const router = useIonRouter();
const activeGame = useSelector(activeGameSelector);
const selectedCharacters = useSelector(selectedCharactersSelector);
const dispatch = useDispatch();


const menuEntryDetails = {
  // gameselect: {
  //   title: 'Game Select',
  //   type: "modalOpener",
  //   url: `/framedata/${activeGame}/${selectedCharacters.playerOne.name}`,
  //   iosIcon: gameControllerOutline,
  //   mdIcon: gameControllerOutline,
  //   modeName: "gameselect",
  // },
  characterselect: {
    title: 'Character Select',
    type: "modalOpener",
    url: `/framedata/${activeGame}/${selectedCharacters.playerOne.name}`,
    iosIcon: peopleOutline,
    mdIcon: peopleOutline,
    modeName: "characterselect",
  },
  bookmarks: {
    title: 'Bookmarks',
    type: "modalOpener",
    url: `/framedata/${activeGame}/${selectedCharacters.playerOne.name}`,
    iosIcon: bookmarksOutline,
    mdIcon: bookmarksOutline,
    modeName: "bookmarks",
  },
  framedata: {
    title: 'Frame Data',
    type: "internalURL",
    url: `/framedata/${activeGame}/${selectedCharacters.playerOne.name}`,
    iosIcon: framesIcon,
    mdIcon: framesIcon,
    modeName: "framedata",
  },
  quicksearch: {
    title: 'Quick Search',
    type: "internalURL",
    url: `/quicksearch`,
    iosIcon: searchOutline,
    mdIcon: searchSharp,
    modeName: "quicksearch"
  },
  moveslist: {
    title: 'Moves List',
    type: "internalURL",
    url: `/moveslist/${activeGame}/${selectedCharacters.playerOne.name}`,
    iosIcon: movesListIcon,
    mdIcon: movesListIcon,
    modeName: "moveslist"
  },
  combos: {
    title: 'Combos & Tech',
    type: "internalURL",
    url: `/combos/${activeGame}/${selectedCharacters.playerOne.name}`,
    iosIcon: barbellOutline,
    mdIcon: barbellSharp,
    modeName: "combos",
    noDisplay: ["3S", "USF4", "GGST", "SF6"]
  },
  statcompare: {
    title: 'Stat Compare',
    type: "internalURL",
    url: `/statcompare`,
    iosIcon: statsChartOutline,
    mdIcon: statsChartSharp,
    modeName: "statcompare"
  },
  calculators: {
    title: 'Calculators',
    type: "internalURL",
    url: `/calculators`,
    iosIcon: calculatorOutline,
    mdIcon: calculatorSharp,
    modeName: "calculators"
  },
  moreresources: {
    title: 'More Resources',
    type: "internalURL",
    url: `/moreresources`,
    iosIcon: libraryOutline,
    mdIcon: librarySharp,
    modeName: "moreresources"
  },
  settings: {
    title: 'Settings',
    type: "internalURL",
    url: '/settings',
    iosIcon: settingsOutline,
    mdIcon: settingsSharp,
    modeName: "settings"
  },
  premium: {
    title: 'Premium',
    type: "internalURL",
    url: '/premium',
    iosIcon: diamondOutline,
    mdIcon: diamondSharp,
    modeName: "premium",
    appOnly: true,
  },
  appAd: {
    title: 'Get the app!',
    type: "externalURL",
    url: '#',
    externalUrl: "https://fullmeter.com/fat",
    iosIcon: phonePortraitOutline,
    mdIcon: phonePortraitSharp,
    modeName: "app",
    desktopOnly: true,
  },
  kofi: {
    title: 'Support on Ko-Fi',
    type: "externalURL",
    url: '#',
    externalUrl: "https://ko-fi.com/fullmeter",
    iosIcon: cafe,
    mdIcon: cafe,
    modeName: null,
    desktopOnly: true,
  },
  patreon: {
    title: 'Support on Patreon',
    type: "externalURL",
    externalUrl: "https://www.patreon.com/d4rk_onion",
    url: '#',
    iosIcon: patreonIcon,
    mdIcon: patreonIcon,
    modeName: null,
    desktopOnly: true,
  },
  paypal: {
    title: 'Support on Paypal',
    type: "externalURL",
    url: '#',
    externalUrl: "https://paypal.me/fullmeter",
    iosIcon: logoPaypal,
    mdIcon: logoPaypal,
    modeName: null,
    desktopOnly: true,
  },
  
}

const onClickHandler = (menuEntryType) => {
  if (menuEntryType === "internalURL") {
    router.push(menuEntryDetails[menuEntryKey].url, 'root')

  } else if (menuEntryType === "externalURL") {
    window.open(menuEntryDetails[menuEntryKey].externalUrl, '_blank')

  } else if (menuEntryType === "modalOpener") {
    if ((menuEntryKey === "characterselect" || menuEntryKey === "bookmarks") && currentMode !== "movedetail") {
      dispatch(setModalVisibility({ currentModal: menuEntryKey as AppModal, visible: true }))
    }

  } else {
    console.log("Something's wrong in the menus!")
  }
}

  if (
    (!isPlatform("capacitor") && menuEntryDetails[menuEntryKey].appOnly)
    || (isPlatform("capacitor") && menuEntryDetails[menuEntryKey].desktopOnly)
    || (menuEntryDetails[menuEntryKey].noDisplay && menuEntryDetails[menuEntryKey].noDisplay.includes(activeGame))
  ) {
    return null;
  } else {
    return (
    <div>
      <div
        className={`
          widescreen-menu-entry
          ion-activatable
          ${(currentMode === "movedetail" && (menuEntryKey === "characterselect" || menuEntryKey === "gameselect")) ? "disabled" : ""}
          ${menuEntryDetails[menuEntryKey].modeName === currentMode || (currentMode === "movedetail" && menuEntryDetails[menuEntryKey].modeName === window.location.hash.split("/")[1]) ? "active-mode" : ""}
          ${!wideMenuIsOpen && "menu-collapsed"}
        `}
        
        onClick={() => onClickHandler(menuEntryDetails[menuEntryKey].type)} key={`wide-${menuEntryDetails[menuEntryKey].title}`}
      >
        <IonIcon aria-label={menuEntryDetails[menuEntryKey].title} icon={menuEntryDetails[menuEntryKey].iosIcon} className={!wideMenuIsOpen || (menuEntryDetails[menuEntryKey].modeName === currentMode || (currentMode === "movedetail" && menuEntryDetails[menuEntryKey].modeName === window.location.hash.split("/")[1])) ? "" : "dimmed-color"} />
        {wideMenuIsOpen && <span>{menuEntryDetails[menuEntryKey].title}</span>}
        <IonRippleEffect/>
      </div>
      {((!isPlatform("capacitor") && menuEntryDetails[menuEntryKey].modeName === "settings") || menuEntryDetails[menuEntryKey].modeName === "bookmarks") && <hr />}
    </div>
    )
  }
}

export default MenuEntry;