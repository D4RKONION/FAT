import { IonContent, IonGrid, IonModal } from '@ionic/react';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PageHeader from './PageHeader';
import '../../style/components/WhatsNew.scss'
import {APP_CURRENT_VERSION_NAME, APP_DATE_UPDATED, VERSION_LOGS} from '../constants/VersionLogs';
import { setModalVisibility } from '../actions';
import { modalVisibilitySelector } from '../selectors';

const WhatsNewModal = () => {

  const modalVisibility = useSelector(modalVisibilitySelector);
  
  const dispatch = useDispatch();

  return(
    <IonModal
      isOpen={modalVisibility.visible && modalVisibility.currentModal === "whatsNew"}
      onDidDismiss={ () => modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "whatsNew", visible: false })) }
    >
      <PageHeader
        buttonsToShow={[{ slot: "end", buttons: [{ text: "Close", buttonFunc: () => dispatch(setModalVisibility({ currentModal: "whatsNew", visible: false })) }] }]}
        title="What's New"
      />
      <IonContent id="whatsNew">
        <IonGrid fixed>
          <h3>
            FAT {APP_CURRENT_VERSION_NAME}
          </h3>
          <h6>{APP_DATE_UPDATED}</h6>
          {Object.keys(VERSION_LOGS[APP_CURRENT_VERSION_NAME]).map(heading =>
            <div key={heading}>
              <h5 className={heading === "New Features" ? "feature" : "bug"}>{heading}</h5>
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
  )
}

export default WhatsNewModal;