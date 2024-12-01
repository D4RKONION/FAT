import "../../style/components/TableSettings.scss";

import { IonContent, IonModal, IonList, IonItem, IonToggle, IonLabel, IonSelect, IonSelectOption, IonPopover, isPlatform, IonRippleEffect, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle } from "@ionic/react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setModalVisibility, setCompactView, setMoveAdvantageColorsOn, setMoveAdvantageIndicator, setTableType, setDataDisplaySettings, setPlayer, setThemeBrightness, setAutoScrollEnabled, setMoveTypeHeadersOn } from "../actions";
import { activeGameSelector, appDisplaySettingsSelector, dataDisplaySettingsSelector, dataTableSettingsSelector, modalVisibilitySelector, modeNameSelector, selectedCharactersSelector } from "../selectors";
import DataTableHeader from "./DataTableHeader";
import DataTableRow from "./DataTableRow";
import ThemeSwitcher from "./ThemeSwitcher";

const TableSettings = () => {
  const activeGame = useSelector(activeGameSelector);
  const modalVisibility = useSelector(modalVisibilitySelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const dataTableType = useSelector(dataTableSettingsSelector).tableType;
  const autoScrollEnabled = useSelector(dataTableSettingsSelector).autoScrollEnabled;
  const moveTypeHeadersOn = useSelector(dataTableSettingsSelector).moveTypeHeadersOn;
  const compactViewOn = useSelector(dataTableSettingsSelector).compactViewOn;
  const xScrollEnabled = useSelector(dataTableSettingsSelector).tableType === "scrolling";
  const moveAdvantageColorsOn = useSelector(dataTableSettingsSelector).moveAdvantageColorsOn;
  const moveAdvantageIndicator = useSelector(dataTableSettingsSelector).moveAdvantageIndicator;
  const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);
  const themeBrightness = useSelector(appDisplaySettingsSelector).themeBrightness;
  const modeName = useSelector(modeNameSelector);

  const dispatch = useDispatch();

  const handleModalDismiss = () => {
    modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "tableSettings", visible: false }));
  };

  const sampleMoveData = {
    official: "LP Hadouken",
    common: "LP Fireball",
    plnCmd: "qcf+LP",
    numCmd: "236LP",
    ezCmd: "f+SP",
    startup: 7,
    active: 2,
    recovery: "11(14)",
    onHit: 2,
    onBlock: -3,
    dmg: 300000000000,
    extraInfo: [
    ],
    moveType: "special",
    i: 1,
  };

  const cols = {
    onHit: "oH",
    onBlock: "oB",
    dmg: "dmg",
    startup: "S",
    active: "A",
    recovery: "R",
  };

  const [showMoveNamePopover, setShowMoveNamePopover] = useState(false);

  const handleMoveNameSelect = (moveNameType) => {
    dispatch(setDataDisplaySettings({moveNameType: moveNameType}));
    dispatch(setPlayer("playerOne", selectedCharacters.playerOne.name));
    dispatch(setPlayer("playerTwo", selectedCharacters.playerTwo.name));
  };

  const sampleMoveName =
    dataDisplaySettings.moveNameType !== "inputs" ?
      sampleMoveData[dataDisplaySettings.moveNameType]
      : sampleMoveData[dataDisplaySettings.inputNotationType];

  return (
    <IonModal
      isOpen={modalVisibility.visible && modalVisibility.currentModal === "tableSettings"}
      onDidDismiss={ () => {
        handleModalDismiss();
      } }
      id="TableSettings"
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => handleModalDismiss()}>Close</IonButton>
          </IonButtons>
          <IonTitle>{modeName === "settings" ? "Frame Data Settings" : "Table Settings"}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {modeName !== "settings" &&
          <>
            <h5>App Theme</h5>
            <ThemeSwitcher lines />

            <IonItem lines="full">
              <IonToggle
                checked={themeBrightness === "light" ? false : true}
                onIonChange={e => { dispatch(setThemeBrightness(e.detail.checked ? "dark" : "light"));}}>Dark Mode</IonToggle>
            </IonItem>
          </>
        }

        <h5>Data Display</h5>
        <div className="custom-setting-item dropdown ion-activatable" onClick={() => setShowMoveNamePopover(true)}>
          <div className="explainer">
            <h2>Move Names</h2>
            {dataDisplaySettings.moveNameType === "official" && <p>Exactly the same as they are in-game</p>}
            {dataDisplaySettings.moveNameType === "common" && <p>Chosen by us to try and help you guess moves</p>}
            {dataDisplaySettings.moveNameType === "inputs" && <p>Uses the below input notation as a move name</p>}
          </div>
          <IonSelect
            id="move-name-select"
            interface="popover"
            value={dataDisplaySettings.moveNameType}
            okText="Select"
            cancelText="Cancel"
            disabled={true}
          >
            <IonSelectOption value="official">Official</IonSelectOption>
            <IonSelectOption value="common">Common</IonSelectOption>
            <IonSelectOption value="inputs">Inputs</IonSelectOption>
          </IonSelect>
          <IonRippleEffect></IonRippleEffect>
        </div>

        <IonPopover
          isOpen={showMoveNamePopover}
          onDidDismiss={() => setShowMoveNamePopover(false)} // Close popover when dismissed
          trigger="move-name-select"
          showBackdrop={isPlatform("ios")}
          alignment="center"
        >
          <IonContent>
            <IonList>
              <IonItem style={{"--background": dataDisplaySettings.moveNameType === "official" && "var(--fat-primary-tint-step-850)"}} lines="none" onClick={() => {handleMoveNameSelect("official"); setShowMoveNamePopover(false);}}>
                <IonLabel>Official</IonLabel>
              </IonItem>
              <IonItem style={{"--background": dataDisplaySettings.moveNameType === "common" && "var(--fat-primary-tint-step-850)"}} lines="none" onClick={() => {handleMoveNameSelect("common"); setShowMoveNamePopover(false);}}>
                <IonLabel>Common</IonLabel>
              </IonItem>
              <IonItem style={{"--background": dataDisplaySettings.moveNameType === "inputs" && "var(--fat-primary-tint-step-850)"}} lines="none" onClick={() => {handleMoveNameSelect("inputs"); setShowMoveNamePopover(false);}}>
                <IonLabel>Inputs</IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>

        <IonItem lines="full">
          <IonSelect
            label={"Input Notation"}
            interface="popover"
            value={dataDisplaySettings.inputNotationType}
            okText="Select"
            cancelText="Cancel"
            onIonChange={e => {
              dispatch(setDataDisplaySettings({inputNotationType: e.detail.value}));
              if (dataDisplaySettings.moveNameType === "inputs" || dataDisplaySettings.inputNotationType === "ezCmd" || e.detail.value === "ezCmd") {
                dispatch(setPlayer("playerOne", selectedCharacters.playerOne.name));
                dispatch(setPlayer("playerTwo", selectedCharacters.playerTwo.name));
              }
            }}
          >
            <IonSelectOption value="plnCmd">Motion</IonSelectOption>
            <IonSelectOption value="numCmd">NumPad</IonSelectOption>
            {activeGame === "SF6" && <IonSelectOption value="ezCmd">Modern</IonSelectOption>}
          </IonSelect>
        </IonItem>

        <h5>Table Layout</h5>
        <div className="custom-setting-item" onClick={() => dispatch(setCompactView(!compactViewOn)) }>
          <div className="explainer">
            <h2>Compact cells</h2>
            <p>Allow the contents of cells to be cut off so that rows all have the same height. Turn this off to see more data in the table view</p>
          </div>
          <IonToggle checked={!!compactViewOn} onClick={() => dispatch(setCompactView(!compactViewOn))} onIonChange={(e) => e.preventDefault()} ></IonToggle>
        </div>

        <div className={"custom-setting-item"} onClick={() => dispatch(setTableType(dataTableType === "fixed" ? "scrolling" : "fixed")) }>
          <div className="explainer">
            <h2>X Axis Scrolling</h2>
            <p>Rather than shrinking rows to fit them on one screen, the table will overflow horizontally and become scrollable.</p>
          </div>
          <IonToggle checked={!!xScrollEnabled} onClick={() => dispatch(setTableType(dataTableType === "fixed" ? "scrolling" : "fixed"))} onIonChange={(e) => e.preventDefault()}></IonToggle>
        </div>
        
        {xScrollEnabled &&
          <div className="custom-setting-item sub-item" onClick={() => dispatch(setAutoScrollEnabled(!autoScrollEnabled)) }>
            <div className="explainer">
              <h2>Table auto-scrolls into view</h2>
              <p>Due to technical limitations with CSS, the table needs to scroll into view to fill the screen. If you find this annoying, you can turn it off here but the table may behave stubbornly on scroll!.</p>
            </div>
            <IonToggle checked={!!autoScrollEnabled} onClick={() => dispatch(setAutoScrollEnabled(!autoScrollEnabled))} onIonChange={(e) => e.preventDefault()}></IonToggle>
          </div>
        }

        <div className="custom-setting-item" onClick={() => dispatch(setMoveTypeHeadersOn(!moveTypeHeadersOn)) }>
          <div className="explainer">
            <h2>Move Type Headers</h2>
            <p>Generate headers throughout the table to separate it by move-type.</p>
          </div>
          <IonToggle checked={!!moveTypeHeadersOn} onClick={() => dispatch(setMoveTypeHeadersOn(!moveTypeHeadersOn))} onIonChange={(e) => e.preventDefault()} ></IonToggle>
        </div>

        <h5>Advantage Highlighting</h5>
        <div className="custom-setting-item" onClick={() => dispatch(setMoveAdvantageColorsOn(!moveAdvantageColorsOn)) }>
          <div className="explainer">
            <h2>Advantage Colours</h2>
            <p>Toggle the coloring of cells which denote advantage such as "On Hit" and "On Punish Counter"</p>
          </div>
          <IonToggle checked={!!moveAdvantageColorsOn} onClick={() => dispatch(setMoveAdvantageColorsOn(!moveAdvantageColorsOn))} onIonChange={(e) => e.preventDefault()}></IonToggle>
        </div>

        <IonItem lines="full">
          <IonSelect interface="popover" label="Advantage Indicator" placeholder="Advantage Indicator" value={moveAdvantageIndicator} onIonChange={(e) => {dispatch(setMoveAdvantageIndicator(e.detail.value)); !moveAdvantageColorsOn && dispatch(setMoveAdvantageColorsOn(true));}}>
            <IonSelectOption value="text">Text Colour</IonSelectOption>
            <IonSelectOption value="background">Background</IonSelectOption>
          </IonSelect>
        </IonItem>

        <table>
          <DataTableHeader
            moveType={sampleMoveData.moveType}
            colsToDisplay={cols}
            xScrollEnabled={xScrollEnabled}
            sample={true}
          />
          <DataTableRow
            moveName={sampleMoveName}
            moveData={sampleMoveData}
            colsToDisplay={cols}
            xScrollEnabled={xScrollEnabled}
            displayOnlyStateMoves={false}
            sample={true}
          />
        </table>

      </IonContent>
    </IonModal>
  );
};

export default TableSettings;
