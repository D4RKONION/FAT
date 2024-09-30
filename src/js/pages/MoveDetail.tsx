import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonIcon, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import '../../style/components/DetailCards.scss';
import PageHeader from '../components/PageHeader';
import SubHeader from '../components/SubHeader';
import SegmentSwitcher from '../components/SegmentSwitcher';
import { setPlayerAttr } from '../actions';
import { activeGameSelector, activePlayerSelector, dataDisplaySettingsSelector, gameDetailsSelector, selectedCharactersSelector } from '../selectors';
import { isPlatform } from '@ionic/react';
import { createSegmentSwitcherObject } from '../utils/segmentSwitcherObject';
import { openOutline } from 'ionicons/icons';


const MoveDetail = () => {

  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const activeGame = useSelector(activeGameSelector);
  const gameDetails = useSelector(gameDetailsSelector);
  const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);

  const dispatch = useDispatch();

  const modeBackTo = useLocation().pathname.split("/")[1];

  const [characterHasStates, setCharacterHasStates] = useState(false);

  useEffect(() => {
    setCharacterHasStates(!!gameDetails.specificCharacterStates[selectedCharacters[activePlayer].name])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeCharName = selectedCharacters[activePlayer].name;
  const charFrameData = selectedCharacters[activePlayer].frameData;
  const selectedMoveName = selectedCharacters[activePlayer].selectedMove;
  const selectedMoveData = charFrameData[selectedMoveName];

  if (!selectedMoveData) {
    return null;
  }


  const universalDataPoints = gameDetails.universalDataPoints;
  const specificCancelRows = gameDetails.specificCancels ? gameDetails.specificCancels.filter(cancelRow =>
    Object.keys(cancelRow).every(key => selectedMoveData[key] !== undefined)
  ) : [];

  return (
    <IonPage>
      <PageHeader
        componentsToShow={
          modeBackTo === "quicksearch"
            ? {customBackUrl: `/${modeBackTo}`}
            : {customBackUrl: `/${modeBackTo}/${activeGame}/${activeCharName}`}
          
          
        }
        title={`${selectedMoveName} | ${activeCharName}`}
      />

      <IonContent id="moveDetail">

        <SubHeader
          adaptToShortScreens={false}
          hideOnWideScreens={false}
          rowsToDisplay={[
            [
              <><b>Official Name</b><br />{selectedMoveData["moveName"]}</>,
              <><b>Common Name</b><br />{selectedMoveData["cmnName"] ? selectedMoveData["cmnName"] : selectedMoveData["moveName"]}</>,
              <><b>{dataDisplaySettings.inputNotationType === "ezCmd" ? "Classic" : "Motion"}</b><br />{selectedMoveData["plnCmd"]}</>,
              <>
              {dataDisplaySettings.inputNotationType === "ezCmd"
                ? <><b>Modern</b><br />{selectedMoveData["ezCmd"]}</>
                : <><b>NumPad</b><br />{selectedMoveData["numCmd"]}</>
              }
              </>
              
            ]
          ]}
        />

        <div className={`segments ${!isPlatform("ios") && "md"}`}>
          {activeGame === "SFV" && !selectedMoveData["uniqueInVt"] ?
              <SegmentSwitcher
                segmentType={"vtrigger"}
                valueToTrack={selectedCharacters[activePlayer].vtState}
                labels={ {normal: "Normal", vtOne: "V-Trigger I" , vtTwo: "V-Trigger II"} }
                clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
              />
            : ((activeGame === "GGST" || activeGame === "SF6") &&
                (characterHasStates && selectedCharacters[activePlayer].frameData[Object.keys(selectedCharacters[activePlayer].frameData)[0]].i !== 0)
              ) &&
              <SegmentSwitcher
                segmentType={"vtrigger"}
                valueToTrack={selectedCharacters[activePlayer].vtState}
                labels={createSegmentSwitcherObject(gameDetails.specificCharacterStates[selectedCharacters[activePlayer].name])}
                clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
              />
            }
        </div>
        
        <div id="flexCardContainer">

          {/* Generic Entries */}

          {Object.keys(universalDataPoints).filter(dataSection =>
            universalDataPoints[dataSection].some(dataRow =>
              Object.keys(dataRow).some(dataKey => selectedMoveData[dataKey] !== undefined)
            )
          ).map(dataSection => (
            <IonCard key={dataSection} className={dataSection === "Extra Information" && "final-card"}>
              <IonCardHeader>
                <IonCardTitle>{dataSection}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {universalDataPoints[dataSection].map((dataRow, index) =>
                  dataSection !== "Extra Information" ?
                    <div key={index} className="row">
                      {Object.entries(dataRow).map(([dataId, headerObj]: [string, {[key: string]: {"dataTableHeader": string, "detailedHeader": string, "dataFileKey": string}}]) => {
                          if (dataId === "xx" || dataId === "gatling") {
                            return (
                              <div
                                className={`col ${selectedMoveData.changedValues && selectedMoveData.changedValues.includes(dataId) ? "triggered-data" : "normal-state"}`}
                                key={dataId}
                              >
                                <h2>{headerObj.detailedHeader}</h2>
                                <p>{selectedMoveData[dataId] || selectedMoveData[dataId] === 0 ? selectedMoveData[dataId].join(", ") : "~"}</p>
                              </div>
                            )
                          } else {
                            return (
                              <div
                                className={`col ${selectedMoveData.changedValues && selectedMoveData.changedValues.includes(dataId) ? "triggered-data" : "normal-state"}`}
                                key={dataId}
                              >
                                <h2>{headerObj.detailedHeader}</h2>
                                <p>{selectedMoveData[dataId] || selectedMoveData[dataId] === 0 ? selectedMoveData[dataId] : "~"}</p>
                              </div>
                            )
                          }
                      })}
                    </div>
                    : <ul key={index}>
                        {selectedMoveData["extraInfo"].map((info, index) =>
                          <li key={index}>{info}</li>
                        )}
                      </ul>


                )}
              </IonCardContent>
            </IonCard>

          ))}


          {/* Character Specific Cancels Entries */}
          {!!specificCancelRows.length &&
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Specific Cancels</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {specificCancelRows.map((dataRow, index) =>
                  <div key={index} className="row">
                    {Object.entries(dataRow).map(([dataId, headerObj]: [string, {[key: string]: {"dataTableHeader": string, "detailedHeader": string, "dataFileKey": string}}]) =>
                      <div className="col" key={dataId}>
                        <h2>{headerObj.detailedHeader}</h2>
                        <p>{selectedMoveData[dataId]}</p>
                      </div>
                    )}
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          }

          {selectedMoveData.dustloopKey && 
            <IonCard className="final-card">
              <IonCardHeader>
                <IonCardTitle>Hitboxes & More On Dustloop</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="row">
                  <div className="col">
                    <IonButton expand="full" fill="clear" onClick={() => window.open(`https://dustloop.com/wiki/index.php?title=GGST/${selectedCharacters[activePlayer].stats.longName ? selectedCharacters[activePlayer].stats.longName : selectedCharacters[activePlayer].name}#${selectedMoveData.dustloopKey}`, '_blank')}>
                      <IonIcon slot="end" icon={openOutline} />
                      Take me there!
                    </IonButton>
                  </div>
                </div>
                
            
              </IonCardContent>
            </IonCard>
          }
          
          {gameDetails.supercomboLink && 
            <IonCard className="final-card">
              <IonCardHeader>
                <IonCardTitle>Move Images & More On SuperCombo.gg</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="row">
                  <div className="col">
                    <IonButton expand="full" fill="clear" onClick={() => window.open(`${gameDetails.supercomboLink}/${selectedCharacters[activePlayer].name}#${selectedMoveData.moveName.replaceAll(" ", "_")}`, '_blank')}>
                      <IonIcon slot="end" icon={openOutline} />
                      Take me there!
                    </IonButton>
                  </div>
                </div>
                
            
              </IonCardContent>
            </IonCard>
          }

          

        </div>

      </IonContent>
    </IonPage>
  );
};

export default MoveDetail;
