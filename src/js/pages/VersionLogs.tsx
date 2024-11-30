import { Preferences } from "@capacitor/preferences";
import { IonBackButton, IonButtons, IonContent, IonGrid, IonHeader, IonItem, IonItemDivider, IonLabel, IonList, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";

import styles from "../../style/components/VersionLogs.module.scss";
import { VERSION_LOGS, APP_CURRENT_VERSION_NAME, UPDATABLE_GAMES, UPDATABLE_GAMES_APP_CODES } from "../constants/VersionLogs";

const VersionLogs = () => {
  const [selectedVersionName, setSelectedVersionName] = useState(APP_CURRENT_VERSION_NAME);
  const [fileDetails, setFileDetails] = useState({});

  useEffect(() => {
    const getFileDetails = () => {
      const tempFileDetails = {};
      UPDATABLE_GAMES.forEach(async gameName => {
        tempFileDetails[gameName] = {};
        tempFileDetails[gameName].frameDataCode = await Preferences.get({key: `ls${gameName}FrameDataCode`});
        tempFileDetails[gameName].frameDataLastUpdated = await Preferences.get({key: `ls${gameName}FrameDataLastUpdated`});
        tempFileDetails[gameName].gameDetailsCode = await Preferences.get({key: `ls${gameName}GameDetails`});
        tempFileDetails[gameName].gameDetailsLastUpdated = await Preferences.get({key: `ls${gameName}GameDetailsLastUpdated`});
      });
      setFileDetails(tempFileDetails);
    };
		
    getFileDetails();
  }, []);
	
  return (
    <IonPage id={styles.versionLogs}>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" />
          </IonButtons>
          <IonTitle>Version Logs</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid fixed>
          <IonItem lines="full">
            <IonSelect
              label="Version Number:"
              interfaceOptions={{ header: "Version Number" }}
              value={selectedVersionName}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => {setSelectedVersionName(e.detail.value);}}
            >
              {Object.keys(VERSION_LOGS).map(versionName =>
                <IonSelectOption key={`versionlogs-${versionName}`} value={versionName}>{versionName}</IonSelectOption>
              )}
            </IonSelect>
          </IonItem>
					
          <IonList>
            {Object.keys(VERSION_LOGS[selectedVersionName]).map(sectionHeader =>
              <div key={`version-section-${sectionHeader}`}>
                <IonItemDivider>{sectionHeader}</IonItemDivider>
                {VERSION_LOGS[selectedVersionName][sectionHeader].map((sectionEntry, index) =>
                  <IonItem key={`version-section-${sectionHeader}-${index}`}>
                    <IonLabel>
                      <h3>{sectionEntry}</h3>
                    </IonLabel>
                  </IonItem>	
                )}
              </div>
            )}
						
            {fileDetails[UPDATABLE_GAMES[0]] && UPDATABLE_GAMES.map(gameName => 
              <div key={`version-section-${gameName}`}>
                <IonItemDivider>{gameName} File Versions
									
                </IonItemDivider>
                <IonItem>
                  <IonLabel>
                    <h2><strong>Frame Data</strong></h2>
                    <h3>
                      Version Code: {
                        (fileDetails[gameName].frameDataCode && fileDetails[gameName].frameDataCode.value) || UPDATABLE_GAMES_APP_CODES[gameName].FrameData
                      }
                    </h3>
                    {fileDetails[gameName].frameDataLastUpdated && fileDetails[gameName].frameDataLastUpdated.value ?
                      <h3>Remote updated on {fileDetails[gameName].frameDataLastUpdated && fileDetails[gameName].frameDataLastUpdated.value}</h3>
                      : <h3>Using local app file</h3>

                    }
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h2><strong>Game Details</strong></h2>
                    <h3>
                      Version Code: {
                        (fileDetails[gameName].gameDetailsCode && fileDetails[gameName].gameDetailsCode.value) || UPDATABLE_GAMES_APP_CODES[gameName].GameDetails
                      }
                    </h3>
                    {fileDetails[gameName].gameDetailsLastUpdated && fileDetails[gameName].gameDetailsLastUpdated.value ?
                      <h3>Remote updated on {fileDetails[gameName].gameDetailsLastUpdated && fileDetails[gameName].gameDetailsLastUpdated.value}</h3>
                      : <h3>Using local app file</h3>

                    }
                  </IonLabel>
                </IonItem>
              </div>
            )}

          </IonList>

        </IonGrid>
      </IonContent>
			
    </IonPage>
  );
};

export default VersionLogs;