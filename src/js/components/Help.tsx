import { IonContent, IonModal } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { setModalVisibility } from '../actions';
import '../../style/components/Markdown.scss';
import PageHeader from './PageHeader';
import ReactMarkdown from 'react-markdown';


const HelpModal =({
  modeName,
  modalVisibility,
  setModalVisibility,
}) => {
  
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
      onDidDismiss={ () => modalVisibility.visible && setModalVisibility({ currentModal: "help", visible: false }) }
    >
      <PageHeader
        buttonsToShow={[{ slot: "end", buttons: [{ text: "Close", buttonFunc() {return setModalVisibility({ currentModal: "help", visible: false })}}] }]}
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

const mapStateToProps = state => ({
  modalVisibility: state.modalVisibilityState,
  modeName: state.modeNameState,
})

const mapDispatchToProps = dispatch => ({
  setModalVisibility: (data)  => dispatch(setModalVisibility(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
(HelpModal);
