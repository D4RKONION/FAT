import { isPlatform } from '@ionic/core/components';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router'
import '../../style/components/DataTable.scss';
import { setModalVisibility, setPlayerAttr } from '../actions';
import { activeGameSelector, activePlayerSelector, counterHitSelector, landscapeColsSelector, onBlockColoursSelector, orientationSelector, selectedCharactersSelector, themeBrightnessSelector, vsBurntoutOpponentSelector } from '../selectors';

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
  const onBlockColours = useSelector(onBlockColoursSelector);
  const counterHit = useSelector(counterHitSelector);
  const vsBurntoutOpponent = useSelector(vsBurntoutOpponentSelector);
  const themeBrightness = useSelector(themeBrightnessSelector);

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
          if (searchText.includes("xx") && moveData["cancelsTo"]) {
            return moveData["cancelsTo"].includes(searchText.toLowerCase().substring(searchText.indexOf("=") + 1))
          } else if (searchText.includes("info=") && moveData["extraInfo"] && moveData["extraInfo"].findIndex(entry => entry.toLowerCase().includes(searchText.toLowerCase().substring(searchText.indexOf("=") + 1))) !== -1 ) {
            return moveData
          } else if (searchText.includes("=") && moveData[searchableHeaders[searchText.toLowerCase().substring(0, searchText.indexOf("="))]] ) {
            return moveData[searchableHeaders[searchText.toLowerCase().substring(0, searchText.indexOf("="))]].toString() === searchText.substring(searchText.indexOf("=") + 1)
          } else if (searchText.includes(">=") && moveData[searchableHeaders[searchText.toLowerCase().substring(0, searchText.indexOf(">"))]] ) {
            return moveData[searchableHeaders[searchText.toLowerCase().substring(0, searchText.indexOf(">"))]] >= parseInt(searchText.substring(searchText.indexOf("=") + 1))
          } else if (searchText.includes("<=") && moveData[searchableHeaders[searchText.toLowerCase().substring(0, searchText.indexOf("<"))]] ) {
            return moveData[searchableHeaders[searchText.toLowerCase().substring(0, searchText.indexOf("<"))]] <= parseInt(searchText.substring(searchText.indexOf("=") + 1))
          } else if (searchText.includes(">") && moveData[searchableHeaders[searchText.toLowerCase().substring(0, searchText.indexOf(">"))]] ) {
            return moveData[searchableHeaders[searchText.toLowerCase().substring(0, searchText.indexOf(">"))]] > parseInt(searchText.substring(searchText.indexOf(">") + 1))
          } else if (searchText.includes("<") && moveData[searchableHeaders[searchText.toLowerCase().substring(0, searchText.indexOf("<"))]] ) {
            return moveData[searchableHeaders[searchText.toLowerCase().substring(0, searchText.indexOf("<"))]] < parseInt(searchText.substring(searchText.indexOf("<") + 1))
          } else {
            return moveName.toLowerCase().includes(searchText.toLowerCase())
          || (moveData.moveName && moveData.moveName.toLowerCase().includes(searchText.toLowerCase()))
          || (moveData.cmnName && moveData.cmnName.toLowerCase().includes(searchText.toLowerCase()))
          || (moveData.plnCmd && moveData.plnCmd.toLowerCase().includes(searchText.toLowerCase()))
          || (moveData.numCmd && moveData.numCmd.toLowerCase().includes(searchText.toLowerCase()))
          }
          
        }).map(([moveName, moveData]) => {
          if ( selectedCharacters[activePlayer].name === "Seth" && moveData["moveType"] === "vskill" && !moveName.includes(`[${inactivePlayerName}]`) && !/VS[12]/.test(moveData.numCmd) ) {
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
                    moveData.changedValues && selectedCharacters[activePlayer].vtState !== "normal" && !moveData.noHL ? "triggered-data"
                    : selectedCharacters[activePlayer].vtState !== "normal" ? "untriggered-data"
                    : "normal-state"
                  }`}
                >
                  {moveName}
                </span>

                {Object.keys(colsToDisplay).map(detailKey =>
                  <span
                    key={detailKey}

                    style={
                      activeGame === "SF6" && vsBurntoutOpponent && detailKey === "onBlock" && typeof moveData[detailKey] !== "string" && !isNaN(moveData[detailKey]) ? {backgroundColor: "var(--fat-datatable-very-plus"}
                      : activeGame === "GGST" && counterHit && detailKey === "onHit" && moveData.chAdv ? (themeBrightness === "light" ? {backgroundColor:  "var(--fat-datatable-very-pun"} : {backgroundColor:  "var(--fat-datatable-very-pun"})
                      : activeGame === "SFV" && counterHit && detailKey === "onHit" && moveData.ccState ? (themeBrightness === "light" ? {backgroundColor:  "var(--fat-datatable-very-pun"} : {backgroundColor:  "var(--fat-datatable-very-pun"})
                      : activeGame !== "3S"  && activeGame !== "GGST" && counterHit && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && !isNaN(moveData[detailKey]) ? (themeBrightness === "light" ? {backgroundColor: "var(--fat-datatable-just-pun"} : {backgroundColor:  "var(--fat-datatable-just-pun"})
                      :	onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && moveData[detailKey] < -8 ? (themeBrightness === "light" ? {backgroundColor: "var(--fat-datatable-serverely-pun"} : {backgroundColor:  "var(--fat-datatable-serverely-pun"})
                      : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && moveData[detailKey] < -5 ? (themeBrightness === "light" ? {backgroundColor: "var(--fat-datatable-very-pun"} : {backgroundColor:  "var(--fat-datatable-very-pun"})
                      : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && moveData[detailKey] < -2 ? (themeBrightness === "light" ? {backgroundColor: "var(--fat-datatable-just-pun"} : {backgroundColor:  "var(--fat-datatable-just-pun"})
                      : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && moveData[detailKey] < 1 ? (themeBrightness === "light" ? {backgroundColor: "var(--fat-datatable-not-pun"} : {backgroundColor:  "var(--fat-datatable-not-pun"})
                      : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && (moveData[detailKey] > 2 || moveData[detailKey] === "KD") ? (themeBrightness === "light" ? {backgroundColor: "var(--fat-datatable-very-plus"} : {backgroundColor:  "var(--fat-datatable-very-plus"})
                      : onBlockColours && (detailKey.includes("Block") || detailKey.includes("OB")) && (moveData[detailKey] > 0) ? (themeBrightness === "light" ? {backgroundColor: "var(--fat-datatable-just-plus"} : {backgroundColor:  "var(--fat-datatable-just-plus"})
                      : null
                    }

                    className={`cell 
                      ${selectedCharacters[activePlayer].vtState !== "normal" && ((moveData.changedValues && moveData.changedValues.includes(detailKey)) || moveData.uniqueInVt) ? "triggered-data"
                      : selectedCharacters[activePlayer].vtState !== "normal" ? "untriggered-data"
                      : "normal-state"}
                    `}
                  >
                    {
                      moveData.extraInfo && detailKey === "extraInfo" ? moveData.extraInfo.map((note, index) => <li className="note" key={index}>{note}</li>)
                      : activeGame === "SF6" && vsBurntoutOpponent && detailKey === "onBlock" && typeof moveData[detailKey] !== "string" && (!!parseInt(moveData[detailKey]) || moveData[detailKey] === 0) ? moveData[detailKey] + 4
                      : activeGame === "SF6" && counterHit && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && (!!parseInt(moveData[detailKey]) || moveData[detailKey] === 0) ? moveData[detailKey] + 2
                      : activeGame === "GGST" && counterHit && detailKey === "onHit" && moveData.chAdv ? moveData.chAdv
                      : activeGame === "SFV" && counterHit && detailKey === "onHit" && moveData.ccAdv ? moveData.ccAdv
                      : activeGame === "SFV" && counterHit && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && (!!parseInt(moveData[detailKey]) || moveData[detailKey] === 0) ? moveData[detailKey] + 2
                      : activeGame === "USF4" && counterHit && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && (!!parseInt(moveData[detailKey]) || moveData[detailKey] === 0) && moveData.moveType === "normal" && moveData.moveButton.includes("L") ? moveData[detailKey] + 1
                      : activeGame === "USF4" && counterHit && detailKey === "onHit" && typeof moveData[detailKey] !== "string" && (!!parseInt(moveData[detailKey]) || moveData[detailKey] === 0) ? moveData[detailKey] + 3
                      : detailKey === "cancelsTo" && typeof moveData[detailKey] === "object" ? moveData[detailKey].map(cancelType => `${cancelType} `)
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
