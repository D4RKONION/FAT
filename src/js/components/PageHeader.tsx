import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonMenuButton, IonBackButton, IonIcon, IonRouterContext, IonSearchbar } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useContext } from 'react';
import PopoverButton from './PopoverButton';
import '../../style/components/PageHeader.scss'
import BrightnessToggle from './BrightnessToggle';


// TSHELP I couldn't get {...}[] to work on buttons here
type PageHeaderProps = {
  componentsToShow?: {
    menu?: boolean;
    back?: boolean;
    search?: boolean;
    customBackUrl?: string;
    popover?: boolean;
  };
  buttonsToShow?: [
    {
      slot: string;
      buttons: Array<
        {
          text: string | JSX.Element;
          buttonFunc: () => void;
        }
      >
    }
  ];
  title: string;
  onSearchHandler?: (text: string) => void;
  searchText?: string;
}

const PageHeader = ( { componentsToShow, buttonsToShow, title, onSearchHandler, searchText }: PageHeaderProps ) => {

  
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
        
        {componentsToShow && componentsToShow.search
          ? <IonSearchbar value={searchText} onIonChange={e => onSearchHandler(e.detail.value!)} placeholder={title}></IonSearchbar>
          : <IonTitle>{title}</IonTitle>
        }
       

        
        

        {componentsToShow && componentsToShow.menu &&
          <BrightnessToggle />
        }
        
        {componentsToShow && componentsToShow.popover &&
          <PopoverButton />
        }

        
      </IonToolbar>
    </IonHeader>
  )
}



export default PageHeader;
