import { IonContent, IonPage, IonItem, IonLabel, IonSelect, IonSelectOption, IonIcon, IonFab, IonFabButton, IonItemDivider, IonGrid } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PageHeader from '../components/PageHeader';
import '../../style/pages/StatCompare.scss';
import '../../style/components/FAB.scss'
import { setModalVisibility } from '../actions';
import { person } from 'ionicons/icons';
import { sortBy } from 'lodash';
import CharacterPortrait from '../components/CharacterPortrait';
import { activeGameSelector, frameDataSelector, selectedCharactersSelector } from '../selectors';


const StatCompare = () => {

  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activeGame = useSelector(activeGameSelector);
  const frameDataFile = useSelector(frameDataSelector);

  const dispatch = useDispatch();


  const [selectedStat, setSelectedStat] = useState("health");
  const [selectedStatProperName, setSelectedStatProperName] = useState("Health");
  const [statHeadings, setStatHeadings] = useState([]);
   const allStats = {"health": "Health", "stun": "Stun", "vgauge1": "VGauge 1", "vgauge2": "VGauge 2", "fWalk": "Forward Walk", "bWalk": "Backwards Walk", "fJump": "Forward Jump", "bJump": "Back Jump", "nJump": "Neutral Jump", "fJumpDist": "F. Jump Distance", "bJumpDist": "B. Jump Distance", "fDash": "Forward Dash (Speed)", "bDash": "Back Dash (Speed)", "bDashCHFrames": "Back Dash CH Frames", "fDashDist": "F. Dash Distance (px)", "bDashDist": "B. Dash Distance (px)", "throwHurt": "Throw Hurtbox Range", "throwRange": "Throw Range"}

  useEffect(() => {
    const statHeadingsTemp = [];
    Object.keys(frameDataFile).map(character =>
      !statHeadingsTemp.includes(frameDataFile[character].stats[selectedStat]) &&
        statHeadingsTemp.push(frameDataFile[character].stats[selectedStat])
    )
    setStatHeadings([...sortBy(statHeadingsTemp).reverse()]);

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
            <IonLabel>
              <h2>Selected Stat</h2>
            </IonLabel>
            <IonSelect
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
            <div key={`section-${listHeader}`}>
              <IonItemDivider>
                <p>{listHeader}</p>
              </IonItemDivider>
              <div className="stat-images-container">
                {Object.keys(frameDataFile).map(charName =>
                  frameDataFile[charName].stats[selectedStat] === listHeader &&
                    <CharacterPortrait
                      key={`${activeGame}-${charName}-stat-image`}
                      charName={charName}
                      game={activeGame.toLowerCase()}
                      selected={ (charName === selectedCharacters.playerOne.name || charName === selectedCharacters.playerTwo.name) && true}
                      charThreeLetterCode={frameDataFile[charName].stats.threeLetterCode.toUpperCase()}
                      charColor={frameDataFile[charName].stats.color}
                      showName={true}
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
