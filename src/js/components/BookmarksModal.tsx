import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonList, IonModal, IonReorder, IonReorderGroup, IonTitle, IonToolbar } from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import { bookmarksSelector, dataDisplaySettingsSelector, modalVisibilitySelector } from "../selectors";
import { removeBookmark, reorderBookmarks, setModalVisibility, setPlayerAttr } from "../actions";
import CharacterPortrait from "./CharacterPortrait";
import "../../style/components/BookmarksModal.scss"
import { checkmarkSharp, closeSharp, reorderTwoSharp, trashSharp } from "ionicons/icons";
import { useHistory } from "react-router";
import { useState } from "react";


import AppSFVFrameData from '../constants/framedata/SFVFrameData.json';
import AppUSF4FrameData from '../constants/framedata/USF4FrameData.json';
import AppSF3FrameData from '../constants/framedata/3SFrameData.json';
import AppGGSTFrameData from '../constants/framedata/GGSTFrameData.json';
import AppSF6FrameData from '../constants/framedata/SF6FrameData.json';
import { allBookmarkStats } from "../constants/gamedetails/characterLists";
import { renameData } from "../utils";

const FRAMEDATA_MAP = {
  "3S": AppSF3FrameData,
  "USF4": AppUSF4FrameData,
  "SFV": AppSFVFrameData,
  "SF6": AppSF6FrameData,
  "GGST": AppGGSTFrameData,
}

const MOVE_STATS= {
  "Startup": "startup",
  "oB": "onBlock",
  "oH": "onHit",
}

const BookmarksModal = () => {

  const modalVisibility = useSelector(modalVisibilitySelector);
  const bookmarks = useSelector(bookmarksSelector)
  const dataDisplaySettings = useSelector(dataDisplaySettingsSelector)

  const dispatch = useDispatch();
  const history = useHistory();

  const [reorderingActive, setReorderingActive] = useState(false);
  const [removeActive, setRemovalActive] = useState(false);

  const handleModalDismiss = () => {  
    modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "bookmarks", visible: false }))
    setReorderingActive(false);
    setRemovalActive(false);
  }


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
              ? <IonButton onClick={() => {setReorderingActive(false); setRemovalActive(false)}}><IonIcon slot="icon-only" icon={checkmarkSharp}></IonIcon></IonButton>
              :
                <>
                  <IonButton size="small" onClick={() => setRemovalActive(true)}><IonIcon slot="icon-only" icon={trashSharp}></IonIcon></IonButton>
                  <IonButton onClick={() => setReorderingActive(true)}><IonIcon slot="icon-only" icon={reorderTwoSharp}></IonIcon></IonButton>
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
            // MOVE BOOKMARK
            if (bookmark.modeName === "movedetail") {
              const renamedMoveObject = renameData({[bookmark.moveName]: FRAMEDATA_MAP[bookmark.gameName][bookmark.characterName].moves[bookmark.vtState][bookmark.moveName]}, dataDisplaySettings.moveNameType, dataDisplaySettings.inputNotationType)
              const userChosenName = Object.keys(renamedMoveObject)[0]
              return (
                <IonItem onClick={() => {
                  if (reorderingActive || removeActive) return false;
                  
                  dispatch(setPlayerAttr("playerOne", bookmark.characterName, { selectedMove: userChosenName }));
                  const bookmarkURL = `/${bookmark.modeName}/${bookmark.gameName}/${bookmark.characterName}/${bookmark.vtState}/${bookmark.moveName}`
                  history.push(bookmarkURL);
                 
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
                          return(
                            <span className={index === 0 ? "small" : index === 1 ? "medium" : "large"}>
                              <h1>{renamedMoveObject[userChosenName][MOVE_STATS[statKey]] ? renamedMoveObject[userChosenName][MOVE_STATS[statKey]] : "~"}</h1>
                              <p>{statKey}</p>
                            </span>)
                        })}
                      </div>
                    }
                    
                    
                  </div>
                  <IonReorder slot="end"></IonReorder>
                  {removeActive && 
                    <IonButton onClick={() => dispatch(removeBookmark(index))} size="default" slot="end" fill="clear"><IonIcon slot="icon-only" icon={trashSharp} ></IonIcon></IonButton>
                  }
                  
                </IonItem>
              )
            } else {
              return (
                // CHARACTER BOOKMARK
                <IonItem onClick={() => {
                  if (reorderingActive || removeActive) return false;

                  const bookmarkURL = `/${bookmark.modeName}/${bookmark.gameName}/${bookmark.characterName}`
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
                          return(
                            <span className={index === 0 ? "small" : index === 1 ? "medium" : "large"}>
                              <h1>{FRAMEDATA_MAP[bookmark.gameName][bookmark.characterName].stats[statKey]}</h1>
                              <p>{allBookmarkStats[bookmark.gameName][statKey]}</p>
                            </span>)
                        })}
                      </div>
                    }
                    
                    
                  </div>
                  <IonReorder slot="end"></IonReorder>
                  {removeActive && 
                    <IonButton onClick={() => dispatch(removeBookmark(index))} size="default" slot="end" fill="clear"><IonIcon slot="icon-only" icon={trashSharp} ></IonIcon></IonButton>
                  }
                  
                </IonItem>
              )
            }
            
          })}
        </IonReorderGroup>
        </IonList>
      </IonContent>
      
    </IonModal>
  )
}

export default BookmarksModal;