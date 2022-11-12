import { IonContent, IonModal, IonList, IonItem, IonItemDivider, IonLabel, IonCheckbox, IonIcon, IonButton, IonToggle, } from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux';

import { setModalVisibility, setLandscapeCols, setAutoSetSpecificCols } from '../actions';

import '../../style/components/LandscapeOptions.scss';
import PageHeader from './PageHeader';
import { reloadOutline, closeOutline, trashOutline } from 'ionicons/icons';
import { activePlayerSelector, autoSetSpecificColsSelector, gameDetailsSelector, landscapeColsSelector, modalVisibilitySelector, selectedCharactersSelector } from '../selectors';
import { createCharacterDataCategoryObj, createOrderedLandscapeColsObj } from '../utils/landscapecols';

const LandscapeOptions = () => {

  const gameDetails = useSelector(gameDetailsSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const modalVisibility = useSelector(modalVisibilitySelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const {...landscapeCols} = useSelector(landscapeColsSelector);
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
        dispatch(setLandscapeCols({...createOrderedLandscapeColsObj(gameDetails, landscapeCols, dataEntryKey, dataCategoryObj[dataRow][dataEntryKey]["dataTableHeader"], allOn ? "off" : "on")}))
      )
    )
  }

  const handleModalDismiss = () => {
    if (Object.keys(landscapeCols).length === 0) {
      dispatch(setLandscapeCols(gameDetails.defaultLandscapeCols))
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
            { text: <IonIcon icon={reloadOutline} />, buttonFunc: () => dispatch(setLandscapeCols(gameDetails.defaultLandscapeCols)) },
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
        
        
          {gameDetails.specificCancels[0] &&
            <div className="list-section" key={`${activePlayerName} cancels`}>
              <IonItemDivider>
                {activePlayerName} Specific Cancels
                <IonButton fill="clear" slot="end" onClick={() =>
                  handleSectionToggleClick(createCharacterDataCategoryObj(activePlayerName, gameDetails.specificCancels))
                }>Toggle</IonButton>
              </IonItemDivider>
              {gameDetails.specificCancels.map(dataRow =>
                Object.keys(dataRow).filter(dataEntryKey =>
                  dataRow[dataEntryKey].usedBy.includes(activePlayerName)
                ).map(dataEntryKey =>
                  <IonItem key={dataRow[dataEntryKey].dataFileKey}>
                    <IonLabel>{dataRow[dataEntryKey].detailedHeader}</IonLabel>
                    <IonCheckbox slot="end" checked={!!landscapeCols[dataEntryKey]} value={dataRow[dataEntryKey].dataFileKey} onClick={() => dispatch(setLandscapeCols({...createOrderedLandscapeColsObj(gameDetails, landscapeCols, dataEntryKey, dataRow[dataEntryKey].dataTableHeader, "none")}))} />
                  </IonItem>
                )
              )}
            </div>
          }
            {Object.keys(gameDetails.universalDataPoints).map(dataCategory =>
              <div className="list-section" key={dataCategory}>
                <IonItemDivider>
                  {dataCategory}
                  <IonButton fill="clear" slot="end" onClick={() => handleSectionToggleClick(gameDetails.universalDataPoints[dataCategory])}>Toggle</IonButton>
                </IonItemDivider>
                {gameDetails.universalDataPoints[dataCategory].map(dataRow =>
                  Object.keys(dataRow).map((dataEntryKey) =>
                    <IonItem key={dataRow[dataEntryKey].dataFileKey}>
                      <IonLabel>{dataRow[dataEntryKey].detailedHeader}</IonLabel>
                      <IonCheckbox slot="end" checked={!!landscapeCols[dataEntryKey]} value={dataRow[dataEntryKey].dataFileKey} onClick={() => dispatch(setLandscapeCols({...createOrderedLandscapeColsObj(gameDetails, landscapeCols, dataEntryKey, dataRow[dataEntryKey].dataTableHeader, "none")}))} />
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
