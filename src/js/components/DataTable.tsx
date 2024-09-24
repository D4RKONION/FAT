import { isPlatform } from '@ionic/core/components';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router'
import '../../style/components/DataTable.scss';
import { setModalVisibility, setPlayerAttr } from '../actions';
import { activeGameSelector, activePlayerSelector, counterHitSelector, dataDisplaySettingsSelector, landscapeColsSelector, compactViewSelector, onBlockColoursSelector, orientationSelector, rawDriveRushSelector, selectedCharactersSelector, themeBrightnessSelector, vsBurntoutOpponentSelector } from '../selectors';

const portraitCols: {[key: string]: string} = {startup: "S", active: "A", recovery: "R", onHit: "oH", onBlock: "oB",};

type DataTableProps = {
  searchText: string;
  previewTable: Boolean;
}

const DataTable = ({ searchText, previewTable }: DataTableProps) => {

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

  // Orientation stuff - we use local state to track which of the two header objects to use, but landscapeCols is stored in Redux
  // as it has to be set and changed in a modal elsewhere
  const [colsToDisplay, setColsToDisplay] = useState(portraitCols);
  
  const searchableHeaders = {};
  Object.keys(colsToDisplay).map(headerName => (searchableHeaders[ colsToDisplay[headerName].toLowerCase() ]) = headerName );
  
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


  //we need to know who the other character is to set Seth's V-Skill steal
  const inactivePlayerName = selectedCharacters[activePlayer === "playerOne" ? "playerTwo" : "playerOne"].name

  return(
    <>
      <div id="noSupportWarning">
        <h1>Oh no =(</h1>
        <p>It looks like your device doesn't support <code>display: grid!</code> Bummer...</p>
        <p>Try updating your Android Webview <strong>and</strong> Chrome, then restart the app</p>
        <p><em>We await your return... warrior</em></p>
      </div>
      <div id="dataTable" style={ {gridTemplateColumns: `fit-content(33%) repeat(${Object.keys(colsToDisplay).length}, 1fr)`} }>
        
        <div id="dataTableHeader" onClick={() => !isPlatform("capacitor") && dispatch(setModalVisibility({ currentModal: "landscapeOptions", visible: true }))}>
          <span className="entry move-name">Move</span>
          {Object.keys(colsToDisplay).map(headerName =>
            <span className="entry" key={headerName}>
              {colsToDisplay[headerName]}
            </span>
            )}
        </div>

        {Object.entries(selectedCharacters[activePlayer].frameData).filter(([moveName, moveData]) => {
          let tempSearchTerm = searchText;
          // Allow people to filter for OD moves using the characters EX
          if (activeGame === "SF6" && tempSearchTerm.toLowerCase().includes("ex")) {
            tempSearchTerm = tempSearchTerm.toLowerCase().replaceAll("ex", "od")
          }
    
          if (tempSearchTerm.includes("xx") && moveData["xx"]) {
            return moveData["xx"].includes(tempSearchTerm.toLowerCase().substring(tempSearchTerm.indexOf("=") + 1))
          } else if (tempSearchTerm.includes("info=") && moveData["extraInfo"] && moveData["extraInfo"].findIndex(entry => entry.toLowerCase().includes(tempSearchTerm.toLowerCase().substring(tempSearchTerm.indexOf("=") + 1))) !== -1 ) {
            return moveData
          } else if (tempSearchTerm.includes("=") && moveData[searchableHeaders[tempSearchTerm.toLowerCase().substring(0, tempSearchTerm.indexOf("="))]] ) {
            return moveData[searchableHeaders[tempSearchTerm.toLowerCase().substring(0, tempSearchTerm.indexOf("="))]].toString() === tempSearchTerm.substring(tempSearchTerm.indexOf("=") + 1)
          } else if (tempSearchTerm.includes(">=") && moveData[searchableHeaders[tempSearchTerm.toLowerCase().substring(0, tempSearchTerm.indexOf(">"))]] ) {
            return moveData[searchableHeaders[tempSearchTerm.toLowerCase().substring(0, tempSearchTerm.indexOf(">"))]] >= parseInt(tempSearchTerm.substring(tempSearchTerm.indexOf("=") + 1))
          } else if (tempSearchTerm.includes("<=") && moveData[searchableHeaders[tempSearchTerm.toLowerCase().substring(0, tempSearchTerm.indexOf("<"))]] ) {
            return moveData[searchableHeaders[tempSearchTerm.toLowerCase().substring(0, tempSearchTerm.indexOf("<"))]] <= parseInt(tempSearchTerm.substring(tempSearchTerm.indexOf("=") + 1))
          } else if (tempSearchTerm.includes(">") && moveData[searchableHeaders[tempSearchTerm.toLowerCase().substring(0, tempSearchTerm.indexOf(">"))]] ) {
            return moveData[searchableHeaders[tempSearchTerm.toLowerCase().substring(0, tempSearchTerm.indexOf(">"))]] > parseInt(tempSearchTerm.substring(tempSearchTerm.indexOf(">") + 1))
          } else if (tempSearchTerm.includes("<") && moveData[searchableHeaders[tempSearchTerm.toLowerCase().substring(0, tempSearchTerm.indexOf("<"))]] ) {
            return moveData[searchableHeaders[tempSearchTerm.toLowerCase().substring(0, tempSearchTerm.indexOf("<"))]] < parseInt(tempSearchTerm.substring(tempSearchTerm.indexOf("<") + 1))
          } else {
            return moveName.toLowerCase().includes(tempSearchTerm.toLowerCase())
          || (moveData.moveName && moveData.moveName.toLowerCase().includes(tempSearchTerm.toLowerCase()))
          || (moveData.cmnName && moveData.cmnName.toLowerCase().includes(tempSearchTerm.toLowerCase()))
          || (moveData.plnCmd && moveData.plnCmd.toLowerCase().includes(tempSearchTerm.toLowerCase()))
          || (moveData.numCmd && moveData.numCmd.toLowerCase().includes(tempSearchTerm.toLowerCase()))
          }
          
        }).map(([moveName, moveData]) => {
          if ( selectedCharacters[activePlayer].name === "Seth" && moveData["moveType"] === "vskill" && !moveName.includes(`[${inactivePlayerName}]`) && !/VS[12]/.test(moveData.numCmd) ) {
            return false;
          } else if (displayOnlyStateMoves && moveData.i >= 1) {
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
                    : moveData.extraInfo && !moveData.changedValues && selectedCharacters[activePlayer].vtState !== "normal" && !moveData.noHL ? { borderRightColor: "var(--fat-primary-tint-extreme)" }
                    : moveData.extraInfo ? { borderRightColor: "var(--fat-primary)" }
                    : null
                  }
                  className={`cell move-name ${
                    moveData.changedValues && !displayOnlyStateMoves && selectedCharacters[activePlayer].vtState !== "normal" && !moveData.noHL ? "triggered-data"
                    : selectedCharacters[activePlayer].vtState !== "normal" && !displayOnlyStateMoves  ? "untriggered-data"
                    : "normal-state"
                  }`}
                >
                  {displayOnlyStateMoves && dataDisplaySettings.moveNameType === "inputs" ? moveName.substring(moveName.indexOf("(") +1, moveName.indexOf(")")) : moveName}
                </span>

                {Object.keys(colsToDisplay).map(detailKey =>
                  <span
                    key={detailKey}

                    style={{

                      backgroundColor: 
                        activeGame === "SF6" && (vsBurntoutOpponent && (rawDriveRush && moveData.moveType === "normal")) && detailKey === "onBlock" && typeof moveData[detailKey] !== "string" && !isNaN(moveData[detailKey]) ? "var(--fat-datatable-very-plus"
                        : activeGame === "SF6" && (vsBurntoutOpponent || (rawDriveRush && moveData.moveType === "normal")) && detailKey === "onBlock" && typeof moveData[detailKey] !== "string" && !isNaN(moveData[detailKey]) ? "var(--fat-datatable-just-plus"
                        : activeGame === "SF6" && (rawDriveRush && moveData.moveType === "normal") && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && !isNaN(moveData[detailKey]) ? "var(--fat-datatable-just-plus"
                        : activeGame === "SF6" && rawDriveRush && detailKey === "onHit" && (moveData.afterDRoH) ? "var(--fat-datatable-just-plus"
                        : activeGame === "GGST" && counterHit && detailKey === "onHit" && moveData.chAdv ? (themeBrightness === "light" ? "var(--fat-datatable-very-pun" : "var(--fat-datatable-very-pun")
                        : activeGame === "SFV" && counterHit && detailKey === "onHit" && moveData.ccState ? (themeBrightness === "light" ? "var(--fat-datatable-very-pun" : "var(--fat-datatable-very-pun")
                        : activeGame !== "3S"  && activeGame !== "GGST" && counterHit && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && !isNaN(moveData[detailKey]) ? (themeBrightness === "light" ? "var(--fat-datatable-just-pun" : "var(--fat-datatable-just-pun")
                        :	onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && moveData[detailKey] < -8 ? (themeBrightness === "light" ? "var(--fat-datatable-serverely-pun" : "var(--fat-datatable-serverely-pun")
                        : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && moveData[detailKey] < -5 ? (themeBrightness === "light" ? "var(--fat-datatable-very-pun" : "var(--fat-datatable-very-pun")
                        // SF6 fastest moves are 4f generally, so we need to colour for < -3 instead of < -2
                        : activeGame === "SF6" && onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && moveData[detailKey] < -3 ? (themeBrightness === "light" ? "var(--fat-datatable-just-pun" : "var(--fat-datatable-just-pun")
                        : activeGame !== "SF6" && onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && moveData[detailKey] < -2 ? (themeBrightness === "light" ? "var(--fat-datatable-just-pun" : "var(--fat-datatable-just-pun")
                        : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && moveData[detailKey] < 1 ? (themeBrightness === "light" ? "var(--fat-datatable-not-pun" : "var(--fat-datatable-not-pun")
                        : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && (moveData[detailKey] > 2 || moveData[detailKey] === "KD") ? (themeBrightness === "light" ? "var(--fat-datatable-very-plus" : "var(--fat-datatable-very-plus")
                        : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && (moveData[detailKey] > 0) ? (themeBrightness === "light" ? "var(--fat-datatable-just-plus" : "var(--fat-datatable-just-plus")
                        : null
                    }}

                    className={`cell 
                      ${selectedCharacters[activePlayer].vtState !== "normal" && ((moveData.changedValues && moveData.changedValues.includes(detailKey)) || moveData.uniqueInVt) && !displayOnlyStateMoves ? "triggered-data"
                      : selectedCharacters[activePlayer].vtState !== "normal" && !displayOnlyStateMoves ? "untriggered-data"
                      : "normal-state"}

                      ${compactView && "compact"}
                    `}
                  >
                    {
                      moveData.extraInfo && detailKey === "extraInfo" ? moveData.extraInfo.map((note, index) => <li className="note" key={index}>{note}</li>)
                      : activeGame === "SF6" && rawDriveRush && detailKey === "onHit" && moveData.afterDRoH ? moveData.afterDRoH
                      : activeGame === "SF6" && (vsBurntoutOpponent || rawDriveRush) && detailKey === "onBlock" && typeof moveData[detailKey] !== "string" && (!!parseInt(moveData[detailKey]) || moveData[detailKey] === 0) ? moveData[detailKey] + (vsBurntoutOpponent ? 4 : 0) + (rawDriveRush && moveData.moveType === "normal" ? 4 : 0)
                      : activeGame === "SF6" && rawDriveRush && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && (!!parseInt(moveData[detailKey]) || moveData[detailKey] === 0) ? moveData[detailKey] + (rawDriveRush && moveData.moveType === "normal" ? 4 : 0)
                      : activeGame === "SF6" && counterHit && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && (!!parseInt(moveData[detailKey]) || moveData[detailKey] === 0) ? moveData[detailKey] + 2
                      : activeGame === "GGST" && counterHit && detailKey === "onHit" && moveData.chAdv ? moveData.chAdv
                      : activeGame === "SFV" && counterHit && detailKey === "onHit" && moveData.ccAdv ? moveData.ccAdv
                      : activeGame === "SFV" && counterHit && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && (!!parseInt(moveData[detailKey]) || moveData[detailKey] === 0) ? moveData[detailKey] + 2
                      : activeGame === "USF4" && counterHit && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && (!!parseInt(moveData[detailKey]) || moveData[detailKey] === 0) && moveData.moveType === "normal" && moveData.moveButton.includes("L") ? moveData[detailKey] + 1
                      : activeGame === "USF4" && counterHit && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && (!!parseInt(moveData[detailKey]) || moveData[detailKey] === 0) ? moveData[detailKey] + 3
                      : detailKey === "xx" && typeof moveData[detailKey] === "object" ? moveData[detailKey].map(cancelType => `${cancelType} `)
                      : detailKey === "gatling" && typeof moveData[detailKey] === "object" ? moveData[detailKey].map(gatlingOption => `${gatlingOption} `)
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

        {<div id="dataTableFooter">
          <span className="entry move-name">Move</span>
          {Object.keys(colsToDisplay).map(footerName =>
            <span className="entry" key={footerName}>
              {colsToDisplay[footerName]}
            </span>
            )}
        </div>}
        
      </div>
    </>
  )
}

export default DataTable;
