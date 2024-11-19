import { useDispatch, useSelector } from "react-redux";
import '../../style/pages/Premium.scss';
import "cordova-plugin-purchase";
import { IonBackButton, IonButton, IonButtons, IonCheckbox, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonMenuButton, IonModal, IonPage, IonTitle, IonToolbar, isPlatform } from "@ionic/react";
import { premiumSelector } from "../selectors";
import { diamondSharp } from "ionicons/icons";
import { useLocation } from "react-router";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { purchaseLifetimePremium, resetPremium } from "../actions";
import { useState } from "react";

const Premium = () => {

  const { store: iapStore } = CdvPurchase;
  const location = useLocation();
  const dispatch = useDispatch();
  const premiumIsPurchased = useSelector(premiumSelector).lifetimePremiumPurchased;

  const [premiumModalIsOpen, setPremiumModalIsOpen]  = useState(false)
  const [tipAdded, setTipAdded]  = useState(false)

  const defaultPrice = "€3.49";
  const defaultTip = "€1.50";

  console.log(iapStore)

  return(
    <IonPage id="Premium">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {location.pathname === "/premium"
              ? <IonMenuButton />
              : <IonBackButton defaultHref="/settings"></IonBackButton>
            }
          </IonButtons>
          <IonTitle>Premium</IonTitle>
        </IonToolbar>
      </IonHeader>
      

      <IonContent className="ion-padding">
        {premiumIsPurchased ?
            <IonItem style={{"--border-radius": "10px"}} >
              <IonIcon aria-hidden="true" icon={diamondSharp} slot="start" size="large" color={"primary"}></IonIcon>
              <IonLabel>
                <h1>Premium Purchased</h1>
                <p>Thank you for supporting FAT! Here's what you're getting.</p>
              </IonLabel>
            </IonItem>
          :
            <p>Premium is a <strong>one-time purchase</strong> which give you access to a bunch of extra helpful features and also helps keep FAT ad-free.</p>
          }

          <article>
            

            <section>
              <h1>App Themes</h1>
              <hr></hr>
              <p>Want to stand out from the crowd? Sick of the colour blue? Then app themes are for you! Choose from 4 new themes which work in both light and dark mode!</p>
              <ThemeSwitcher
                premiumPreview={true}

              ></ThemeSwitcher>
            </section>

          </article>
        {/* DEBUG BUTTON */}
        {!isPlatform("capacitor") && 
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton onClick={() => premiumIsPurchased ? dispatch(resetPremium()) : dispatch(purchaseLifetimePremium())}>
              <IonIcon icon={diamondSharp}></IonIcon>
            </IonFabButton>
          </IonFab>
        }
  
        {!premiumIsPurchased && 
          <IonButton mode="ios" shape="round" onClick={() => {
            setPremiumModalIsOpen(true)
          }}>Upgrade to Premium!</IonButton>
        }

        {/* styled globally as modals are presented at root  */}
        <IonModal className="premium-offer-modal" showBackdrop={true} isOpen={premiumModalIsOpen} initialBreakpoint={1} breakpoints={[0, 1]} onDidDismiss={() => setPremiumModalIsOpen(false)}>
          <div className="premium-offer-modal-content">
            {!premiumIsPurchased && 
              <IonButton expand="full" shape="round" mode="ios" onClick={() => {
                iapStore.get(
                  !tipAdded ? "com.fullmeter.fat.premium_lifetime" : "com.fullmeter.fat.premium_lifetime_tip",
                  isPlatform('android') ? CdvPurchase.Platform.GOOGLE_PLAY : CdvPurchase.Platform.APPLE_APPSTORE
                )?.getOffer()?.order()
              }}>Lifetime Premium {iapStore?.get("com.fullmeter.fat.premium_lifetime")?.pricing.price || defaultPrice}</IonButton>
            }
            <IonItem>
              <IonCheckbox checked={tipAdded} onIonChange={() => setTipAdded(!tipAdded)}>Add a tip for Paul (+{defaultTip}) </IonCheckbox>
            </IonItem>
            <p><em>Adding a tip to your purchase is completely optional, and provides no extra features. It's simply a way to give a little extra support to FAT. Either way, thank you for considering purchasing premium!</em></p>
          </div>
        </IonModal>
        
      </IonContent>
    </IonPage>
  )
}

export default Premium;