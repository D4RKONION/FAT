import "../../style/components/CharacterEntryDetailed.scss";
import { IonButton, IonIcon, IonItem, IonReorder } from "@ionic/react";
import { trashSharp } from "ionicons/icons";
import { useDispatch, useSelector } from "react-redux";

import { removeBookmark } from "../actions";
import AppSF3FrameData from "../constants/framedata/3SFrameData.json";
import AppGGSTFrameData from "../constants/framedata/GGSTFrameData.json";
import AppSF6FrameData from "../constants/framedata/SF6FrameData.json";
import AppSFVFrameData from "../constants/framedata/SFVFrameData.json";
import AppUSF4FrameData from "../constants/framedata/USF4FrameData.json";
import { allBookmarkStats } from "../constants/gamedetails/characterLists";
import { Bookmark } from "../types";
import CharacterPortrait from "./CharacterPortrait";
import { dataDisplaySettingsSelector } from "../selectors";
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

type Props = {
  bookmark: Bookmark,
  bookmarkIndex: number,
  disableOnClick: boolean,
  onClickHandler: (userChosenName?: string) => void,
  removalActive: boolean,
};

const CharacterEntryDetailed = ({bookmark, bookmarkIndex, disableOnClick, onClickHandler, removalActive }: Props) => {
  const dispatch = useDispatch();

  const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);

  const renamedMoveObject = bookmark.modeName ==="movedetail" ? renameData({[bookmark.moveName]: FRAMEDATA_MAP[bookmark.gameName][bookmark.characterName].moves[bookmark.vtState][bookmark.moveName]}, dataDisplaySettings.moveNameType, dataDisplaySettings.inputNotationType) : [""];
  const userChosenName = Object.keys(renamedMoveObject)[0];

  return (
    <IonItem button onClick={() => {
      if (disableOnClick) return false;
      onClickHandler(bookmark.modeName ==="movedetail" ? userChosenName : null);
    }} routerDirection="root">
      <div className="character-entry-detailed">
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
          <h1>{bookmark.moveName ? userChosenName : bookmark.characterName}</h1>
        </div>
        {!disableOnClick &&
        <div className="details">
          {bookmark.modeName !== "movedetail" ? (
            Object.keys(allBookmarkStats[bookmark.gameName]).map((statKey, index) => {
              return (
                <span key={`stat-${bookmark.gameName}-${bookmark.characterName}-${statKey}`} className={index === 0 ? "small" : index === 1 ? "medium" : "large"}>
                  <h1>{FRAMEDATA_MAP[bookmark.gameName][bookmark.characterName].stats[statKey]}</h1>
                  <p>{allBookmarkStats[bookmark.gameName][statKey]}</p>
                </span>);
            })
          ) : (
            Object.keys(MOVE_STATS).map((statKey, index) => {
              return (
                <span key={`stat-${bookmark.gameName}-${bookmark.characterName}-${bookmark.moveName}-${statKey}`} className={index === 0 ? "small" : index === 1 ? "medium" : "large"}>
                  <h1>{renamedMoveObject[userChosenName][MOVE_STATS[statKey]] ? renamedMoveObject[userChosenName][MOVE_STATS[statKey]] : "~"}</h1>
                  <p>{statKey}</p>
                </span>);
            })
          )}
        </div>
        }

      </div>
      <IonReorder slot="end"></IonReorder>
      {removalActive &&
      <IonButton onClick={() => dispatch(removeBookmark(bookmarkIndex))} size="default" slot="end" fill="clear"><IonIcon slot="icon-only" icon={trashSharp} ></IonIcon></IonButton>
      }

    </IonItem>
  );
};

export default CharacterEntryDetailed;