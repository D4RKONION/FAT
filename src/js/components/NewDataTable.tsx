import React, { useEffect, useState } from "react"
import { PlayerData } from "../types"
import DataTableRow from "./DataTableRow"
import { landscapeColsSelector, orientationSelector, themeBrightnessSelector } from "../selectors"
import { useSelector } from "react-redux"
import '../../style/components/NewDataTable.scss';
import DataTableHeader from "./DataTableHeader"

type Props = {
  frameData: PlayerData["frameData"];
  scrollToBottom: () => void;
}

const portraitCols: {[key: string]: string} = {startup: "S", active: "A", recovery: "R", onHit: "oH", onBlock: "oB",};

const NewDataTable = ({frameData, scrollToBottom}: Props) => {
  
  // Orientation stuff - we use local state to track which of the two header objects to use, but landscapeCols is stored in Redux
  // as it has to be set and changed in a modal elsewhere
  const landscapeCols = useSelector(landscapeColsSelector);
  const currentOrientation = useSelector(orientationSelector);
  const xScrollEnabled = useSelector(themeBrightnessSelector) === "dark" ? true : false; // TODO: Change this to be controlled properly
  const [colsToDisplay, setColsToDisplay] = useState(portraitCols);
  

  useEffect(() => {
    if(currentOrientation === "landscape") {
      setColsToDisplay({...landscapeCols})
    } else {
      setColsToDisplay({...portraitCols})
    }
  }, [landscapeCols, currentOrientation])

  let previousMoveType;
  let moveTypeHeaderRequired;

  return (
    <div className={`NewDataTable ${xScrollEnabled ? "xScroll" : "fixed"}`} style={{height: `calc(100vh - 56px)`}} onScroll={() => xScrollEnabled ? scrollToBottom() : false}>
      <table>
        <tbody>
          {Object.entries(frameData).map(([moveName, moveData]) => {
            
            // Group moves into segments, ignoring move types that are unhelpful for users or would otherwise
            // break the table flow
            if ((previousMoveType !== moveData.moveType) && moveData.moveType && moveData.moveType !== "movement-special" && moveData.moveType !== "taunt" && moveData.moveType !== "command-grab" ) {
              moveTypeHeaderRequired = true
              previousMoveType = moveData.moveType
            } else { 
              moveTypeHeaderRequired = false
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