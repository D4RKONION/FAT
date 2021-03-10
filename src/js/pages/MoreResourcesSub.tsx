import { IonContent, IonPage, IonList, IonItem, IonLabel, IonIcon, IonItemGroup, IonListHeader, IonGrid } from '@ionic/react';
import React from 'react';
import '../../style/pages/Calculators.scss';
import PageHeader from '../components/PageHeader';
import { openOutline } from 'ionicons/icons';
import { RES_DISCORDS_LIST, RES_APPS_LIST, RES_DOCS_LIST, RES_SOC_LIST, RES_FAT_LIST } from '../constants/MenuLists';
import { useParams } from 'react-router';


const MoreResourcesSub = () => {
  
  let { resourcePageSlug } = useParams();
  const resourcePageData = {
    title: "",
    obj: {}
  };

  if (resourcePageSlug === "discords") {
    resourcePageData.title = "Discords";
    resourcePageData.obj = RES_DISCORDS_LIST;
  } else if (resourcePageSlug === "apps") {
    resourcePageData.title = "Apps";
    resourcePageData.obj = RES_APPS_LIST;
  } else if (resourcePageSlug === "docs") {
    resourcePageData.title = "Docs & Sheets";
    resourcePageData.obj = RES_DOCS_LIST;
  }	else if (resourcePageSlug === "social") {
    resourcePageData.title = "Social Media";
    resourcePageData.obj = RES_SOC_LIST;
  } else if (resourcePageSlug === "fat") {
    resourcePageData.title = "FAT Team";
    resourcePageData.obj = RES_FAT_LIST;
  }
   

  return (
    <IonPage>
      <PageHeader
        componentsToShow={{back: true, popover: false}}
        title={resourcePageData.title}
      />

      <IonContent className="calculators">
        <IonGrid fixed>
          <IonList>
              {
                Object.keys(resourcePageData.obj).map(listHeader =>
                  <IonItemGroup key={`${listHeader}-options`}>
                    <IonListHeader>{listHeader}</IonListHeader>
                    {Object.keys(resourcePageData.obj[listHeader]).map(discordItem =>
                      <IonItem detail="false" lines="full" key={`${discordItem}-discordItem`} href={resourcePageData.obj[listHeader][discordItem].url} button>
                        <IonLabel>
                          <h2>{discordItem}</h2>
                          {resourcePageData.obj[listHeader][discordItem].desc && 
                            <p>{resourcePageData.obj[listHeader][discordItem].desc}</p>

                          }
                        </IonLabel>
                        {
                          <IonIcon className="small-end-icon" icon={openOutline} slot="end" />
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
}

export default MoreResourcesSub;
