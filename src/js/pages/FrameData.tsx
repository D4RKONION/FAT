import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SegmentSwitcher from '../components/SegmentSwitcher';
import SubHeader from '../components/SubHeader';
import LandscapeOptions from '../components/LandscapeOptions';
import PageHeader from '../components/PageHeader';
import { setActiveFrameDataPlayer, setModalVisibility, setPlayerAttr, setLandscapeCols } from '../actions';
import { useHistory, useParams } from 'react-router';
import { informationCircle } from 'ionicons/icons';
import AdviceToast from '../components/AdviceToast';
import { APP_CURRENT_VERSION_CODE } from '../constants/VersionLogs';
import { activeGameSelector, activePlayerSelector, autoSetSpecificColsSelector, gameDetailsSelector, landscapeColsSelector, modalVisibilitySelector, selectedCharactersSelector } from '../selectors';
import { FrameDataSlug } from '../types';
import { handleNewCharacterLandscapeCols } from '../utils/landscapecols';
import { isPlatform } from '@ionic/react';
import FrameDataSubHeader from '../components/FrameDataSubHeader';
import { createSegmentSwitcherObject } from '../utils/segmentSwitcherObject';
import { Preferences } from '@capacitor/preferences';
import NewDataTable from '../components/NewDataTable';



const FrameData = () => {
  
  const modalVisibility = useSelector(modalVisibilitySelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const activeGame = useSelector(activeGameSelector);
  const landscapeCols = useSelector(landscapeColsSelector);
  const autoSetSpecificCols = useSelector(autoSetSpecificColsSelector);
  const gameDetails = useSelector(gameDetailsSelector);

  const [searchText, setSearchText] = useState('');
  const [characterHasStates, setCharacterHasStates] = useState(false);

  const searchBoxMessages = [`Search ${selectedCharacters[activePlayer].name}`, 'Type a move name', 'Try searching s=4', 'Try searching a>3', 'Try searching r<10', 'Try searching oH>=3', 'Try searching xx=sp', 'Try searching info=fully inv', 'Try searching oB<=-4', 'FAT supports: =, >, <, >=, <=']
  const [searchPlaceholderText, setSearchPlaceholderText] = useState(searchBoxMessages[0]);

  const dispatch = useDispatch();
  
  const history = useHistory();
  const slugs: FrameDataSlug = useParams();

  const [whatsNewCheckComplete, setWhatsNewCheckComplete]= useState(false)

  useEffect(() => {
    dispatch(setLandscapeCols(handleNewCharacterLandscapeCols(gameDetails, selectedCharacters["playerOne"].name, slugs.characterSlug, autoSetSpecificCols, landscapeCols)));

    const checkForNewAppVersion = async () => {
			const lsCurrentVersionCode = await (await Preferences.get({key: "lsCurrentVersionCode"})).value

      if (!lsCurrentVersionCode || parseInt(lsCurrentVersionCode as unknown as string) < APP_CURRENT_VERSION_CODE) {
        await Preferences.set({
          key: `lsCurrentVersionCode`,
          value: APP_CURRENT_VERSION_CODE.toString(),
        });
        dispatch(setModalVisibility({ currentModal: "whatsNew", visible: true }))
      }
      setWhatsNewCheckComplete(true)
		}
		checkForNewAppVersion();

    setSearchPlaceholderText(searchBoxMessages[Math.floor(Math.random() * searchBoxMessages.length)])


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  
  useEffect(() => {
    setCharacterHasStates(!!gameDetails.specificCharacterStates[selectedCharacters[activePlayer].name])
  }, [selectedCharacters, gameDetails, activePlayer])

  const contentRef = useRef(null);

  let lastScrollTime = useRef(0)

  const scrollToBottom = (scrollEvent) => {
    // Passing a duration to the method makes it so the scroll slowly
    // goes to the bottom instead of instantly
    if (scrollEvent.target.scrollTop < 10 || (scrollEvent.timeStamp - lastScrollTime.current) > 1000 ) {
      lastScrollTime.current = scrollEvent.timeStamp
      contentRef.current?.scrollToBottom(500);
    }
  }

  return (
    <IonPage id="frameData">
      <PageHeader
        componentsToShow={{menuButton: true, popover: true, search: true}}
        title={searchPlaceholderText}
        searchText={searchText}
        onSearchHandler={ (text: string) => setSearchText(text)}
      />
      <IonContent ref={contentRef} scrollEvents={true}>
        <SubHeader
          adaptToShortScreens={true}
          hideOnWideScreens={true}
          rowsToDisplay={
            gameDetails.statsPoints["The Basics"].map((dataRow, index) => 
              [
                ...Object.keys(dataRow).map(statKey =>
                  <div key={`stat-point-${dataRow}-${statKey}`}><b>{dataRow[statKey]}</b><br />{
                      statKey === "bestReversal" ? Object.keys(selectedCharacters[activePlayer].frameData).find(moveEntry => 
                        selectedCharacters[activePlayer].frameData[moveEntry].moveName === selectedCharacters[activePlayer].stats[statKey]
                      ) || selectedCharacters[activePlayer].stats[statKey]
                      : selectedCharacters[activePlayer].stats[statKey]
                    
                  }</div>
                ),
                index === 0 && <div key={"tap-stats"} onClick={() => {history.push(`/stats/${selectedCharacters[activePlayer].name}`)}}><b>More Stats</b><br /><IonIcon icon={informationCircle} /></div>
              ]
            )
          }    
        />
        <FrameDataSubHeader
          charName={selectedCharacters[activePlayer].name}
          charStats={selectedCharacters[activePlayer].stats}
          activeGame={activeGame}        
        />
        <div className={`segments ${!isPlatform("ios") && "md"}`}>
          <SegmentSwitcher
            key={"FD ActivePlayer"}
            segmentType={"active-player"}
            valueToTrack={activePlayer}
            labels={ {playerOne: `P1: ${selectedCharacters.playerOne.name}`, playerTwo: `P2: ${selectedCharacters.playerTwo.name}`}}
            clickFunc={ (eventValue) => {
              if (!modalVisibility.visible && eventValue === activePlayer) {
                dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true }));
              } else {
                dispatch(setLandscapeCols(handleNewCharacterLandscapeCols(gameDetails, selectedCharacters[activePlayer].name, selectedCharacters[eventValue].name, autoSetSpecificCols, landscapeCols)));
                dispatch(setActiveFrameDataPlayer(eventValue));
              }
            }}
          />
          {activeGame === "SFV" ?
            <SegmentSwitcher
              segmentType={"vtrigger"}
              valueToTrack={selectedCharacters[activePlayer].vtState}
              labels={ {normal: "Normal", vtOne: "V-Trigger I" , vtTwo: "V-Trigger II"} }
              clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
            />
          : (activeGame === "GGST" || activeGame === "SF6") &&
            <SegmentSwitcher
              passedClassNames={!characterHasStates ? "collapsed" : "expanded"}
              segmentType={"vtrigger"}
              valueToTrack={selectedCharacters[activePlayer].vtState}
              labels={createSegmentSwitcherObject(gameDetails.specificCharacterStates[selectedCharacters[activePlayer].name])}
              clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
            />
          }
        </div>
        

{/* 
        <DataTable searchText={searchText} previewTable={false} /> */}

        <NewDataTable
          frameData={selectedCharacters[activePlayer].frameData}
          searchText={searchText}
          scrollToBottom={scrollToBottom}
          clearSearchText={() => setSearchText("")}
        />
        
        {whatsNewCheckComplete && !modalVisibility.visible &&
          <AdviceToast />
        }
      </IonContent>
      <LandscapeOptions />
    </IonPage>
  );
};

export default FrameData;
