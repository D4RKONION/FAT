import { IonContent, IonPage, IonItem, IonSelect, IonSelectOption, IonIcon, IonFab, IonFabButton, IonItemDivider, IonGrid, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from '@ionic/react';
import { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../style/pages/StatCompare.scss';
import '../../style/components/FAB.scss'
import { setModalVisibility } from '../actions';
import { person } from 'ionicons/icons';
import CharacterPortrait from '../components/CharacterPortrait';
import { activeGameSelector, frameDataSelector, gameDetailsSelector, selectedCharactersSelector } from '../selectors';
import PopoverButton from '../components/PopoverButton';


const StatCompare = () => {

  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activeGame = useSelector(activeGameSelector);
  const frameDataFile = useSelector(frameDataSelector);
  const gameDetails = useSelector(gameDetailsSelector);

  const dispatch = useDispatch();


  
  const [statHeadings, setStatHeadings] = useState([]);
  const gameStatsObj = gameDetails.statsPoints;
  const allStats = {}
  Object.keys(gameStatsObj).forEach(dataSection =>
    gameStatsObj[dataSection].map(dataRow =>
      Object.keys(dataRow).map(dataKey =>
        allStats[dataKey] = dataRow[dataKey]
      )
    )
  )

  const generateColors = (numColors) => {
    let colors = [];
    if (numColors === 2) {
      colors = ["hsl(0, 100%, 75%)", "hsl(25, 100%, 75%)"];
    } else if (numColors === 3) {
      colors = ["hsl(0, 100%, 75%)", "hsl(25, 100%, 75%)",  "hsl(60, 100%, 75%)"];
    } else if (numColors === 4) {
      colors = ["hsl(0, 100%, 75%)", "hsl(28, 100%, 75%)",  "hsl(60, 100%, 75%)", "hsl(100, 100%, 75%)"];
    } else if (numColors === 5) {
      colors = ["hsl(0, 100%, 75%)", "hsl(28, 100%, 75%)",  "hsl(60, 100%, 75%)", "hsl(100, 100%, 75%)", "hsl(185, 100%, 75%)"];
    } else {
      for (let i = 0; i < numColors; i++) {
        const hue = Math.round((360 / numColors) * i); // Evenly spaced hues
        colors.push(`hsl(${hue}, 100%, 75%)`);
      }
    }
    
    return colors;
  }

  const defaultKey = Object.keys(allStats)[0];
  const [selectedStat, setSelectedStat] = useState(defaultKey);
  const [selectedStatProperName, setSelectedStatProperName] = useState<string>(allStats[defaultKey]);
  const [colorSpectrumArray, setColorSpectrumArray] = useState([])
  

  useEffect(() => {
    const statHeadingsTemp = [];
    Object.keys(frameDataFile).map(character =>
      !statHeadingsTemp.includes(frameDataFile[character].stats[selectedStat]) &&
        statHeadingsTemp.push(frameDataFile[character].stats[selectedStat])
    )

    isNaN(statHeadingsTemp[0])
      ? statHeadingsTemp.sort()
      : statHeadingsTemp.sort((a, b) => {
        const y = a.match(/[^0-9.f]/g) ? a.split(/[^0-9.f]/g)[0] : a
        const z = b.match(/[^0-9.f]/g) ? b.split(/[^0-9.f]/g)[0] : b
        return y - z
      }).reverse()
    setStatHeadings(statHeadingsTemp);

    setColorSpectrumArray(generateColors(statHeadingsTemp.length))


  },[selectedStat, frameDataFile]);

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{`Stats - ${selectedStatProperName}`}</IonTitle>
          <IonButtons slot="end">
            <PopoverButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>


      <IonContent id="statCompare">
        <div className='side-and-main-container'>
          <ul className='side-bar'>
            {Object.keys(allStats).map(statKey => 
              statKey !== "bestReversal" && <li key={`stat-${statKey}`} className={statKey === selectedStat ? "selected" : null} onClick={() => {setSelectedStat(statKey); setSelectedStatProperName(allStats[statKey])}}>{allStats[statKey]}</li>             
            )}
          </ul>
          <div className='main-content'>
            <IonItem lines="full">
              <IonSelect
                label={"Selected Stat"}
                interfaceOptions={{ header: "Selected Stat" }}
                interface='modal'
                value={selectedStat}
                okText="Select"
                cancelText="Cancel"
                onIonChange={e => {setSelectedStat(e.detail.value); setSelectedStatProperName(allStats[e.detail.value])}}
              >
                {Object.keys(allStats).map(statKey => 
                  statKey !== "bestReversal" && <IonSelectOption key={`stat-${statKey}`} value={statKey}>{allStats[statKey]}</IonSelectOption>             
                )}
              </IonSelect>
            </IonItem>
            <div className='stats-container'>
              {statHeadings.map((statSectionHeader, index) =>
                !statSectionHeader || statSectionHeader === "?"|| statSectionHeader === "~"
                  ? null
                  : <Fragment key={statSectionHeader}>
                      <div style={{backgroundColor: colorSpectrumArray[index]}} className='stat-section-header' key={`section-${statSectionHeader}`}>
                        {statSectionHeader}
                      </div>
                      <div>
                        <span className="stat-images-container">
                          {Object.keys(frameDataFile).map(charName =>
                            frameDataFile[charName].stats[selectedStat] === statSectionHeader && !frameDataFile[charName].stats.hideCharacter &&
                              <CharacterPortrait
                                key={`${activeGame}-${charName}-stat-image`}
                                charName={charName}
                                game={activeGame}
                                selected={ (charName === selectedCharacters.playerOne.name || charName === selectedCharacters.playerTwo.name) && true}
                                charColor={frameDataFile[charName].stats.color}
                                remoteImage={frameDataFile[charName].stats.remoteImage}
                                showName={false}
                              />
                          )}
                        </span>
                      </div>
                    </Fragment>
              )}
            </div>
          </div>
        </div>
          
      </IonContent>
    </IonPage>
  );
};

export default StatCompare;
