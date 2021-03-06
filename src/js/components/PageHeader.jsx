import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonMenuButton, IonBackButton, IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router';
import PopoverButton from './PopoverButton';


const PageHeader = ({ componentsToShow, buttonsToShow, title }) => {

  const history = useHistory();

  return(
    <IonHeader>
      <IonToolbar>
        {componentsToShow &&
          <IonButtons slot="start">
            {componentsToShow.menu && <IonMenuButton />}
            {componentsToShow.back && <IonBackButton />}

            {/* ionic is smelly and dumps the ionbackbutton when I change brightness */}
            {componentsToShow.customback &&
              <IonButton size="small" onClick={() => history.goBack() }>
                <IonIcon slot="icon-only" icon={arrowBack} />
              </IonButton>
            }
            
          </IonButtons>
        }
        {buttonsToShow && buttonsToShow.map(buttonSet => (
          <IonButtons key={buttonSet.slot} slot={buttonSet.slot}>
            {buttonSet.buttons.map((button, index) => (
              <IonButton key={index} onClick={() => button.buttonFunc()}>
                {button.text}
              </IonButton>
            ))}
          </IonButtons>
        ))}
        <IonTitle>{title}</IonTitle>
        {componentsToShow && componentsToShow.popover &&
          <PopoverButton />
        }
      </IonToolbar>
    </IonHeader>
  )
}



export default PageHeader;
