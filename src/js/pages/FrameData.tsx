import { IonContent, IonPage, IonIcon, createGesture } from '@ionic/react';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from '../components/DataTable';
import SegmentSwitcher from '../components/SegmentSwitcher';
import SubHeader from '../components/SubHeader';
import LandscapeOptions from '../components/LandscapeOptions';
import PageHeader from '../components/PageHeader';
import { setActiveFrameDataPlayer, setModalVisibility, setPlayerAttr, setPlayer, setActiveGame } from '../actions';
import { useHistory, useParams } from 'react-router';
import { informationCircle } from 'ionicons/icons';
import AdviceToast from '../components/AdviceToast';
import { APP_CURRENT_VERSION_CODE } from '../constants/VersionLogs';



const FrameData = () => {
  
  const modalVisibility = useSelector(state => state.modalVisibilityState);
  const selectedCharacters = useSelector(state => state.selectedCharactersState);
  const activePlayer = useSelector(state => state.activePlayerState);
  const activeGame = useSelector(state => state.activeGameState);

  const dispatch = useDispatch();
  
  const history = useHistory();
  const slugs = useParams();

  useEffect(() => {
    if (!localStorage.getItem("lsCurrentVersionCode") || localStorage.getItem("lsCurrentVersionCode") < APP_CURRENT_VERSION_CODE) {
      localStorage.setItem("lsCurrentVersionCode", APP_CURRENT_VERSION_CODE);
      dispatch(setModalVisibility({ currentModal: "whatsNew", visible: true }))
    } 

    if (activeGame !== slugs.gameSlug) {
      console.log(activeGame)
      console.log("URL game mismatch");
      dispatch(setActiveGame(slugs.gameSlug));
    }

    if (selectedCharacters["playerOne"].name !== slugs.characterSlug) {
      console.log("URL character mismatch");
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
      dispatch(setActiveFrameDataPlayer("playerTwo"));
      gesture.enable(false)
    } else if (detail.startX < window.screen.width /2 && detail.currentX > window.screen.width /2 && activePlayer === "playerTwo") {
      console.log("swiping right")
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


        <DataTable/>

        <AdviceToast />
      </IonContent>
      <LandscapeOptions />
    </IonPage>
  );
};

export default FrameData;
