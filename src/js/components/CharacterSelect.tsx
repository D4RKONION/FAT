import { IonContent, IonModal, IonRouterContext } from '@ionic/react';
import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setModalVisibility, setPlayer, setActiveFrameDataPlayer, setPlayerAttr } from '../actions';
import SegmentSwitcher from './SegmentSwitcher';
import GAME_DETAILS from '../constants/GameDetails';
import '../../style/components/CharacterSelect.scss';
import PageHeader from './PageHeader';
import CharacterPortrait from './CharacterPortrait'

const CharacterSelectModal = () => {

  const routerContext = useContext(IonRouterContext);

  const modeName = useSelector(state => state.modeNameState)
  const frameDataFile = useSelector(state => state.frameDataState)
  const modalVisibility = useSelector(state => state.modalVisibilityState)
  const selectedCharacters = useSelector(state => state.selectedCharactersState)
  const activePlayer = useSelector(state => state.activePlayerState)
  const activeGame = useSelector(state => state.activeGameState)

  const dispatch = useDispatch();

  const onCharacterSelect = (playerId, charName) => {
    dispatch(setPlayer(playerId, charName));
    dispatch(setModalVisibility({ currentModal: "characterSelect", visible: false }));
    if (playerId === "playerOne" && (modeName === "framedata" || modeName === "moveslist" || modeName === "combos")) {
      //we have to use IonRouterContext due to this issue
      //https://github.com/ionic-team/ionic-framework/issues/21832
      routerContext.push(`/${modeName}/${activeGame}/${charName}`, "none");
    }

  }

  return(
    <IonModal
      isOpen={modalVisibility.visible && modalVisibility.currentModal === "characterSelect"}
      onDidDismiss={ () => modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "characterSelect", visible: false })) }
    >
      <PageHeader
        buttonsToShow={[{ slot: "end", buttons: [{ text: "Close", buttonFunc: () => dispatch(setModalVisibility({ currentModal: "characterSelect", visible: false }))}] }]}
        title={`${activeGame} | ${selectedCharacters[activePlayer].name}`}
      />
      <IonContent>

        {modeName !== "calc-frametrapchecker" && modeName !== "calc-frametraplister" && modeName !== "calc-framekillgenerator" &&
          <SegmentSwitcher
            key={"CS ActivePlayer"}
            segmentType={"active-player"}
            valueToTrack={activePlayer}
            labels={ {playerOne: `P1: ${selectedCharacters.playerOne.name}`, playerTwo: `P2: ${selectedCharacters.playerTwo.name}`}}
            clickFunc={ (eventValue) => dispatch(setActiveFrameDataPlayer(eventValue)) }
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

        <div id="characterSelectGrid">
          {GAME_DETAILS[activeGame].characterList.map(charName => {
            const charData = frameDataFile[charName];
            if (!charData) {return false}
            return(
              <CharacterPortrait
                key={`selectportrait-${activeGame}-${charName}`}
                game={activeGame.toLowerCase()}
                charName={charName}
                charColor={charData.stats.color}
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
