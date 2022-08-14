import React, { useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plugins } from '@capacitor/core';
import { IonApp, IonRouterOutlet, IonSplitPane, IonAlert } from '@ionic/react';
import { menuController } from "@ionic/core";
import { IonReactHashRouter } from '@ionic/react-router';
import { InAppPurchase2 as iapStore} from '@ionic-native/in-app-purchase-2';
import { Route } from 'react-router-dom';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* CSS */
import './style/App.scss'
import './style/theme/universal/light.scss'
import './style/theme/universal/dark.scss'
/* Theme variables */
import './style/theme/classic/light.scss'
import './style/theme/classic/dark.scss'
import './style/theme/reddragon/light.scss'
import './style/theme/reddragon/dark.scss'
import './style/theme/secondincommand/light.scss'
import './style/theme/secondincommand/dark.scss'
import './style/theme/deltagreen/light.scss'
import './style/theme/deltagreen/dark.scss'
import './style/theme/poisonouspink/light.scss'
import './style/theme/poisonouspink/dark.scss'

import HomePageRedirect from './js/pages/HomePageRedirect';
import Menu from './js/components/Menu';
import FrameData from './js/pages/FrameData';
import MoveDetail from './js/pages/MoveDetail';
import MovesList from './js/pages/MovesList';
import Combos from './js/pages/Combos';
import CalculatorMenu from './js/pages/CalculatorMenu';
import FrameTrapChecker from './js/pages/Calculators/FrameTrapChecker';
import Settings from './js/pages/Settings';
import Shoutouts from './js/pages/Shoutouts';
import CharacterStats from './js/pages/CharacterStats';
import FrameTrapLister from './js/pages/Calculators/FrameTrapLister';
import FrameKillGenerator from './js/pages/Calculators/FrameKillGenerator';
import MovePunisher from './js/pages/Calculators/MovePunisher';
import CharacterPunisher from './js/pages/Calculators/CharacterPunisher';
import MoveLinker from './js/pages/Calculators/MoveLinker';
import Yaksha from './js/pages/Yaksha';
import StringInterrupter from './js/pages/Calculators/StringInterrupter';
import StatCompare from './js/pages/StatCompare';
import MoreResources from './js/pages/MoreResourcesMenu';
import MoreResourcesSub from './js/pages/MoreResourcesSub';
import ThemeStore from './js/pages/ThemeStore';
import ThemePreview from './js/pages/ThemePreview';
import VersionLogs from './js/pages/VersionLogs';

import { activeGameSelector, themeAccessibilitySelector, themeBrightnessSelector, themeColorSelector } from './js/selectors';
import { setOrientation, setModalVisibility, setActiveGame, setThemeOwned, setThemeBrightness } from './js/actions';
import { store } from './js/store';
import { APP_SFV_FRAME_DATA_CODE, APP_GGST_FRAME_DATA_CODE, APP_CURRENT_VERSION_CODE, APP_DATE_UPDATED } from './js/constants/VersionLogs';
import GAME_DETAILS from './js/constants/GameDetails';
import { GameName } from './js/types';

const App = () => {

  const activeGame = useSelector(activeGameSelector);
  const themeBrightness = useSelector(themeBrightnessSelector);
  const themeAccessibility = useSelector(themeAccessibilitySelector);
  const themeColor = useSelector(themeColorSelector);

  const dispatch = useDispatch();

  const [exitAlert, setExitAlert] = useState(false);

  const { SplashScreen } = Plugins;
  useEffect(() => {
    SplashScreen.hide();
  }, [SplashScreen])

  // G says: try moving the modal listener into it's own area again
  const { App: CapAppPlugin }  = Plugins;
  useEffect(() => {
    const { remove } = CapAppPlugin.addListener("backButton", async () => {
      const currentModalState = store.getState().modalVisibilityState;
      const modeNameState = store.getState().modeNameState;
      if (currentModalState.visible) {
        console.log("closing modal")
        store.dispatch(setModalVisibility({ currentModal: currentModalState.currentModal, visible: false }))
      } else if (modeNameState === "movedetail" || modeNameState.startsWith("subpage") || modeNameState.startsWith("calc-")) {
        console.log("going back")
        window.history.back();
      } else if ( !(await menuController.isOpen()) ) {
        menuController.open();
      } else {
        console.log("closing app")
        setExitAlert(true)
      }
    })

    return remove;
  }, [CapAppPlugin])

  useEffect(() => {
    //G: is this okay?
    if (iapStore.when("").updated) {
      const productList = [
        { id: "com.fullmeter.fat.theme.reddragon", alias: "Red Dragon", type: iapStore.NON_CONSUMABLE },
        { id: "com.fullmeter.fat.theme.secondincommand", alias: "Second in Command", type: iapStore.NON_CONSUMABLE },
        { id: "com.fullmeter.fat.theme.deltagreen", alias: "Delta Green", type: iapStore.NON_CONSUMABLE },
        { id: "com.fullmeter.fat.theme.poisonouspink", alias: "Poisonous Pink", type: iapStore.NON_CONSUMABLE },
      ]

      iapStore.verbosity = iapStore.DEBUG;
      
      productList.forEach(productEntry => {
        iapStore.register({
          id: productEntry.id,
          alias: productEntry.alias,
          type: productEntry.type,
        })

        iapStore.when(productEntry.id).registered( (product => {
          console.log('Registered: ' + JSON.stringify(product));
        }))
  
        iapStore.when(productEntry.id).updated( (product => {
          console.log('Updated: ' + JSON.stringify(product));
        }))
  
        iapStore.when(productEntry.id).cancelled( (product => {
          console.log('Cancelled: ' + JSON.stringify(product));
        }))

        iapStore.when(productEntry.id).approved( (product => {
          console.log('Approved: ' + JSON.stringify(product));
          product.finish();
        }))

        iapStore.when(productEntry.id).owned( (product => {
          dispatch(setThemeOwned(product.alias))
        }))
      })
      

      iapStore.error( error => {
        console.log('Store Error: ' + JSON.stringify(error));
      })

      iapStore.ready(() =>  {
        console.log('Store is ready');
        console.log('Products: ' + JSON.stringify(iapStore.products));
      });

      iapStore.refresh();

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const orientationCheck = () => {
      if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
        dispatch(setOrientation("landscape"));
      } else {
        dispatch(setOrientation("portrait"));
      }
    }

    orientationCheck();
    window.addEventListener('resize', orientationCheck);

    return () => window.removeEventListener('resize', orientationCheck);
  }, [dispatch]);

useEffect(() => {
    const newVersionCheck = async (gameName: string) => {
      
      // rename the generic lsFrameDataCode to lsSFVFrameDataCode
      if (localStorage.getItem("lsFrameDataCode")) {
        console.log("deleting old SFV code")
        localStorage.setItem("lsSFVFrameDataCode", localStorage.getItem("lsFrameDataCode"))
        localStorage.removeItem("lsFrameDataCode")
      }

      const APP_FRAME_DATA_CODE = gameName === "SFV" ? APP_SFV_FRAME_DATA_CODE : APP_GGST_FRAME_DATA_CODE

      // check if the frame data was updated
      let LS_FRAME_DATA_CODE = parseInt(localStorage.getItem(`ls${gameName}FrameDataCode`));

      if (!LS_FRAME_DATA_CODE) {
        // fresh install, local code doesn't exist, set it up using the app's local data
        console.log("local frame data code don't exist, set it up using the app's local data")
        localStorage.setItem(`ls${gameName}FrameDataCode`, APP_FRAME_DATA_CODE.toString())
        // regardless of the game, if this is a store update we want to set the frame-data last updated date to the app's last update
        localStorage.setItem(`ls${gameName}FrameDataLastUpdated`, APP_DATE_UPDATED.toString())

        LS_FRAME_DATA_CODE = parseInt(localStorage.getItem(`ls${gameName}FrameDataCode`));

        // also because this is a fresh install, we're going to do a cheeky check for if
        // the user likes dark mode right here
        window.matchMedia('(prefers-color-scheme: dark)').matches &&
          dispatch(setThemeBrightness("dark"))

      } else if (LS_FRAME_DATA_CODE <= APP_FRAME_DATA_CODE) {
        // the app has been updated via the store, delete the LS FrameData.json and update the VS_FDC
        console.log("the app has been updated via the store, delete the LS FrameData.json and update the VS_FDC")
        localStorage.setItem(`ls${gameName}FrameDataCode`, APP_FRAME_DATA_CODE.toString())
        localStorage.removeItem(`ls${gameName}FrameData`);

        LS_FRAME_DATA_CODE = parseInt(localStorage.getItem(`ls${gameName}FrameDataCode`));

        // regardless of the game, if this is a store update we want to set the frame-data last updated date to the app's last update
        localStorage.setItem(`ls${gameName}FrameDataLastUpdated`, APP_DATE_UPDATED.toString())

      } else if (LS_FRAME_DATA_CODE > APP_FRAME_DATA_CODE) {
        // the app has downloaded a frame data update
        console.log("the app has downloaded a frame data update")
      } else {
        console.log("something has gone horribly wrong")
      }

      const version_response = await fetch(`https://fullmeter.com/fatfiles/release/${gameName}/${gameName}VersionDetails.json?ts=${Date.now()}`)
      const SERVER_VERSION_DETAILS = await version_response.json();

      // this stops the update process accidentally being ruined
      if (SERVER_VERSION_DETAILS.MINIMUM_VERSION_REQUIRED > APP_CURRENT_VERSION_CODE) {
        console.log("Someone added a version code greater than 5 digits in length OR this app falls below the minimum version required");
        return false;
      }

      if (SERVER_VERSION_DETAILS.FRAME_DATA_CODE > LS_FRAME_DATA_CODE) {
        console.log("there's a new version on the server, get it");
        const framedatajson_response = await fetch(`https://fullmeter.com/fatfiles/release/${gameName}/${gameName}FrameData.json?ts=${Date.now()}`)
        const SERVER_FRAME_DATA = await framedatajson_response.json();

        await Plugins.Storage.set({
          key: `ls${gameName}FrameData`,
          value: JSON.stringify(SERVER_FRAME_DATA),
        });
        localStorage.setItem(`ls${gameName}FrameDataCode`, SERVER_VERSION_DETAILS.FRAME_DATA_CODE)
        localStorage.setItem(`ls${gameName}FrameDataLastUpdated`, SERVER_VERSION_DETAILS.DATE_UPDATED)
        // this is kind of dirty, and I don't like it but I don't know how else to access the activeGame from the URL.
        // without this check, this function always thinks that the current game on a fresh load is SFV
        // and totally ignores the URL switcher in framedata component. In short, I am sorry programming gods
        // please forgive me
        if (GAME_DETAILS[window.location.hash.split("/")[2]]) {
          dispatch(setActiveGame(window.location.hash.split("/")[2] as GameName, true));
        } else if (GAME_DETAILS[window.location.hash.split("/")[3]]) {
          dispatch(setActiveGame(window.location.hash.split("/")[3] as GameName, true));
        } else {
          dispatch(setActiveGame(activeGame, false))
        }
        
        
        
      }
    }
    const gamesToCheck = ["SFV", "GGST"]
    gamesToCheck.forEach(gameName => {
      newVersionCheck(gameName);
    })
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])



  return (
    <IonApp className={`${themeColor}-${themeBrightness}-theme universal-${themeBrightness}-${themeAccessibility}`}>
      <IonReactHashRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route exact path="/stats/:characterSlug" component={CharacterStats} />

            <Route exact path="/framedata/:gameSlug/:characterSlug" component={FrameData} />
            <Route exact path="/framedata/movedetail/:gameSlug/:characterSlug/:vtStateSlug/:moveNameSlug" component={MoveDetail} />

            <Route exact path="/moveslist/:gameSlug/:characterSlug" component={MovesList} />
            <Route exact path="/moveslist/movedetail/:gameSlug/:characterSlug/:vtStateSlug/:moveNameSlug" component={MoveDetail} />

            <Route exact path="/combos/:gameSlug/:characterSlug" component={Combos} />
            <Route exact path="/statcompare" component={StatCompare} />

            <Route exact path="/calculators/" component={CalculatorMenu} />
            <Route exact path="/calculators/frametrapchecker" component={FrameTrapChecker} />
            <Route exact path="/calculators/frametraplister" component={FrameTrapLister} />
            <Route exact path="/calculators/framekillgenerator" component={FrameKillGenerator} />
            <Route exact path="/calculators/movepunisher" component={MovePunisher} />
            <Route exact path="/calculators/characterpunisher" component={CharacterPunisher} />
            <Route exact path="/calculators/movelinker" component={MoveLinker} />
            <Route exact path="/calculators/stringinterrupter" component={StringInterrupter} />

            <Route exact path="/yaksha" component={Yaksha} />
            <Route exact path="/yaksha/movedetail/:gameSlug/:characterSlug/:vtStateSlug/:moveNameSlug" component={MoveDetail} />

            <Route exact path="/moreresources" component={MoreResources} />
            <Route exact path="/moreresources/:resourcePageSlug" component={MoreResourcesSub} />

            <Route exact path="/settings" component={Settings} />
            <Route exact path="/settings/shoutouts" component={Shoutouts} />
            <Route exact path="/settings/versionlogs" component={VersionLogs} />

            <Route exact path="/themestore" component={ThemeStore} />
            <Route exact path="/themestore/:themeNameSlug" component={ThemePreview} />

            <Route path="/" component={HomePageRedirect} exact />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactHashRouter>
      <IonAlert
        isOpen={exitAlert}
        onDidDismiss={() => setExitAlert(false)}
        header={'Close App'}
        message={'Are you sure you want to exit FAT?'}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Okay',
            handler: () => {
              CapAppPlugin.exitApp();
            }
          }
        ]}
      />
    </IonApp>
  )
}

export default App;
