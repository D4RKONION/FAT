import React, { useEffect, useState } from "react"
import { PlayerData } from "../types"
import DataTableRow from "./DataTableRow"
import { activeGameSelector, activePlayerSelector, appDisplaySettingsSelector, landscapeColsSelector, orientationSelector, selectedCharactersSelector } from "../selectors"
import { useSelector } from "react-redux"
import '../../style/components/NewDataTable.scss';
import DataTableHeader from "./DataTableHeader"

type Props = {
  frameData: PlayerData["frameData"];
  searchText: string;
  scrollToBottom: (scrollEvent) => void;
  clearSearchText: () => void;
}

const portraitCols: {[key: string]: string} = {startup: "S", active: "A", recovery: "R", onHit: "oH", onBlock: "oB",};

const NewDataTable = ({frameData, searchText, scrollToBottom, clearSearchText}: Props) => {
  
  // Orientation stuff - we use local state to track which of the two header objects to use, but landscapeCols is stored in Redux
  // as it has to be set and changed in a modal elsewhere
  const landscapeCols = useSelector(landscapeColsSelector);
  const currentOrientation = useSelector(orientationSelector);
  const xScrollEnabled = useSelector(appDisplaySettingsSelector).themeBrightness === "dark" ? true : false; // TODO: Change this to be controlled properly
  const [colsToDisplay, setColsToDisplay] = useState(portraitCols);
  const activeGame = useSelector(activeGameSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  

  // Decide whether to use the default 5 columns or the user chosen ones
  useEffect(() => {
    if(currentOrientation === "landscape") {
      setColsToDisplay({...landscapeCols})
    } else {
      setColsToDisplay({...portraitCols})
    }
  }, [landscapeCols, currentOrientation])


  // Check if the first move's i===0. If it is, that means
  // we only want to display the VTState moves. This is used
  // in the table below to skip highlighting and rendering
  // of moves that are not state unique in certain cases (Asuka Spells)
  const [displayOnlyStateMoves, setDisplayOnlyStateMoves] = useState(false);

  useEffect(() => {
    const firstMove = selectedCharacters[activePlayer].frameData[Object.keys(selectedCharacters[activePlayer].frameData)[0]]
    if (firstMove.i === 0) {
      setDisplayOnlyStateMoves(true)
    } else {
      setDisplayOnlyStateMoves(false)
    }
  }, [selectedCharacters, activePlayer])


  // Handle filtering the frame data by searchText
  const searchableHeaders = {};
  Object.keys(colsToDisplay).map(headerName => (searchableHeaders[ colsToDisplay[headerName].toLowerCase() ]) = headerName );

  const filteredFrameData = Object.entries(frameData).filter(([moveName, moveData]) => {
    let tempSearchTerm = searchText;
  
    // Convert "EX" to "OD" if the game is SF6
    if (activeGame === "SF6" && tempSearchTerm.toLowerCase().includes("ex")) {
      tempSearchTerm = tempSearchTerm.toLowerCase().replaceAll("ex", "od");
    }
  
    const operators = ["=", ">=", "<=", ">", "<"];
    const operatorPattern = new RegExp(`(${operators.map(op => op.replace(/([=<>])/g, "\\$1")).join("|")})`);
    const match = tempSearchTerm.match(operatorPattern);
  
    if (match) {
      // Extract key, operator, and value from the search term
      const [key, value] = tempSearchTerm.split(match[0]);
      const operator = match[0];
      const lowerKey = key.trim().toLowerCase();
  
      // Map tempSearchTerm key to the appropriate moveData key using `searchableHeaders`
      const dataKey = searchableHeaders[lowerKey] || lowerKey;
  
      // Handle "xx" special case
      if (lowerKey === "xx" && moveData["xx"]) {
        return moveData["xx"].includes(value.trim().toLowerCase());
      }
  
      // Handle `info=` special case
      if (lowerKey === "info" && moveData["extraInfo"]) {
        return moveData["extraInfo"].some(entry => entry.toLowerCase().includes(value.trim().toLowerCase()));
      }
  
      // Handle other operators
      if (moveData[dataKey]) {
        const dataValue = moveData[dataKey];
  
        switch (operator) {
          case "=": return dataValue.toString() === value.trim();
          case ">=": return parseInt(dataValue) >= parseInt(value);
          case "<=": return parseInt(dataValue) <= parseInt(value);
          case ">": return parseInt(dataValue) > parseInt(value);
          case "<": return parseInt(dataValue) < parseInt(value);
          default:
            return false; // Operator not recognized, exclude from result
        }
      }
  
      return false; // If no match was found in this branch
    } else {
      // Fallback: Check for matches in moveName and other fields
      const lowerTerm = tempSearchTerm.toLowerCase();
      return (
        moveName.toLowerCase().includes(lowerTerm) ||
        (moveData.moveName && moveData.moveName.toLowerCase().includes(lowerTerm)) ||
        (moveData.cmnName && moveData.cmnName.toLowerCase().includes(lowerTerm)) ||
        (moveData.plnCmd && moveData.plnCmd.toLowerCase().includes(lowerTerm)) ||
        (moveData.numCmd && moveData.numCmd.toLowerCase().includes(lowerTerm))
      );
    }
  });
  

  // Search empty, don't display the table
  if (filteredFrameData.length === 0) {
    return (
      <div className="noSearchResultsWarning">
        <h2>0 results for {searchText}</h2>
        <span onClick={() => clearSearchText()}>Clear search term</span>
      </div>
    )
  }

  // Used to handle when to place a new page divider (th)
  let previousMoveType;
  let moveTypeHeaderRequired;

  return (
    <div className={`NewDataTable ${xScrollEnabled ? "xScroll" : "fixed"}`} style={{height: `calc(100vh - 56px)`}} onScroll={(e) => xScrollEnabled ? scrollToBottom(e) : false}>
      <table>
        <tbody>
        {filteredFrameData.map(([moveName, moveData]) => {

            // Group moves into segments, ignoring move types that are unhelpful for users or would otherwise
            // break the table flow
            if ((previousMoveType !== moveData.moveType) && moveData.moveType && moveData.moveType !== "movement-special" && moveData.moveType !== "taunt" && moveData.moveType !== "command-grab" ) {
              moveTypeHeaderRequired = true
              previousMoveType = moveData.moveType
            } else { 
              moveTypeHeaderRequired = false
            }

            if (displayOnlyStateMoves && moveData.i >= 1) { return null }

            //we need to know who the other character is to set Seth's V-Skill steal
            const inactivePlayerName = selectedCharacters[activePlayer === "playerOne" ? "playerTwo" : "playerOne"].name
            if ( selectedCharacters[activePlayer].name === "Seth" && moveData["moveType"] === "vskill" && !moveName.includes(`[${inactivePlayerName}]`) && !/VS[12]/.test(moveData.numCmd) ) {
              return false;
            }

            return (
              <React.Fragment key={`table-row-${moveName}`}>
                {moveTypeHeaderRequired &&
                  <DataTableHeader
                    colsToDisplay={colsToDisplay}
                    moveType={moveData.moveType}
                    xScrollEnabled={xScrollEnabled}
                  />
                }
                  
                <DataTableRow
                  moveName={moveName}
                  moveData={moveData}
                  colsToDisplay={colsToDisplay}
                  xScrollEnabled={xScrollEnabled}
                  displayOnlyStateMoves={displayOnlyStateMoves}
                />
              </React.Fragment>
            )
          })}
          <DataTableHeader
            colsToDisplay={colsToDisplay}
            moveType={"Move Name"}
            xScrollEnabled={xScrollEnabled}
          />
        </tbody>
        
      </table>
    </div>
  )
}

export default NewDataTable