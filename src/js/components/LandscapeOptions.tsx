import { IonContent, IonModal, IonList, IonItem, IonItemDivider, IonCheckbox, IonIcon, IonButton, IonToggle, } from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux';

import { setModalVisibility, setDataTableColumns, setAutoSetSpecificCols } from '../actions';

import '../../style/components/LandscapeOptions.scss';
import PageHeader from './PageHeader';
import { reloadOutline, closeOutline, trashOutline, medicalSharp } from 'ionicons/icons';
import { activePlayerSelector, dataTableSettingsSelector, gameDetailsSelector, modalVisibilitySelector, selectedCharactersSelector } from '../selectors';
import { createCharacterDataCategoryObj, createOrderedLandscapeColsObj } from '../utils/landscapecols';

const LandscapeOptions = () => {

  const gameDetails = useSelector(gameDetailsSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const modalVisibility = useSelector(modalVisibilitySelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const dataTableColumns = useSelector(dataTableSettingsSelector).tableColumns;
  const autoSetCharacterSpecificColumnsOn = useSelector(dataTableSettingsSelector).autoSetCharacterSpecificColumnsOn;

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
    const allOn = dataCategoryKeysArr.every(entry => Object.keys(dataTableColumns).includes(entry));

    const colsToSet = {}
    Object.keys(dataCategoryObj).forEach(dataRow =>
      Object.keys(dataCategoryObj[dataRow]).forEach(dataEntryKey => {
        colsToSet[dataEntryKey] = dataCategoryObj[dataRow][dataEntryKey]["dataTableHeader"]

      })
    )
    dispatch(setDataTableColumns(createOrderedLandscapeColsObj(gameDetails, dataTableColumns, colsToSet, allOn ? "off" : "on")))
    
  }

  const handleModalDismiss = () => {
    if (Object.keys(dataTableColumns).length === 0) {
      dispatch(setDataTableColumns(gameDetails.defaultLandscapeCols))
      modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "landscapeOptions", visible: false }))
    } else {
      modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "landscapeOptions", visible: false }))
    }
  }

  const allColumns = () => {
    const columnObj = {}
    Object.keys(gameDetails.universalDataPoints).forEach(dataCategory => {
      dataCategory !== "Extra Information" &&
      gameDetails.universalDataPoints[dataCategory].forEach(dataRow =>
        Object.keys(dataRow).forEach((dataEntryKey) => 
          columnObj[dataEntryKey] = dataRow[dataEntryKey].dataTableHeader
        )
      )
    })

    gameDetails.specificCancels.map(dataRow =>
      Object.keys(dataRow).filter(dataEntryKey =>
        dataRow[dataEntryKey].usedBy.includes(activePlayerName)
      ).map(dataEntryKey =>
        columnObj[dataEntryKey] = dataRow[dataEntryKey].dataTableHeader
      )
    )
    
    return columnObj
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
            { text: <IonIcon icon={trashOutline} />, buttonFunc: () => dispatch(setDataTableColumns({})) },
            { text: <IonIcon icon={reloadOutline} />, buttonFunc: () => dispatch(setDataTableColumns(gameDetails.defaultLandscapeCols)) },
            { text: <IonIcon icon={medicalSharp} />, buttonFunc: () => dispatch(setDataTableColumns(allColumns())) },
            { text: <IonIcon icon={closeOutline} />, buttonFunc: () => handleModalDismiss()}
          ]
        }]}
        title="Table Column Options"
      />

      <IonContent id="LandscapeOptions">
        <IonList>
        <div className="list-section" >
          <IonItemDivider>Set specific columns on character change</IonItemDivider>
          <IonItem>
            <IonToggle
              checked={autoSetCharacterSpecificColumnsOn ? true : false}
              onIonChange={e => { e.detail.checked ? dispatch(setAutoSetSpecificCols(true)) : dispatch(setAutoSetSpecificCols(false))}}
            >{autoSetCharacterSpecificColumnsOn ? "Specific cols will auto set" : "Specific cols will NOT auto set"}</IonToggle>
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
                    <IonCheckbox checked={!!dataTableColumns[dataEntryKey]} value={dataRow[dataEntryKey].dataFileKey} onIonChange={() => dispatch(setDataTableColumns(createOrderedLandscapeColsObj(gameDetails, dataTableColumns, {[dataEntryKey]: dataRow[dataEntryKey].dataTableHeader}, "none")))}>{dataRow[dataEntryKey].detailedHeader}</IonCheckbox>
                  </IonItem>
                )
              )}
            </div>
          }
            {Object.keys(gameDetails.universalDataPoints).map(dataCategory =>
              dataCategory !== "Extra Information" &&
              <div className="list-section" key={dataCategory}>
                <IonItemDivider>
                  {dataCategory}
                  <IonButton fill="clear" slot="end" onClick={() => handleSectionToggleClick(gameDetails.universalDataPoints[dataCategory])}>Toggle</IonButton>
                </IonItemDivider>
                {gameDetails.universalDataPoints[dataCategory].map(dataRow =>
                  Object.keys(dataRow).map((dataEntryKey) =>
                    <IonItem key={dataRow[dataEntryKey].dataFileKey}>
                      <IonCheckbox checked={!!dataTableColumns[dataEntryKey]} value={dataRow[dataEntryKey].dataFileKey} onIonChange={() => dispatch(setDataTableColumns(createOrderedLandscapeColsObj(gameDetails, dataTableColumns, {[dataEntryKey]: dataRow[dataEntryKey].dataTableHeader}, "none")))}>{dataRow[dataEntryKey].detailedHeader}</IonCheckbox>
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
