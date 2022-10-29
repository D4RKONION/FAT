import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonAlert, isPlatform, IonButton, IonGrid, IonRow, IonCol } from '@ionic/react';
import { peopleOutline, settingsOutline, settingsSharp, moon, sunny, gameControllerOutline, gameControllerSharp, libraryOutline, librarySharp, calculatorOutline, calculatorSharp, caretDownOutline, searchOutline, searchSharp, statsChartOutline, statsChartSharp, barbellOutline, barbellSharp, colorPaletteOutline, colorPaletteSharp, menuSharp, logoPaypal, phonePortraitOutline, phonePortraitSharp } from 'ionicons/icons';

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import '../../style/components/Menu.scss';
import { setModalVisibility, setModeName, setActiveGame, setThemeBrightness } from '../actions'
import CharacterSelectModal from './CharacterSelect';
import WhatsNewModal from './WhatsNew'
import HelpModal from './Help';
import framesIcon from  '../../images/icons/frames.svg';
import patreonIcon from '../../images/icons/patreon.svg';
import { APP_CURRENT_VERSION_NAME } from '../constants/VersionLogs';
import { activeGameSelector, modeNameSelector, selectedCharactersSelector, themeBrightnessSelector } from '../selectors';

const Menu = () => {

  const themeBrightness = useSelector(themeBrightnessSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const modeName = useSelector(modeNameSelector);
  const activeGame = useSelector(activeGameSelector);

  const dispatch = useDispatch();
  
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
      title: 'Yaksha Search',
      url: `/yaksha`,
      iosIcon: searchOutline,
      mdIcon: searchSharp,
      modeName: "yaksha"
    },
    {
      title: 'Moves List',
      url: `/moveslist/${activeGame}/${selectedCharacters.playerOne.name}`,
      iosIcon: gameControllerOutline,
      mdIcon: gameControllerSharp,
      modeName: "moveslist"
    },
    {
      title: 'Combos & Tech',
      url: `/combos/${activeGame}/${selectedCharacters.playerOne.name}`,
      iosIcon: barbellOutline,
      mdIcon: barbellSharp,
      modeName: "combos"
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
  

  return (
    <IonMenu
      id="sideMenu"
      menuId="sideMenu"
      contentId="main"
      type="overlay"
      className={isWideFullMenuOpen ? "wide-full-menu" : "wide-partial-menu"}
    >
      <IonContent>
        <div id="mobileSideMenu">
          <div id="menuHeader">
            <div id="themeButton" onClick={ () => themeBrightness === "light" ? dispatch(setThemeBrightness("dark")) : dispatch(setThemeBrightness("light")) }>
              <IonIcon icon={themeBrightness === "dark" ? sunny : moon} />
            </div>
            <div id="appDetails">
              <h2>FAT - <span onClick={() => modeName !== "movedetail" && setActiveGameAlertOpen(true)}>{activeGame} <IonIcon icon={caretDownOutline} /></span></h2>
              <p>Ver {APP_CURRENT_VERSION_NAME}</p>
            </div>
          </div>
          <IonList id="pageList">
            <IonMenuToggle autoHide={false}>
              <IonItem disabled={modeName === "movedetail"} key="mobile-charSelectItem" onClick={() => dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true })) }  lines="none" detail={false} button>
                <IonIcon slot="start" icon={peopleOutline} />
                <IonLabel>Character Select</IonLabel>
              </IonItem>
            </IonMenuToggle>
            {appPages.map((appPage) => {
              if (!isPlatform("capacitor") && appPage.appOnly) {
                return false;
              } else if (isPlatform("capacitor") && appPage.desktopOnly) {
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

        <div id="widescreenMenu">
          <IonGrid>
            <IonRow id="showMenuButtonContainer">
              <IonCol size={isWideFullMenuOpen ? "2" : "12"}>
                <IonButton key="wide-full-menu-open-item" onClick={() => setIsWideFullMenuOpen(isWideFullMenuOpen ? false : true)}>
                  <IonIcon aria-label="menu" slot="icon-only" icon={menuSharp} />
                </IonButton>
              </IonCol>
              {isWideFullMenuOpen &&
                <IonCol>
                  <p>FAT {APP_CURRENT_VERSION_NAME} - <span onClick={() => modeName !== "movedetail" && setActiveGameAlertOpen(true)}>{activeGame} <IonIcon icon={caretDownOutline} /></span> </p>
                </IonCol>
              }
            </IonRow>

            <IonRow className="menu-entry">
              <IonCol size={isWideFullMenuOpen ? "2" : "12"}>
                <IonButton className={isWideFullMenuOpen ? "dimmed-color" : null} fill="clear" disabled={modeName === "movedetail"} key="wide-charSelectItem" onClick={() => dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true })) } >
                  <IonIcon aria-label="Character Select" slot="icon-only" icon={peopleOutline} />
                </IonButton>
              </IonCol>
              {isWideFullMenuOpen &&
                <IonCol>
                  <IonItem disabled={modeName === "movedetail"} onClick={() => dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true })) } lines="none" button detail={false}>Character Select</IonItem>
                </IonCol>
              }
            </IonRow>
            
            {appPages.map((appPage) => {
              if (!isPlatform("capacitor") && appPage.appOnly) {
                return false;
              } else if (isPlatform("capacitor") && appPage.desktopOnly) {
                return false;
              } else {
                return (
                  <IonRow onClick={() => appPage.externalUrl ? window.open(appPage.externalUrl, '_blank') : false} key={`wide-${appPage.title}`} className={`${appPage.modeName === "settings" && !isPlatform("capacitor") ? "lines-bottom" : null} menu-entry`}>
                    <IonCol size={isWideFullMenuOpen ? "2" : "12"}>
                      <IonButton
                        fill="clear" className={`${modeName === appPage.modeName ? "selected" : null} ${isWideFullMenuOpen ? "dimmed-color" : null}`}
                        routerLink={appPage.url} routerDirection="root"
                      >
                        <IonIcon aria-label={appPage.title} slot="icon-only" icon={appPage.iosIcon} />
                      </IonButton>
                    </IonCol>
                    {isWideFullMenuOpen &&
                      <IonCol>
                        <IonItem routerLink={appPage.url} routerDirection="root" lines="none" detail={false}>{appPage.title}</IonItem>
                      </IonCol>
                    }
                  </IonRow>
                )
              }
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
          inputs={[
            {
              name: '3S',
              type: 'radio',
              label: '3S',
              value: '3S',
              checked: activeGame === "3S"
            },
            {
              name: 'USF4',
              type: 'radio',
              label: 'USF4',
              value: 'USF4',
              checked: activeGame === "USF4"
            },
            {
              name: 'SFV',
              type: 'radio',
              label: 'SFV',
              value: 'SFV',
              checked: activeGame === "SFV"
            },
            {
              name: 'SF6',
              type: 'radio',
              label: 'SF6',
              value: 'SF6',
              checked: activeGame === "SF6"
            },
            {
              name: 'GGST',
              type: 'radio',
              label: 'GGST',
              value: 'GGST',
              checked: activeGame === "GGST"
            },
          ]}
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
              }
            }
          ]}
        />
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
