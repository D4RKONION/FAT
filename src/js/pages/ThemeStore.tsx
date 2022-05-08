import { IonContent, IonPage, IonList, IonItem, IonLabel, IonGrid, IonButton, isPlatform, IonIcon, IonRow, IonCol, IonSelect, IonSelectOption, IonListHeader } from '@ionic/react';
import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InAppPurchase2 as iapStore } from '@ionic-native/in-app-purchase-2';
import PageHeader from '../components/PageHeader';
import { checkmarkSharp } from 'ionicons/icons';
import '../../style/pages/ThemeStore.scss'
import { setThemeAccessibility, setThemeColor } from '../actions';
import { themeAccessibilitySelector, themeColorSelector, themesOwnedSelector } from '../selectors';
import THEMES from '../constants/Themes';
import SubHeader from '../components/SubHeader';

const defaultPrice = isPlatform('android') ? '€1.79' : '$1.99';

const PRODUCTS = THEMES.map(themeObj => (
  {...themeObj, "price":  defaultPrice}
))

const ThemeStore = () => {

  const themeColor = useSelector(themeColorSelector);
  const themeAccessibility = useSelector(themeAccessibilitySelector);
  const themesOwned = useSelector(themesOwnedSelector);

  const dispatch = useDispatch();

  const listOfProducts = useMemo(() => (
    PRODUCTS.map(product => {
      const iapProduct = iapStore?.products?.find(p => p.id === product.id);
      return {
        ...product,
        price: iapProduct?.price ?? product.price,
      };
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [iapStore?.products]);

  return (
    <IonPage>
      <PageHeader
        componentsToShow={{menu: true, popover: true}}
        title="Theme Store"
      />

      <IonContent className="themeStore">
        {themeAccessibility === "colorBlind" && 
          <SubHeader
          adaptToShortScreens={false}
          hideOnWideScreens={false}
          rowsToDisplay={[
            [
              <h4>Color Blind mode is only compatible with FAT Classic. Changing the theme will automatically turn color blind mode off.</h4>,
            ]
          ]}
        />
        }
      
        <IonGrid fixed>
          <IonList>
            <IonItem lines="full" key={`default-theme-item`}>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonLabel>
                      <h2>FAT Classic</h2>
                      <p>Everybody's favourite shade of blue</p>
                    </IonLabel>
                  </IonCol>
                  {themeColor === "classic" ?
                    <IonCol className="center-in-row" size="2.75">
                      <IonIcon size="large" color="primary" icon={checkmarkSharp} />
                    </IonCol>
                  :
                  <IonCol className="center-in-row" size="2.75">
                    <IonButton
                      fill="solid" size="default"
                      onClick={ () => {
                        dispatch(setThemeColor("classic"));
                      }}>Use</IonButton>
                  </IonCol>
                  
                  }
                  
                </IonRow>			
              </IonGrid>
            </IonItem>

            {listOfProducts.map(iapStoreObj =>
              <IonItem lines="full" key={`store-theme-item-${iapStoreObj.alias}`}>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonLabel>
                        <h2>{iapStoreObj.alias}</h2>
                        <p>{iapStoreObj.description}</p>
                      </IonLabel>
                    </IonCol>
                    {themesOwned.includes(iapStoreObj.alias) &&
                      <>
                      {themeColor === iapStoreObj.shortId ?
                        <IonCol className="center-in-row" size="2.75">
                          <IonIcon size="large" color="primary" icon={checkmarkSharp} />
                        </IonCol>
                      :
                      <IonCol className="center-in-row" size="2.75">
                        <IonButton
                          fill="solid" size="default"
                          onClick={ () => {
                            if (themeAccessibility === "colorBlind") {
                              dispatch(setThemeAccessibility("none"));
                            }
                            dispatch(setThemeColor(iapStoreObj.shortId));
                          }}
                        >Use</IonButton>
                      </IonCol>
                      }
                      </>
                    }			
                  </IonRow>
                  {!themesOwned.includes(iapStoreObj.alias) &&
                    <IonRow className="purchasable-theme-row center-in-row">
                      <IonCol>
                        <IonButton
                          fill="outline" expand="block" size="default"
                          routerLink={`/themestore/${iapStoreObj.shortId}`}
                          routerDirection="forward"
                        >Preview</IonButton>
                      </IonCol>
                      <IonCol>
                      <IonButton
                        fill="solid" expand="block" size="default"
                        onClick={ () => {
                          iapStore.order(iapStoreObj.id);
                        }}
                      >{iapStoreObj.price || defaultPrice}</IonButton>
                      </IonCol>
                    </IonRow>
                  }
                </IonGrid>
              </IonItem>	
            )}

            

            {isPlatform('ios') && (
              <IonItem lines="full" key={`restore-theme-item`}>
              <IonLabel>
                <h2>Restore Previous Purchase</h2>
                <p>Tap this button to restore any themes you've purchased before!</p>
              </IonLabel>
              <IonButton
                fill="solid" slot="end" size="default"
                onClick={() => iapStore.refresh()}
              >Restore</IonButton>
              </IonItem>
            )}
            <IonItem lines="full">
                <IonLabel>
                  <h2>Colour Blind Mode</h2>
                  <p>Use colour blind safe palettes</p>
                </IonLabel>
                <IonSelect
                  interfaceOptions={{ header: "Colour Blind Mode" }}
                  value={themeAccessibility}
                  okText="Select"
                  cancelText="Cancel"
                  onIonChange={ (e) => {
                    dispatch(setThemeColor("classic"));
                    dispatch(setThemeAccessibility(e.detail.value));
                  }}
                >
                  <IonSelectOption value={"colorBlind"}>On</IonSelectOption>
                  <IonSelectOption value={"none"}>Off</IonSelectOption>
                </IonSelect>
              </IonItem>
          </IonList>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

export default ThemeStore;
