import "../../style/components/Markdown.scss";

import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector, useDispatch } from "react-redux";

import { setModalVisibility } from "../actions";
import { modalVisibilitySelector, modeNameSelector } from "../selectors";

const HelpModal = () => {
  const modalVisibility = useSelector(modalVisibilitySelector);
  const modeName = useSelector(modeNameSelector);

  const dispatch = useDispatch();

  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    if (modeName && !modeName.startsWith("subpage") && modeName !== "calc-" && modeName !== "moreresources" && modeName !== "premium" && modeName !== "movedetail" && modeName !== "versionlogs") {
      (async () => {
        const file = await import(`../constants/helpfiles/${modeName}.md`);
        const response = await fetch(file.default);
        const text = await response.text();
        setMarkdown(text);
      })();
    }
  }, [modeName]);

  return (
    <IonModal
      isOpen={modalVisibility.visible && modalVisibility.currentModal === "help"}
      onDidDismiss={ () => modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "help", visible: false })) }
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => dispatch(setModalVisibility({ currentModal: "help", visible: false }))}>Close</IonButton>
          </IonButtons>
          <IonTitle>Help</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent id="Help">
        <div id="MarkdownContainer">
          <ReactMarkdown children={markdown} />
        </div>
      </IonContent>
    </IonModal>
  );
};

export default HelpModal;
