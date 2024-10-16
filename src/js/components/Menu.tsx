import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonAlert, isPlatform, IonGrid, IonRippleEffect, IonButton } from '@ionic/react';
import { peopleOutline, settingsOutline, settingsSharp, moon, sunny, gameControllerOutline, libraryOutline, librarySharp, calculatorOutline, calculatorSharp, searchOutline, searchSharp, statsChartOutline, statsChartSharp, barbellOutline, barbellSharp, colorPaletteOutline, colorPaletteSharp, menuSharp, logoPaypal, phonePortraitOutline, phonePortraitSharp, cafe } from 'ionicons/icons';

import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import '../../style/components/Menu.scss';
import { setModalVisibility, setModeName, setActiveGame, setThemeBrightness } from '../actions'
import CharacterSelectModal from './CharacterSelect';
import WhatsNewModal from './WhatsNew'
import HelpModal from './Help';
import framesIcon from  '../../images/icons/frames.svg';
import patreonIcon from '../../images/icons/patreon.svg';
import movesListIcon from '../../images/icons/moveslist.svg';
import { APP_CURRENT_VERSION_NAME } from '../constants/VersionLogs';
import { activeGameSelector, modeNameSelector, selectedCharactersSelector, appDisplaySettingsSelector } from '../selectors';
import { GAME_NAMES } from '../constants/ImmutableGameDetails';
import MenuEntry from './MenuEntry';
import BrightnessToggle from './BrightnessToggle';

const Menu = () => {

  const themeBrightness = useSelector(appDisplaySettingsSelector).themeBrightness;
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const modeName = useSelector(modeNameSelector);
  const activeGame = useSelector(activeGameSelector);

  const dispatch = useDispatch();
  const history = useHistory();
  
  const [activeGameAlertOpen, setActiveGameAlertOpen] = useState(false);
  const [isWideFullMenuOpen, setIsWideFullMenuOpen] = useState(false) 
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname.includes("calculators") && location.pathname.split("/").length > 2) {
      dispatch(setModeName(`calc-${location.pathname.split("/")[2]}`));
    } else if (location.pathname.includes("movedetail")) {
      dispatch(setModeName("movedetail"));
    } else if (
      location.pathname.includes("stats")
      || (location.pathname.includes("settings") && location.pathname.split("/").length > 2)
      || (location.pathname.includes("moreresources") && location.pathname.split("/").length > 2)
      || (location.pathname.includes("themestore") && location.pathname.split("/").length > 2)
    ) {
      dispatch(setModeName("subpage"));
    } else {
      dispatch(setModeName(location.pathname.split("/")[1]));
    }
  },[location.pathname, dispatch]);

  //account for the fact this will be imported some day
  //perhaps do a check in the div creation and concat the selected character in
  const appPages = [
    {
      title: 'Frame Data',
      url: `/framedata/${activeGame}/${selectedCharacters.playerOne.name}`,
      iosIcon: framesIcon,
      mdIcon: framesIcon,
      modeName: "framedata"
    },
    {
      title: 'Quick Search',
      url: `/quicksearch`,
      iosIcon: searchOutline,
      mdIcon: searchSharp,
      modeName: "quicksearch"
    },
    {
      title: 'Moves List',
      url: `/moveslist/${activeGame}/${selectedCharacters.playerOne.name}`,
      iosIcon: movesListIcon,
      mdIcon: movesListIcon,
      modeName: "moveslist"
    },
    {
      title: 'Combos & Tech',
      url: `/combos/${activeGame}/${selectedCharacters.playerOne.name}`,
      iosIcon: barbellOutline,
      mdIcon: barbellSharp,
      modeName: "combos",
      noDisplay: ["3S", "USF4", "GGST", "SF6"]
    },
    {
      title: 'Stat Compare',
      url: `/statcompare`,
      iosIcon: statsChartOutline,
      mdIcon: statsChartSharp,
      modeName: "statcompare"
    },
    {
      title: 'Calculators',
      url: `/calculators`,
      iosIcon: calculatorOutline,
      mdIcon: calculatorSharp,
      modeName: "calculators"
    },
    {
      title: 'More Resources',
      url: `/moreresources`,
      iosIcon: libraryOutline,
      mdIcon: librarySharp,
      modeName: "moreresources"
    },
    {
      title: 'Settings',
      url: '/settings',
      iosIcon: settingsOutline,
      mdIcon: settingsSharp,
      modeName: "settings"
    },
    {
      title: 'Theme Store',
      url: '/themestore',
      iosIcon: colorPaletteOutline,
      mdIcon: colorPaletteSharp,
      modeName: "themestore",
      appOnly: true,
    },
    {
      title: 'Get the app!',
      url: '#',
      externalUrl: "https://fullmeter.com/fat",
      iosIcon: phonePortraitOutline,
      mdIcon: phonePortraitSharp,
      modeName: "app",
      desktopOnly: true,
    },
    {
      title: 'Support on Ko-Fi',
      url: '#',
      externalUrl: "https://ko-fi.com/fullmeter",
      iosIcon: cafe,
      mdIcon: cafe,
      modeName: null,
      desktopOnly: true,
    },
    {
      title: 'Support on Patreon',
      externalUrl: "https://www.patreon.com/d4rk_onion",
      url: '#',
      iosIcon: patreonIcon,
      mdIcon: patreonIcon,
      modeName: null,
      desktopOnly: true,
    },
    {
      title: 'Support on Paypal',
      url: '#',
      externalUrl: "https://paypal.me/fullmeter",
      iosIcon: logoPaypal,
      mdIcon: logoPaypal,
      modeName: null,
      desktopOnly: true,
    },
    
  ];

  const MENU_ENTRIES = [
    "characterselect",
    "framedata",
    "quicksearch",
    "moveslist",
    "combos",
    "statcompare",
    "calculators",
    "moreresources",
    "settings",
    "themestore",
    "appAd",
    "kofi",
    "patreon",
    "paypal",
  ]

  // populate the menu game switcher array
  const gameOptions = []
  GAME_NAMES.forEach(gameName => {
    gameOptions.push({
      name: gameName,
      type: 'radio',
      label: gameName,
      value: gameName,
      checked: activeGame === gameName
    })
  })
  

  return (
    <IonMenu
      id="sideMenu"
      menuId="sideMenu"
      contentId="main"
      type="overlay"
      className={isWideFullMenuOpen ? "wide-full-menu" : "wide-partial-menu"}
    >
      <IonContent>

        {/* MOBILE SIDE MENU */}
        <div id="mobileSideMenu">
          <div id="menuHeader">
            <div id="themeButton" onClick={ () => themeBrightness === "light" ? dispatch(setThemeBrightness("dark")) : dispatch(setThemeBrightness("light")) }>
              <IonIcon icon={themeBrightness === "dark" ? sunny : moon} />
            </div>
            <div id="appDetails">
              <h2>FAT - <span onClick={() => modeName !== "movedetail" && setActiveGameAlertOpen(true)}>{activeGame}</span></h2>
              <p>Ver {APP_CURRENT_VERSION_NAME}</p>
            </div>
          </div>
          <IonList id="pageList">
            <IonMenuToggle autoHide={false}>
              <IonItem disabled={modeName === "movedetail"} key="mobile-gameSelectItem" onClick={() => modeName !== "movedetail" && setActiveGameAlertOpen(true)}  lines="none" detail={false} button>
                <IonIcon slot="start" icon={gameControllerOutline} />
                <IonLabel>Game Select</IonLabel>
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle autoHide={false}>
              <IonItem disabled={modeName === "movedetail"} key="mobile-charSelectItem" onClick={() => dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true }))}  lines="none" detail={false} button>
                <IonIcon slot="start" icon={peopleOutline} />
                <IonLabel>Character Select</IonLabel>
              </IonItem>
            </IonMenuToggle>
            <hr style={{backgroundColor: "var(--fat-settings-item-border)"}} />
            {appPages.map((appPage) => {
              if (!isPlatform("capacitor") && appPage.appOnly) {
                return false;
              } else if (isPlatform("capacitor") && appPage.desktopOnly) {
                return false;
              } else if (appPage.noDisplay && appPage.noDisplay.includes(activeGame)) {
                return false;
              } else {
                return (
                  <IonMenuToggle key={`mobile-${appPage.title}`} autoHide={false}>
                    <IonItem className={modeName === appPage.modeName ? "selected" : null} routerLink={appPage.url} routerDirection="root" lines="none" detail={false} button>
                      <IonIcon slot="start" icon={appPage.iosIcon} />
                      <IonLabel>{appPage.title}</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
                )
              }
            })}
          </IonList>
        </div>

        {/* WIDE SIDE MENU */}
        <div id="widescreenMenu">
          <IonGrid>

            <div className={`widescreen-menu-header widescreen-menu-entry ${!isWideFullMenuOpen && "menu-collapsed"} ${modeName === "movedetail" && "disabled"}`}>
              <IonButton onClick={() => setIsWideFullMenuOpen(!isWideFullMenuOpen)}>
                <IonIcon icon={menuSharp} slot='icon-only' />
              </IonButton>
              {isWideFullMenuOpen &&
                <>
                  <span>FAT {APP_CURRENT_VERSION_NAME} </span>
                  <BrightnessToggle></BrightnessToggle>
                </>
                }
              
            </div>

            <div className={`widescreen-menu-entry ion-activatable ${!isWideFullMenuOpen && "menu-collapsed"} ${modeName === "movedetail" && "disabled"}`} onClick={() => modeName !== "movedetail" && setActiveGameAlertOpen(true)}>
              <IonIcon aria-label="Game select" icon={gameControllerOutline} className={isWideFullMenuOpen ? "dimmed-color" : null} />
              {isWideFullMenuOpen && <span>Game Select</span>}
              <IonRippleEffect/>
            </div>


          {MENU_ENTRIES.map((menuEntryKey) => {
             
            return (
              <MenuEntry
                key={menuEntryKey}
                menuEntryKey={menuEntryKey}
                wideMenuIsOpen={isWideFullMenuOpen}
              />
            )
          })}
            
          </IonGrid>
        </div>
        

        <CharacterSelectModal />
        <HelpModal />
        <WhatsNewModal />
        <IonAlert
          isOpen={activeGameAlertOpen}
          onDidDismiss={() => setActiveGameAlertOpen(false)}
          header={'Select Game'}
          inputs={gameOptions}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary'
            },
            {
              text: 'Select',
              handler: selectedGame => {
                dispatch(setActiveGame(selectedGame, true));
                if (modeName === "framedata" || modeName === "moveslist" || modeName === "combos") {
                  history.replace(`/${modeName}/${selectedGame}/${selectedCharacters["playerOne"].name}`) //TODO: check if character exists in the new game and if not, select character[0] from the array
                }
              }
            }
          ]}
        />
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
