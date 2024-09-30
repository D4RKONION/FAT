import { IonContent, IonPage, IonList, IonItemDivider, IonLabel, IonItem, IonIcon, IonGrid } from '@ionic/react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../style/pages/Combos.scss';
import SegmentSwitcher from '../components/SegmentSwitcher';
import PageHeader from '../components/PageHeader';
import { setActiveFrameDataPlayer, setModalVisibility } from '../actions';
import { SFV_COMBOS } from '../constants/Combos';
import { informationCircleOutline, openOutline } from 'ionicons/icons';
import AdviceToast from '../components/AdviceToast';
import { activeGameSelector, activePlayerSelector, modalVisibilitySelector, selectedCharactersSelector } from '../selectors';
import { isPlatform } from '@ionic/react';



const Combos = () => {
  
  const modalVisibility = useSelector(modalVisibilitySelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const activeGame = useSelector(activeGameSelector);

  const dispatch = useDispatch();



  const [selectedCombo, setSelectedCombo] = useState(null);
  return (
    <IonPage>
      <PageHeader
        componentsToShow={{menu: true, popover: true}}
        title={`Combos | ${selectedCharacters[activePlayer].name}`}
      />
      <IonContent id="combos">
        <IonGrid fixed>
          {activeGame !== "SFV" || !SFV_COMBOS[selectedCharacters[activePlayer].name]
            ? 
              <div>
                <h4>No Combos for {activeGame}<br/>Sorry!</h4>
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
                {Object.keys(SFV_COMBOS[selectedCharacters[activePlayer].name]).map(comboHeader =>
                  <div className="list-section" key={comboHeader}>
                    <IonItemDivider>
                      {comboHeader}
                    </IonItemDivider>
                    {SFV_COMBOS[selectedCharacters[activePlayer].name][comboHeader].map((comboEntry, index) =>
                    <div key={comboEntry.input + index}>
                      {comboEntry.input !== ""
                        ? <IonItem button className={selectedCombo === comboEntry.input && "selected-combo"} onClick={() => {setSelectedCombo(comboEntry.input)}}>
                            {comboEntry.comments !== "" && <IonIcon className={selectedCombo === comboEntry.input && "selected-combo"} icon={informationCircleOutline} slot="end" />}
                            <IonLabel>
                              <h2>
                                {comboEntry.input}
                              </h2>
                              <p>
                                {comboEntry.damage && `Damage: ${comboEntry.damage}`}
                                {comboEntry.damage && comboEntry.stun && " | "}
                                {comboEntry.stun && `Stun: ${comboEntry.stun}`}
                              </p>
                              {comboEntry.meter &&
                                <div className="meter-container">
                                  <span className={`meter-bar ${comboEntry.meter > 0 ? "full" : "empty"}`}></span>
                                  <span className={`meter-bar ${comboEntry.meter > 1 ? "full" : "empty"}`}></span>
                                  <span className={`meter-bar ${comboEntry.meter > 2 ? "full" : "empty"}`}></span>
                                </div>
                              }
                              
                              {selectedCombo === comboEntry.input &&
                                <>
                                  <h2 className="combo-comments">
                                    {comboEntry.comments}
                                  </h2>
                                  <p className="combo-author">Author: <a href={comboEntry.authLink} target="_system">{comboEntry.author}</a> <IonIcon icon={openOutline}></IonIcon> | Source: <a href={comboEntry.comSour} target="_system">Link</a> <IonIcon icon={openOutline}></IonIcon></p>
                                </>
                              }
                            </IonLabel>
                          </IonItem>
                        : <IonItem button className="selected-combo">
                            <IonLabel>
                                <h2 className="combo-comments">
                                  {comboEntry.comments}
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
