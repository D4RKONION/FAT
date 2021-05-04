import { IonContent, IonModal, IonRouterContext } from '@ionic/react';
import { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setModalVisibility, setPlayer, setActiveFrameDataPlayer, setPlayerAttr, setLandscapeCols } from '../actions';
import SegmentSwitcher from './SegmentSwitcher';
import GAME_DETAILS from '../constants/GameDetails';
import '../../style/components/CharacterSelect.scss';
import PageHeader from './PageHeader';
import CharacterPortrait from './CharacterPortrait'
import { activeGameSelector, activePlayerSelector, autoSetSpecificColsSelector, frameDataSelector, landscapeColsSelector, modalVisibilitySelector, modeNameSelector, selectedCharactersSelector } from '../selectors';
import { createCharacterDataCategoryObj, createOrderedLandscapeColsObj } from '../utils/landscapecols';
import { PlayerData } from '../types';
import { isPlatform } from '@ionic/core';

const CharacterSelectModal = () => {

  const routerContext = useContext(IonRouterContext);

  const [searchText, setSearchText] = useState('');

  const modeName = useSelector(modeNameSelector)
  const frameDataFile = useSelector(frameDataSelector)
  const modalVisibility = useSelector(modalVisibilitySelector)
  const selectedCharacters = useSelector(selectedCharactersSelector)
  const activePlayer = useSelector(activePlayerSelector)
  const activeGame = useSelector(activeGameSelector)
  const landscapeCols = useSelector(landscapeColsSelector);
  const autoSetSpecificCols = useSelector(autoSetSpecificColsSelector);

  const dispatch = useDispatch();

  const handleNewCharacterLandscapeCols = (oldCharName: PlayerData["name"], newCharName: PlayerData["name"]) => {

    if (!autoSetSpecificCols) {
      return false;
    }
    
    const charNames = [oldCharName, newCharName]

    charNames.forEach((charName, index) => {
      const characterDataCategoryObj = createCharacterDataCategoryObj(activeGame, charName)

      Object.keys(characterDataCategoryObj).forEach(dataRow =>
        Object.keys(characterDataCategoryObj[dataRow]).forEach(dataEntryKey =>
          dispatch(setLandscapeCols({...createOrderedLandscapeColsObj(activeGame, landscapeCols, dataEntryKey, characterDataCategoryObj[dataRow][dataEntryKey]["dataTableHeader"], index === 0 ? "off" : "on" )}))
        )
      )
    })
    
  }

  const onCharacterSelect = (playerId, charName) => {
    dispatch(setModalVisibility({ currentModal: "characterSelect", visible: false }));

    handleNewCharacterLandscapeCols(selectedCharacters[playerId].name, charName);

    dispatch(setPlayer(playerId, charName));

    setSearchText("");

    
    if (playerId === "playerOne" && (modeName === "framedata" || modeName === "moveslist" || modeName === "combos")) {
      //we have to use IonRouterContext due to this issue
      //https://github.com/ionic-team/ionic-framework/issues/21832
      routerContext.push(`/${modeName}/${activeGame}/${charName}`, "none");
    }
    
  }

  return(
    <IonModal
      id="characterSelect"
      isOpen={modalVisibility.visible && modalVisibility.currentModal === "characterSelect"}
      onDidDismiss={ () => modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "characterSelect", visible: false })) }
    >
      <PageHeader
        componentsToShow={{search: true}}
        buttonsToShow={[{ slot: "end", buttons: [{ text: "Close", buttonFunc: () => dispatch(setModalVisibility({ currentModal: "characterSelect", visible: false }))}] }]}
        title={"Filter Characters"}
        searchText={searchText}
        onSearchHandler={ (text: string) => setSearchText(text)}
      />
      <IonContent>
        <div className={`segments ${!isPlatform("ios") && "md"}`}>
          {modeName !== "calc-frametrapchecker" && modeName !== "calc-frametraplister" && modeName !== "calc-framekillgenerator" &&
            <SegmentSwitcher
              key={"CS ActivePlayer"}
              segmentType={"active-player"}
              valueToTrack={activePlayer}
              labels={ {playerOne: `P1: ${selectedCharacters.playerOne.name}`, playerTwo: `P2: ${selectedCharacters.playerTwo.name}`}}
              clickFunc={ (eventValue) => { handleNewCharacterLandscapeCols(selectedCharacters[activePlayer].name, selectedCharacters[eventValue].name); dispatch(setActiveFrameDataPlayer(eventValue)) } }
            />
          }
          {activeGame === "SFV" &&
            <SegmentSwitcher
              segmentType={"vtrigger"}
              valueToTrack={selectedCharacters[activePlayer].vtState}
              labels={ {normal: "Normal", vtOne: "V-Trigger I" , vtTwo: "V-Trigger II"} }
              clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
            />
          }
        </div>

        <div id="characterSelectGrid">
          {(GAME_DETAILS[activeGame].characterList as unknown as string[]).filter(charName => charName.toLowerCase().includes(searchText.toLowerCase())).map(charName => {
            const charData = frameDataFile[charName];
            if (!charData || charData.stats.hideCharacter) {return null}
            return(
              <CharacterPortrait
                key={`selectportrait-${activeGame}-${charName}`}
                game={activeGame}
                charName={charName}
                charColor={charData.stats.color}
                showName={true}
                onClick={() => onCharacterSelect(activePlayer, charName)}
              />
            )
          }

          )}
        </div>
      </IonContent>
    </IonModal>
  )
}

export default CharacterSelectModal;
