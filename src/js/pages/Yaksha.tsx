import { IonContent, IonPage, IonIcon, IonItem, IonInput, IonCardHeader, IonCardContent, IonCard, IonCardTitle, IonButton, IonFab, IonFabButton, IonGrid } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import '../../style/components/DetailCards.scss';
import '../../style/components/FAB.scss'
import PageHeader from '../components/PageHeader';
import { setPlayerAttr, setPlayer } from '../actions';
import { useHistory } from 'react-router';
import { close, searchOutline, trashBinOutline } from 'ionicons/icons';
import GAME_DETAILS from '../constants/GameDetails';
import fuzz from 'fuzzball'

const YAKSHA_HEADERS = [
  {
    "startup": {
      "dataTableHeader": "S",
      "detailedHeader": "Startup",
      "dataFileKey": "startup",
    },
    "active": {
      "dataTableHeader": "A",
      "detailedHeader": "Active",
      "dataFileKey": "active",
    },
    "recovery": {
      "dataTableHeader": "R",
      "detailedHeader": "Recovery",
      "dataFileKey": "recovery",
    }
  },
  {
    "onBlock": {
      "dataTableHeader": "oB",
      "detailedHeader": "On Block",
      "dataFileKey": "onBlock",
    },
    "onHit": {
      "dataTableHeader": "oH",
      "detailedHeader": "On Hit",
      "dataFileKey": "onHit",
    }
  }
]

const Yaksha = ({ frameDataFile, activeGame, setPlayerAttr, setPlayer, dataDisplaySettings, selectedCharacters }) => {

  let history = useHistory();

  const [searchbarText, setSearchbarText] = useState("Chunli EY");
  const [searchResults, setSearchResults] = useState([]);

  useEffect( () => {
    setSearchResults([]);
  },[activeGame]);

  const fuzzyNameScorer = (possibleCharName) => {
    const possibleCharFuzzObj = fuzz.extract(possibleCharName, GAME_DETAILS[activeGame].characterList)[0];
    if (possibleCharName === "Chun" || possibleCharName === "chun" ) {
      return "Chun-Li"
    } else if (possibleCharName === "E" || possibleCharName === "e") {
      return "E.Honda"
    } else if (possibleCharName === "FANG" || possibleCharName === "fang") {
      return "F.A.N.G"
    } else if (possibleCharName === "zeku") {
      return "Zeku (Old)"
    } else if (possibleCharFuzzObj[1] > 75) {
      return possibleCharFuzzObj[0];
    } else {
      return selectedCharacters.playerOne.name;
    }
  }

  const fuzzyMoveScorer = (query, choice, options) => {
    const SEARCH_TYPES = ["moveName", "cmnName", "plnCmd", "numCmd"];
    for (let x = 100; x >=0; x -= 10) {
      for (let type in SEARCH_TYPES) {
        if (fuzz.ratio(query, choice[SEARCH_TYPES[type]], options) > x) {
          return fuzz.ratio(query, choice[SEARCH_TYPES[type]], options);
        }
      }
    }
  }

  const fuzzyOptions = {scorer: fuzzyMoveScorer}

  const searchHandler = () => {

    const fuzzyCharName = fuzzyNameScorer(searchbarText.substr(0, searchbarText.indexOf(" ")));
    const fuzzyMoveNameKey =
      !/\S/.test(searchbarText) ? "userError"
      : searchbarText.includes(" ") ? fuzz.extract(searchbarText.substr(searchbarText.indexOf(" ") + 1), frameDataFile[fuzzyCharName]["moves"]["normal"], fuzzyOptions)[0][2]
      : "userError";

    if (searchResults.length !== 0 && (searchResults[searchResults.length -1].moveNameKey === fuzzyMoveNameKey && searchResults[searchResults.length -1].charName === fuzzyCharName)) {
      return false;
    }
    const prevSearchMinusDupes = searchResults.filter(entry => {
      if ( !(entry.charName === fuzzyCharName && entry.moveNameKey === fuzzyMoveNameKey) ) {
        console.log("duplicate found")
        return true
      } else {
        return false;
      }
    })
    
  
    setSearchResults([...prevSearchMinusDupes, { charName: fuzzyCharName, moveNameKey: fuzzyMoveNameKey }])
    setSearchbarText("");
    
    
  }

  return (
    <IonPage>
      <PageHeader
        componentsToShow={{menu: true, popover: true}}
        title={`Yaksha Search`}
      />
      <IonContent>
        <IonGrid fixed>
        <IonItem>
          <IonInput clearInput onKeyUp={(event) => event.key === "Enter" && searchHandler()} value={searchbarText} placeholder="charactername move" onIonChange={e => setSearchbarText(e.detail.value)}></IonInput>
          <IonIcon color="primary" slot="end" icon={searchOutline} onClick={() => searchHandler()}
          ></IonIcon>
        </IonItem>
        <div id="flexCardContainer">
        {searchResults.length === 0 &&
          <IonCard key={"blank-card"}>
            <IonCardContent className="fail-warning">
              <h1>Important!</h1>
              <h2>You must use the format</h2>
              <code>charactername move</code>
              <p><em>PS: Don't put a space in your character's name</em></p>
            </IonCardContent>
          </IonCard>
        }
        {[...searchResults].reverse().map((resultObj, index) => {

          // the error card needs this one
          const positionInArray = searchResults.indexOf(resultObj)

          if (resultObj.moveNameKey === "userError") {
            return(
              <IonCard key={"fail-card" + index} className={index === 0 && "animate-in"}>
                <IonCardContent className="fail-warning">
                  <h1>Oops!</h1>
                  <h2>Did you use the format</h2>
                  <code>charactername move</code>
                  <IonIcon icon={close} onClick={() => {
                    const removedItemArray = [...searchResults];
                    removedItemArray.splice(positionInArray, 1);
                    setSearchResults(removedItemArray);
                  }} />
                </IonCardContent>
              </IonCard>
            )
          }

          const charName = resultObj.charName;
          const moveNameKey = resultObj.moveNameKey;
          const searchedMoveData = frameDataFile[charName]["moves"]["normal"][moveNameKey];
          const displayedMoveName =
            dataDisplaySettings.moveNameType === "inputs" ? searchedMoveData[dataDisplaySettings.inputNotationType]
            : dataDisplaySettings.moveNameType === "common" && searchedMoveData["cmnName"] ? searchedMoveData["cmnName"]
            : searchedMoveData["moveName"];

          return (
            <IonCard key={charName + moveNameKey + index} className={index === 0 && "animate-in"}>
              <IonCardHeader>
                <IonCardTitle>
                  {charName} | {displayedMoveName}
                </IonCardTitle>
                <IonIcon icon={close} onClick={() => {
                  const removedItemArray = [...searchResults];
                  removedItemArray.splice(positionInArray, 1);
                  setSearchResults(removedItemArray);
                }} />
              </IonCardHeader>
              <IonCardContent>
                {YAKSHA_HEADERS.map((dataRow, index) =>
                  <div className="row" key={index}>
                    {Object.entries(dataRow).map(([dataId, headerObj]) => {
                      if (dataId === "cancelsTo") {
                        return <div className={searchedMoveData.changedValues && searchedMoveData.changedValues.includes(dataId) ? "triggered-data" : "normal-state"} key={dataId}><b>{headerObj.detailedHeader}</b><br/>{searchedMoveData[dataId] || searchedMoveData[dataId] === 0 ? searchedMoveData[dataId].join(", ") : "~"}</div>
                      } else {
                        return <div className={searchedMoveData.changedValues && searchedMoveData.changedValues.includes(dataId) ? "triggered-data" : "normal-state"} key={dataId}><b>{headerObj.detailedHeader}</b><br/>{searchedMoveData[dataId] || searchedMoveData[dataId] === 0 ? searchedMoveData[dataId] : "~"}</div>
                      }
                      })}
                  </div>
                )}
                <IonButton expand="full" fill="clear" onClick={() => {setPlayer("playerOne", charName); setPlayerAttr("playerOne", charName, {selectedMove: displayedMoveName}); history.push(`/yaksha/movedetail/${activeGame}/${charName}/normal/${searchedMoveData.moveName}`)}}>More info {">"}</IonButton>
              </IonCardContent>

            </IonCard>
          )
            })}
        </div>

        </IonGrid>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => {setSearchResults([])} }>
            <IonIcon icon={trashBinOutline} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

const mapStateToProps = state => ({
  activeGame: state.activeGameState,
  frameDataFile: state.frameDataState,
  dataDisplaySettings: state.dataDisplaySettingsState,
  selectedCharacters: state.selectedCharactersState,
})

const mapDispatchToProps = dispatch => ({
  setPlayerAttr: (playerId, charName, playerData) => dispatch(setPlayerAttr(playerId, charName, playerData)),
  setPlayer: (playerId, charName) => dispatch(setPlayer(playerId, charName))
})


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
(Yaksha)
