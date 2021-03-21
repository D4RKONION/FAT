import { IonContent, IonGrid, IonItem, IonItemDivider, IonLabel, IonList, IonPage, IonSelect, IonSelectOption } from "@ionic/react";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import styles from '../../style/components/VersionLogs.module.scss'
import { VERSION_LOGS, APP_CURRENT_VERSION_NAME } from "../constants/VersionLogs";

const VersionLogs = () => {

	const [selectedVersionName, setSelectedVersionName] = useState(APP_CURRENT_VERSION_NAME);


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
                <IonSelectOption key={`stat-${versionName}`} value={versionName}>{versionName}</IonSelectOption>
              )}
            </IonSelect>
          </IonItem>
					
					<IonList>
						{Object.keys(VERSION_LOGS[selectedVersionName]).map(sectionHeader =>
							<>
								<IonItemDivider>{sectionHeader}</IonItemDivider>
								{VERSION_LOGS[selectedVersionName][sectionHeader].map(sectionEntry =>
									<IonItem>
										<IonLabel>
											<h3>{sectionEntry}</h3>
										</IonLabel>
									</IonItem>	
								)}
							</>
						)}
           

          </IonList>








				</IonGrid>
			</IonContent>
			
		</IonPage>
	)
}

export default VersionLogs;