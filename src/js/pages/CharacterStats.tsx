import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useSelector } from 'react-redux';
import GAME_DETAILS from '../constants/GameDetails'
import '../../style/components/DetailCards.scss';
import PageHeader from '../components/PageHeader';
import SubHeader from '../components/SubHeader';


const CharacterStats = () => {

  const selectedCharacters = useSelector(state => state.selectedCharactersState);
  const activeGame = useSelector(state => state.activeGameState); 
  const activePlayer = useSelector(state => state.activePlayerState);

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
                      <div key={dataId}><b>{headerObj}</b><br/>{charStatsData[dataId]}</div>
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
