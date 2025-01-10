import "cordova-plugin-purchase";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* CSS */
import "./style/App.scss";
import "./style/theme/universal/light.scss";
import "./style/theme/universal/dark.scss";
/* Theme variables */
import "./style/theme/classic/light.scss";
import "./style/theme/classic/dark.scss";
import "./style/theme/red/light.scss";
import "./style/theme/red/dark.scss";
import "./style/theme/purple/light.scss";
import "./style/theme/purple/dark.scss";
import "./style/theme/green/light.scss";
import "./style/theme/green/dark.scss";
import "./style/theme/pink/light.scss";
import "./style/theme/pink/dark.scss";

import { App as CapAppPlugin } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { SplashScreen } from "@capacitor/splash-screen";
import { SafeArea } from "@capacitor-community/safe-area";
import { actionSheetController, menuController, modalController, popoverController } from "@ionic/core/components";
import { IonApp, IonRouterOutlet, IonSplitPane, IonAlert, isPlatform } from "@ionic/react";
import { IonReactHashRouter } from "@ionic/react-router";
import { useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route } from "react-router-dom";

import { setOrientation, setModalVisibility, setThemeBrightness, setActiveGame, setThemeColor, purchaseLifetimePremium, setAppOpenCount } from "./js/actions";
import Menu from "./js/components/Menu";
import { APP_CURRENT_VERSION_CODE, APP_DATE_UPDATED, UPDATABLE_GAMES, TYPES_OF_UPDATES, UPDATABLE_GAMES_APP_CODES } from "./js/constants/VersionLogs";
import CalculatorMenu from "./js/pages/CalculatorMenu";
import CharacterPunisher from "./js/pages/Calculators/CharacterPunisher";
import FrameKillGenerator from "./js/pages/Calculators/FrameKillGenerator";
import FrameTrapChecker from "./js/pages/Calculators/FrameTrapChecker";
import FrameTrapLister from "./js/pages/Calculators/FrameTrapLister";
import MoveLinker from "./js/pages/Calculators/MoveLinker";
import MovePunisher from "./js/pages/Calculators/MovePunisher";
import StringInterrupter from "./js/pages/Calculators/StringInterrupter";
import CharacterStats from "./js/pages/CharacterStats";
import Combos from "./js/pages/Combos";
import FrameData from "./js/pages/FrameData";
import HomePageRedirect from "./js/pages/HomePageRedirect";
import MoreResources from "./js/pages/MoreResourcesMenu";
import MoreResourcesSub from "./js/pages/MoreResourcesSub";
import MoveDetail from "./js/pages/MoveDetail";
import MovesList from "./js/pages/MovesList";
import Premium from "./js/pages/Premium";
import QuickSearch from "./js/pages/QuickSearch";
import Settings from "./js/pages/Settings";
import Shoutouts from "./js/pages/Shoutouts";
import StatCompare from "./js/pages/StatCompare";
import VersionLogs from "./js/pages/VersionLogs";
import { activeGameSelector, appDisplaySettingsSelector, modalVisibilitySelector, premiumSelector } from "./js/selectors";
import { store } from "./js/store";

const App = () => {
  const themeBrightness = useSelector(appDisplaySettingsSelector).themeBrightness;
  const themeAccessibility = useSelector(appDisplaySettingsSelector).themeAccessibility;
  const themeColor = useSelector(appDisplaySettingsSelector).themeColor;
  const activeGame = useSelector(activeGameSelector);
  const premiumInfo = useSelector(premiumSelector);
  const modalVisibility = useSelector(modalVisibilitySelector);

  const dispatch = useDispatch();

  const [exitAlert, setExitAlert] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      SplashScreen.hide().then(() => {
        SafeArea.enable({
          config: {
            customColorsForSystemBars: true,
            statusBarColor: "#00000000", // transparent
            statusBarContent: "light",
            navigationBarColor: "#00000000", // transparent
            navigationBarContent: "light",
          },
        });
      });
    }
  }, []);

  useEffect(() => {
    const backButtonListener = async () => {
      // Get modal visibility state and mode state from Redux store & Controllers
      const currentModalState = store.getState().modalVisibilityState;
      const modeNameState = store.getState().modeNameState;
      const topPopover = await popoverController.getTop();
      const topActionSheet = await actionSheetController.getTop();

      if (topPopover && topPopover.isConnected && topPopover.nodeName === "ION-POPOVER") {
        console.log("Dismissing popover...");
        await popoverController.dismiss();
      } else if (topActionSheet && topActionSheet.isConnected && topActionSheet.nodeName === "ION-ACTION-SHEET") {
        console.log("Dismissing action sheet...");
        await actionSheetController.dismiss();
      } else if (currentModalState.visible) {
        console.log("Closing modal because it's visible");
        store.dispatch(setModalVisibility({ currentModal: currentModalState.currentModal, visible: false }));
      } else {
        try {
          const topModal = await modalController.getTop();
          if (topModal && topModal.isConnected && topModal.nodeName === "ION-MODAL") {
            console.log("Dismissing modal...");
            await modalController.dismiss();
          } else if (modeNameState === "movedetail" || modeNameState.startsWith("subpage") || modeNameState.startsWith("calc-")) {
            console.log("Going back in history");
            window.history.back();
          } else if (!(await menuController.isOpen())) {
            console.log("Opening menu");
            await menuController.open();
          } else {
            console.log("Closing app, showing exit alert");
            setExitAlert(true);
          }
        } catch (error) {
          console.error("Error handling back button:", error);
        }
      }
    };
  
    // Add listener for the back button event
    CapAppPlugin.addListener("backButton", backButtonListener);
  
    // Clean up listener on component unmount
    return () => {
      CapAppPlugin.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    if ((prefersDark.matches && themeBrightness === "unset") || (themeBrightness === "dark")) {
      dispatch(setThemeBrightness("dark"));
      document.body.classList.toggle("dark", true);
    } else {
      dispatch(setThemeBrightness("light"));
      document.body.classList.toggle("dark", false);
    }

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener("change", (mediaQuery) => {
      dispatch(setThemeBrightness(mediaQuery.matches ? "dark" : "light"));
      document.body.classList.toggle("dark", mediaQuery.matches);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isPlatform("capacitor") && CdvPurchase.store.when().productUpdated) {
      // Awesome Cordova Plugins has not updated it's iap wrapper, so we have to import the entire store
      // https://github.com/danielsogl/awesome-cordova-plugins/issues/4457

      // also you can change these to CONSUMABLE, then run the app once and clear the cache to retest purchases.

      // ****************** SET IT BACK TO NON_CONSUMABLE WHEN DONE ****************** //
      const { store: iapStore, Platform, ProductType } = CdvPurchase;
      const currentPlatform = isPlatform("android") ? Platform.GOOGLE_PLAY : Platform.APPLE_APPSTORE;
      const productList = [
        { id: "vanilla_donation", type: ProductType.NON_CONSUMABLE, platform: currentPlatform },
        { id: "super_donation", type: ProductType.NON_CONSUMABLE, platform: currentPlatform },
        { id: "ae2012_donation", type: ProductType.NON_CONSUMABLE, platform: currentPlatform },
        { id: "ultra_donation", type: ProductType.NON_CONSUMABLE, platform: currentPlatform },

        { id: "com.fullmeter.fat.theme.reddragon", type: ProductType.NON_CONSUMABLE, platform: currentPlatform },
        { id: "com.fullmeter.fat.theme.secondincommand", type: ProductType.NON_CONSUMABLE, platform: currentPlatform },
        { id: "com.fullmeter.fat.theme.deltagreen", type: ProductType.NON_CONSUMABLE, platform: currentPlatform },
        { id: "com.fullmeter.fat.theme.poisonouspink", type: ProductType.NON_CONSUMABLE, platform: currentPlatform },

        { id: "com.fullmeter.fat.premium_lifetime", type: ProductType.NON_CONSUMABLE, platform: currentPlatform },
        { id: "com.fullmeter.fat.premium_lifetime_tip", type: ProductType.NON_CONSUMABLE, platform: currentPlatform },
      ];

      iapStore.verbosity = CdvPurchase.LogLevel.QUIET;

      iapStore.register(productList);

      iapStore.when().approved(transaction => {
        transaction.finish();
        transaction.products.forEach(purchase => {
          if (
            iapStore.owned(purchase)
            // Ensure the purchased product is one that actually unlocks Premium. This is needed
            // because on iOS, the app itself (com.fullmeter.fat) is returned as an owned product.
            && productList.find(product => product.id === purchase.id)
          ) {
            dispatch(purchaseLifetimePremium());
          }
        });
      });

      iapStore.initialize([currentPlatform]);
      iapStore.restorePurchases();
    }

    // Reset theme name if using old theme name
    if (["secondincommand", "deltagreen", "reddragon", "poisonouspink"].includes(themeColor)) {
      dispatch(setThemeColor("classic"));
    }

    // If the user has opened the app 2 weeks after first open FAT begins counting opens.
    // After 5, 50, 150, 250, FAT will prompt the user to upgrade to premium
    if (Capacitor.isNativePlatform() && !premiumInfo.lifetimePremiumPurchased && (new Date().getTime() - premiumInfo.appFirstOpened) > 1209600000 && !modalVisibility.visible) {
      dispatch(setAppOpenCount(premiumInfo.appOpenCount + 1));
      if (premiumInfo.appOpenCount === 5 || premiumInfo.appOpenCount === 50 || premiumInfo.appOpenCount === 150 || premiumInfo.appOpenCount === 250) {
        dispatch(setModalVisibility({ currentModal: "premiumEncouragement", visible: true }));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const orientationCheck = () => {
      if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
        dispatch(setOrientation("landscape"));
      } else {
        dispatch(setOrientation("portrait"));
      }
    };

    orientationCheck();
    window.addEventListener("resize", orientationCheck);

    return () => window.removeEventListener("resize", orientationCheck);
  }, [dispatch]);

  useEffect(() => {
    const newVersionCheck = async (gameName: string, updateType: string) => {
      const APP_WHATS_BEING_UPDATED_CODE = UPDATABLE_GAMES_APP_CODES[gameName][updateType];

      // check if the element was updated
      let LS_WHATS_BEING_UPDATED_CODE = parseInt((await Preferences.get({ key: `ls${gameName}${updateType}Code`})).value);

      if (!LS_WHATS_BEING_UPDATED_CODE) {
        // fresh install, local code doesn't exist, set it up using the app's local data
        console.log(`local ${gameName} ${updateType} code don't exist, set it up using the app's local data`);
        await Preferences.set({
          key: `ls${gameName}${updateType}Code`,
          value: APP_WHATS_BEING_UPDATED_CODE.toString(),
        });
        // regardless of the game, if this is a store update we want to set the element being updated's last updated date to the app's last update
        await Preferences.set({
          key: `ls${gameName}${updateType}LastUpdated`,
          value: APP_DATE_UPDATED.toString(),
        });

        LS_WHATS_BEING_UPDATED_CODE = parseInt((await Preferences.get({ key: `ls${gameName}${updateType}Code`})).value);
      } else if (LS_WHATS_BEING_UPDATED_CODE <= APP_WHATS_BEING_UPDATED_CODE) {
        // the app has been updated via the store, delete the LS updatetype.json and update the LS updatetype code
        console.log(`the app has been updated via the store, delete the LS ${gameName} ${updateType}.json and update the LS code`);
        await Preferences.set({
          key: `ls${gameName}${updateType}Code`,
          value: APP_WHATS_BEING_UPDATED_CODE.toString(),
        });
        await Preferences.remove({ key: `ls${gameName}${updateType}` });

        LS_WHATS_BEING_UPDATED_CODE = parseInt((await Preferences.get({ key: `ls${gameName}${updateType}Code`})).value);

        // regardless of the game, if this is a store update we want to set the frame-data last updated date to the app's last update
        await Preferences.set({
          key: `ls${gameName}${updateType}LastUpdated`,
          value: APP_DATE_UPDATED.toString(),
        });
      } else if (LS_WHATS_BEING_UPDATED_CODE > APP_WHATS_BEING_UPDATED_CODE) {
        // the app has downloaded an updateType update
        console.log(`the app has previously downloaded a ${gameName} ${updateType} update`);
      } else {
        console.log(`something has gone horribly wrong with ${gameName} ${updateType} updating process`);
      }

      const version_response = await fetch(`https://fullmeter.com/fatfiles/release/${gameName}/${updateType}/${gameName}${updateType}VersionDetails.json?ts=${Date.now()}`);
      const SERVER_WHATS_BEING_UPDATED_VERSION_DETAILS = await version_response.json();

      // this stops the update process accidentally being ruined
      if (SERVER_WHATS_BEING_UPDATED_VERSION_DETAILS.MINIMUM_VERSION_REQUIRED > APP_CURRENT_VERSION_CODE) {
        console.log(`Someone added a version code greater than 5 digits in length OR this app falls below the minimum version required. This error occured while doing a ${gameName} ${updateType} update`);
        return false;
      }

      if (SERVER_WHATS_BEING_UPDATED_VERSION_DETAILS.VERSION_CODE > LS_WHATS_BEING_UPDATED_CODE) {
        console.log(`there's a new ${gameName} ${updateType} file on the server, get it`);
        const WHATS_BEING_UPDATED_json_response = await fetch(`https://fullmeter.com/fatfiles/release/${gameName}/${updateType}/${gameName}${updateType}.json?ts=${Date.now()}`);
        const SERVER_DATA = await WHATS_BEING_UPDATED_json_response.json();

        await Preferences.set({
          key: `ls${gameName}${updateType}`,
          value: JSON.stringify(SERVER_DATA),
        });
        await Preferences.set({
          key: `ls${gameName}${updateType}Code`,
          value: SERVER_WHATS_BEING_UPDATED_VERSION_DETAILS.VERSION_CODE.toString(),
        });
        await Preferences.set({
          key: `ls${gameName}${updateType}LastUpdated`,
          value: SERVER_WHATS_BEING_UPDATED_VERSION_DETAILS.DATE_UPDATED,
        });

        dispatch(setActiveGame(activeGame, true));
      }
    };

    if (UPDATABLE_GAMES.includes(activeGame)) {
      TYPES_OF_UPDATES.forEach(updateType => {
        newVersionCheck(activeGame, updateType);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGame]);

  return (
    <IonApp className={`${themeColor}-${themeBrightness}-theme universal-${themeBrightness}-${themeAccessibility}`}>
      <IonReactHashRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route exact path="/stats/:gameSlug/:characterSlug" component={CharacterStats} />

            <Route exact path="/movedetail/:gameSlug/:characterSlug/:vtStateSlug/:moveNameSlug" component={MoveDetail} />

            <Route exact path="/framedata/:gameSlug/:characterSlug" component={FrameData} />

            <Route exact path="/moveslist/:gameSlug/:characterSlug" component={MovesList} />

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

            <Route exact path="/quicksearch" component={QuickSearch} />

            <Route exact path="/moreresources" component={MoreResources} />
            <Route exact path="/moreresources/:resourcePageSlug" component={MoreResourcesSub} />

            <Route exact path="/settings" component={Settings} />
            <Route exact path="/settings/shoutouts" component={Shoutouts} />
            <Route exact path="/settings/versionlogs" component={VersionLogs} />

            <Route exact path="/premium" component={Premium} />
            <Route exact path="/settings/premium" component={Premium} />

            <Route path="/" component={HomePageRedirect} exact />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactHashRouter>
      <IonAlert
        isOpen={exitAlert}
        onDidDismiss={() => setExitAlert(false)}
        header={"Close App"}
        message={"Are you sure you want to exit FAT?"}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Okay",
            handler: () => {
              CapAppPlugin.exitApp();
            },
          },
        ]}
      />
    </IonApp>
  );
};

export default App;
