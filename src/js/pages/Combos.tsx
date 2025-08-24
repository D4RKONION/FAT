import "../../style/pages/Combos.scss";
import { IonContent, IonPage, IonList, IonItemDivider, IonLabel, IonItem, IonIcon, IonGrid, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from "@ionic/react";
import { isPlatform } from "@ionic/react";
import { informationCircleOutline, openOutline } from "ionicons/icons";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setActiveFrameDataPlayer, setModalVisibility } from "../actions";
import AdviceToast from "../components/AdviceToast";
import PopoverButton from "../components/PopoverButton";
import SegmentSwitcher from "../components/SegmentSwitcher";
import SF6_COMBOS from "../constants/combos/SF6Combos.json";
import SFV_COMBOS from "../constants/combos/SFVCombos.json";
import { activeGameSelector, activePlayerSelector, modalVisibilitySelector, selectedCharactersSelector } from "../selectors";

const COMBO_DATA_MAP = {
  SFV: {
    data: SFV_COMBOS,
    credit: "https://docs.google.com/spreadsheets/d/1T9CdiurUdmwAscuGOu_B0dB3IInBr5ksFk1VSGnk5uY/edit?gid=0#gid=0",
  
  },
  SF6: {
    data: SF6_COMBOS,
    credit: "https://docs.google.com/spreadsheets/d/1L5hQoTEwKF20IFExQnthy9nVeB23CRuXVplkryvrOKU/edit?gid=0#gid=0",
  },
};

const Combos = () => {
  const modalVisibility = useSelector(modalVisibilitySelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const activeGame = useSelector(activeGameSelector);

  const dispatch = useDispatch();

  const [selectedCombo, setSelectedCombo] = useState(null);
  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{`Combos - ${selectedCharacters[activePlayer].name}`}</IonTitle>
          <IonButtons slot="end">
            <PopoverButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent id="combos">
        <IonGrid fixed>
          {!COMBO_DATA_MAP?.[activeGame]?.data[selectedCharacters[activePlayer].name]
            ?
            <div>
              <h4>No Combos for {activeGame}.<br/>Sorry!</h4>
              {activeGame === "GGST" && <h5>However, you should check out<br/><a target="_system" href={`https://dustloop.com/wiki/index.php?title=GGST/${selectedCharacters[activePlayer].stats.longName ? selectedCharacters[activePlayer].stats.longName : selectedCharacters[activePlayer].name}/Combos`}>Dustloop's extensive combo guide's</a><br/>for {selectedCharacters.playerOne.name}</h5>}
            </div>
            : <>
              <div className={`segments ${!isPlatform("ios") && "md"}`}>
                <SegmentSwitcher
                  key={"CT ActivePlayer"}
                  segmentType={"active-player"}
                  valueToTrack={activePlayer}
                  labels={ {playerOne: `P1: ${selectedCharacters.playerOne.name}`, playerTwo: `P2: ${selectedCharacters.playerTwo.name}`}}
                  clickFunc={ (eventValue) => !modalVisibility.visible && eventValue === activePlayer ? dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true })) : dispatch(setActiveFrameDataPlayer(eventValue)) }
                />
              </div>
              <IonList>
                {Object.keys(COMBO_DATA_MAP[activeGame].data[selectedCharacters[activePlayer].name]).map(comboHeader =>
                  <div className="list-section" key={comboHeader}>
                    <IonItemDivider>
                      {comboHeader}
                    </IonItemDivider>
                    {COMBO_DATA_MAP[activeGame].data[selectedCharacters[activePlayer].name][comboHeader].map((comboEntry, index) =>
                      <div key={comboEntry.input + index}>
                        {comboEntry.input !== ""
                          ? <IonItem button className={selectedCombo === comboEntry.input && "selected-combo"} onClick={() => {setSelectedCombo(comboEntry.input);}}>
                            {comboEntry.notes !== "" && <IonIcon className={selectedCombo === comboEntry.input && "selected-combo"} icon={informationCircleOutline} slot="end" />}
                            <IonLabel>
                              <h2>
                                {comboEntry.input}
                              </h2>
                              <p>
                                {comboEntry.dmg && `Damage: ${comboEntry.dmg}`}
                                {comboEntry.dmg && comboEntry.stun && " | "}
                                {comboEntry.stun && `Stun: ${comboEntry.stun}`}
                              </p>

                              {comboEntry.meter &&
                                <div className="meter-container">
                                  <span className={`meter-bar ${comboEntry.meter > 0 ? "full" : "empty"}`}></span>
                                  <span className={`meter-bar ${comboEntry.meter > 1 ? "full" : "empty"}`}></span>
                                  <span className={`meter-bar ${comboEntry.meter > 2 ? "full" : "empty"}`}></span>
                                </div>
                              }
                              
                              {comboEntry.drive &&
                                <div className="meter-container">
                                  <span className={`drive-bar ${comboEntry.drive > 0 ? "full" : "empty"}`}></span>
                                  <span className={`drive-bar ${comboEntry.drive > 1 ? "full" : "empty"}`}></span>
                                  <span className={`drive-bar ${comboEntry.drive > 2 ? "full" : "empty"}`}></span>
                                  <span className={`drive-bar ${comboEntry.drive > 3 ? "full" : "empty"}`}></span>
                                  <span className={`drive-bar ${comboEntry.drive > 4 ? "full" : "empty"}`}></span>
                                  <span className={`drive-bar ${comboEntry.drive > 5 ? "full" : "empty"}`}></span>
                                  {["1", "2", "3"].includes(comboEntry.super) && <><span className={"super-bar"}></span> {comboEntry.super}</>}
                                </div>
                              }

                              {selectedCombo === comboEntry.input &&
                                <>
                                  <ul className="combo-comments">
                                    {comboEntry.notes &&
                                      comboEntry.notes.split(/(?<!\b(?:cr|cl|st|j|f|c|b))\. (?![a-z])/).map(note => 
                                        <li>{note}</li>
                                      )
                                    }
                                  </ul>
                                  <p className="combo-author"><a href={COMBO_DATA_MAP[activeGame].credit} target="_system">Check out Sestze's sheet! <IonIcon icon={openOutline} /></a></p>
                                </>
                              }
                            </IonLabel>
                          </IonItem>
                          : <IonItem button className="selected-combo">
                            <IonLabel>
                              <h2 className="combo-comments">
                                {comboEntry.notes}
                              </h2>
                            </IonLabel>
                          </IonItem>

                        }
                      </div>
                    )}

                  </div>
                )}

              </IonList>
            </>
          }
          <AdviceToast />
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Combos;
