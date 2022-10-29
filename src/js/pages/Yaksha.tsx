import { IonContent, IonPage, IonIcon, IonItem, IonInput, IonCardHeader, IonCardContent, IonCard, IonCardTitle, IonButton, IonFab, IonFabButton, IonGrid } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../style/components/Yaksha.scss';
import '../../style/components/FAB.scss'
import PageHeader from '../components/PageHeader';
import { setPlayerAttr, setPlayer } from '../actions';
import { useHistory } from 'react-router';
import { close, searchOutline, trashBinOutline } from 'ionicons/icons';
import GAME_DETAILS from '../constants/GameDetails';
import {ratio as fuzzratio, extract as fuzzextract } from 'fuzzball'
import { activeGameSelector, dataDisplaySettingsSelector, frameDataSelector, selectedCharactersSelector } from '../selectors';

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

const CHARACTER_NAME_DICTIONARY = {
  "SFV": {
    "chun": "Chun-Li",
    "e": "E.Honda", 
    "fang": "F.A.N.G",
    "zeku": "Zeku (Old)",
    "gief": "Zangief",
    "sim": "Dhalsim",
  },
  "GGST": {
    "ino": "I-No",
    "zato": "Zato-1",
  }
  
}

const Yaksha = () => {

  const activeGame = useSelector(activeGameSelector);
  const frameDataFile = useSelector(frameDataSelector);
  const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);

  const dispatch = useDispatch();

  let history = useHistory();

  const [searchbarText, setSearchbarText] = useState("Chunli EY");
  const [searchResults, setSearchResults] = useState([]);

  useEffect( () => {
    setSearchResults([]);
  },[activeGame]);

  const fuzzyNameScorer = (possibleCharName: string) => {
    const possibleCharFuzzObj = fuzzextract(possibleCharName, GAME_DETAILS[activeGame].characterList)[0];
    if (CHARACTER_NAME_DICTIONARY[activeGame] && CHARACTER_NAME_DICTIONARY[activeGame][possibleCharName.toLowerCase()]) {
      return CHARACTER_NAME_DICTIONARY[activeGame][possibleCharName.toLowerCase()]
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
        if (fuzzratio(query, choice[SEARCH_TYPES[type]], options) > x) {
          return fuzzratio(query, choice[SEARCH_TYPES[type]], options);
        }
      }
    }
  }

  const fuzzyOptions = {scorer: fuzzyMoveScorer}

  const searchHandler = () => {

    const fuzzyCharName = fuzzyNameScorer(searchbarText.substr(0, searchbarText.indexOf(" ")));
    const fuzzyMoveNameKey =
      !/\S/.test(searchbarText) ? "userError"
      : searchbarText.includes(" ") ? fuzzextract(searchbarText.substr(searchbarText.indexOf(" ") + 1), frameDataFile[fuzzyCharName]["moves"]["normal"], fuzzyOptions)[0][2]
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
        <div id="yaksha">
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
                    {Object.entries(dataRow).map(([dataId, headerObj]) => 
                      <div className="col" key={dataId}>
                        <h2>{headerObj.detailedHeader}</h2>
                        <p>{searchedMoveData[dataId] || searchedMoveData[dataId] === 0 ? searchedMoveData[dataId] : "~"}</p>
                      </div>
                    )}
                  </div>
                )}
                <IonButton expand="full" fill="clear" onClick={() => {
                  dispatch(setPlayer("playerOne", charName));
                  dispatch(setPlayerAttr("playerOne", charName, {selectedMove: displayedMoveName}));
                  history.push(`/yaksha/movedetail/${activeGame}/${charName}/normal/${searchedMoveData.moveName}`)}}
                >More info {">"}</IonButton>
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

export default Yaksha;
