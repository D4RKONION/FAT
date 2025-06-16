import { IonButton, IonButtons, IonContent, IonGrid, IonHeader, IonModal, IonTitle, IonToolbar, isPlatform } from "@ionic/react";
import ReactMarkdown from "react-markdown";
import { useSelector, useDispatch } from "react-redux";

import "../../style/components/WhatsNew.scss";
import { setModalVisibility } from "../actions";
import {APP_CURRENT_VERSION_NAME, APP_DATE_UPDATED, VERSION_LOGS} from "../constants/VersionLogs";
import { modalVisibilitySelector } from "../selectors";
import ChunkyButton from "./ChunkyButton";

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
            (!isPlatform("ios") && heading.toLowerCase().includes("ios")) || (!isPlatform("android") && heading.toLowerCase().includes("android")) ?
              false
              : (
                <div key={heading}>
                  <h5 className={heading.includes("Bug Fixes") || heading.includes("Hotfix") ? "bug" : "feature"}>{heading}</h5>
                  <ul>
                    {VERSION_LOGS[APP_CURRENT_VERSION_NAME][heading].map((newThing, index) =>
                      !(!isPlatform("ios") && newThing.toLowerCase().startsWith("ios") || !isPlatform("android") && newThing.toLowerCase().startsWith("android")) &&
                      <li key={heading+index}>
                        <ReactMarkdown
                          components={{
                            p: ({ node, children }) => <span>{children}</span>,
                          }}
                          children={newThing} />
                      </li>
                      
                    )}
                  </ul>
                </div>
              )
          )}
          <ChunkyButton
            onClick={() => window.open("https://bsky.app/profile/d4rkonion.bsky.social", "_blank")}>Follow me on Bluesky!</ChunkyButton>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default WhatsNewModal;