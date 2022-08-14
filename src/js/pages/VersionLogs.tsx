import { IonContent, IonGrid, IonItem, IonItemDivider, IonLabel, IonList, IonPage, IonSelect, IonSelectOption } from "@ionic/react";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import styles from '../../style/components/VersionLogs.module.scss'
import { VERSION_LOGS, APP_CURRENT_VERSION_NAME, UPDATABLE_GAMES } from "../constants/VersionLogs";

const VersionLogs = () => {

	const [selectedVersionName, setSelectedVersionName] = useState(APP_CURRENT_VERSION_NAME);

	const LS_SFV_FRAME_DATA_CODE = localStorage.getItem("lsSFVFrameDataCode");
	const LS_SFV_FRAME_DATA_LAST_UPDATED = localStorage.getItem("lsSFVFrameDataLastUpdated");
  const LS_GGST_FRAME_DATA_CODE = localStorage.getItem("lsGGSTFrameDataCode");
  const LS_GGST_FRAME_DATA_LAST_UPDATED = localStorage.getItem("lsGGSTFrameDataLastUpdated");


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
						{UPDATABLE_GAMES.map(gameName => 
							<div key={`version-section-${gameName}`}>
								<IonItemDivider>{gameName} Frame Data 
									v{
										gameName === "SFV" ? LS_SFV_FRAME_DATA_CODE :
										gameName === "GGST" ? LS_GGST_FRAME_DATA_CODE :
										"something broke! Email me a screenshot"
									}
								</IonItemDivider>
								<IonItem>
									<IonLabel>
										<h3>Last Updated: {
											gameName === "SFV" ? LS_SFV_FRAME_DATA_LAST_UPDATED :
											gameName === "GGST" ? LS_GGST_FRAME_DATA_LAST_UPDATED :
											"something broke! Email me a screenshot"
										}</h3>
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