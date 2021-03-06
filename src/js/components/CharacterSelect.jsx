import { IonContent, IonModal, IonRouterContext } from '@ionic/react';
import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';

import { setModalVisibility, setPlayer, setActiveFrameDataPlayer, setPlayerAttr } from '../actions';
import SegmentSwitcher from './SegmentSwitcher';
import GAME_DETAILS from '../constants/GameDetails';
import '../../style/components/CharacterSelect.scss';
import PageHeader from './PageHeader';
import CharacterPortrait from './CharacterPortrait'

const CharacterSelectModal =({
  modeName,
  frameDataFile,
  modalVisibility,
  setModalVisibility,
  setActiveFrameDataPlayer,
  selectedCharacters,
  setPlayer,
  setPlayerAttr,
  activeGame,
  activePlayer,
}) => {

  let history = useHistory();
  const routerContext = useContext(IonRouterContext);

  const onCharacterSelect = (playerId, charName) => {
    setPlayer(playerId, charName);
    setModalVisibility({ currentModal: "characterSelect", visible: false });
    if (modeName.substr(0, 4) !== "calc" && modeName !== "statcompare" && modeName !== "settings" && !modeName.startsWith("moreresources") && modeName !== "yaksha" && modeName !== "themestore" && modeName !== "subpage") {
      if (playerId === "playerOne") {
        //we have to use IonRouterContext due to this issue
        //https://github.com/ionic-team/ionic-framework/issues/21832
        routerContext.push(`/${modeName}/${charName}`, "none");
      }
    }

  }

  return(
    <IonModal
      isOpen={modalVisibility.visible && modalVisibility.currentModal === "characterSelect"}
      onDidDismiss={ () => modalVisibility.visible && setModalVisibility({ currentModal: "characterSelect", visible: false }) }
    >
      <PageHeader
        buttonsToShow={[{ slot: "end", buttons: [{ text: "Close", buttonFunc() {return setModalVisibility({ currentModal: "characterSelect", visible: false })}}] }]}
        title={`${activeGame} | ${selectedCharacters[activePlayer].name}`}
      />
      <IonContent>

        {modeName !== "calc-frametrapchecker" && modeName !== "calc-frametraplister" && modeName !== "calc-framekillgenerator" &&
          <SegmentSwitcher
            key={"CS ActivePlayer"}
            segmentType={"active-player"}
            valueToTrack={activePlayer}
            labels={ {playerOne: `P1: ${selectedCharacters.playerOne.name}`, playerTwo: `P2: ${selectedCharacters.playerTwo.name}`}}
            clickFunc={ (eventValue) => setActiveFrameDataPlayer(eventValue) }
          />
        }
        {activeGame === "SFV" &&
          <SegmentSwitcher
            segmentType={"vtrigger"}
            valueToTrack={selectedCharacters[activePlayer].vtState}
            labels={ {normal: "Normal", vtOne: "V-Trigger I" , vtTwo: "V-Trigger II"} }
            clickFunc={ (eventValue) => setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue}) }
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

const mapStateToProps = state => ({
  modeName: state.modeNameState,
  frameDataFile: state.frameDataState,
  modalVisibility: state.modalVisibilityState,
  selectedCharacters: state.selectedCharactersState,
  activePlayer: state.activePlayerState,
  activeGame: state.activeGameState,
})

const mapDispatchToProps = dispatch => ({
  setActiveFrameDataPlayer: (oneOrTwo) => dispatch(setActiveFrameDataPlayer(oneOrTwo)),
  setPlayerAttr: (playerId, charName, playerData) => dispatch(setPlayerAttr(playerId, charName, playerData)),
  setModalVisibility: (data)  => dispatch(setModalVisibility(data)),
  setPlayer: (playerId, charName) => dispatch(setPlayer(playerId, charName)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
(CharacterSelectModal);
