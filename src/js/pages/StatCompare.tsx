import { IonContent, IonPage, IonItem, IonLabel, IonSelect, IonSelectOption, IonIcon, IonFab, IonFabButton, IonItemDivider, IonGrid } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PageHeader from '../components/PageHeader';
import '../../style/pages/StatCompare.scss';
import '../../style/components/FAB.scss'
import { setModalVisibility } from '../actions';
import { person } from 'ionicons/icons';
import CharacterPortrait from '../components/CharacterPortrait';
import { activeGameSelector, frameDataSelector, gameDetailsSelector, selectedCharactersSelector } from '../selectors';


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
  const defaultKey = Object.keys(allStats)[0];
  const [selectedStat, setSelectedStat] = useState(defaultKey);
  const [selectedStatProperName, setSelectedStatProperName] = useState<string>(allStats[defaultKey]);

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

  },[selectedStat, frameDataFile]);

  return (
    <IonPage>
      <PageHeader
        componentsToShow={{ menu: true, popover: true}}
        title={`Stats - ${selectedStatProperName}`}
      />


      <IonContent id="statCompare">
        <IonGrid fixed>
          <IonItem lines="full">
            <IonSelect
              label={"Selected Stat"}
              interfaceOptions={{ header: "Selected Stat" }}
              value={selectedStat}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => {setSelectedStat(e.detail.value); setSelectedStatProperName(allStats[e.detail.value])}}
            >
              {Object.keys(allStats).map(statKey =>
                <IonSelectOption key={`stat-${statKey}`} value={statKey}>{allStats[statKey]}</IonSelectOption>
              )}
            </IonSelect>
          </IonItem>

          {statHeadings.map(listHeader =>
            listHeader === "?"
              ? null
              : <div key={`section-${listHeader}`}>
                  <IonItemDivider>
                    <p>{listHeader}</p>
                  </IonItemDivider>
                  <div className="stat-images-container">
                    {Object.keys(frameDataFile).map(charName =>
                      frameDataFile[charName].stats[selectedStat] === listHeader && !frameDataFile[charName].stats.hideCharacter &&
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
                  </div>
                </div>
          )}
          

          

        </IonGrid>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={ () => { dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true})) } }>
              <IonIcon icon={person} />
            </IonFabButton>
          </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default StatCompare;
