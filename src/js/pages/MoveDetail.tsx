import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonPage } from '@ionic/react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import GAME_DETAILS from '../constants/GameDetails'
import '../../style/components/DetailCards.scss';
import PageHeader from '../components/PageHeader';
import SubHeader from '../components/SubHeader';
import SegmentSwitcher from '../components/SegmentSwitcher';
import { setActiveGame, setPlayerAttr } from '../actions';
import { activeGameSelector, activePlayerSelector, selectedCharactersSelector } from '../selectors';
import { FrameDataSlug } from '../types';
import { isPlatform } from '@ionic/core';


const MoveDetail = () => {

  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const activeGame = useSelector(activeGameSelector);

  const dispatch = useDispatch();

  const slugs: FrameDataSlug = useParams();
  const modeBackTo = useLocation().pathname.split("/")[1];

  useEffect(() => {

    if (activeGame !== slugs.gameSlug) {
      console.log(activeGame)
      console.log("URL game mismatch");
      dispatch(setActiveGame(slugs.gameSlug));
    }
    
    if ((selectedCharacters[activePlayer].name !== slugs.characterSlug || selectedCharacters[activePlayer].vtState !== slugs.vtStateSlug) ) {
      console.log("URL character/vtState mismatch");
      console.log(slugs)
      dispatch(setPlayerAttr(activePlayer, slugs.characterSlug, {vtState: slugs.vtStateSlug}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (activePlayer === "playerOne") {
      console.log("URL movename mismatch")
      const urlMove = Object.keys(selectedCharacters[activePlayer].frameData).filter(moveDetail => 
        selectedCharacters[activePlayer].frameData[moveDetail].moveName === slugs.moveNameSlug
      )[0]
      dispatch(setPlayerAttr("playerOne", slugs.characterSlug, {selectedMove: urlMove}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCharacters["playerOne"].name])

  const activeCharName = selectedCharacters[activePlayer].name;
  const charFrameData = selectedCharacters[activePlayer].frameData;
  const selectedMoveName = selectedCharacters[activePlayer].selectedMove;
  const selectedMoveData = charFrameData[selectedMoveName];

  if (!selectedMoveData) {
    return null;
  }


  const universalDataPoints = GAME_DETAILS[activeGame].universalDataPoints;
  const specificCancelRows = GAME_DETAILS[activeGame].specificCancels ? GAME_DETAILS[activeGame].specificCancels.filter(cancelRow =>
    Object.keys(cancelRow).every(key => selectedMoveData[key] !== undefined)
  ) : [];

  return (
    <IonPage>
      <PageHeader
        componentsToShow={
          modeBackTo === "yaksha"
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
              <><b>Motion</b><br />{selectedMoveData["plnCmd"]}</>,
              <><b>NumPad</b><br />{selectedMoveData["numCmd"]}</>
            ]
          ]}
        />

        <div className={`segments ${!isPlatform("ios") && "md"}`}>
          {activeGame === "SFV" && !selectedMoveData["uniqueInVt"] &&
            <SegmentSwitcher
              segmentType={"vtrigger"}
              valueToTrack={selectedCharacters[activePlayer].vtState}
              labels={ {normal: "Normal", vtOne: "V-Trigger I" , vtTwo: "V-Trigger II"} }
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
                          if (dataId === "cancelsTo") {
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

        </div>

      </IonContent>
    </IonPage>
  );
};

export default MoveDetail;
