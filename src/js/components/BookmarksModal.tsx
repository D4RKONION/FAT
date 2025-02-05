import "../../style/components/BookmarksModal.scss";
import { Capacitor } from "@capacitor/core";
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonList, IonModal, IonReorder, IonReorderGroup, IonTitle, IonToolbar } from "@ionic/react";
import { bookmarkOutline, checkmarkSharp, closeSharp, reorderTwoSharp, trashSharp } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { addBookmark, reorderBookmarks, setActiveFrameDataPlayer, setActiveGame, setModalVisibility, setPlayer, setPlayerAttr } from "../actions";
import { activeGameSelector, activePlayerSelector, bookmarksSelector, modalVisibilitySelector, premiumSelector, selectedCharactersSelector } from "../selectors";
import CharacterEntryDetailed from "./CharacterEntryDetailed";
import ChunkyButton from "./ChunkyButton";

const BookmarksModal = () => {
  const modalVisibility = useSelector(modalVisibilitySelector);
  const bookmarks = useSelector(bookmarksSelector);
  const activeGame = useSelector(activeGameSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const premiumIsPurchased = useSelector(premiumSelector).lifetimePremiumPurchased;

  const dispatch = useDispatch();
  const history = useHistory();

  const [reorderingActive, setReorderingActive] = useState(false);
  const [removalActive, setRemovalActive] = useState(false);

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

            {reorderingActive || removalActive
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
        <IonList style={{paddingBottom: (((bookmarks.length < 3 && !premiumIsPurchased) || premiumIsPurchased || !Capacitor.isNativePlatform())
          && !(removalActive || reorderingActive)
          && bookmarks.findIndex( (bookmark) =>
            bookmark.modeName === "framedata" && bookmark.gameName === activeGame && bookmark.characterName === selectedCharacters[activePlayer].name
          ) === -1 ) || bookmarks.length >=3 && (!premiumIsPurchased && Capacitor.isNativePlatform()) ? "calc(var(--safe-area-inset-bottom) + 70px)" : "var(--safe-area-inset-bottom)"}}>
          <IonReorderGroup disabled={!reorderingActive} onIonItemReorder={event => dispatch(reorderBookmarks(event.detail.complete(bookmarks)))}>
            {bookmarks.map((bookmark, index) => {
            // MOVE-DETAIL BOOKMARK
              if (bookmark.modeName === "movedetail") {
                return (
                  <IonReorder key={`stat-${bookmark.gameName}-${bookmark.characterName}-${bookmark.moveName}`}>
                    <CharacterEntryDetailed
                      bookmark={bookmark}
                      bookmarkIndex={index}
                      disableOnClick={reorderingActive || removalActive}
                      onClickHandler={(userChosenName) => {
                        dispatch(setActiveFrameDataPlayer("playerOne"));
                        if (bookmark.gameName !== activeGame) {
                          dispatch(setActiveGame(bookmark.gameName, true, bookmark.characterName, bookmark.vtState, userChosenName));
                        } else {
                          dispatch(setPlayerAttr("playerOne", bookmark.characterName, { selectedMove: userChosenName, vtState: bookmark.vtState }));
                        }
                        history.push(`/${bookmark.modeName}/${bookmark.gameName}/${bookmark.characterName}/${bookmark.vtState}/${bookmark.moveName}`);

                        handleModalDismiss();
                      }}
                      removalActive={removalActive}></CharacterEntryDetailed>
                  </IonReorder>
                );
              } else {
                return (
                // CHARACTER BOOKMARK
                  <IonReorder key={`stat-${bookmark.gameName}-${bookmark.characterName}-${index}`}>
                    <CharacterEntryDetailed
                      bookmark={bookmark}
                      bookmarkIndex={index}
                      disableOnClick={reorderingActive || removalActive}
                      onClickHandler={() => {
                        dispatch(setActiveFrameDataPlayer("playerOne"));

                        if (bookmark.gameName !== activeGame) {
                          dispatch(setActiveGame(bookmark.gameName, true, bookmark.characterName));
                        } else if (selectedCharacters["playerOne"].name !== bookmark.characterName) {
                          dispatch(setPlayer("playerOne", bookmark.characterName));
                        }

                        const bookmarkURL = `/${bookmark.modeName}/${bookmark.gameName}/${bookmark.characterName}`;
                        history.replace(bookmarkURL);

                        handleModalDismiss();
                      }}
                      removalActive={removalActive}
                    ></CharacterEntryDetailed>
                  </IonReorder>
                );
              }
            })}
          </IonReorderGroup>
        </IonList>
        {bookmarks.length === 0 ?
          <div className="bookmark-message-container">
            <h1>No bookmarks!</h1>
            <p>{Capacitor.isNativePlatform() ? "Tap" : "Click"} a bookmark <IonIcon icon={bookmarkOutline}/> to see it here</p>
            <p>or <span onClick={() => {
              if (bookmarks.length >= 3 && !premiumIsPurchased && Capacitor.isNativePlatform()) {
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
          : ((bookmarks.length < 3 && !premiumIsPurchased) || premiumIsPurchased || !Capacitor.isNativePlatform())
          && !(removalActive || reorderingActive)
          && bookmarks.findIndex( (bookmark) =>
            bookmark.modeName === "framedata" && bookmark.gameName === activeGame && bookmark.characterName === selectedCharacters[activePlayer].name
          ) === -1 ?
            <div className="bookmark-message-container">
              <ChunkyButton extraText={!premiumIsPurchased && Capacitor.isNativePlatform() && `${3 - bookmarks.length} free bookmark${bookmarks.length !== 2 ? "s" : ""} left`} onClick={() => {
                if (bookmarks.length >= 3 && !premiumIsPurchased && Capacitor.isNativePlatform()) {
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
        {bookmarks.length >=3 && (!premiumIsPurchased && Capacitor.isNativePlatform()) &&
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