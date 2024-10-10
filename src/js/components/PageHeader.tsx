import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonMenuButton, IonBackButton, IonIcon, IonSearchbar } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import PopoverButton from './PopoverButton';
import '../../style/components/PageHeader.scss'
import { useHistory } from 'react-router';

type PageHeaderProps = {
  componentsToShow?: {
    menuButton?: boolean;
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

  let history = useHistory()
  
  return(
    <IonHeader>
      <IonToolbar>
        {componentsToShow &&
          <IonButtons slot="start">
            {componentsToShow.menuButton && <IonMenuButton />}
            {componentsToShow.back && <IonBackButton />}

            {/* ionic only shows the back button when you navigate from somewhere, but sometimes
                I might want to navigate "back" anyway
            */}
            {componentsToShow.customBackUrl &&
              <IonButton size="small" onClick={() => 
                history.replace(componentsToShow.customBackUrl)
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
          ? <IonSearchbar value={searchText} onIonInput={e => onSearchHandler(e.detail.value!)} placeholder={title}></IonSearchbar>
          : <IonTitle>{title}</IonTitle>
        }
       
        
        <IonButtons slot="end">
          {componentsToShow && componentsToShow.popover &&
            <PopoverButton />
          }
        </IonButtons>

        
      </IonToolbar>
    </IonHeader>
  )
}



export default PageHeader;
