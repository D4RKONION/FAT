import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonMenuButton, IonBackButton, IonIcon, IonRouterContext } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import React, { useContext } from 'react';
import PopoverButton from './PopoverButton';
import '../../style/components/PageHeader.scss'
import BrightnessToggle from './BrightnessToggle';

type PageHeaderProps = {
  componentsToShow?: {
    menu?: boolean;
    back?: boolean;
    customBackUrl?: string;
    popover?: boolean;
  };
  buttonsToShow?: [
    {
      slot: string;
      buttons: [
        {
          // TSHELP: this is throwing an error on Element e.g. in LandscapeOptions.tsx
          text: string | Element;
          buttonFunc: () => void;
        }
      ]
    }
  ];
  title: string;
}

const PageHeader = ( { componentsToShow, buttonsToShow, title }: PageHeaderProps ) => {

  
  const routerContext = useContext(IonRouterContext);

  return(
    <IonHeader>
      <IonToolbar>
        {componentsToShow &&
          <IonButtons slot="start">
            {componentsToShow.menu && <IonMenuButton />}
            {componentsToShow.back && <IonBackButton />}

            {/* ionic only shows the back button when you navigate from somewhere, but sometimes
                I might want to navigate "back" anyway
            */}
            {componentsToShow.customBackUrl &&
              <IonButton size="small" onClick={() => 
                routerContext.push(componentsToShow.customBackUrl, "back")
              }><IonIcon slot="icon-only" icon={arrowBack} /></IonButton>
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

        
        

        {componentsToShow && componentsToShow.menu &&
          <BrightnessToggle styleName="widescreenMode" />
        }
        
        {componentsToShow && componentsToShow.popover &&
          <PopoverButton />
        }

        
      </IonToolbar>
    </IonHeader>
  )
}



export default PageHeader;
