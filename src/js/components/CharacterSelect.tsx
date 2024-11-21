import { IonButton, IonButtons, IonHeader, IonModal, IonSearchbar, IonTitle, IonToolbar, isPlatform } from '@ionic/react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setModalVisibility, setPlayer, setActiveFrameDataPlayer, setPlayerAttr, setDataTableColumns } from '../actions';
import SegmentSwitcher from './SegmentSwitcher';
import '../../style/components/CharacterSelect.scss';
import CharacterPortrait from './CharacterPortrait'
import { activeGameSelector, activePlayerSelector, dataTableSettingsSelector, frameDataSelector, gameDetailsSelector, modalVisibilitySelector, modeNameSelector, selectedCharactersSelector } from '../selectors';
import { handleNewCharacterLandscapeCols } from '../utils/landscapecols';
import { createSegmentSwitcherObject } from '../utils/segmentSwitcherObject';
import { useHistory } from 'react-router';

const CharacterSelectModal = () => {

  let history = useHistory();

  const [searchText, setSearchText] = useState('');

  const modeName = useSelector(modeNameSelector);
  const frameDataFile = useSelector(frameDataSelector);
  const gameDetails = useSelector(gameDetailsSelector);
  const modalVisibility = useSelector(modalVisibilitySelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const activeGame = useSelector(activeGameSelector);
  const dataTableColumns = useSelector(dataTableSettingsSelector).tableColumns;
  const autoSetCharacterSpecificColumnsOn = useSelector(dataTableSettingsSelector).autoSetCharacterSpecificColumnsOn;

  const dispatch = useDispatch();


  const onCharacterSelect = (playerId, charName) => {
    dispatch(setModalVisibility({ currentModal: "characterSelect", visible: false }));

    dispatch(setDataTableColumns(handleNewCharacterLandscapeCols(gameDetails, selectedCharacters[playerId].name, charName, autoSetCharacterSpecificColumnsOn, dataTableColumns)));

    dispatch(setPlayer(playerId, charName));

    setSearchText("");

    
    if (playerId === "playerOne" && (modeName === "framedata" || modeName === "moveslist" || modeName === "combos")) {
      history.replace(`/${modeName}/${activeGame}/${charName}`)
    }
    
  }

  return(
    <IonModal
      id="characterSelect"
      isOpen={modalVisibility.visible && modalVisibility.currentModal === "characterSelect"}
      onDidDismiss={ () => modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "characterSelect", visible: false })) }
    >

      <IonHeader>
        <IonToolbar>
          <IonSearchbar value={searchText} onIonInput={e => setSearchText(e.detail.value)} placeholder={"Filter Characters"}></IonSearchbar>
          <IonButtons slot={"end"}>
            <IonButton onClick={() => dispatch(setModalVisibility({ currentModal: "characterSelect", visible: false }))}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
        <div className={`segments ${!isPlatform("ios") && "md"}`}>
          {modeName !== "calc-frametrapchecker" && modeName !== "calc-frametraplister" && modeName !== "calc-framekillgenerator" &&
            <SegmentSwitcher
              key={"CS ActivePlayer"}
              segmentType={"active-player"}
              valueToTrack={activePlayer}
              labels={ {playerOne: `P1: ${selectedCharacters.playerOne.name}`, playerTwo: `P2: ${selectedCharacters.playerTwo.name}`}}
              clickFunc={ (eventValue) => { dispatch(setDataTableColumns(handleNewCharacterLandscapeCols(gameDetails, selectedCharacters[activePlayer].name, selectedCharacters[eventValue].name, autoSetCharacterSpecificColumnsOn, dataTableColumns))); dispatch(setActiveFrameDataPlayer(eventValue)) } }
            />
          }
          {activeGame === "SFV" ?
              <SegmentSwitcher
                segmentType={"vtrigger"}
                valueToTrack={selectedCharacters[activePlayer].vtState}
                labels={ {normal: "Normal", vtOne: "V-Trigger I" , vtTwo: "V-Trigger II"} }
                clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
              />
            : (activeGame === "GGST" || activeGame === "SF6") &&
              <SegmentSwitcher
                segmentType={"vtrigger"}
                valueToTrack={selectedCharacters[activePlayer].vtState}
                labels={createSegmentSwitcherObject(gameDetails.specificCharacterStates[selectedCharacters[activePlayer].name])}
                clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
              />
            }
        </div>

        <div
          id="characterSelectGrid"
          style={{gridTemplateColumns: `repeat(${
            Object.keys(frameDataFile).length < 22 ? "7" :
            Object.keys(frameDataFile).length < 25 ? "8" :
            Object.keys(frameDataFile).length < 46 ? "9" :
            "10"
          }, 1fr [col-start])`}}
        >
          {(gameDetails.characterList as unknown as string[]).filter(charName => charName.toLowerCase().includes(searchText.toLowerCase())).map(charName => {
            const charData = frameDataFile[charName];
            if (!charData || charData.stats.hideCharacter) {return null}
            return(
              <CharacterPortrait
                key={`selectportrait-${activeGame}-${charName}`}
                game={activeGame}
                charName={charName}
                charThreeLetterCode={charData.stats.threeLetterCode.toUpperCase()}
                charColor={charData.stats.color}
                remoteImage={charData.stats.remoteImage}
                showName={true}
                onClick={() => onCharacterSelect(activePlayer, charName)}
              />
            )
          }

          )}
          <div className="hidden-flex-item"></div>
          <div className="hidden-flex-item"></div>
          <div className="hidden-flex-item"></div>
        </div>
    </IonModal>
  )
}

export default CharacterSelectModal;
