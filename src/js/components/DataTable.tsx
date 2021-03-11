import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router'
import '../../style/components/DataTable.scss';
import { setPlayerAttr } from '../actions';
import { activeGameSelector, activePlayerSelector, counterHitSelector, landscapeColsSelector, onBlockColoursSelector, orientationSelector, selectedCharactersSelector } from '../selectors';



const portraitCols: {[key: string]: string} = {startup: "S", active: "A", recovery: "R", onHit: "oH", onBlock: "oB",};

const DataTable = ({ previewTable }) => {


  const currentOrientation = useSelector(orientationSelector);
  const activeGame = useSelector(activeGameSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const landscapeCols = useSelector(landscapeColsSelector);
  const onBlockColours = useSelector(onBlockColoursSelector);
  const counterHit = useSelector(counterHitSelector);

  const dispatch = useDispatch();

  let history = useHistory();

  // Orientation stuff - we use local state to track which of the two header objects to use, but landscapeCols is stored in Redux
  // as it has to be set and changed in a modal elsewhere
  const [colsToDisplay, setColsToDisplay] = useState(portraitCols);
  
  useEffect(() => {
    if(currentOrientation === "landscape") {
      setColsToDisplay({...landscapeCols})
    } else {
      setColsToDisplay({...portraitCols})
    }
  }, [landscapeCols, currentOrientation])



  //we need to know who the other character is to set Seth's V-Skill steal
  const inactivePlayerName = selectedCharacters[activePlayer === "playerOne" ? "playerTwo" : "playerOne"].name

  return(
    <div id="dataTable" style={ {gridTemplateColumns: `fit-content(33%) repeat(${Object.keys(colsToDisplay).length}, 1fr)`} }>
      
      <div id="dataTableHeader">
        <span className="entry move-name">Move</span>
        {Object.keys(colsToDisplay).map(headerName =>
          <span className="entry" key={headerName}>
            {colsToDisplay[headerName]}
          </span>
          )}
      </div>

      {Object.entries(selectedCharacters[activePlayer].frameData).map(([moveName, moveData]) => {
        if ( selectedCharacters[activePlayer].name === "Seth" && moveData["moveType"] === "vskill" && !moveName.includes(`[${inactivePlayerName}]`) ) {
          return false;
        } else {
          return (
            <div className="move-row" key={`table-row-${moveName}`}
              onClick={() => {
                if (previewTable) {return false};
                
                dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {selectedMove: moveName}));
                history.push(`/framedata/movedetail/${activeGame}/${selectedCharacters[activePlayer].name}/${selectedCharacters[activePlayer].vtState}/${selectedCharacters[activePlayer].frameData[moveName]["moveName"]}`)
              }}>
            
              <span
                style={
                  moveData.extraInfo && ((moveData.changedValues && moveData.changedValues.includes("extraInfo")) || moveData.uniqueInVt) ?  {borderRightColor: "var(--fat-vtrigger)" }
                  : moveData.extraInfo && !moveData.changedValues && selectedCharacters[activePlayer].vtState.includes("vt") ? { borderRightColor: "var(--fat-primary-tint-extreme)" }
                  : moveData.extraInfo ? { borderRightColor: "var(--fat-primary)" }
                  : null
                }
                className={`cell move-name ${
                  moveData.changedValues && selectedCharacters[activePlayer].vtState.includes("vt") ? "triggered-data"
                  : selectedCharacters[activePlayer].vtState.includes("vt") ? "untriggered-data"
                  : "normal-state"
                }`}
              >
                {moveName}
              </span>

              {Object.keys(colsToDisplay).map(detailKey =>
                <span
                  key={detailKey}
                  className={`cell 
                    ${
                      activeGame === "SFV" && counterHit && detailKey === "onHit" && moveData.ccState ? "very-punishable"
                      : counterHit && activeGame !== "3S" && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && !!parseInt(moveData[detailKey]) ? "just-punishable"
                      :	onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && moveData[detailKey] < -8 ? "severely-punishable"
                      : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && moveData[detailKey] < -5 ? "very-punishable"
                      : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && moveData[detailKey] < -2 ? "just-punishable"
                      : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && moveData[detailKey] < 0 ? "not-punishable"
                      : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && (moveData[detailKey] > 2 || moveData[detailKey] === "KD") ? "very-plus"
                      : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && (moveData[detailKey] > 0) ? "just-plus"
                      : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) ? "other-oB"
                      : "non-block-data"
                    }

                    ${selectedCharacters[activePlayer].vtState.includes("vt") && ((moveData.changedValues && moveData.changedValues.includes(detailKey)) || moveData.uniqueInVt) ? "triggered-data"
                    : selectedCharacters[activePlayer].vtState.includes("vt") ? "untriggered-data"
                    : "normal-state"}
                  `}
                >
                  {
                    moveData.extraInfo && detailKey === "extraInfo" ? moveData.extraInfo.map((note, index) => <li className="note" key={index}>{note}</li>)
                    : activeGame === "SFV" && counterHit && detailKey === "onHit" && moveData.ccAdv ? moveData.ccAdv
                    : activeGame === "SFV" && counterHit && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && (!!parseInt(moveData[detailKey]) || moveData[detailKey] === 0) ? moveData[detailKey] + 2
                    : activeGame === "USF4" && counterHit && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && (!!parseInt(moveData[detailKey]) || moveData[detailKey] === 0) && moveData.moveType === "normal" && moveData.moveButton.includes("L") ? moveData[detailKey] + 1
                    : activeGame === "USF4" && counterHit && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && (!!parseInt(moveData[detailKey]) || moveData[detailKey] === 0) ? moveData[detailKey] + 3
                    : detailKey === "cancelsTo" && typeof moveData[detailKey] === "object" ? moveData[detailKey].map(cancelType => `${cancelType} `)
                    : moveData[detailKey] || moveData[detailKey] === 0 ? moveData[detailKey]
                    : "~"
                  }
                </span>
              )}
            </div>
          )
        }
      }
    )}			

      <div id="dataTableFooter">
        <span className="entry move-name">Move</span>
        {Object.keys(colsToDisplay).map(footerName =>
          <span className="entry" key={footerName}>
            {colsToDisplay[footerName]}
          </span>
          )}
      </div>
      
    </div>
  )
}

export default DataTable;
