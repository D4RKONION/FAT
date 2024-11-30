import { IonButton, IonButtons, IonContent, IonGrid, IonHeader, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { useSelector, useDispatch } from "react-redux";

import "../../style/components/WhatsNew.scss";
import { setModalVisibility } from "../actions";
import {APP_CURRENT_VERSION_NAME, APP_DATE_UPDATED, VERSION_LOGS} from "../constants/VersionLogs";
import { modalVisibilitySelector } from "../selectors";

const WhatsNewModal = () => {
  const modalVisibility = useSelector(modalVisibilitySelector);
  
  const dispatch = useDispatch();
  
  return (
    <IonModal
      isOpen={modalVisibility.visible && modalVisibility.currentModal === "whatsNew"}
      onDidDismiss={ () => modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "whatsNew", visible: false })) }
    >

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => dispatch(setModalVisibility({ currentModal: "whatsNew", visible: false }))}>Close</IonButton>
          </IonButtons>
          <IonTitle>What's New</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent id="whatsNew" className="ion-padding">
        <IonGrid fixed>
          <h3>
            FAT {APP_CURRENT_VERSION_NAME}
          </h3>
          <h6>{APP_DATE_UPDATED}</h6>
          {Object.keys(VERSION_LOGS[APP_CURRENT_VERSION_NAME]).map(heading =>
            <div key={heading}>
              <h5 className={heading === "Bug Fixes" ? "bug" : "feature"}>{heading}</h5>
              <ul>
                {VERSION_LOGS[APP_CURRENT_VERSION_NAME][heading].map((newThing, index) =>
                  <li key={heading+index}>
                    {newThing}
                  </li>
                )}
              </ul>
            </div>
          )}
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default WhatsNewModal;