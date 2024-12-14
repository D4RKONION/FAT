import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonAlert, isPlatform, IonGrid, IonRippleEffect, IonButton, IonPopover } from "@ionic/react";
import { peopleOutline, settingsOutline, settingsSharp, moon, sunny, gameControllerOutline, libraryOutline, librarySharp, calculatorOutline, calculatorSharp, searchOutline, searchSharp, statsChartOutline, statsChartSharp, barbellOutline, barbellSharp, menuSharp, logoPaypal, phonePortraitOutline, phonePortraitSharp, cafe, diamondOutline, diamondSharp, bookmarksSharp } from "ionicons/icons";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import "../../style/components/Menu.scss";
import { setModalVisibility, setModeName, setActiveGame, setThemeBrightness } from "../actions";
import BookmarksModal from "./BookmarksModal";
import BrightnessToggle from "./BrightnessToggle";
import CharacterSelectModal from "./CharacterSelect";
import HelpModal from "./Help";
import MenuEntry from "./MenuEntry";
import TableSettings from "./TableSettings";
import WhatsNewModal from "./WhatsNew";
import framesIcon from "../../images/icons/frames.svg";
import movesListIcon from "../../images/icons/moveslist.svg";
import patreonIcon from "../../images/icons/patreon.svg";
import { allCharacterLists } from "../constants/gamedetails/characterLists";
import { GAME_NAMES } from "../constants/ImmutableGameDetails";
import { APP_CURRENT_VERSION_NAME } from "../constants/VersionLogs";
import { activeGameSelector, modeNameSelector, selectedCharactersSelector, appDisplaySettingsSelector, activePlayerSelector, premiumSelector } from "../selectors";

const Menu = () => {
  const themeBrightness = useSelector(appDisplaySettingsSelector).themeBrightness;
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const modeName = useSelector(modeNameSelector);
  const activeGame = useSelector(activeGameSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const premiumIsPurchased = useSelector(premiumSelector).lifetimePremiumPurchased;

  const dispatch = useDispatch();
  const history = useHistory();
  const menuRef = useRef<HTMLIonMenuElement>(null);
  const [showGameNamePopover, setShowGameNamePopover] = useState(false);
  
  const [activeGameAlertOpen, setActiveGameAlertOpen] = useState(false);
  const [isWideFullMenuOpen, setIsWideFullMenuOpen] = useState(false);
  
  const location = useLocation();
  
  useEffect(() => {
    // const bookmarkableModes = ["framedata", "movedetail"]

    const modeNameSlug = location.pathname.split("/")[1];

    // const activeGameSlug = GAME_NAMES.includes(location.pathname.split("/")[2] as GameName) ? location.pathname.split("/")[2] as GameName : "SF6";
    // let characterSlug = location.pathname.split("/")[3]
    // let vtStateSlug;
    // let moveNameSlug;

    // if (modeNameSlug === "movedetail") {
    //   vtStateSlug = location.pathname.split("/")[4]
    //   moveNameSlug = location.pathname.split("/")[5]
    // }

    if (location.pathname.includes("calculators") && location.pathname.split("/").length > 2) {
      dispatch(setModeName(`calc-${location.pathname.split("/")[2]}`));
    } else if (
      location.pathname.includes("stats")
      || (location.pathname.includes("settings") && location.pathname.split("/").length > 2)
      || (location.pathname.includes("moreresources") && location.pathname.split("/").length > 2)
    ) {
      dispatch(setModeName("subpage"));
    } else {
      dispatch(setModeName(modeNameSlug));
    }

    // // Handles the URL changing via bookmarks etc.
    // if (activeGameSlug !== activeGame && bookmarkableModes.includes(modeNameSlug)) {
    //   dispatch(setActiveGame(activeGameSlug, true, selectedCharacters[activePlayer].name !== characterSlug && bookmarkableModes.includes(modeNameSlug) ? characterSlug : "unset"))
    // } else if (selectedCharacters[activePlayer].name !== characterSlug && bookmarkableModes.includes(modeNameSlug)) {
    //   dispatch(setPlayer(activePlayer, characterSlug));
    // }
  },[location.pathname, dispatch]);

  //account for the fact this will be imported some day
  //perhaps do a check in the div creation and concat the selected character in
  const appPages = [
    {
      title: "Frame Data",
      url: `/framedata/${activeGame}/${selectedCharacters.playerOne.name}`,
      iosIcon: framesIcon,
      mdIcon: framesIcon,
      modeName: "framedata",
    },
    {
      title: "Quick Search",
      url: "/quicksearch",
      iosIcon: searchOutline,
      mdIcon: searchSharp,
      modeName: "quicksearch",
    },
    {
      title: "Moves List",
      url: `/moveslist/${activeGame}/${selectedCharacters.playerOne.name}`,
      iosIcon: movesListIcon,
      mdIcon: movesListIcon,
      modeName: "moveslist",
    },
    {
      title: "Combos & Tech",
      url: `/combos/${activeGame}/${selectedCharacters.playerOne.name}`,
      iosIcon: barbellOutline,
      mdIcon: barbellSharp,
      modeName: "combos",
      noDisplay: ["3S", "USF4", "GGST", "SF6"],
    },
    {
      title: "Stat Compare",
      url: "/statcompare",
      iosIcon: statsChartOutline,
      mdIcon: statsChartSharp,
      modeName: "statcompare",
    },
    {
      title: "Calculators",
      url: "/calculators",
      iosIcon: calculatorOutline,
      mdIcon: calculatorSharp,
      modeName: "calculators",
    },
    {
      title: "More Resources",
      url: "/moreresources",
      iosIcon: libraryOutline,
      mdIcon: librarySharp,
      modeName: "moreresources",
    },
    {
      title: "Settings",
      url: "/settings",
      iosIcon: settingsOutline,
      mdIcon: settingsSharp,
      modeName: "settings",
    },
    {
      title: "Premium",
      url: "/premium",
      iosIcon: diamondOutline,
      mdIcon: diamondSharp,
      modeName: "premium",
      appOnly: true,
    },
    {
      title: "Get the app!",
      url: "#",
      externalUrl: "https://fullmeter.com",
      iosIcon: phonePortraitOutline,
      mdIcon: phonePortraitSharp,
      modeName: "app",
      desktopOnly: true,
    },
    {
      title: "Support on Ko-Fi",
      url: "#",
      externalUrl: "https://ko-fi.com/fullmeter",
      iosIcon: cafe,
      mdIcon: cafe,
      modeName: null,
      desktopOnly: true,
    },
    {
      title: "Support on Patreon",
      externalUrl: "https://www.patreon.com/d4rk_onion",
      url: "#",
      iosIcon: patreonIcon,
      mdIcon: patreonIcon,
      modeName: null,
      desktopOnly: true,
    },
    {
      title: "Support on Paypal",
      url: "#",
      externalUrl: "https://paypal.me/fullmeter",
      iosIcon: logoPaypal,
      mdIcon: logoPaypal,
      modeName: null,
      desktopOnly: true,
    },
    
  ];

  const MENU_ENTRIES = [
    "characterSelect",
    "bookmarks",
    "framedata",
    "quicksearch",
    "moveslist",
    "combos",
    "statcompare",
    "calculators",
    "moreresources",
    "settings",
    "premium",
    "appAd",
    "kofi",
    "patreon",
    "paypal",
  ];

  // populate the menu game switcher array
  const gameOptions = [];
  GAME_NAMES.forEach(gameName => {
    gameOptions.push({
      name: gameName,
      type: "radio",
      label: gameName,
      value: gameName,
      checked: activeGame === gameName,
    });
  });

  return (
    <IonMenu
      ref={menuRef}
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
            <div className="button-container">
              <div className="header-fab ion-activatable" onClick={ () => themeBrightness === "light" ? dispatch(setThemeBrightness("dark")) : dispatch(setThemeBrightness("light")) }>
                <IonIcon icon={themeBrightness === "dark" ? sunny : moon} />
                <IonRippleEffect></IonRippleEffect>
              </div>
              <div className="header-fab ion-activatable" onClick={() => {dispatch(setModalVisibility({ currentModal: "bookmarks", visible: true })); menuRef.current.close();}} >
                <IonIcon icon={bookmarksSharp} />
                <IonRippleEffect></IonRippleEffect>
              </div>
            </div>
            <div className="app-details">
              <h2>FAT {premiumIsPurchased && <span>Premium</span>}</h2>
              <p onClick={() => {history.push("/settings/versionlogs"); menuRef.current.close(); }}>Ver {APP_CURRENT_VERSION_NAME}</p>
            </div>
            <div className="quick-set-bar">
              <div id="quick-set-game" className="quick-set-section ion-activatable" onClick={() => setShowGameNamePopover(true)}>
                <IonIcon icon={gameControllerOutline} /> {activeGame}
                <IonPopover
                  className="quick-set-game"
                  isOpen={showGameNamePopover}
                  dismissOnSelect={true}
                  onDidDismiss={() => setShowGameNamePopover(false)} // Close popover when dismissed
                  trigger="quick-set-game"
                  showBackdrop={true}
                  alignment="center"
                >
                  <IonContent>
                    <IonList>
                      {GAME_NAMES.map(gameName => 
                        <IonItem
                          style={{"--background": activeGame === gameName && "var(--fat-primary-tint-step-800)"}}
                          key={`switcher-${gameName}-option`}
                          lines="none"
                          onClick={() => {
                            dispatch(setActiveGame(gameName, true));
                            if (modeName === "framedata" || modeName === "moveslist" || modeName === "combos") {
                              history.replace(`/${modeName}/${gameName}/${allCharacterLists[gameName].includes(selectedCharacters["playerOne"].name)? selectedCharacters["playerOne"].name : allCharacterLists[gameName][0]}`);
                            }}
                          }>
                          <IonLabel>{gameName}</IonLabel>
                        </IonItem>
                      )}
                    </IonList>
                  </IonContent>
                </IonPopover>
                <IonRippleEffect></IonRippleEffect>
              </div>
              <div className="quick-set-section ion-activatable" onClick={() => {modeName !== "movedetail" && dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true })); menuRef.current.close();}}>
                <IonIcon icon={peopleOutline} />{selectedCharacters[activePlayer].name}
                <IonRippleEffect></IonRippleEffect>
              </div>
            </div>
          </div>
          <IonList id="pageList">
            {appPages.map((appPage) => {
              if (!isPlatform("capacitor") && appPage.appOnly) {
                return false;
              } else if (isPlatform("capacitor") && appPage.desktopOnly) {
                return false;
              } else if (appPage.noDisplay && appPage.noDisplay.includes(activeGame)) {
                return false;
              } else {
                return (
                  <Fragment key={`mobile-${appPage.title}`}>
                    <IonMenuToggle autoHide={false}>
                      <IonItem className={modeName === appPage.modeName ? "selected" : null} routerLink={appPage.url} routerDirection="root" lines="none" detail={false} button>
                        <IonIcon slot="start" icon={appPage.iosIcon} />
                        <IonLabel>{appPage.title}</IonLabel>
                      </IonItem>
                    </IonMenuToggle>
                    {!isPlatform("capacitor") && appPage.modeName === "settings" && <hr style={{backgroundColor: "var(--fat-settings-item-border)"}} />}
                  </Fragment>
                );
              }
            })}
          </IonList>
        </div>

        {/* WIDE SIDE MENU */}
        <div id="widescreenMenu">
          <IonGrid>

            <div className={`widescreen-menu-header widescreen-menu-entry ${!isWideFullMenuOpen && "menu-collapsed"} ${modeName === "movedetail" && "disabled"} ${isPlatform("ios") ? "ios" : "md"}`}>
              <IonButton onClick={() => setIsWideFullMenuOpen(!isWideFullMenuOpen)}>
                <IonIcon icon={menuSharp} slot="icon-only" />
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
              );
            })}
            
          </IonGrid>
        </div>

        <CharacterSelectModal />
        <HelpModal />
        <WhatsNewModal />
        <BookmarksModal />
        <TableSettings />
        
        <IonAlert
          isOpen={activeGameAlertOpen}
          onDidDismiss={() => setActiveGameAlertOpen(false)}
          header={"Select Game"}
          inputs={gameOptions}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
            },
            {
              text: "Select",
              handler: selectedGame => {
                dispatch(setActiveGame(selectedGame, true));
                if (modeName === "framedata" || modeName === "moveslist" || modeName === "combos") {
                  history.replace(`/${modeName}/${selectedGame}/${allCharacterLists[selectedGame].includes(selectedCharacters["playerOne"].name) ? selectedCharacters["playerOne"].name : allCharacterLists[selectedGame][0]}`);
                }
              },
            },
          ]}
        />
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
