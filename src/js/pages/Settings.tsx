import { IonContent, IonPage, IonItem, IonLabel, IonSelect, IonSelectOption, IonList, IonListHeader, IonIcon, useIonViewDidEnter, isPlatform, IonButton, IonToast, IonGrid  } from '@ionic/react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Clipboard } from '@ionic-native/clipboard';

import { setActiveGame, setAdviceToastShown, setDataDisplaySettings, setPlayer } from '../actions'
import '../../style/pages/Settings.scss';
import PageHeader from '../components/PageHeader';
import { logoTwitter, chevronForward, mailOutline, starOutline, heartOutline, openOutline, globeOutline, logoGithub } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { APP_CURRENT_VERSION_NAME } from '../constants/VersionLogs';
import { activeGameSelector, adviceToastShownSelector, dataDisplaySettingsSelector, selectedCharactersSelector } from '../selectors';

const Settings = () => {
  
  const activeGame = useSelector(activeGameSelector);
  const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const adviceToastShown = useSelector(adviceToastShownSelector);

  const dispatch = useDispatch();
  
  let history = useHistory();
  let urlHash = history.location.hash.substring(1);

  const [copyToastShown, setCopyToastShown] = useState(false);

  const LS_FRAME_DATA_CODE = localStorage.getItem("lsFrameDataCode");

  useIonViewDidEnter(() => {
     urlHash &&
       document.getElementById(urlHash).scrollIntoView({behavior: "smooth"});
  });



  return (
    <IonPage>
      <PageHeader
        componentsToShow={{ menu: true, popover: true }}
        title="Settings"
      />
      <IonContent id="Settings" scrollEvents={true} >
        <IonGrid fixed>
          <IonList>
            {/* FRAMEDATA OPTIONS */}
            <IonListHeader>Frame Data</IonListHeader>
            <IonItem lines="none">
              <IonLabel>
                <h2>Active Game</h2>
                <p>Research a different game</p>
              </IonLabel>
              <IonSelect
                interfaceOptions={{ header: "Select Game" }}
                value={activeGame}
                okText="Select"
                cancelText="Cancel"
                onIonChange={ e => dispatch(setActiveGame(e.detail.value)) }
              >
                <IonSelectOption value="3S">3S</IonSelectOption>
                <IonSelectOption value="USF4">USF4</IonSelectOption>
                <IonSelectOption value="SFV">SFV</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem id="moveNameType" lines="none">
              <IonLabel>
                <h2>Move Name Type</h2>
                <p>Change how moves are named</p>
              </IonLabel>
              <IonSelect
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
                <IonSelectOption value="shorthand">Shorthand</IonSelectOption>
                <IonSelectOption value="inputs">Inputs</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem lines="none">
              <IonLabel>
                <h2>Command Notation</h2>
                <p>Change how inputs are displayed</p>
              </IonLabel>
              <IonSelect
                interfaceOptions={{ header: "Select a Naming Type" }}
                value={dataDisplaySettings.inputNotationType}
                okText="Select"
                cancelText="Cancel"
                onIonChange={e => {
                  dispatch(setDataDisplaySettings({inputNotationType: e.detail.value}));
                  if (dataDisplaySettings.moveNameType === "inputs") {
                    dispatch(setPlayer("playerOne", selectedCharacters.playerOne.name));
                    dispatch(setPlayer("playerTwo", selectedCharacters.playerTwo.name));
                  }
                }}
              >
                <IonSelectOption value="plnCmd">Motion</IonSelectOption>
                <IonSelectOption value="numCmd">NumPad</IonSelectOption>
              </IonSelect>
            </IonItem>

            {/* @Jon Uncomment this! */}
            {/* <IonItem lines="full">
              <IonLabel>
                <h2>Normal Notation</h2>
                <p>Choose long or short normal names</p>
              </IonLabel>
              <IonSelect
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
              <IonItem lines="full">
                <IonLabel>
                  <h2>Advice Popups</h2>
                  <p>Turn the advice popups on and off</p>
                </IonLabel>
                <IonSelect
                  interfaceOptions={{ header: "Toggle Advice Popups" }}
                  value={adviceToastShown}
                  okText="Select"
                  cancelText="Cancel"
                  onIonChange={ e => dispatch(setAdviceToastShown(e.detail.value)) }
                >
                  <IonSelectOption value={true}>On</IonSelectOption>
                  <IonSelectOption value={false}>Off</IonSelectOption>
                </IonSelect>
              </IonItem>
              
              {Object.keys(localStorage).includes("localNotes") &&
                <IonItem lines="full">
                  <IonLabel>
                    <h2>Legacy Notes Retrieval</h2>
                    <p>Add your notes from FAT 2.X to your clipboard</p>
                  </IonLabel>
                  <IonButton
                    fill="outline" slot="end" size="default"
                    onClick={async () => {
                      try {
                        // Android wont allow me to use nav.clip so I have to use a Cordova plugin instead.
                        // Maybe in the future we can go back to web api
                        // await navigator.clipboard.writeText(localStorage.getItem("localNotes"));
                        await Clipboard.copy(localStorage.getItem("localNotes"));
                        setCopyToastShown(true);
                      } catch (err) {
                        console.error('Failed to copy: ', err);
                      }									
                    }}
                  >Copy</IonButton>
                </IonItem>
                
              }

              
              


            {/* FEEDBACK OPTIONS */}
            <IonListHeader>Feedback</IonListHeader>
            <IonItem lines="none" href="mailto:apps@fullmeter.com" target="_system" button>
              <IonLabel>
                <h2>apps@fullmeter.com</h2>
                <p>Got any suggestions or feedback for FAT? Email me!</p>
              </IonLabel>
              <IonIcon icon={mailOutline} slot="start" />
            </IonItem>
            <IonItem lines="full" href={isPlatform("ios") ? "https://apps.apple.com/us/app/frame-assistant-tool/id886775464" : "https://play.google.com/store/apps/details?id=com.fullmeter.fat"} target="_system" button>
              <IonLabel>
                <h2>Leave a review</h2>
                <p>If you find FAT has helped you, we'd love if you left us a review!</p>
              </IonLabel>
              <IonIcon icon={starOutline} slot="start" />
            </IonItem>
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
            <IonItem detail={false} lines="none" href="https://twitter.com/D4RK_ONION" target="_system" button>
              <IonLabel>
                <h2>Twitter</h2>
              </IonLabel>
              <IonIcon icon={logoTwitter} slot="start" />
              <IonIcon icon={openOutline} slot="end" />
            </IonItem>
            <IonItem detail={false} lines="full" href="https://github.com/D4RKONION/FAT" target="_system" button>
              <IonLabel>
                <h2>Github</h2>
              </IonLabel>
              <IonIcon icon={logoGithub} slot="start" />
              <IonIcon icon={openOutline} slot="end" />
            </IonItem>


          </IonList>
          <p className="final-fat">FAT {`${APP_CURRENT_VERSION_NAME}.${LS_FRAME_DATA_CODE}`}</p>

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
