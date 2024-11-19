import { IonContent, IonPage, IonItem, IonLabel, IonSelect, IonSelectOption, IonList, IonListHeader, IonIcon, useIonViewDidEnter, isPlatform, IonButton, IonToast, IonGrid, IonToggle, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle  } from '@ionic/react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setActiveGame, setAdviceToastsOn, setDataDisplaySettings, setPlayer, setThemeAccessibility, setThemeBrightness, setThemeColor } from '../actions'
import '../../style/pages/Settings.scss';
import { logoTwitter, chevronForward, mailOutline, starOutline, heartOutline, openOutline, globeOutline, logoGithub, bulbOutline, lockClosedOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { APP_CURRENT_VERSION_NAME } from '../constants/VersionLogs';
import { activeGameSelector, dataDisplaySettingsSelector, selectedCharactersSelector, appDisplaySettingsSelector, adviceToastSelector } from '../selectors';
import { GAME_NAMES } from '../constants/ImmutableGameDetails';
import ThemeSwitcher from '../components/ThemeSwitcher';
import PopoverButton from '../components/PopoverButton';

const Settings = () => {
  
  const activeGame = useSelector(activeGameSelector);
  const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const adviceToastsOn = useSelector(adviceToastSelector).adviceToastsOn;
  const themeAccessibility = useSelector(appDisplaySettingsSelector).themeAccessibility;
  const themeBrightness = useSelector(appDisplaySettingsSelector).themeBrightness;

  const dispatch = useDispatch();
  
  let history = useHistory();
  let urlHash = history.location.hash.substring(1);

  const [copyToastShown, setCopyToastShown] = useState(false);

  useIonViewDidEnter(() => {
     urlHash &&
       document.getElementById(urlHash).scrollIntoView({behavior: "smooth"});
  });



  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Settings</IonTitle>
          <IonButtons slot="end">
            <PopoverButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent id="Settings" scrollEvents={true} >
        <IonGrid fixed>
          <IonList>
            {/* FRAMEDATA OPTIONS */}
            <IonListHeader>Frame Data</IonListHeader>
            <IonItem lines="none">
              <IonSelect
                label={"Active Game"}
                interfaceOptions={{ header: "Select Game" }}
                value={activeGame}
                okText="Select"
                cancelText="Cancel"
                onIonChange={ e => dispatch(setActiveGame(e.detail.value, true)) }
              >
                {GAME_NAMES.map(gameName => 
                  <IonSelectOption key={`active-game-${gameName}-selection`} value={gameName}>{gameName}</IonSelectOption>
                )}
              </IonSelect>
            </IonItem>

            <IonItem id="moveNameType" lines="none">
              <IonSelect
                label={"Move Names"}
                interfaceOptions={{ header: "Select a Naming Type" }}
                value={dataDisplaySettings.moveNameType}
                okText="Select"
                cancelText="Cancel"
                onIonChange={e => {
                  dispatch(setDataDisplaySettings({moveNameType: e.detail.value}));
                  dispatch(setPlayer("playerOne", selectedCharacters.playerOne.name));
                  dispatch(setPlayer("playerTwo", selectedCharacters.playerTwo.name));
                }}
              >
                <IonSelectOption value="official">Official</IonSelectOption>
                <IonSelectOption value="common">Common</IonSelectOption>
                <IonSelectOption value="inputs">Inputs</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonSelect
                label={"Input Notation"}
                interfaceOptions={{ header: "Select a Naming Type" }}
                value={dataDisplaySettings.inputNotationType}
                okText="Select"
                cancelText="Cancel"
                onIonChange={e => {
                  dispatch(setDataDisplaySettings({inputNotationType: e.detail.value}));
                  if (dataDisplaySettings.moveNameType === "inputs" || dataDisplaySettings.inputNotationType === "ezCmd" || e.detail.value === "ezCmd") {
                    dispatch(setPlayer("playerOne", selectedCharacters.playerOne.name));
                    dispatch(setPlayer("playerTwo", selectedCharacters.playerTwo.name));
                  }
                }}
              >
                <IonSelectOption value="plnCmd">Motion</IonSelectOption>
                <IonSelectOption value="numCmd">NumPad</IonSelectOption>
                {activeGame === "SF6" && <IonSelectOption value="ezCmd">Modern</IonSelectOption>}
              </IonSelect>
            </IonItem>

            {/* @Jon Uncomment this! */}
            {/* <IonItem lines="full">
              <IonSelect
                label={"Normal Notation"}
                interfaceOptions={{ header: "Select a Naming Type" }}
                value={dataDisplaySettings.normalNotationType}
                okText="Select"
                cancelText="Cancel"
                onIonChange={e => {
                  dispatch(setDataDisplaySettings({normalNotationType: e.detail.value}));
                  if (dataDisplaySettings.moveNameType === "official" || dataDisplaySettings.moveNameType === "common") {
                    dispatch(setPlayer("playerOne", selectedCharacters.playerOne.name));
                    dispatch(setPlayer("playerTwo", selectedCharacters.playerTwo.name));
                  }
                }}
              >
                <IonSelectOption value="fullWord">Full Word</IonSelectOption>
                <IonSelectOption value="shorthand">Shorthand</IonSelectOption>
              </IonSelect>
            </IonItem> */}


              {/* APP OPTIONS */}
              <IonListHeader>App Settings</IonListHeader>
              <IonItem lines="none">
                <IonSelect
                  label={"Advice Popups"}
                  interfaceOptions={{ header: "Toggle Advice Popups" }}
                  value={adviceToastsOn}
                  okText="Select"
                  cancelText="Cancel"
                  onIonChange={ e => dispatch(setAdviceToastsOn(e.detail.value)) }
                >
                  <IonSelectOption value={true}>On</IonSelectOption>
                  <IonSelectOption value={false}>Off</IonSelectOption>
                </IonSelect>
              </IonItem>
              
              <IonItem lines="none">
                <IonSelect
                  label={"Colour Blind Mode"}
                  interfaceOptions={{ header: "Colour Blind Mode" }}
                  value={themeAccessibility}
                  okText="Select"
                  cancelText="Cancel"
                  onIonChange={ e => {dispatch(setThemeAccessibility(e.detail.value)); dispatch(setThemeColor("classic"))} }
                >
                  <IonSelectOption value={"colorBlind"}>On</IonSelectOption>
                  <IonSelectOption value={"none"}>Off</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem lines="none">
                <IonToggle
                  checked={themeBrightness === "light" ? false : true}
                  onIonChange={e => { dispatch(setThemeBrightness(e.detail.checked ? "dark" : "light"))}}>Dark Mode</IonToggle>
              </IonItem>

              <ThemeSwitcher />

            {/* FEEDBACK OPTIONS */}
            <IonListHeader>Feedback</IonListHeader>
            <IonItem lines="none" href="mailto:apps@fullmeter.com" target="_system" button>
              <IonLabel>
                <h2>apps@fullmeter.com</h2>
                <p>Got any suggestions or feedback for FAT? Email me!</p>
              </IonLabel>
              <IonIcon icon={mailOutline} slot="start" />
            </IonItem>
            <IonItem lines="none" href={isPlatform("ios") ? "https://apps.apple.com/us/app/frame-assistant-tool/id886775464" : "https://play.google.com/store/apps/details?id=com.fullmeter.fat"} target="_system" button>
              <IonLabel>
                <h2>Leave a review</h2>
                <p>If you find FAT has helped you, we'd love if you left us a review!</p>
              </IonLabel>
              <IonIcon icon={starOutline} slot="start" />
            </IonItem>
            <hr></hr>
            {/* META OPTIONS */}
            <IonListHeader>FAT Meta</IonListHeader>
            <IonItem lines="none" onClick={() => history.push(`/settings/shoutouts`)} button>
              <IonLabel>
                <h2>Shoutouts</h2>
              </IonLabel>
              <IonIcon icon={heartOutline} slot="start" />
              {!isPlatform("ios") &&
                <IonIcon icon={chevronForward} slot="end" />
              }
            </IonItem>
            <IonItem lines="none" onClick={() => history.push(`/settings/versionlogs/`)} button>
              <IonLabel>
                <h2>Version Logs</h2>
              </IonLabel>
              <IonIcon icon={bulbOutline} slot="start" />
              {!isPlatform("ios") &&
                <IonIcon icon={chevronForward} slot="end" />
              }
            </IonItem>
            <IonItem detail={false} lines="none" href="https://twitter.com/D4RK_ONION" target="_system" button>
              <IonLabel>
                <h2>Twitter</h2>
              </IonLabel>
              <IonIcon icon={logoTwitter} slot="start" />
              <IonIcon icon={openOutline} slot="end" />
            </IonItem>
            <IonItem detail={false} lines="none" href="https://github.com/D4RKONION/FAT" target="_system" button>
              <IonLabel>
                <h2>Github</h2>
              </IonLabel>
              <IonIcon icon={logoGithub} slot="start" />
              <IonIcon icon={openOutline} slot="end" />
            </IonItem>
            <IonItem detail={false} lines="none" href="https://fullmeter.com/fat/privacy" target="_system" button>
              <IonLabel>
                <h2>Privacy Policy</h2>
              </IonLabel>
              <IonIcon icon={lockClosedOutline} slot="start" />
              <IonIcon icon={openOutline} slot="end" />
            </IonItem>


          </IonList>
          <p className="final-fat">FAT {APP_CURRENT_VERSION_NAME}</p>

          <IonToast
            isOpen={copyToastShown}
            onDidDismiss={() => setCopyToastShown(false)}
            header="Notes Object Copied!"
            message="It's JSON, so try pasting it somewhere like onlinejsontools.com"
            buttons={[
              {
                side: 'end',
                icon: globeOutline,
                handler: () => {
                  window.open("https://onlinejsontools.com/convert-json-to-text")
                }
              }
            ]}
            position="bottom"
            duration={3000}
          />
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
