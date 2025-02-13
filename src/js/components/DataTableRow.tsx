import "../../style/components/DataTableRow.scss";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { setPlayerAttr } from "../actions";
import { activeGameSelector, activePlayerSelector, advantageModifiersSelector, dataDisplaySettingsSelector, dataTableSettingsSelector, selectedCharactersSelector } from "../selectors";
import { canParseBasicFrames, parseBasicFrames } from "../utils/ParseFrameData";

type Props = {
  moveName: string;
  moveData: Record<string, any>;
  colsToDisplay: Record<string, any>;
  xScrollEnabled: boolean;
  displayOnlyStateMoves: boolean;
  sample?: boolean;
};

const moveAdvantageColorsExcludeList = [
  "ddob",
  "ddoh",
  "selfsoh",
  "selfsob",
  "oppsoh",
  "oppsob",
  "hitstun",
  "hitstop",
  "blockstun",
];

const plusExlcudeList = [
  "hitstun",
  "hitstop",
  "blockstun",
];

const DataTableRow = ({ moveName, moveData, colsToDisplay, xScrollEnabled, displayOnlyStateMoves, sample }: Props) => {
  const activeGame = useSelector(activeGameSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const compactViewOn = useSelector(dataTableSettingsSelector).compactViewOn;
  const moveAdvantageColorsOn = useSelector(dataTableSettingsSelector).moveAdvantageColorsOn;
  const moveAdvantageIndicator = useSelector(dataTableSettingsSelector).moveAdvantageIndicator;
  const counterHit = useSelector(advantageModifiersSelector).counterHitActive;
  const rawDriveRush = useSelector(advantageModifiersSelector).rawDriveRushActive;
  const vsBurntoutOpponent = useSelector(advantageModifiersSelector).vsBurntoutOpponentActive;
  const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);

  const dispatch = useDispatch();
  const history = useHistory();

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

    if (typeof moveData[detailKey] === "undefined") {
      // Fallback for blanks
      // TODO: Make this a choice between "-" and "" and "~"
      return "-";
    } else if (detailKey === "xx" && typeof moveData[detailKey] === "object") {
      // Parse cancel object with ,s
      return moveData[detailKey].map((cancelType, index) => `${cancelType}${moveData[detailKey].length - 1 !== index ? "," : ""} `);
    } else if (detailKey === "gatling" && typeof moveData[detailKey] === "object") {
      // Parse gatling object with ,s
      return moveData[detailKey].map((gatlingOption, index) => `${gatlingOption}${moveData[detailKey].length - 1 !== index ? "," : ""} `);
    } else {
      // Return the sheet data as is
      return moveData[detailKey];
    }
  };

  const addPlusToAdvantageMoves = (detailKey, cellValue) => {
    if (!plusExlcudeList.includes(detailKey) && (detailKey.toLowerCase().includes("block") || detailKey.toLowerCase().includes("ob") || detailKey.toLowerCase().includes("hit") || detailKey.toLowerCase().includes("oh") || detailKey === "onPC" || detailKey === "onPP") && !isNaN(cellValue) && cellValue > 0) {
      return `+${cellValue}`;
    } else {
      return cellValue;
    }
  };

  const generateClassNames = (detailKey: string, cellDataToDisplay) => {
    const classNamesToAdd = [];

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
      classNamesToAdd.push("extra-info-available");
    }

    const detailKeyLowerCase = detailKey.toLowerCase();

    // handle adv colors
    if (
      moveAdvantageColorsOn
      && !moveAdvantageColorsExcludeList.includes(detailKeyLowerCase)
      && (detailKeyLowerCase.includes("block") || detailKeyLowerCase.includes("ob") || detailKeyLowerCase.includes("hit") || detailKeyLowerCase.includes("oh") || detailKey === "onPC" || detailKey === "onPP" || detailKey === "toxicblossom")
    ) {
      const amountToCheck =
        typeof cellDataToDisplay === "string" && canParseBasicFrames(cellDataToDisplay) ? parseBasicFrames(cellDataToDisplay)
          : cellDataToDisplay;
          
      const advantageAmount =
        amountToCheck < -8 ? "extremely-unsafe"
          : amountToCheck < -5 ? "very-unsafe"
            : (amountToCheck < -3 && activeGame === "SF6") || (amountToCheck < -2 && activeGame !== "SF6") ? "just-unsafe"
              : amountToCheck < 1 ? "safe"
                : amountToCheck < 4 ? "just-plus"
                  : (amountToCheck >= 4 || (amountToCheck && amountToCheck.toLowerCase().includes("kd"))) ? "very-plus"
                    : "";

      classNamesToAdd.push(`${advantageAmount}-${moveAdvantageIndicator}`);
    }

    return classNamesToAdd;
  };

  // If it's state moves only, we need to show the move name and not the input names
  const getMoveName = (moveName) => {
    if (displayOnlyStateMoves && dataDisplaySettings.moveNameType === "inputs") {
      return moveName.substring(moveName.indexOf("(") + 1, moveName.indexOf(")"));
    } else {
      return moveName;
    }
  };

  const handleRowAction = (event: React.MouseEvent<HTMLTableRowElement> | React.KeyboardEvent<HTMLTableRowElement>) => {
    if (event.type === "keydown") {
      const keyboardEvent = event as React.KeyboardEvent<HTMLTableRowElement>;
      if (keyboardEvent.key !== "Enter" && keyboardEvent.key !== " ") {
        return;
      }
      if (keyboardEvent.key === " ") {
        keyboardEvent.preventDefault();
      }
    }

    if (sample) return;
    dispatch(
      setPlayerAttr(
        activePlayer,
        selectedCharacters[activePlayer].name,
        { selectedMove: moveName }
      )
    );
    history.push(
      `/movedetail/${activeGame}/${selectedCharacters[activePlayer].name}/${selectedCharacters[activePlayer].vtState}/${selectedCharacters[activePlayer].frameData[moveName]["moveName"]}`
    );
  };

  return (
    <tr tabIndex={0} onClick={handleRowAction} onKeyDown={handleRowAction} className={`DataTableRow ${xScrollEnabled ? "xScroll" : "fixed"}`}>
      <td className={`cell move-name ${generateClassNames("moveName", getMoveName(moveName)).map(className => `${className}`).join(" ")}`}>{getMoveName(moveName)}</td>
      {Object.keys(colsToDisplay).map(detailKey => {
        // we first parse and modify out cell data as advantage can change
        const cellDataToDisplay = addPlusToAdvantageMoves(detailKey, parseCellData(detailKey));
        return (
          <td aria-label={`${getMoveName(moveName)} ${detailKey}: ${cellDataToDisplay}`} className={`cell ${generateClassNames(detailKey, cellDataToDisplay).map(className => className).join(" ")} ${compactViewOn && "compact"}`}
            key={`cell-entry-${detailKey}`}
          >
            {cellDataToDisplay}
          </td>
        );
      }

      )}
    </tr>
  );
};

export default DataTableRow;