import { IonGrid, IonRow, IonCol } from "@ionic/react";

import "../../style/components/SubHeader.scss";

// TSHELP Couldn't type rowsToDisplay properly
type Props = {
  adaptToShortScreens: Boolean;
  hideOnWideScreens: Boolean;
  rowsToDisplay: any;
  clickHandler?: () => void;
};

const SubHeader = ({ adaptToShortScreens, hideOnWideScreens, rowsToDisplay, clickHandler }: Props) => {
  const setRows = rowsToDisplay.length <= 1 && rowsToDisplay[0].length !== 1 ? true : false;

  return (
    <IonGrid id="subHeader" className={hideOnWideScreens ? "hidden-wide-screens" : "visible"}>
      {rowsToDisplay.map((rowContents, index) =>
        <IonRow key={`subheader-row-${index}`} className={index > 0 && adaptToShortScreens ? "hidden-short-screens" : "visible"}>
          {rowContents.map((col, index) =>
            col &&
              <IonCol onClick={col.key?.includes("tap-stats") ? clickHandler : () => {}} key={`subheader-col-${index}`} sizeXs={setRows ? "6" : null} sizeSm={setRows ? "6" : null} sizeMd={setRows ? "3": null} className={col.key?.includes("tap-stats") ? "tap-stats" : null}>
                {col} {setRows}
              </IonCol>
          )}
        </IonRow>
      )}
    </IonGrid>
  );
};

export default SubHeader;
