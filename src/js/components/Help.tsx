import { IonContent, IonModal } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setModalVisibility } from '../actions';
import '../../style/components/Markdown.scss';
import PageHeader from './PageHeader';
import ReactMarkdown from 'react-markdown';


const HelpModal = () => {
  

  const modalVisibility = useSelector(state => state.modalVisibilityState);
  const modeName = useSelector(state => state.modeNameState);

  const dispatch = useDispatch();

  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    if (modeName && !modeName.startsWith("subpage") && modeName !== "calc-" && modeName !== "moreresources" && modeName !== "themestore" && modeName !== "themepreview" && modeName !== "movedetail") {
      (async () => {
        const file = await import(`../constants/helpfiles/${modeName}.md`);
        const response = await fetch(file.default);
        const text = await response.text();
        setMarkdown(text)
      })()
    }

  }, [modeName]);

  return(
    <IonModal
      isOpen={modalVisibility.visible && modalVisibility.currentModal === "help"}
      onDidDismiss={ () => modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "help", visible: false })) }
    >
      <PageHeader
        buttonsToShow={[{ slot: "end", buttons: [{ text: "Close", buttonFunc: () => dispatch(setModalVisibility({ currentModal: "help", visible: false })) }] }]}
        title="Help"
      />
      <IonContent id="Help">
        <div id="MarkdownContainer">
          <ReactMarkdown source={markdown} />
        </div>
      </IonContent>
    </IonModal>
  )
}

export default HelpModal;
