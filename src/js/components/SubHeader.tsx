import { IonGrid, IonRow, IonCol } from '@ionic/react';

import '../../style/components/SubHeader.scss';

// TSHELP Couldn't type rowsToDisplay properly
type CharacterPortraitProps = {
  adaptToShortScreens: Boolean;
  rowsToDisplay: any;
}

const SubHeader = ({ adaptToShortScreens, rowsToDisplay }: CharacterPortraitProps) => {

  return(
    <IonGrid id="subHeader">
      {rowsToDisplay.map((rowContents, index) =>
        <IonRow key={`subheader-row-${index}`} className={index > 0 && adaptToShortScreens ? "hidden-short-screens" : "visible"}>
          {rowContents.map((col, index) =>
              col &&
                <IonCol key={`subheader-col-${index}`}>
                  {col}
                </IonCol>
            )}
        </IonRow>
      )}
    </IonGrid>
  )
}


export default SubHeader;
