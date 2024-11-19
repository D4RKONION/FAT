import { IonContent, IonPage, IonList, IonListHeader, IonItem, IonLabel, IonIcon, isPlatform, IonItemGroup, IonGrid, IonHeader, IonToolbar, IonButtons, IonTitle, IonMenuButton } from '@ionic/react';
import '../../style/pages/Calculators.scss';
import { bulbOutline, chevronForward, skullOutline, linkOutline, handLeftOutline, receiptOutline, peopleOutline, personRemoveOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { CALC_MENU_LIST } from '../constants/MenuLists'
import { useSelector } from 'react-redux';
import { activeGameSelector } from '../selectors';
import PopoverButton from '../components/PopoverButton';

const Calculators = () => {
  let history = useHistory();
  const activeGame = useSelector(activeGameSelector);

  const icons = { bulbOutline, chevronForward, skullOutline, linkOutline, handLeftOutline, receiptOutline, peopleOutline, personRemoveOutline }
  const getIcon = (iconAsString) => {
    return icons[iconAsString]
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Calculator Menu</IonTitle>
          <IonButtons slot="end">
            <PopoverButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="calculators">
        <IonGrid fixed>
          <IonList>
            {
              Object.keys(CALC_MENU_LIST).map(listHeader =>
                <IonItemGroup key={`${listHeader}-options`}>
                  <IonListHeader>{listHeader}</IonListHeader>
                  {Object.keys(CALC_MENU_LIST[listHeader]).map(calcType =>
                    CALC_MENU_LIST[listHeader][calcType].excludedGames && CALC_MENU_LIST[listHeader][calcType].excludedGames.includes(activeGame)
                      ? null
                      : <IonItem key={`${calcType}-calcItem`} lines="none" onClick={() => history.push(`/calculators/${CALC_MENU_LIST[listHeader][calcType].url}`)} button>
                          <IonLabel>
                            <h2>{calcType}</h2>
                            <p>{CALC_MENU_LIST[listHeader][calcType].desc}</p>
                          </IonLabel>
                          <IonIcon icon={	getIcon(CALC_MENU_LIST[listHeader][calcType].icon) } slot="start" />
                          {!isPlatform("ios") &&
                            <IonIcon icon={chevronForward} slot="end" />
                          }
                        </IonItem>
                    
                  )}
                </IonItemGroup>
              )
            }
          </IonList>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};


export default Calculators;
