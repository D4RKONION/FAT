import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonAlert, isPlatform } from '@ionic/react';
import { peopleOutline, settingsOutline, settingsSharp, moon, sunny, gameControllerOutline, gameControllerSharp, libraryOutline, librarySharp, calculatorOutline, calculatorSharp, caretDownOutline, searchOutline, searchSharp, statsChartOutline, statsChartSharp, barbellOutline, barbellSharp, colorPaletteOutline, colorPaletteSharp } from 'ionicons/icons';

import React, { useEffect, useState } from 'react';
import { withRouter, useLocation } from 'react-router-dom';
import { connect } from 'react-redux'

import '../../style/components/Menu.scss';
import { setModalVisibility, setModeName, setActiveGame } from '../actions'
import CharacterSelectModal from './CharacterSelect';
import WhatsNewModal from './WhatsNew'
import HelpModal from './Help';
import framesIcon from  '../../images/icons/frames.svg';
import { APP_CURRENT_VERSION_NAME } from '../constants/VersionLogs';

const Menu = ({ themeBrightness, themeBrightnessClickHandler, selectedCharacters, setModalVisibility, modeName, setModeName, activeGame, setActiveGame }) => {

  const [activeGameAlertOpen, setActiveGameAlertOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname.includes("calculators") && location.pathname.split("/").length > 2) {
      setModeName(`calc-${location.pathname.split("/")[2]}`);
    } else if (
      location.pathname.includes("stats")
      || (location.pathname.includes("settings") && location.pathname.split("/").length > 2)
      || (location.pathname.includes("moreresources") && location.pathname.split("/").length > 2)
      || (location.pathname.includes("themestore") && location.pathname.split("/").length > 2)
    ) {
      setModeName("subpage");
    } else {
      setModeName(location.pathname.split("/")[1]);
    }
  },[location.pathname, setModeName]);

  //account for the fact this will be imported some day
  //perhaps do a check in the div creation and concat the selected character in
  const appPages = [
    {
      title: 'Frame Data',
      url: `/framedata/${selectedCharacters.playerOne.name}`,
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
      url: `/moveslist/${selectedCharacters.playerOne.name}`,
      iosIcon: gameControllerOutline,
      mdIcon: gameControllerSharp,
      modeName: "moveslist"
    },
    {
      title: 'Combos & Tech',
      url: `/combos/${selectedCharacters.playerOne.name}`,
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
  ];
  
  const LS_FRAME_DATA_CODE = localStorage.getItem("lsFrameDataCode");

  return (
    <IonMenu id="sideMenu" menuId="sideMenu" contentId="main" type="overlay">
      <IonContent>
        <div id="menuHeader">
          <div id="themeButton" onClick={(() => themeBrightnessClickHandler())}>
            <IonIcon icon={themeBrightness === "dark" ? sunny : moon} />
          </div>
          <div id="appDetails">
            <h2>FAT - <span onClick={() => setActiveGameAlertOpen(true)}>{activeGame} <IonIcon icon={caretDownOutline} /></span></h2>
            <p>Ver {`${APP_CURRENT_VERSION_NAME}.${LS_FRAME_DATA_CODE}`}</p>
          </div>
        </div>
        <IonList id="pageList">
          <IonMenuToggle autoHide={false}>
            <IonItem disabled={modeName === "movedetail"} key="charSelectItem" className="" onClick={() => setModalVisibility({ currentModal: "characterSelect", visible: true })}  lines="none" detail={false} button>
              <IonIcon slot="start" icon={peopleOutline} />
              <IonLabel>Character Select</IonLabel>
            </IonItem>
          </IonMenuToggle>
          {appPages.map((appPage) => {
            if (isPlatform("desktop") && appPage.appOnly) {
              return false;
            } else {
              return (
                <IonMenuToggle key={appPage.title} autoHide={false}>
                  <IonItem className={modeName === appPage.modeName ? "selected" : null} routerLink={appPage.url} routerDirection="root" lines="none" detail={false} button>
                    <IonIcon slot="start" icon={appPage.iosIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              )
            }
          })}
        </IonList>

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
            }
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
                setActiveGame(selectedGame);
              }
            }
          ]}
        />
      </IonContent>
    </IonMenu>
  );
};


const mapStateToProps = state => ({
  selectedCharacters: state.selectedCharactersState,
  modeName: state.modeNameState,
  activeGame: state.activeGameState,
})

const mapDispatchToProps = dispatch => ({
  setModalVisibility: (data)  => dispatch(setModalVisibility(data)),
  setModeName: (modeName)  => dispatch(setModeName(modeName)),
  setActiveGame: (gameName)  => dispatch(setActiveGame(gameName)),
})


export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ) (Menu)
);
