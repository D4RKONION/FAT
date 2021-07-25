import { IonContent, IonModal, IonList, IonItem, IonItemDivider, IonLabel, IonCheckbox, IonIcon, IonButton, IonToggle, } from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux';

import { setModalVisibility, setLandscapeCols, setAutoSetSpecificCols } from '../actions';
import GAME_DETAILS from '../constants/GameDetails'

import '../../style/components/LandscapeOptions.scss';
import PageHeader from './PageHeader';
import { reloadOutline, closeOutline, trashOutline } from 'ionicons/icons';
import { activeGameSelector, activePlayerSelector, autoSetSpecificColsSelector, landscapeColsSelector, modalVisibilitySelector, selectedCharactersSelector } from '../selectors';
import { createCharacterDataCategoryObj, createOrderedLandscapeColsObj } from '../utils/landscapecols';

const LandscapeOptions = () => {

  const activePlayer = useSelector(activePlayerSelector);
  const modalVisibility = useSelector(modalVisibilitySelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const landscapeCols = useSelector(landscapeColsSelector);
  const activeGame = useSelector(activeGameSelector);
  const autoSetSpecificCols = useSelector(autoSetSpecificColsSelector);

  const activePlayerName = selectedCharacters[activePlayer].name;

  const dispatch = useDispatch();

  const handleSectionToggleClick = (dataCategoryObj) => {

    //check if every box in this dataCategory is currently ticked
    const dataCategoryKeysArr = [];
    dataCategoryObj.map(dataRow =>
      Object.keys(dataRow).forEach(dataEntryKey =>
        dataCategoryKeysArr.push(dataEntryKey)  
      )
    )
    const allOn = dataCategoryKeysArr.every(entry => Object.keys(landscapeCols).includes(entry));


    Object.keys(dataCategoryObj).forEach(dataRow =>
      Object.keys(dataCategoryObj[dataRow]).forEach(dataEntryKey =>
        dispatch(setLandscapeCols({...createOrderedLandscapeColsObj(activeGame, landscapeCols, dataEntryKey, dataCategoryObj[dataRow][dataEntryKey]["dataTableHeader"], allOn ? "off" : "on")}))
      )
    )
  }

  const handleModalDismiss = () => {
    if (Object.keys(landscapeCols).length === 0) {
      dispatch(setLandscapeCols(GAME_DETAILS[activeGame].defaultLandscapeCols))
      modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "landscapeOptions", visible: false }))
    } else {
      modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "landscapeOptions", visible: false }))
    }
  }

  return(
    <IonModal
      isOpen={modalVisibility.visible && modalVisibility.currentModal === "landscapeOptions"}
      onDidDismiss={ () => {
        handleModalDismiss();
      } }
    >
      <PageHeader
        buttonsToShow={[{ slot: "end",
          buttons: [
            { text: <IonIcon icon={trashOutline} />, buttonFunc: () => dispatch(setLandscapeCols({})) },
            { text: <IonIcon icon={reloadOutline} />, buttonFunc: () => dispatch(setLandscapeCols(GAME_DETAILS[activeGame].defaultLandscapeCols)) },
            { text: <IonIcon icon={closeOutline} />, buttonFunc: () => handleModalDismiss()}
          ]
        }]}
        title="Landscape Options"
      />

      <IonContent id="LandscapeOptions">
        <IonList>
        <div className="list-section" >
          <IonItemDivider>Set specific columns on character change</IonItemDivider>
          <IonItem>
            <IonToggle
              checked={autoSetSpecificCols ? true : false}
              onIonChange={e => { e.detail.checked ? dispatch(setAutoSetSpecificCols(true)) : dispatch(setAutoSetSpecificCols(false))}}
              slot="end"
            />
            <IonLabel>{autoSetSpecificCols ? "Specific cols will auto set" : "Specific cols will NOT auto set"}</IonLabel>
          </IonItem>
        </div>
        
        
          {GAME_DETAILS[activeGame].specificCancels[0] &&
            <div className="list-section" key={`${activePlayerName} cancels`}>
              <IonItemDivider>
                {activePlayerName} Specific Cancels
                <IonButton fill="clear" slot="end" onClick={() =>
                  handleSectionToggleClick(createCharacterDataCategoryObj(activeGame, activePlayerName))
                }>Toggle</IonButton>
              </IonItemDivider>
              {GAME_DETAILS[activeGame].specificCancels.map(dataRow =>
                Object.keys(dataRow).filter(dataEntryKey =>
                  dataRow[dataEntryKey].usedBy.includes(activePlayerName)
                ).map(dataEntryKey =>
                  <IonItem key={dataRow[dataEntryKey].dataFileKey}>
                    <IonLabel>{dataRow[dataEntryKey].detailedHeader}</IonLabel>
                    <IonCheckbox slot="end" checked={!!landscapeCols[dataEntryKey]} value={dataRow[dataEntryKey].dataFileKey} onClick={() => dispatch(setLandscapeCols({...createOrderedLandscapeColsObj(activeGame, landscapeCols, dataEntryKey, dataRow[dataEntryKey].dataTableHeader, "none")}))} />
                  </IonItem>
                )
              )}
            </div>
          }
            {Object.keys(GAME_DETAILS[activeGame].universalDataPoints).map(dataCategory =>
              <div className="list-section" key={dataCategory}>
                <IonItemDivider>
                  {dataCategory}
                  <IonButton fill="clear" slot="end" onClick={() => handleSectionToggleClick(GAME_DETAILS[activeGame].universalDataPoints[dataCategory])}>Toggle</IonButton>
                </IonItemDivider>
                {GAME_DETAILS[activeGame].universalDataPoints[dataCategory].map(dataRow =>
                  Object.keys(dataRow).map((dataEntryKey) =>
                    <IonItem key={dataRow[dataEntryKey].dataFileKey}>
                      <IonLabel>{dataRow[dataEntryKey].detailedHeader}</IonLabel>
                      <IonCheckbox slot="end" checked={!!landscapeCols[dataEntryKey]} value={dataRow[dataEntryKey].dataFileKey} onClick={() => dispatch(setLandscapeCols({...createOrderedLandscapeColsObj(activeGame, landscapeCols, dataEntryKey, dataRow[dataEntryKey].dataTableHeader, "none")}))} />
                    </IonItem>
                  )
                )}
              </div>
            )}
        </IonList>
      </IonContent>
    </IonModal>
  )
}

export default LandscapeOptions;
