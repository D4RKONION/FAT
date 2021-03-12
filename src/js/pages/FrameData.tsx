import { IonContent, IonPage, IonIcon, createGesture } from '@ionic/react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from '../components/DataTable';
import SegmentSwitcher from '../components/SegmentSwitcher';
import SubHeader from '../components/SubHeader';
import LandscapeOptions from '../components/LandscapeOptions';
import PageHeader from '../components/PageHeader';
import { setActiveFrameDataPlayer, setModalVisibility, setPlayerAttr, setPlayer, setActiveGame, setLandscapeCols } from '../actions';
import { useHistory, useParams } from 'react-router';
import { informationCircle } from 'ionicons/icons';
import AdviceToast from '../components/AdviceToast';
import { APP_CURRENT_VERSION_CODE } from '../constants/VersionLogs';
import { activeGameSelector, activePlayerSelector, autoSetSpecificColsSelector, landscapeColsSelector, modalVisibilitySelector, selectedCharactersSelector } from '../selectors';
import { FrameDataSlug, PlayerData } from '../types';
import { createCharacterDataCategoryObj, createOrderedLandscapeColsObj } from '../utils/landscapecols';



const FrameData = () => {
  
  const modalVisibility = useSelector(modalVisibilitySelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const activeGame = useSelector(activeGameSelector);
  const landscapeCols = useSelector(landscapeColsSelector);
  const autoSetSpecificCols = useSelector(autoSetSpecificColsSelector);

  const dispatch = useDispatch();
  
  const history = useHistory();
  const slugs: FrameDataSlug = useParams();

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

  useEffect(() => {
    if (!localStorage.getItem("lsCurrentVersionCode") || parseInt(localStorage.getItem("lsCurrentVersionCode")) < APP_CURRENT_VERSION_CODE) {
      localStorage.setItem("lsCurrentVersionCode", APP_CURRENT_VERSION_CODE.toString());
      dispatch(setModalVisibility({ currentModal: "whatsNew", visible: true }))
    } 

    if (activeGame !== slugs.gameSlug) {
      console.log(activeGame)
      console.log("URL game mismatch");
      dispatch(setActiveGame(slugs.gameSlug));
    }

    if (selectedCharacters["playerOne"].name !== slugs.characterSlug) {
      console.log("URL character mismatch");
      handleNewCharacterLandscapeCols("Ryu", slugs.characterSlug)
      dispatch(setPlayer("playerOne", slugs.characterSlug));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // use useRef instead
  let DataTableEl = document.getElementById('dataTable');
  const gesture = createGesture({
    el: DataTableEl,
    threshold: 50,
    gestureName: 'table-swipe',
    onMove: detail => onSwipeHandler(detail)
  });

  const onSwipeHandler = (detail) => {
    if (detail.startX > window.screen.width /2 && detail.currentX < window.screen.width /2 && activePlayer === "playerOne") {
      console.log("swiping left")
      handleNewCharacterLandscapeCols(selectedCharacters.playerOne.name, selectedCharacters.playerTwo.name)
      dispatch(setActiveFrameDataPlayer("playerTwo"));
      gesture.enable(false)
    } else if (detail.startX < window.screen.width /2 && detail.currentX > window.screen.width /2 && activePlayer === "playerTwo") {
      console.log("swiping right")
      handleNewCharacterLandscapeCols(selectedCharacters.playerTwo.name, selectedCharacters.playerOne.name)
      dispatch(setActiveFrameDataPlayer("playerOne"));
      gesture.enable(false)
    }
  }

  useEffect(() => {
    if (DataTableEl) {
      gesture.enable();
      return () => {gesture.enable(false)}
    }
  }, [gesture, DataTableEl])
  

  return (
    <IonPage>
      <PageHeader
        componentsToShow={{menu: true, popover: true}}
        title={`Frame Data | ${selectedCharacters[activePlayer].name}`}
      />
      <IonContent>
        <SubHeader
          adaptToShortScreens={true}
          rowsToDisplay={[
            [
              <><b>Health</b><br />{selectedCharacters[activePlayer].stats.health}</>,
              <><b>Stun</b><br />{selectedCharacters[activePlayer].stats.stun}</>,
              <div onClick={() => {history.push(`/stats/${selectedCharacters[activePlayer].name}`)}}><b>Tap for more</b><br /><IonIcon icon={informationCircle} /></div>
            ],
          [
            <><b>Fwd Dash</b><br />{selectedCharacters[activePlayer].stats.fDash}</>,
            <><b>Back Dash</b><br />{selectedCharacters[activePlayer].stats.bDash}</>,

          ]
        ]}
        />
        <SegmentSwitcher
          key={"FD ActivePlayer"}
          segmentType={"active-player"}
          valueToTrack={activePlayer}
          labels={ {playerOne: `P1: ${selectedCharacters.playerOne.name}`, playerTwo: `P2: ${selectedCharacters.playerTwo.name}`}}
          clickFunc={ (eventValue) => {
            if (!modalVisibility.visible && eventValue === activePlayer) {
              dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true }));
            } else {
              handleNewCharacterLandscapeCols(selectedCharacters[activePlayer].name, selectedCharacters[eventValue].name)
              dispatch(setActiveFrameDataPlayer(eventValue));
            }
          }}
        />
        {activeGame === "SFV" &&
          <SegmentSwitcher
            segmentType={"vtrigger"}
            valueToTrack={selectedCharacters[activePlayer].vtState}
            labels={ {normal: "Normal", vtOne: "V-Trigger I" , vtTwo: "V-Trigger II"} }
            clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
          />
        }


        <DataTable previewTable={false} />

        <AdviceToast />
      </IonContent>
      <LandscapeOptions />
    </IonPage>
  );
};

export default FrameData;
