import { IonContent, IonIcon, IonItem, IonList, IonMenu, IonMenuToggle } from "@ionic/react";
import { peopleOutline } from 'ionicons/icons';
import { setModalVisibility } from '../actions';

const WidescreenMenu = (() => {
  return (
    <IonMenu contentId="wideScreenMenu" type="overlay">
      <IonContent>
        <IonList>
          <IonMenuToggle autoHide={false}>
            <IonItem key="charSelectItem" className="" onClick={() => setModalVisibility({ currentModal: "characterSelect", visible: true })}  lines="none" detail={false} button>
              <IonIcon slot="start" icon={peopleOutline} />
            </IonItem>
          </IonMenuToggle>
        </IonList>
        
      </IonContent>
    </IonMenu>
  )
})

export default WidescreenMenu;