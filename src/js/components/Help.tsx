import { IonContent, IonModal } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setModalVisibility } from '../actions';
import '../../style/components/Markdown.scss';
import PageHeader from './PageHeader';
import ReactMarkdown from 'react-markdown';
import { modalVisibilitySelector, modeNameSelector } from '../selectors';


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
          <ReactMarkdown children={markdown} />
        </div>
      </IonContent>
    </IonModal>
  )
}

export default HelpModal;
