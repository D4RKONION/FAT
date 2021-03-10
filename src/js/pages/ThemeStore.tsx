import { IonContent, IonPage, IonList, IonItem, IonLabel, IonGrid, IonButton, isPlatform, IonIcon, IonRow, IonCol } from '@ionic/react';
import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InAppPurchase2 as iapStore } from '@ionic-native/in-app-purchase-2';
import { last } from 'lodash';
import PageHeader from '../components/PageHeader';
import { checkmarkSharp } from 'ionicons/icons';
import '../../style/pages/ThemeStore.scss'
import { setThemeColor } from '../actions';
import { themeColorSelector, themesOwnedSelector } from '../selectors';

const defaultPrice = isPlatform('android') ? '€1.79' : '$1.99';

const PRODUCTS = [
  {
    id: "com.fullmeter.fat.theme.reddragon",
    alias: "Red Dragon",
    description: "Can you buy this red and blonde theme? Sure you can!",
    price: defaultPrice,
  },
  {
    id: "com.fullmeter.fat.theme.secondincommand",
    alias: "Second in Command",
    description: "An intoxicatingly purple choice for our 2nd theme!",
    price: defaultPrice,
  }
];

const ThemeStore = () => {

  const themeColor = useSelector(themeColorSelector);
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
                      {themeColor === last(iapStoreObj.id.split(".")) ?
                        <IonCol className="center-in-row" size="2.75">
                          <IonIcon size="large" color="primary" icon={checkmarkSharp} />
                        </IonCol>
                      :
                      <IonCol className="center-in-row" size="2.75">
                        <IonButton
                          fill="solid" size="default"
                          onClick={ () => {
                            dispatch(setThemeColor(last(iapStoreObj.id.split("."))));
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
                          fill="outline" size="block"
                          routerLink={`/themestore/${last(iapStoreObj.id.split("."))}`}
                          routerDirection="forward"
                        >Preview</IonButton>
                      </IonCol>
                      <IonCol>
                      <IonButton
                        fill="solid" size="block"
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
          </IonList>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

export default ThemeStore;
