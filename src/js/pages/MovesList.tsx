import { IonContent, IonPage, IonList, IonItem, IonLabel, IonItemDivider, IonGrid, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from '@ionic/react';
import { useSelector, useDispatch } from 'react-redux';
import SegmentSwitcher from '../components/SegmentSwitcher';
import '../../style/pages/MovesList.scss';
import { setPlayerAttr, setModalVisibility, setActiveFrameDataPlayer } from '../actions';
import { useHistory } from 'react-router';
import AdviceToast from '../components/AdviceToast';
import { activeGameSelector, activePlayerSelector, dataDisplaySettingsSelector, gameDetailsSelector, selectedCharactersSelector } from '../selectors';
import { isPlatform } from '@ionic/react';
import { createSegmentSwitcherObject } from '../utils/segmentSwitcherObject';
import PopoverButton from '../components/PopoverButton';


const MovesList = () => {
  
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const activeGame = useSelector(activeGameSelector);
  const gameDetails = useSelector(gameDetailsSelector);
  const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);

  const dispatch = useDispatch();
  
  const history = useHistory();
  const moveData = selectedCharacters[activePlayer].frameData;

  
  const moveListEntryKeys = Object.keys(moveData).filter(moveKey => {
    if (selectedCharacters[activePlayer].vtState !== "normal") {
      if (moveData[moveKey].uniqueInVt) {
        return moveData[moveKey].movesList
      } else {
        return null;
      }
    } else {
      return moveData[moveKey].movesList
    }
  })

  
  let moveListHeaders = [];
  moveListEntryKeys.forEach(moveKey => {
      if (!moveListHeaders.includes(moveData[moveKey].movesList)) {
          moveListHeaders.push(moveData[moveKey].movesList)
      }
    }
  )

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{`Moves List - ${selectedCharacters[activePlayer].name}`}</IonTitle>
          <IonButtons slot="end">
            <PopoverButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent id="movesList">
        <IonGrid fixed>
          <div className={`segments ${!isPlatform("ios") && "md"}`}>
            <SegmentSwitcher
              key={"ML ActivePlayer"}
              segmentType={"active-player"}
              valueToTrack={activePlayer}
              labels={ {playerOne: `P1: ${selectedCharacters.playerOne.name}`, playerTwo: `P2: ${selectedCharacters.playerTwo.name}`}}
              clickFunc={ (eventValue) => eventValue === activePlayer ? dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true })) : dispatch(setActiveFrameDataPlayer(eventValue)) }
            />
            {activeGame === "SFV" ?
              <SegmentSwitcher
                segmentType={"vtrigger"}
                valueToTrack={selectedCharacters[activePlayer].vtState}
                labels={ {normal: "Normal", vtOne: "V-Trigger I" , vtTwo: "V-Trigger II"} }
                clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
              />
            : (activeGame === "GGST") &&
              <SegmentSwitcher
                segmentType={"vtrigger"}
                valueToTrack={selectedCharacters[activePlayer].vtState}
                labels={createSegmentSwitcherObject(gameDetails.specificCharacterStates[selectedCharacters[activePlayer].name])}
                clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
              />
            }
          </div>
          
          <IonList>
            {!moveListHeaders.length && <h4>No New Unique Moves</h4>}
            {moveListHeaders.map(listHeader =>
              <div key={listHeader} className="list-section">
                <IonItemDivider>
                  {listHeader}
                </IonItemDivider>

                {
                  // filter only for the keys which need to go in this header, then map out a list of strings
                  // removing LP and LK from the start of moves and changing keys that are inputs to
                  // official names.
                  moveListEntryKeys.filter(moveKey =>
                    moveData[moveKey].movesList === listHeader
                  ).map(moveKey => {
                    const namingType = dataDisplaySettings.moveNameType === "common" ? "cmnName" : "moveName";
                    const displayedName = !moveData[moveKey][namingType] ? moveData[moveKey]["moveName"] : moveData[moveKey][namingType];

                    return (
                      <IonItem button key={moveKey} onClick={() => { dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {selectedMove: moveKey})); history.push(`/movedetail/${activeGame}/${selectedCharacters[activePlayer].name}/${selectedCharacters[activePlayer].vtState}/${selectedCharacters[activePlayer].frameData[moveKey]["moveName"]}`)}}>
                        <IonLabel>
                          <h2>
                            {((displayedName.startsWith("LP ") || displayedName.startsWith("LK ")) && (moveData[moveKey].moveType === "special" || moveData[moveKey].moveType === "command-grab"))
                              ? displayedName.substr(3)
                              : displayedName}
                          </h2>
                          <p>
                            {((displayedName.startsWith("LP ") || displayedName.startsWith("LK ")) && (moveData[moveKey].moveType === "special" || moveData[moveKey].moveType === "command-grab"))
                              ? moveData[moveKey][dataDisplaySettings.inputNotationType].substr(0, moveData[moveKey][dataDisplaySettings.inputNotationType].search(/(?:[L](?:P))|(?:(?:L)(?:K))/g)) + moveData[moveKey][dataDisplaySettings.inputNotationType].substr(moveData[moveKey][dataDisplaySettings.inputNotationType].search(/(?:[L](?:P))|(?:(?:L)(?:K))/g) + 1)
                              : moveData[moveKey][dataDisplaySettings.inputNotationType]}
                          </p>
                        </IonLabel>
                      </IonItem>
                    )
                  })
                }

              </div>
            )}

          </IonList>

          <AdviceToast />
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default MovesList;
