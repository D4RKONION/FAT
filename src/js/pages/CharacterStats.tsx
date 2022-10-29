import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonPage } from '@ionic/react';
import { useSelector } from 'react-redux';
import '../../style/components/DetailCards.scss';
import PageHeader from '../components/PageHeader';
import SubHeader from '../components/SubHeader';
import { activePlayerSelector, dataDisplaySettingsSelector, frameDataSelector, gameDetailsSelector, selectedCharactersSelector } from '../selectors';


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
                        <h2>{headerObj}</h2>
                        <p>
                          {
                            dataId === "bestReversal" && frameData[activeCharName] && frameData[activeCharName].moves.normal[charStatsData[dataId]]
                              ? frameData[activeCharName].moves.normal[charStatsData[dataId]][moveNotation]								
                              : charStatsData[dataId]
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </IonCardContent>
            </IonCard>
            )
          )}
        </div>

      </IonContent>
    </IonPage>
  );
};

export default CharacterStats;
