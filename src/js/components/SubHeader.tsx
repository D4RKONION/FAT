import { IonGrid, IonRow, IonCol } from '@ionic/react';

import '../../style/components/SubHeader.scss';

// TSHELP Couldn't type rowsToDisplay properly
type CharacterPortraitProps = {
  adaptToShortScreens: Boolean;
  hideOnWideScreens: Boolean;
  rowsToDisplay: any;
}

const SubHeader = ({ adaptToShortScreens, hideOnWideScreens, rowsToDisplay }: CharacterPortraitProps) => {

  const setRows = rowsToDisplay.length <= 1 ? true : false; 

  return(
    <IonGrid id="subHeader" className={hideOnWideScreens ? "hidden-wide-screens" : "visible"}>
      {rowsToDisplay.map((rowContents, index) =>
        <IonRow key={`subheader-row-${index}`} className={index > 0 && adaptToShortScreens ? "hidden-short-screens" : "visible"}>
          {rowContents.map((col, index) =>
              col &&
                <IonCol key={`subheader-col-${index}`} sizeXs={setRows ? "6" : null} sizeSm={setRows ? "6" : null} sizeMd={setRows ? "3": null}>
                  {col}
                </IonCol>
            )}
        </IonRow>
      )}
    </IonGrid>
  )
}


export default SubHeader;
