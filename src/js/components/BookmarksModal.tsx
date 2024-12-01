import "../../style/components/BookmarksModal.scss";
import { isPlatform } from "@ionic/core";
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonList, IonModal, IonReorder, IonReorderGroup, IonTitle, IonToolbar } from "@ionic/react";
import { bookmarkOutline, checkmarkSharp, closeSharp, reorderTwoSharp, trashSharp } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { addBookmark, removeBookmark, reorderBookmarks, setActiveFrameDataPlayer, setActiveGame, setModalVisibility, setPlayer, setPlayerAttr } from "../actions";
import { activeGameSelector, activePlayerSelector, bookmarksSelector, dataDisplaySettingsSelector, modalVisibilitySelector, premiumSelector, selectedCharactersSelector } from "../selectors";
import CharacterPortrait from "./CharacterPortrait";
import ChunkyButton from "./ChunkyButton";
import AppSF3FrameData from "../constants/framedata/3SFrameData.json";
import AppGGSTFrameData from "../constants/framedata/GGSTFrameData.json";
import AppSF6FrameData from "../constants/framedata/SF6FrameData.json";
import AppSFVFrameData from "../constants/framedata/SFVFrameData.json";
import AppUSF4FrameData from "../constants/framedata/USF4FrameData.json";
import { allBookmarkStats } from "../constants/gamedetails/characterLists";
import { renameData } from "../utils";

const FRAMEDATA_MAP = {
  "3S": AppSF3FrameData,
  USF4: AppUSF4FrameData,
  SFV: AppSFVFrameData,
  SF6: AppSF6FrameData,
  GGST: AppGGSTFrameData,
};

const MOVE_STATS= {
  Startup: "startup",
  oB: "onBlock",
  oH: "onHit",
};

const BookmarksModal = () => {
  const modalVisibility = useSelector(modalVisibilitySelector);
  const bookmarks = useSelector(bookmarksSelector);
  const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);
  const activeGame = useSelector(activeGameSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const premiumIsPurchased = useSelector(premiumSelector).lifetimePremiumPurchased;

  const dispatch = useDispatch();
  const history = useHistory();

  const [reorderingActive, setReorderingActive] = useState(false);
  const [removeActive, setRemovalActive] = useState(false);

  const handleModalDismiss = () => {
    modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "bookmarks", visible: false }));
    setReorderingActive(false);
    setRemovalActive(false);
  };

  useEffect(() => {
    if (bookmarks.length === 0) {
      setRemovalActive(false);
    }
  }, [bookmarks]);

  return (
    <IonModal
      id="BookmarksModal"
      isOpen={modalVisibility.visible && modalVisibility.currentModal === "bookmarks"}
      onDidDismiss={ () => {
        handleModalDismiss();
      } }
    >

      <IonHeader>
        <IonToolbar>

          <IonButtons slot="end">

            {reorderingActive || removeActive
              ? <IonButton onClick={() => {setReorderingActive(false); setRemovalActive(false);}}><IonIcon slot="icon-only" icon={checkmarkSharp}></IonIcon></IonButton>
              :
              <>
                {bookmarks.length !== 0 &&
                    <IonButton size="small" onClick={() => setRemovalActive(true)}><IonIcon slot="icon-only" icon={trashSharp}></IonIcon></IonButton>
                }
                {bookmarks.length > 1 &&
                    <IonButton onClick={() => setReorderingActive(true)}><IonIcon slot="icon-only" icon={reorderTwoSharp}></IonIcon></IonButton>
                }
                <IonButton onClick={() => handleModalDismiss()}><IonIcon slot="icon-only" icon={closeSharp}></IonIcon></IonButton>
              </>

            }
          </IonButtons>
          <IonTitle slot="start">Bookmarks</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          <IonReorderGroup disabled={!reorderingActive} onIonItemReorder={event => dispatch(reorderBookmarks(event.detail.complete(bookmarks)))}>
            {bookmarks.map((bookmark, index) => {
            // MOVE-DETAIL BOOKMARK
              if (bookmark.modeName === "movedetail") {
                const renamedMoveObject = renameData({[bookmark.moveName]: FRAMEDATA_MAP[bookmark.gameName][bookmark.characterName].moves[bookmark.vtState][bookmark.moveName]}, dataDisplaySettings.moveNameType, dataDisplaySettings.inputNotationType);
                const userChosenName = Object.keys(renamedMoveObject)[0];
                return (
                  <IonReorder key={`stat-${bookmark.gameName}-${bookmark.characterName}-${bookmark.moveName}`}>
                    <IonItem button onClick={() => {
                      if (reorderingActive || removeActive) return false;

                      // we replace the current URL with the frame-data page for the new character,
                      // so that when the user goes "back" they go back to that page

                      // We need to set the active player to player one so that the page is correctly displayed
                      dispatch(setActiveFrameDataPlayer("playerOne"));
                      if (bookmark.gameName !== activeGame) {
                        dispatch(setActiveGame(bookmark.gameName, true, bookmark.characterName, bookmark.vtState, userChosenName));
                      } else {
                        dispatch(setPlayerAttr("playerOne", bookmark.characterName, { selectedMove: userChosenName, vtState: bookmark.vtState }));
                      }

                      history.push(`/${bookmark.modeName}/${bookmark.gameName}/${bookmark.characterName}/${bookmark.vtState}/${bookmark.moveName}`);

                      handleModalDismiss();
                    }} routerDirection="root">

                      <div className="bookmark-entry">
                        <CharacterPortrait
                          charName={bookmark.characterName}
                          game={bookmark.gameName}
                          charColor={"#ffff00"}
                          remoteImage={false}
                          showName={false}
                          selected={true}
                        ></CharacterPortrait>
                        <div className="bio">
                          <p>{bookmark.gameName}</p>
                          <h1>{userChosenName}</h1>
                        </div>
                        {!(reorderingActive || removeActive) &&
                        <div className="details">
                          {Object.keys(MOVE_STATS).map((statKey, index) => {
                            return (
                              <span key={`stat-${bookmark.gameName}-${bookmark.characterName}-${bookmark.moveName}-${statKey}`} className={index === 0 ? "small" : index === 1 ? "medium" : "large"}>
                                <h1>{renamedMoveObject[userChosenName][MOVE_STATS[statKey]] ? renamedMoveObject[userChosenName][MOVE_STATS[statKey]] : "~"}</h1>
                                <p>{statKey}</p>
                              </span>);
                          })}
                        </div>
                        }

                      </div>
                      <IonReorder slot="end"></IonReorder>
                      {removeActive &&
                      <IonButton onClick={() => dispatch(removeBookmark(index))} size="default" slot="end" fill="clear"><IonIcon slot="icon-only" icon={trashSharp} ></IonIcon></IonButton>
                      }

                    </IonItem>
                  </IonReorder>
                );
              } else {
                return (
                // CHARACTER BOOKMARK
                  <IonReorder key={`stat-${bookmark.gameName}-${bookmark.characterName}-${index}`}>
                    <IonItem button onClick={() => {
                      if (reorderingActive || removeActive) return false;
                      dispatch(setActiveFrameDataPlayer("playerOne"));

                      if (bookmark.gameName !== activeGame) {
                        dispatch(setActiveGame(bookmark.gameName, true, bookmark.characterName));
                      } else if (selectedCharacters["playerOne"].name !== bookmark.characterName) {
                        dispatch(setPlayer("playerOne", bookmark.characterName));
                      }

                      const bookmarkURL = `/${bookmark.modeName}/${bookmark.gameName}/${bookmark.characterName}`;
                      history.replace(bookmarkURL);

                      handleModalDismiss();
                    }} routerDirection="root">
                      <div className="bookmark-entry">
                        <CharacterPortrait
                          charName={bookmark.characterName}
                          game={bookmark.gameName}
                          charColor={"#ffff00"}
                          remoteImage={false}
                          showName={false}
                          selected={true}
                        ></CharacterPortrait>
                        <div className="bio">
                          <p>{bookmark.gameName} {bookmark.moveName && `- ${bookmark.moveName}`}</p>
                          <h1>{bookmark.characterName}</h1>
                        </div>
                        {!(reorderingActive || removeActive) &&
                        <div className="details">
                          {Object.keys(allBookmarkStats[bookmark.gameName]).map((statKey, index) => {
                            return (
                              <span key={`stat-${bookmark.gameName}-${bookmark.characterName}-${statKey}`} className={index === 0 ? "small" : index === 1 ? "medium" : "large"}>
                                <h1>{FRAMEDATA_MAP[bookmark.gameName][bookmark.characterName].stats[statKey]}</h1>
                                <p>{allBookmarkStats[bookmark.gameName][statKey]}</p>
                              </span>);
                          })}
                        </div>
                        }

                      </div>
                      <IonReorder slot="end"></IonReorder>
                      {removeActive &&
                      <IonButton onClick={() => dispatch(removeBookmark(index))} size="default" slot="end" fill="clear"><IonIcon slot="icon-only" icon={trashSharp} ></IonIcon></IonButton>
                      }

                    </IonItem>
                  </IonReorder>
                );
              }
            })}
          </IonReorderGroup>
        </IonList>
        {bookmarks.length === 0 ?
          <div className="bookmark-message-container">
            <h1>No bookmarks!</h1>
            <p>{isPlatform("desktop") ? "Click" : "Tap"} a bookmark <IonIcon icon={bookmarkOutline}/> to see it here</p>
            <p>or <span onClick={() => {
              if (bookmarks.length >= 3 && !premiumIsPurchased && !isPlatform("desktop")) {
                history.push("/settings/premium");
              } else {
                dispatch(addBookmark({
                  gameName: activeGame,
                  modeName: "framedata",
                  characterName: selectedCharacters[activePlayer].name,
                }));
              }
            }}>add the current character</span></p>
          </div>
          : (
            (bookmarks.length < 3 && !premiumIsPurchased) || premiumIsPurchased || isPlatform("desktop"))
          && !(removeActive || reorderingActive)
          && bookmarks.findIndex((bookmark) =>
            bookmark.modeName === "framedata" && bookmark.gameName === activeGame && bookmark.characterName === selectedCharacters[activePlayer].name
          ) === -1 ?
            <div className="bookmark-message-container">
              <ChunkyButton extraText={!premiumIsPurchased && !isPlatform("desktop") && `${3 - bookmarks.length} free bookmark${bookmarks.length !== 2 ? "s" : ""} left`} onClick={() => {
                if (bookmarks.length >= 3 && !premiumIsPurchased && !isPlatform("desktop")) {
                  history.push("/settings/premium");
                } else {
                  dispatch(addBookmark({
                    gameName: activeGame,
                    modeName: "framedata",
                    characterName: selectedCharacters[activePlayer].name,
                  }));
                }
              }}>Add {selectedCharacters[activePlayer].name} to bookmarks</ChunkyButton>
            </div>
            : ""
        }
        {bookmarks.length >=3 && (!premiumIsPurchased && !isPlatform("desktop")) &&
          <div className="bookmark-message-container">
            <ChunkyButton extraText={"Get unlimited bookmarks"} onClick={() => {
              handleModalDismiss();
              history.push("/settings/premium");
            }}>Upgrade to Premium!</ChunkyButton>
          </div>
        }
      </IonContent>

    </IonModal>
  );
};

export default BookmarksModal;