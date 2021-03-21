import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonPage } from '@ionic/react';
import { useSelector } from 'react-redux';
import GAME_DETAILS from '../constants/GameDetails'
import '../../style/components/DetailCards.scss';
import PageHeader from '../components/PageHeader';
import SubHeader from '../components/SubHeader';
import { activeGameSelector, activePlayerSelector, selectedCharactersSelector } from '../selectors';


const CharacterStats = () => {

  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activeGame = useSelector(activeGameSelector); 
  const activePlayer = useSelector(activePlayerSelector);

  const activeCharName = selectedCharacters[activePlayer].name;
  const charStatsData = selectedCharacters[activePlayer].stats;


  const statsPoints = GAME_DETAILS[activeGame].statsPoints;

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
                        <p>{charStatsData[dataId]}</p>
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
