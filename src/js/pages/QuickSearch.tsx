import { IonContent, IonPage, IonIcon, IonItem, IonInput, IonCardHeader, IonCardContent, IonCard, IonCardTitle, IonButton, IonFab, IonFabButton, IonGrid } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../style/components/QuickSearch.scss';
import '../../style/components/FAB.scss'
import PageHeader from '../components/PageHeader';
import { setPlayerAttr, setPlayer } from '../actions';
import { useHistory } from 'react-router';
import { close, searchOutline, trashBinOutline } from 'ionicons/icons';
import {ratio as fuzzratio, extract as fuzzextract } from 'fuzzball'
import { activeGameSelector, dataDisplaySettingsSelector, frameDataSelector, gameDetailsSelector, selectedCharactersSelector } from '../selectors';

type HeaderObj = {
  dataTableHeader: string;
  detailedHeader: string;
  dataFileKey: string;
};

const QUICKSEARCH_HEADERS = {
  "3S": [
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
  ],
  "USF4": [
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
  ],
  "SFV": [
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
      },
      "total": {
        "dataTableHeader": "T",
        "detailedHeader": "Total",
        "dataFileKey": "total",
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
    },
    {
      "extraInfo": {
        "dataTableHeader": "Extra Information",
        "detailedHeader": "Extra Information",
        "dataFileKey": "extraInfo",
      }
    }
  ],
  "SF6": [
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
      },
      "total": {
        "dataTableHeader": "T",
        "detailedHeader": "Total",
        "dataFileKey": "total",
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
      },
      "onPC": {
        "dataTableHeader": "onPC",
        "detailedHeader": "On PC",
        "dataFileKey": "onPC",
      }
    },
    {
      "extraInfo": {
        "dataTableHeader": "Extra Information",
        "detailedHeader": "Extra Information",
        "dataFileKey": "extraInfo",
      }
    }
  ],
  "GGST": [
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
      },
      "total": {
        "dataTableHeader": "T",
        "detailedHeader": "Total",
        "dataFileKey": "total",
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
      },
      "atkLvl": {
        "dataTableHeader": "atkLvl",
        "detailedHeader": "Attack Level",
        "dataFileKey": "atkLvl",
      }
    },
    {
      "extraInfo": {
        "dataTableHeader": "Extra Information",
        "detailedHeader": "Extra Information",
        "dataFileKey": "extraInfo",
      }
    }
  ]
}

const CHARACTER_NAME_DICTIONARY = {
  "SF6": {
    "chun": "Chun-Li",
    "e": "E.Honda",
    "kim": "Kimberly",
    "gief": "Zangief",
    "sim": "Dhalsim",
    "deejay": "Dee Jay",
    "dj": "Dee Jay",
    "m": "M.Bison", 
  },
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

const QuickSearch = () => {

  const activeGame = useSelector(activeGameSelector);
  const frameDataFile = useSelector(frameDataSelector);
  const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const gameDetails = useSelector(gameDetailsSelector);

  const dispatch = useDispatch();

  let history = useHistory();

  const [searchbarText, setSearchbarText] = useState("chunli stand lp");
  const [searchResults, setSearchResults] = useState([]);

  useEffect( () => {
    setSearchResults([]);
  },[activeGame]);

  const fuzzyNameScorer = (possibleCharName: string) => {
    const possibleCharFuzzObj = fuzzextract(possibleCharName, gameDetails.characterList)[0];
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
        title={`Quick Search`}
      />
      <IonContent id='QuickSearch' className='ion-padding'>
        <IonItem lines='none'>
          <IonInput clearInput onKeyUp={(event) => event.key === "Enter" && searchHandler()} value={searchbarText} placeholder="charactername move" onIonInput={e => setSearchbarText(e.detail.value)}></IonInput>
          <IonIcon color="primary" slot="end" icon={searchOutline} onClick={() => searchHandler()}
          ></IonIcon>
        </IonItem>
        
        <div className="search-results">
        {searchResults.length === 0 &&
          <IonCard key={"blank-card"}>
            <IonCardContent className="fail-warning">
              <h1>Important!</h1>
              <h2>You must use the format</h2>
              <code>charactername move</code>
              <p><em>NB: Don't put a space in your character's name</em></p>
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
                {QUICKSEARCH_HEADERS[activeGame].map((dataRow, index) =>
                  <div className="row" key={index}>
                    {Object.entries(dataRow).map(([dataId, headerObj]: [string, HeaderObj]) => 
                      <div style={{display: headerObj.dataFileKey === "extraInfo" && !searchedMoveData["extraInfo"] ? "none" : ''}} className={`col ${headerObj.dataFileKey === "extraInfo" && "extra-info"}`} key={dataId}>
                        
                        {headerObj.dataFileKey !== "extraInfo"
                          ? <>
                              <h2>{headerObj.detailedHeader}</h2>
                              <p>{searchedMoveData[dataId] || searchedMoveData[dataId] === 0 ? searchedMoveData[dataId] : "~"}</p>
                            </>
                          :  <ul key={index}>
                              {searchedMoveData["extraInfo"] && searchedMoveData["extraInfo"].map((info, index) =>
                            <li key={index}>{info}</li>
                          )}
                        </ul>  
                        
                        }
                        
                      </div>
                    )}
                  </div>
                )}
                <IonButton expand="full" fill="clear" onClick={() => {
                  dispatch(setPlayer("playerOne", charName));
                  dispatch(setPlayerAttr("playerOne", charName, {selectedMove: displayedMoveName}));
                  history.push(`/quicksearch/movedetail/${activeGame}/${charName}/normal/${searchedMoveData.moveName}`)}}
                >More info {">"}</IonButton>
              </IonCardContent>

            </IonCard>
          )
            })}
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => {setSearchResults([])} }>
            <IonIcon icon={trashBinOutline} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default QuickSearch;
