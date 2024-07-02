import { IonContent, IonGrid, IonItem, IonItemDivider, IonLabel, IonList, IonPage, IonSelect, IonSelectOption } from "@ionic/react";
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import styles from '../../style/components/VersionLogs.module.scss'
import { VERSION_LOGS, APP_CURRENT_VERSION_NAME, UPDATABLE_GAMES, UPDATABLE_GAMES_APP_CODES } from "../constants/VersionLogs";
import { storageGet } from "../utils/ionicStorage";

const VersionLogs = () => {

	const [selectedVersionName, setSelectedVersionName] = useState(APP_CURRENT_VERSION_NAME);
	const [fileDetails, setFileDetails] = useState({});

	useEffect(() => {

		const getFileDetails = () => {
			const tempFileDetails = {}
			UPDATABLE_GAMES.forEach(async gameName => {
				tempFileDetails[gameName] = {}
				tempFileDetails[gameName].frameDataCode = await storageGet(`ls${gameName}FrameDataCode`)
				tempFileDetails[gameName].frameDataLastUpdated = await storageGet(`ls${gameName}FrameDataLastUpdated`)
				tempFileDetails[gameName].gameDetailsCode = await storageGet(`ls${gameName}GameDetails`)
				tempFileDetails[gameName].gameDetailsLastUpdated = await storageGet(`ls${gameName}GameDetailsLastUpdated`)
			})
			setFileDetails(tempFileDetails)
		}
		
		getFileDetails();
	}, []);

	
	return (
		<IonPage id={styles.versionLogs}>
			<PageHeader
				componentsToShow={{ back: true }}
				title="Version Logs"
			/>
			<IonContent>
				<IonGrid fixed>
					<IonItem lines="full">
            <IonLabel>
              <h2>Version Number:</h2>
            </IonLabel>
            <IonSelect
              interfaceOptions={{ header: "Version Number" }}
              value={selectedVersionName}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => {setSelectedVersionName(e.detail.value)}}
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
												fileDetails[gameName].frameDataCode || UPDATABLE_GAMES_APP_CODES[gameName].FrameData
											}
										</h3>
										{fileDetails[gameName].frameDataLastUpdated ?
											<h3>Remote updated on {fileDetails[gameName].frameDataLastUpdated}</h3>
											: <h3>Using local app file</h3>

										}
									</IonLabel>
								</IonItem>
								<IonItem>
									<IonLabel>
										<h2><strong>Game Details</strong></h2>
										<h3>
											Version Code: {
												fileDetails[gameName].gameDetailsCode || UPDATABLE_GAMES_APP_CODES[gameName].GameDetails
											}
										</h3>
										{fileDetails[gameName].gameDetailsLastUpdated ?
											<h3>Remote updated on {fileDetails[gameName].gameDetailsLastUpdated}</h3>
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
	)
}

export default VersionLogs;