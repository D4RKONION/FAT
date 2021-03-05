import { IonContent, IonPage, IonList, IonItem, IonLabel, IonItemDivider, IonGrid } from '@ionic/react';
import React from 'react';
import { connect } from 'react-redux'
import PageHeader from '../components/PageHeader';
import SegmentSwitcher from '../components/SegmentSwitcher';
import '../../style/pages/MovesList.scss';
import { setPlayerAttr, setModalVisibility, setActiveFrameDataPlayer } from '../actions';
import { useHistory } from 'react-router';
import AdviceToast from '../components/AdviceToast';


const MovesList = ({ activeGame, dataDisplaySettings, selectedCharacters, activePlayer, setPlayerAttr, setModalVisibility, setActiveFrameDataPlayer }) => {
  const history = useHistory();
  const moveData = selectedCharacters[activePlayer].frameData;
  // First we have to get a list of the keys which will be used as move names
  // These aren't nessacarily the names that will be displayed, later we'll
  // filter for LP or LK at the start of a move or change the displayed name
  // if the current key type is already an input
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

  // Then we go through these keys and pull out any headers we might need
  // These will be used to separate out the list in app
  let moveListHeaders = [];
  moveListEntryKeys.forEach(moveKey => {
      if (!moveListHeaders.includes(moveData[moveKey].movesList)) {
          moveListHeaders.push(moveData[moveKey].movesList)
      }
    }
  )

  return (
    <IonPage>
      <PageHeader
        componentsToShow={{ menu: true, popover: true }}
        title={`Moves List - ${selectedCharacters[activePlayer].name}`}
      />
      <IonContent id="movesList">
        <IonGrid fixed>
          <SegmentSwitcher
            key={"ML ActivePlayer"}
            segmentType={"active-player"}
            valueToTrack={activePlayer}
            labels={ {playerOne: `P1: ${selectedCharacters.playerOne.name}`, playerTwo: `P2: ${selectedCharacters.playerTwo.name}`}}
            clickFunc={ (eventValue) => !setModalVisibility.visible && eventValue === activePlayer ? setModalVisibility({ currentModal: "characterSelect", visible: true }) : setActiveFrameDataPlayer(eventValue) }
          />
          {activeGame === "SFV" &&
            <SegmentSwitcher
              segmentType={"vtrigger"}
              valueToTrack={selectedCharacters[activePlayer].vtState}
              labels={ {normal: "Normal", vtOne: "V-Trigger I" , vtTwo: "V-Trigger II"} }
              clickFunc={ (eventValue) => setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue}) }
            />
          }
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
                      <IonItem button key={moveKey} onClick={() => {setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {selectedMove: moveKey}); history.push(`/framedata/${selectedCharacters[activePlayer].name}/${moveKey}`)}}>
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

const mapStateToProps = state => ({
  selectedCharacters: state.selectedCharactersState,
  activePlayer: state.activePlayerState,
  activeGame: state.activeGameState,
  dataDisplaySettings: state.dataDisplaySettingsState,
})

const mapDispatchToProps = dispatch => ({
  setActiveFrameDataPlayer: (oneOrTwo) => dispatch(setActiveFrameDataPlayer(oneOrTwo)),
  setPlayerAttr: (playerId, charName, playerData) => dispatch(setPlayerAttr(playerId, charName, playerData)),
  setModalVisibility: (data)  => dispatch(setModalVisibility(data)),
})


export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )
  (MovesList)
