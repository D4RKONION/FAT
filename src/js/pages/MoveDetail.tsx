import "../../style/components/DetailCards.scss";

import { Capacitor } from "@capacitor/core";
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { isPlatform } from "@ionic/react";
import { bookmarkOutline, bookmark, openOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import nowrap from "../../images/icons/nowrap.svg";
import wrap from "../../images/icons/wrap.svg";
import { addBookmark, removeBookmark, setFrameMeterLayout, setPlayerAttr } from "../actions";
import BookmarkToast from "../components/BookmarkToast";
import FrameMeter from "../components/FrameMeter";
import SegmentSwitcher from "../components/SegmentSwitcher";
import SubHeader from "../components/SubHeader";
import { allSpecificCharacterStates } from "../constants/gamedetails/characterLists";
import { activeGameSelector, activePlayerSelector, appDisplaySettingsSelector, bookmarksSelector, dataDisplaySettingsSelector, gameDetailsSelector, premiumSelector, selectedCharactersSelector } from "../selectors";
import { createSegmentSwitcherObject } from "../utils/segmentSwitcherObject";

const MoveDetail = () => {
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const activeGame = useSelector(activeGameSelector);
  const gameDetails = useSelector(gameDetailsSelector);
  const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);

  const bookmarks = useSelector(bookmarksSelector);
  const [bookmarkToastVisible, setBookmarkToastVisible] = useState(false);
  const [bookmarkToastMessage, setBookmarkToastMessage] = useState("");
  const premiumIsPurchased = useSelector(premiumSelector).lifetimePremiumPurchased;
  
  const frameMeterWrap = useSelector(appDisplaySettingsSelector).frameMeterLayout === "nowrap" ? false : true;

  const dispatch = useDispatch();

  const history = useHistory();

  const [characterHasStates, setCharacterHasStates] = useState(false);

  useEffect(() => {
    setCharacterHasStates(!!gameDetails.specificCharacterStates[selectedCharacters[activePlayer].name]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCharName = selectedCharacters[activePlayer].name;
  const charFrameData = selectedCharacters[activePlayer].frameData;
  const selectedMoveName = selectedCharacters[activePlayer].selectedMove;
  const selectedMoveData = charFrameData[selectedMoveName];

  // Check if the current state is bookmarked
  const [currentBookmarkIndex, setCurrentBookmarkIndex]= useState(-1);
  useEffect(() => {
    setCurrentBookmarkIndex(bookmarks.findIndex((bookmark) =>
      bookmark.modeName === "movedetail" &&
      bookmark.gameName === activeGame &&
      bookmark.characterName === selectedCharacters[activePlayer].name &&
      (bookmark.vtState === selectedCharacters[activePlayer].vtState || (!selectedMoveData.uniqueInVt && bookmark.vtState === "normal")) &&
      selectedMoveData &&
      bookmark.moveName === selectedMoveData["moveName"]
    ));
  }, [selectedCharacters, activeGame, activePlayer, bookmarks, selectedMoveData]);

  if (!selectedMoveData) {
    return null;
  }

  const universalDataPoints = gameDetails.universalDataPoints;
  const specificCancelRows = gameDetails.specificCancels ? gameDetails.specificCancels.filter(cancelRow =>
    Object.keys(cancelRow).every(key => selectedMoveData[key] !== undefined)
  ) : [];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/framedata/${activeGame}/${activeCharName}`} />
          </IonButtons>
          <IonTitle>{`${selectedMoveName} - ${activeCharName}`}</IonTitle>
          <IonButtons slot="end">
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
                  modeName: "movedetail",
                  characterName: selectedCharacters[activePlayer].name,
                  vtState: selectedMoveData.uniqueInVt ? selectedCharacters[activePlayer].vtState : "normal",
                  moveName: selectedMoveData["moveName"],
                }));
                setBookmarkToastMessage(`Bookmark Added: ${activeGame} ${selectedCharacters[activePlayer].name} - ${selectedMoveName}`);
                setBookmarkToastVisible(true);
              }
            }}>
              <IonIcon icon={currentBookmarkIndex !== -1 ? bookmark : bookmarkOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent id="moveDetail">

        <SubHeader
          adaptToShortScreens={false}
          hideOnWideScreens={false}
          rowsToDisplay={[
            [
              <><b>Official Name</b><br />{selectedMoveData["moveName"]}</>,
              <><b>Common Name</b><br />{selectedMoveData["cmnName"] ? selectedMoveData["cmnName"] : selectedMoveData["moveName"]}</>,
              <><b>{dataDisplaySettings.inputNotationType === "ezCmd" ? "Classic" : "Motion"}</b><br />{selectedMoveData["plnCmd"]}</>,
              <>
                {dataDisplaySettings.inputNotationType === "ezCmd"
                  ? <><b>Modern</b><br />{selectedMoveData["ezCmd"]}</>
                  : <><b>NumPad</b><br />{selectedMoveData["numCmd"]}</>
                }
              </>,

            ],
          ]}
        />

        <div className={`segments ${!isPlatform("ios") && "md"}`}>
          {activeGame === "SFV" && !selectedMoveData["uniqueInVt"] ?
            <SegmentSwitcher
              segmentType={"vtrigger"}
              valueToTrack={selectedCharacters[activePlayer].vtState}
              labels={ {normal: "Normal", vtOne: "V-Trigger I" , vtTwo: "V-Trigger II"} }
              clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
            />
            : ((Object.keys(allSpecificCharacterStates[activeGame]).length > 0) &&
                (characterHasStates && selectedCharacters[activePlayer].frameData[Object.keys(selectedCharacters[activePlayer].frameData)[0]].i !== 0)
            ) &&
              <SegmentSwitcher
                segmentType={"vtrigger"}
                valueToTrack={selectedCharacters[activePlayer].vtState}
                labels={createSegmentSwitcherObject(gameDetails.specificCharacterStates[selectedCharacters[activePlayer].name])}
                clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
              />
          }
        </div>

        <div id="flexCardContainer">

          {/* Frame Meter */}
          <IonCard className={`frame-meter ${frameMeterWrap ? "wrap" : "scroll"}`}>
            <div className={`buttoned-card-header ${isPlatform("ios") ? "ios": "md"}`}>
              <span>Frame Meter</span>
              <span className="button-container">
                <IonIcon style={{transform: frameMeterWrap ? "rotate(180deg)" : ""}} onClick={() => dispatch(setFrameMeterLayout(frameMeterWrap ? "nowrap" : "wrap"))} icon={frameMeterWrap ? wrap : nowrap} slot="icon-only" />
              </span>
 
            </div>
            <IonCardContent>
              <FrameMeter
                moveData={
                  {
                    startup: selectedMoveData["startup"],
                    active: selectedMoveData["active"],
                    recovery: selectedMoveData["recovery"],
                  }
                }
                wrap={frameMeterWrap}
              />
              {/* add padding to the end of the meter */}
              {!frameMeterWrap && <span style={{width: "12px"}}></span>}
            </IonCardContent>
          </IonCard>

          {/* Generic Entries */}

          {Object.keys(universalDataPoints).filter(dataSection =>
            universalDataPoints[dataSection].some(dataRow =>
              Object.keys(dataRow).some(dataKey => selectedMoveData[dataKey] !== undefined)
            )
          ).map(dataSection => (
            <IonCard key={dataSection} className={dataSection === "Extra Information" && "final-card"}>
              <IonCardHeader>
                <IonCardTitle>{dataSection}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {universalDataPoints[dataSection].map((dataRow, index) =>
                  dataSection !== "Extra Information" ?
                    <div key={index} className="row">
                      {Object.entries(dataRow).map(([dataId, headerObj]: [string, {[key: string]: {dataTableHeader: string, detailedHeader: string, dataFileKey: string}}]) => {
                        if (dataId === "xx" || dataId === "gatling") {
                          return (
                            <div
                              className={`col ${selectedMoveData.changedValues && selectedMoveData.changedValues.includes(dataId) ? "triggered-data" : "normal-state"}`}
                              key={dataId}
                            >
                              <h2>{headerObj.detailedHeader}</h2>
                              <p>{selectedMoveData[dataId] || selectedMoveData[dataId] === 0 ? selectedMoveData[dataId].join(", ") : "~"}</p>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              className={`col ${selectedMoveData.changedValues && selectedMoveData.changedValues.includes(dataId) ? "triggered-data" : "normal-state"}`}
                              key={dataId}
                            >
                              <h2>{headerObj.detailedHeader}</h2>
                              <p>{selectedMoveData[dataId] || selectedMoveData[dataId] === 0 ? selectedMoveData[dataId] : "~"}</p>
                            </div>
                          );
                        }
                      })}
                    </div>
                    : <ul key={index}>
                      {selectedMoveData["extraInfo"].map((info, index) =>
                        <li key={index}>{info}</li>
                      )}
                    </ul>

                )}
              </IonCardContent>
            </IonCard>

          ))}

          {/* Character Specific Data Entries */}
          {!!specificCancelRows.length &&
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Character Specific Data</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {specificCancelRows.map((dataRow, index) =>
                  <div key={index} className="row">
                    {Object.entries(dataRow).map(([dataId, headerObj]: [string, {[key: string]: {dataTableHeader: string, detailedHeader: string, dataFileKey: string}}]) =>
                      <div className="col" key={dataId}>
                        <h2>{headerObj.detailedHeader}</h2>
                        <p>{selectedMoveData[dataId]}</p>
                      </div>
                    )}
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          }

          {selectedMoveData.dustloopKey &&
            <IonCard className="final-card">
              <IonCardHeader>
                <IonCardTitle>Hitboxes & More On Dustloop</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="row">
                  <div className="col">
                    <IonButton expand="full" fill="clear" onClick={() => window.open(`https://dustloop.com/wiki/index.php?title=GGST/${selectedCharacters[activePlayer].stats.longName ? selectedCharacters[activePlayer].stats.longName : selectedCharacters[activePlayer].name}#${selectedMoveData.dustloopKey}`, "_blank")}>
                      <IonIcon slot="end" icon={openOutline} />
                      Take me there!
                    </IonButton>
                  </div>
                </div>

              </IonCardContent>
            </IonCard>
          }

          {gameDetails.supercomboLink &&
            <IonCard className="final-card">
              <IonCardHeader>
                <IonCardTitle>Move Images & More On SuperCombo.gg</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="row">
                  <div className="col">
                    <IonButton expand="full" fill="clear" onClick={() => window.open(`${gameDetails.supercomboLink}/${selectedCharacters[activePlayer].name}#${selectedMoveData.moveName.replaceAll(" ", "_")}`, "_blank")}>
                      <IonIcon slot="end" icon={openOutline} />
                      Take me there!
                    </IonButton>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          }

        </div>

        <BookmarkToast
          toastVisible={bookmarkToastVisible}
          dismissToast={() => setBookmarkToastVisible(false)}
          message={bookmarkToastMessage}
        ></BookmarkToast>

      </IonContent>
    </IonPage>
  );
};

export default MoveDetail;
