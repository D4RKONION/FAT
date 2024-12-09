import { IonContent, IonPage, IonList, IonItem, IonLabel, IonIcon, isPlatform, IonGrid, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from "@ionic/react";
import { chevronForward, desktopOutline, documentTextOutline, logoDiscord, chatbubblesOutline, heartOutline } from "ionicons/icons";
import { useHistory } from "react-router";

import { RES_MENU_LIST } from "../constants/MenuLists";

const MoreResources = () => {
  const history = useHistory();
  
  const icons = { desktopOutline, documentTextOutline, logoDiscord, chatbubblesOutline, heartOutline };
  const getIcon = (iconAsString) => {
    return icons[iconAsString];
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>More Resources</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="calculators">
        <IonGrid fixed>
          <IonList>
            {Object.keys(RES_MENU_LIST).map(resItem =>
              <IonItem key={`${resItem}-resItem`} lines="full" onClick={() => history.push(`/moreresources/${RES_MENU_LIST[resItem].url}`)} button>
                <IonLabel>
                  <h2>{resItem}</h2>
                  <p>{RES_MENU_LIST[resItem].desc}</p>
                </IonLabel>
                <IonIcon icon={getIcon(RES_MENU_LIST[resItem].icon)} slot="start" />
                {!isPlatform("ios") &&
                <IonIcon icon={chevronForward} slot="end" />
                }
              </IonItem>
            )}
          </IonList>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default MoreResources;
