import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonIcon, IonPage } from '@ionic/react';
import { useSelector } from 'react-redux';
import '../../style/components/DetailCards.scss';
import PageHeader from '../components/PageHeader';
import SubHeader from '../components/SubHeader';
import { activePlayerSelector, dataDisplaySettingsSelector, frameDataSelector, gameDetailsSelector, selectedCharactersSelector } from '../selectors';
import { openOutline } from 'ionicons/icons';


const CharacterStats = () => {

  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);

  const activeCharName = selectedCharacters[activePlayer].name;
  const charStatsData = selectedCharacters[activePlayer].stats;

  const frameData = useSelector(frameDataSelector);
  const gameDetails = useSelector(gameDetailsSelector);
	const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);
	const moveNotation = 
		dataDisplaySettings.moveNameType === "common"
			? "cmnName"
		: dataDisplaySettings.inputNotationType


  const statsPoints = gameDetails.statsPoints;

  return (
    <IonPage>
      <PageHeader
        componentsToShow={{back: true}}
        title={`Stats | ${activeCharName}`}
      />

      <IonContent id="characterStats">

        <SubHeader
          adaptToShortScreens={false}
          hideOnWideScreens={false}
          rowsToDisplay={[
            [
              <h4>{charStatsData["phrase"]}</h4>,
            ]
          ]}
        />
        <div id="flexCardContainer">

          {/* Always Displayed Entries */}
          {Object.keys(statsPoints).map(dataSection => (
            <IonCard key={dataSection}>
              <IonCardHeader>
                <IonCardTitle>{dataSection}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {statsPoints[dataSection].map((dataRow, index) =>
                  <div key={index} className="row">
                    {Object.entries(dataRow).map(([dataId, headerObj]) =>
                      <div key={dataId} className="col">
                        <p>{headerObj}</p>
                        <h2>
                          {
                            dataId === "bestReversal" && frameData[activeCharName] && frameData[activeCharName].moves.normal[charStatsData[dataId]]
                              ? frameData[activeCharName].moves.normal[charStatsData[dataId]][moveNotation]								
                              : charStatsData[dataId]
                          }
                        </h2>
                      </div>
                    )}
                  </div>
                )}
              </IonCardContent>
            </IonCard>
            )
          )}
          
          {selectedCharacters[activePlayer].stats.hashtag && 
            <IonCard className="final-card">
              <IonCardHeader>
                <IonCardTitle>Check out the Twitter tech</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="row">
                  <div className="col">
                    <IonButton expand="full" fill="clear" onClick={() => window.open(`https://twitter.com/search?q=%23${(selectedCharacters[activePlayer].stats.hashtag as string).substring(1)}`, '_blank')}>
                      <IonIcon slot="end" icon={openOutline} />
                      {selectedCharacters[activePlayer].stats.hashtag}
                    </IonButton>
                  </div>
                </div>
                
            
              </IonCardContent>
            </IonCard>
          }
        </div>

      </IonContent>
    </IonPage>
  );
};

export default CharacterStats;
