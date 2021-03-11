import { IonContent, IonModal, IonList, IonItem, IonItemDivider, IonLabel, IonCheckbox, IonIcon, IonButton, } from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux';

import { setModalVisibility, setLandscapeCols } from '../actions';
import GAME_DETAILS from '../constants/GameDetails'

import '../../style/components/LandscapeOptions.scss';
import PageHeader from './PageHeader';
import { reloadOutline, closeOutline, trashOutline } from 'ionicons/icons';
import { activeGameSelector, landscapeColsSelector, modalVisibilitySelector, selectedCharactersSelector } from '../selectors';

const LandscapeOptions = () => {

  const modalVisibility = useSelector(modalVisibilitySelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const landscapeCols = useSelector(landscapeColsSelector);
  const activeGame = useSelector(activeGameSelector);

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
        handleCheckboxClick(dataEntryKey, dataCategoryObj[dataRow][dataEntryKey]["dataTableHeader"], allOn ? "off" : "on")
      )
    )
  }

  const handleCheckboxClick = (dataEntryKey, dataTableHeader, forceMode) => {
    
    const keysInOrder = [];
    const landscapeColsInOrder = {};

    // extract the keys from the 2 data table entry files so we can order our landscape cols
    Object.keys(GAME_DETAILS[activeGame].universalDataPoints).forEach(dataCategory =>
      GAME_DETAILS[activeGame].universalDataPoints[dataCategory].forEach(dataRow =>
        Object.keys(dataRow).forEach(dataEntryKey =>
          keysInOrder.push(dataEntryKey)
        )
      )
    )
    GAME_DETAILS[activeGame].specificCancels.forEach(dataCategory =>
      Object.keys(dataCategory).forEach(dataRow =>
        keysInOrder.push(dataCategory[dataRow].dataFileKey)
      )
    )

    // Handle the new landscape column to be set
    if (forceMode === "on" || !landscapeCols[dataEntryKey]) {
      landscapeCols[dataEntryKey] = dataTableHeader;
    } else {
      delete landscapeCols[dataEntryKey];
    }
    
    // reorder the landscape columns before returning it
    keysInOrder.forEach(detailKey => {
      Object.keys(landscapeCols).forEach(key => {
        if (detailKey === key) {
          landscapeColsInOrder[key] = landscapeCols[key]
        }
      })
    })

    dispatch(setLandscapeCols({...landscapeColsInOrder}))
  }

  const handleModalDismiss = () => {
    if (Object.keys(landscapeCols).length === 0) {
      dispatch(setLandscapeCols({startup: "S", active: "A", recovery: "R", onBlock: "oB", onHit: "oH", damage:"dmg", stun:"stun", kd:"kd", kdr:"kdr", kdrb:"kdrb"}))
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
            { text: <IonIcon icon={reloadOutline} />, buttonFunc: () => dispatch(setLandscapeCols({startup: "S", active: "A", recovery: "R", onBlock: "oB", onHit: "oH", damage:"dmg", stun:"stun", kd:"kd", kdr:"kdr", kdrb:"kdrb"})) },
            { text: <IonIcon icon={closeOutline} />, buttonFunc: () => handleModalDismiss()}
          ]
        }]}
        title="Landscape Options"
      />

      <IonContent id="LandscapeOptions">
        <IonList>
          {GAME_DETAILS[activeGame].specificCancels &&
            [selectedCharacters.playerOne.name, selectedCharacters.playerTwo.name].map((playerName, index) =>
            <div className="list-section" key={`${playerName}${index} cancels`}>
              <IonItemDivider>
                Showing cancels for {playerName}
                <IonButton fill="clear" slot="end"
                  onClick={() =>
                    handleSectionToggleClick(GAME_DETAILS[activeGame].specificCancels.filter(dataRow =>
                      Object.keys(dataRow).map(dataEntryKey => 
                        dataRow[dataEntryKey]
                      ).some(dataEntry =>
                        dataEntry.usedBy.includes(playerName)
                      )
                    ))
                  }>Toggle</IonButton>
              </IonItemDivider>
              {GAME_DETAILS[activeGame].specificCancels.map(dataRow =>
                Object.keys(dataRow).filter(dataEntryKey =>
                  dataRow[dataEntryKey].usedBy.includes(playerName)
                ).map(dataEntryKey =>
                  <IonItem key={dataRow[dataEntryKey].dataFileKey}>
                    <IonLabel>{dataRow[dataEntryKey].detailedHeader}</IonLabel>
                    <IonCheckbox slot="end" checked={!!landscapeCols[dataEntryKey]} value={dataRow[dataEntryKey].dataFileKey} onClick={() => handleCheckboxClick(dataEntryKey, dataRow[dataEntryKey].dataTableHeader, "none")} />
                  </IonItem>
                )
              )}
            </div>
          )}
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
                    <IonCheckbox slot="end" checked={!!landscapeCols[dataEntryKey]} value={dataRow[dataEntryKey].dataFileKey} onClick={() => handleCheckboxClick(dataEntryKey, dataRow[dataEntryKey].dataTableHeader, "none")} />
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
