import "../../style/pages/FrameData.scss";

import { Preferences } from "@capacitor/preferences";
import { IonContent, IonPage, IonIcon, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonSearchbar, IonButton, IonTitle, IonFab, IonFabButton, ScrollDetail } from "@ionic/react";
import { isPlatform } from "@ionic/react";
import { backspaceOutline, bookmarkOutline, bookmarkSharp, bookmarksSharp, closeOutline, informationCircle, searchSharp } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";

import { setActiveFrameDataPlayer, setModalVisibility, setPlayerAttr, setDataTableColumns, addBookmark, removeBookmark } from "../actions";
import AdviceToast from "../components/AdviceToast";
import BookmarkToast from "../components/BookmarkToast";
import DataTable from "../components/DataTable";
import FrameDataSubHeader from "../components/FrameDataSubHeader";
import LandscapeOptions from "../components/LandscapeOptions";
import PopoverButton from "../components/PopoverButton";
import SegmentSwitcher from "../components/SegmentSwitcher";
import SubHeader from "../components/SubHeader";
import { APP_CURRENT_VERSION_CODE } from "../constants/VersionLogs";
import { activeGameSelector, activePlayerSelector, bookmarksSelector, dataTableSettingsSelector, gameDetailsSelector, modalVisibilitySelector, premiumSelector, selectedCharactersSelector } from "../selectors";
import { FrameDataSlug } from "../types";
import { handleNewCharacterLandscapeCols } from "../utils/landscapecols";
import { createSegmentSwitcherObject } from "../utils/segmentSwitcherObject";

const FrameData = () => {
  const modalVisibility = useSelector(modalVisibilitySelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const activeGame = useSelector(activeGameSelector);
  const dataTableColumns = useSelector(dataTableSettingsSelector).tableColumns;
  const autoSetCharacterSpecificColumnsOn = useSelector(dataTableSettingsSelector).autoSetCharacterSpecificColumnsOn;
  const gameDetails = useSelector(gameDetailsSelector);

  const bookmarks = useSelector(bookmarksSelector);
  const premiumIsPurchased = useSelector(premiumSelector).lifetimePremiumPurchased;

  const [searchShown, setSearchShown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [characterHasStates, setCharacterHasStates] = useState(false);

  const searchBoxMessages = [`Search ${selectedCharacters[activePlayer].name}`, "Type a move name", "Try s: 4", "Try a > 3", "Try r < 10", "Try oH >= 3", "Try xx: sp", "Try info: fully inv", "Try oB <= -4", "Try =, >, <, >=, <="];
  const [searchPlaceholderText, setSearchPlaceholderText] = useState(searchBoxMessages[0]);

  const dispatch = useDispatch();

  const history = useHistory();
  const slugs: FrameDataSlug = useParams();

  const [whatsNewCheckComplete, setWhatsNewCheckComplete]= useState(false);

  const [scrollingUp, setScrollingUp]= useState(true);

  const [bookmarkToastVisible, setBookmarkToastVisible] = useState(false);
  const [bookmarkToastMessage, setBookmarkToastMessage] = useState("");

  useEffect(() => {
    dispatch(setDataTableColumns(handleNewCharacterLandscapeCols(gameDetails, selectedCharacters["playerOne"].name, slugs.characterSlug, autoSetCharacterSpecificColumnsOn, dataTableColumns)));

    const checkForNewAppVersion = async () => {
      const lsCurrentVersionCode = await (await Preferences.get({key: "lsCurrentVersionCode"})).value;

      if (!lsCurrentVersionCode || parseInt(lsCurrentVersionCode as unknown as string) < APP_CURRENT_VERSION_CODE) {
        await Preferences.set({
          key: "lsCurrentVersionCode",
          value: APP_CURRENT_VERSION_CODE.toString(),
        });
        dispatch(setModalVisibility({ currentModal: "whatsNew", visible: true }));
      }
      setWhatsNewCheckComplete(true);
    };
    checkForNewAppVersion();

    setSearchPlaceholderText(searchBoxMessages[Math.floor(Math.random() * searchBoxMessages.length)]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show or hide the state changer when the character or game changes
  useEffect(() => {
    setCharacterHasStates(!!gameDetails.specificCharacterStates[selectedCharacters[activePlayer].name]);
  }, [selectedCharacters, gameDetails, activePlayer]);

  // Check if the current state is bookmarked
  const [currentBookmarkIndex, setCurrentBookmarkIndex]= useState(-1);
  useEffect(() => {
    setCurrentBookmarkIndex(bookmarks.findIndex((bookmark) =>
      bookmark.modeName === "framedata" && bookmark.gameName === activeGame && bookmark.characterName === selectedCharacters[activePlayer].name
    ));
  }, [selectedCharacters, activeGame, activePlayer, bookmarks]);

  const searchRef = useRef(null);
  useEffect(() => {
    if (searchShown) {
      searchRef?.current.setFocus();
    }
  }, [searchShown]);

  const contentRef = useRef(null);
  const lastScrollTime = useRef(0);

  const scrollToBottom = (scrollEvent) => {
    if (scrollEvent.target.scrollTop < 10 || (scrollEvent.timeStamp - lastScrollTime.current) > 1000 ) {
      lastScrollTime.current = scrollEvent.timeStamp;
      contentRef.current?.scrollToBottom(500); // over 500ms
    }
  };

  function handleScroll(ev: CustomEvent<ScrollDetail>) {
    if (ev.detail.deltaY < 0) {
      setScrollingUp(true);
    } else {
      setScrollingUp(false);
    }
  }

  return (
    <IonPage id="FrameData">

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>

          <IonSearchbar
            className="hideOnSmallScreen"
            value={searchText}
            onIonInput={e => setSearchText(e.detail.value!)}
            placeholder={searchPlaceholderText}
          />

          {searchShown
            ? <>
              <IonSearchbar
                className="hideOnWideScreen slideOnChange"
                showCancelButton="always"
                cancelButtonIcon={closeOutline}
                clearIcon={backspaceOutline}
                value={searchText}
                onIonInput={e => setSearchText(e.detail.value!)}
                onIonCancel={() => {setSearchText(""); setSearchShown(false);}}
                placeholder={searchPlaceholderText}
                ref={searchRef}
              />
              <IonButtons slot="end">
                <PopoverButton />
              </IonButtons>
            </>

            : <>
              <IonTitle className="hideOnWideScreen">{activeGame} {!isPlatform("ios") && `- ${selectedCharacters[activePlayer].name}`}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setSearchShown(!searchShown)} className="hideOnWideScreen">
                  <IonIcon icon={searchSharp} slot="icon-only" />
                </IonButton>
                <IonButton onClick={() => {
                  if (currentBookmarkIndex !== -1) {
                    dispatch(removeBookmark(currentBookmarkIndex));
                    setBookmarkToastMessage(`Bookmark Removed: ${activeGame} ${selectedCharacters[activePlayer].name}`);
                    setBookmarkToastVisible(true);
                  } else if (bookmarks.length >= 3 && !premiumIsPurchased && isPlatform("capacitor")) {
                    history.push("/settings/premium");
                  } else {
                    dispatch(addBookmark({
                      gameName: activeGame,
                      modeName: "framedata",
                      characterName: selectedCharacters[activePlayer].name,
                    }));
                    setBookmarkToastMessage(`Bookmark Added: ${activeGame} ${selectedCharacters[activePlayer].name}`);
                    setBookmarkToastVisible(true);
                  }
                }}>
                  <IonIcon icon={currentBookmarkIndex !== -1 ? bookmarkSharp : bookmarkOutline} slot="icon-only" />
                </IonButton>
                <PopoverButton />
              </IonButtons>
            </>

          }

        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} scrollEvents={true} onIonScroll={handleScroll}>
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
                index === 0 && <div key={"tap-stats"} onClick={() => {history.push(`/stats/${activeGame}/${selectedCharacters[activePlayer].name}`);}}><b>More Stats</b><br /><IonIcon icon={informationCircle} /></div>,
              ]
            )
          }
        />
        <FrameDataSubHeader
          charName={selectedCharacters[activePlayer].name}
          characterHasStates={characterHasStates}
          opponentName={selectedCharacters[activePlayer === "playerOne" ? "playerTwo" : "playerOne"].name}
          charStats={selectedCharacters[activePlayer].stats}
          activeGame={activeGame}
        />
        <div className={`hideOnWideScreen segments ${!isPlatform("ios") && "md"}`} style={{flexDirection: "column"}}>
          <SegmentSwitcher
            key={"FD ActivePlayer"}
            segmentType={"active-player"}
            valueToTrack={activePlayer}
            labels={ {playerOne: `P1: ${selectedCharacters.playerOne.name}`, playerTwo: `P2: ${selectedCharacters.playerTwo.name}`}}
            clickFunc={ (eventValue) => {
              if (!modalVisibility.visible && eventValue === activePlayer) {
                dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true }));
              } else {
                dispatch(setDataTableColumns(handleNewCharacterLandscapeCols(gameDetails, selectedCharacters[activePlayer].name, selectedCharacters[eventValue].name, autoSetCharacterSpecificColumnsOn, dataTableColumns)));
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

        <DataTable
          frameData={selectedCharacters[activePlayer].frameData}
          searchText={searchText}
          scrollToBottom={scrollToBottom}
          clearSearchText={() => setSearchText("")}
        />

        {whatsNewCheckComplete && !modalVisibility.visible &&
          <AdviceToast />
        }

        <BookmarkToast
          toastVisible={bookmarkToastVisible}
          dismissToast={() => setBookmarkToastVisible(false)}
          message={bookmarkToastMessage}
        ></BookmarkToast>

        <IonFab className={`${scrollingUp ? "visible" : "hidden"}`} slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => dispatch(setModalVisibility({ currentModal: "bookmarks", visible: true }))} >
            <IonIcon icon={bookmarksSharp}></IonIcon>
          </IonFabButton>
        </IonFab>

      </IonContent>
      <LandscapeOptions />
    </IonPage>
  );
};

export default FrameData;
