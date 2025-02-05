import "../../style/pages/FrameData.scss";
import "../../style/components/DetailCards.scss";

import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { IonContent, IonPage, IonIcon, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonSearchbar, IonButton, IonTitle, IonFab, IonFabButton, ScrollDetail } from "@ionic/react";
import { isPlatform } from "@ionic/react";
import { backspaceOutline, bookmarkOutline, bookmarkSharp, bookmarksSharp, chevronDown, chevronUp, closeOutline, informationCircleOutline, searchSharp } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { setActiveFrameDataPlayer, setModalVisibility, setPlayerAttr, setDataTableColumns, addBookmark, removeBookmark, setSubheaderStatsCollapsed } from "../actions";
import AdviceToast from "../components/AdviceToast";
import BookmarkToast from "../components/BookmarkToast";
import DataTable from "../components/DataTable";
import FrameDataSubHeader from "../components/FrameDataSubHeader";
import LandscapeOptions from "../components/LandscapeOptions";
import PopoverButton from "../components/PopoverButton";
import SegmentSwitcher from "../components/SegmentSwitcher";
import { APP_CURRENT_VERSION_CODE } from "../constants/VersionLogs";
import { activeGameSelector, activePlayerSelector, appDisplaySettingsSelector, bookmarksSelector, dataDisplaySettingsSelector, dataTableSettingsSelector, frameDataSelector, gameDetailsSelector, modalVisibilitySelector, premiumSelector, selectedCharactersSelector } from "../selectors";
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
  const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);
  const subheaderStatsCollapsed = useSelector(appDisplaySettingsSelector).subheaderStatsCollapsed;
  const xScrollEnabled = useSelector(dataTableSettingsSelector).tableType === "scrolling";
  const frameData = useSelector(frameDataSelector);

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
  const [scrolledToTop, setScrolledToTop]= useState(true);

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
  
  // Pops up the keyboard on native platforms when searchbar is tapped
  const searchRef = useRef(null);
  useEffect(() => {
    if (searchShown) {
      searchRef?.current.setFocus();
    }
  }, [searchShown]);

  // Scrolling logic for xAxis scrolling
  const contentRef = useRef(null);
  const lastScrollTime = useRef(0);

  const scrollToBottom = (scrollEvent) => {
    if (scrollEvent.target.scrollTop < 10 || (scrollEvent.timeStamp - lastScrollTime.current) > 1000 ) {
      lastScrollTime.current = scrollEvent.timeStamp;
      contentRef.current?.scrollToBottom(500); // over 500ms
    }
  };

  //Handles scrolling up to display the bookmarks fab
  function handleScroll(ev: CustomEvent<ScrollDetail>) {
    if (ev.detail.scrollTop === 0) {
      setScrolledToTop(true);
    } else {
      setScrolledToTop(false);
    }
    if (ev.detail.deltaY < 0) {
      setScrollingUp(true);
    } else {
      setScrollingUp(false);
    }
  }

  return (
    <IonPage id="FrameData">

      <IonHeader style={scrolledToTop ? {boxShadow: "none"} : {}}>
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
                  } else if (bookmarks.length >= 3 && !premiumIsPurchased && Capacitor.isNativePlatform()) {
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

      <IonContent className={xScrollEnabled ? "xScroll" : "fixed"} ref={contentRef} scrollEvents={true} onIonScroll={handleScroll}>

        <Swiper pagination={true} modules={[Pagination]} loop={true} className={subheaderStatsCollapsed && "collapsed"}>
          {Object.keys(gameDetails.statsPoints).filter(dataSection =>
            gameDetails.statsPoints[dataSection].some(dataRow =>
              Object.keys(dataRow).some(dataKey => selectedCharacters[activePlayer].stats[dataKey] !== undefined)
            )
          ).map(dataSection => {
            return (
              <SwiperSlide key={dataSection}>
                <div className="slide-card">
                  {gameDetails.statsPoints[dataSection].map((dataRow, index) =>
                    <div key={index} className="row">
                      {Object.entries(dataRow).map(([dataId, headerObj]) =>
                        <div key={dataId} className="col">
                          <h5>{headerObj}</h5>
                          <p>
                            {
                              dataId === "bestReversal"
                                ? frameData[selectedCharacters[activePlayer].name] && frameData[selectedCharacters[activePlayer].name].moves.normal[selectedCharacters[activePlayer].stats[dataId]] && frameData[selectedCharacters[activePlayer].name].moves.normal[selectedCharacters[activePlayer].stats[dataId]][dataDisplaySettings.moveNameType === "common"
                                  ? "cmnName"
                                  : dataDisplaySettings.inputNotationType]
                                : selectedCharacters[activePlayer].stats[dataId]
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
          <SwiperSlide>
            <div className="slide-card see-all-card " onClick={() => history.push(`/stats/${activeGame}/${selectedCharacters[activePlayer].name}`)}>
              <div className="row">
                <div className="col">
                  <h4>See all stats</h4>
                  <IonIcon icon={informationCircleOutline} />
                </div>
              </div>

            </div>
          </SwiperSlide>

          <button onClick={() => dispatch(setSubheaderStatsCollapsed(!subheaderStatsCollapsed))} className="swiper-toggle"><span className="label">Show stats</span> <IonIcon size="icon-only" icon={subheaderStatsCollapsed ? chevronDown : chevronUp} /></button>
        </Swiper>
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

        <FrameDataSubHeader
          charName={selectedCharacters[activePlayer].name}
          characterHasStates={characterHasStates}
          opponentName={selectedCharacters[activePlayer === "playerOne" ? "playerTwo" : "playerOne"].name}
          charStats={selectedCharacters[activePlayer].stats}
          activeGame={activeGame}
        />

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
