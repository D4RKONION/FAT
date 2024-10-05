import { useDispatch, useSelector } from 'react-redux';
import '../../style/components/DataTableRow.scss';
import { activeGameSelector, activePlayerSelector, compactViewSelector, counterHitSelector, dataDisplaySettingsSelector, landscapeColsSelector, onBlockColoursSelector, orientationSelector, rawDriveRushSelector, selectedCharactersSelector, themeBrightnessSelector, vsBurntoutOpponentSelector } from '../selectors';
import { useEffect, useState } from 'react';
import { setPlayerAttr } from '../actions';
import { useHistory } from 'react-router';

type Props = {
  moveName: string;
  moveData: Record<string, any>;
  colsToDisplay: Record<string, any>;
  xScrollEnabled: boolean;
  displayOnlyStateMoves: boolean
}

const DataTableRow = ({moveName, moveData, colsToDisplay, xScrollEnabled, displayOnlyStateMoves}: Props) => { 
  
  const currentOrientation = useSelector(orientationSelector);
  const activeGame = useSelector(activeGameSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const landscapeCols = useSelector(landscapeColsSelector);
  const compactView = useSelector(compactViewSelector);
  const onBlockColours = useSelector(onBlockColoursSelector);
  const counterHit = useSelector(counterHitSelector);
  const rawDriveRush = useSelector(rawDriveRushSelector);
  const vsBurntoutOpponent = useSelector(vsBurntoutOpponentSelector);
  const themeBrightness = useSelector(themeBrightnessSelector);
  const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);

  const dispatch = useDispatch();
  let history = useHistory();


  const parseCellData = (detailKey: string) => {

    // Game Specific rules 
    if (activeGame === "SF6") {
      if (detailKey === "onBlock" && (vsBurntoutOpponent || rawDriveRush) && !isNaN(moveData[detailKey])) {
          // generic +4 on hit raw drive rush
          return moveData[detailKey] + (vsBurntoutOpponent ? 4 : 0) + (rawDriveRush && moveData.moveType === "normal" ? 4 : 0);
        
      } else if (detailKey === "onHit") {
        if (moveData.afterDRoH && rawDriveRush) {
          // specified on hit raw drive rush
          return moveData.afterDRoH;

        } else if (!isNaN(moveData[detailKey]) && rawDriveRush) {
          // generic +4 on hit raw drive rush
          return moveData[detailKey] + (rawDriveRush && moveData.moveType === "normal" ? 4 : 0) + (counterHit ? 2 : 0);

        } else if (!isNaN(moveData[detailKey]) && counterHit) {
          //generic +2 on counter hit
          return moveData[detailKey] + 2;
        }
      }
    } else if (activeGame === "SFV") {
      if (counterHit && detailKey === "onHit") {
        if (moveData.ccAdv) {
          // specficied crush counter data
          return moveData.ccAdv;
        } else if (!isNaN(moveData[detailKey])) {
          // generic +2 on counter hit
          return moveData[detailKey] + 2;
        }
      }

    } else if (activeGame === "USF4" && counterHit && detailKey === "onHit" && !isNaN(moveData[detailKey])) {
      if (moveData.moveType === "normal" && moveData.moveButton.includes("L")) {
        // USF4 lights give +1 on ch
        return moveData[detailKey] + 1;
      } else {
        // otherwise it's +3
        return moveData[detailKey] + 3;
      }
    } else if (activeGame === "GGST" && counterHit && detailKey === "onHit" && moveData.chAdv) {
      // specific counterhit advantage
      return moveData.chAdv;
    }
    
    // Generic rules
    if (typeof moveData[detailKey] === "undefined") {
      // Fallback for blanks
      // TODO: Make this a choice between "-" and "" and "~"
      return "-"
    } else if (detailKey === "xx" && typeof moveData[detailKey] === "object") {
      // Parse cancel object with ,s
      return moveData[detailKey].map((cancelType, index) => `${cancelType}${moveData[detailKey].length -1 !== index ? "," : ""} `);
    } else if (detailKey === "gatling" && typeof moveData[detailKey] === "object") {
      // Parse gatling object with ,s
      return moveData[detailKey].map((gatlingOption, index) => `${gatlingOption}${moveData[detailKey].length -1 !== index ? "," : ""} `);
    } else {
      // Return the sheet data as is
      return moveData[detailKey]
    }
  }  


  const generateClassNames = (detailKey: string) => {
    const classNamesToAdd = []

    // Handle State shifts
    if (selectedCharacters[activePlayer].vtState !== "normal") {
      if (((moveData.changedValues && moveData.changedValues.includes(detailKey)) || moveData.uniqueInVt)
        || (detailKey === "moveName" && moveData.changedValues && (!moveData.noHL || moveData.changedValues.includes("extraInfo")))
      ) {
        classNamesToAdd.push("triggered-data");
      } else {
        //TODO allow people to stop these being greyed out as an option
        classNamesToAdd.push("untriggered-data");
      }
    } else {
      classNamesToAdd.push("normal-state");
    }

    // handle extra info borders
    if (detailKey === "moveName" && moveData.extraInfo) {
     classNamesToAdd.push("extra-info-available")
    }

    // handle advantage colours

    return classNamesToAdd;
  }


  // If it's state moves only, we need to show the move name and not the input names
  const getMoveName = (moveName) => {
    if (displayOnlyStateMoves && dataDisplaySettings.moveNameType === "inputs") {
      return moveName.substring(moveName.indexOf("(") +1, moveName.indexOf(")"));
    } else {
      return moveName;
    }
  }

  

  return (
    <tr onClick={() => {
      dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {selectedMove: moveName}));
      history.push(`/framedata/movedetail/${activeGame}/${selectedCharacters[activePlayer].name}/${selectedCharacters[activePlayer].vtState}/${selectedCharacters[activePlayer].frameData[moveName]["moveName"]}`)
    }} className={`DataTableRow ${xScrollEnabled ? "xScroll" : "fixed"}`}>
      <td className={`cell move-name ${generateClassNames("moveName").map(className => `${className}`).join(' ')}`}>{getMoveName(moveName)}</td>
      {Object.keys(colsToDisplay).map(detailKey =>
        <td className={`cell ${generateClassNames(detailKey).map(className => className)} ${compactView && "compact"}`} key={`cell-entry-${detailKey}`}>
          {parseCellData(detailKey)}
        </td>
      )}
    </tr>
  )
}

export default DataTableRow;