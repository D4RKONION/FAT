import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { informationCircle } from 'ionicons/icons';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import SegmentSwitcher from '../components/SegmentSwitcher';
import SubHeader from '../components/SubHeader';

import { setThemeBrightness } from '../actions';
import { activeGameSelector, selectedCharactersSelector, themeBrightnessSelector } from '../selectors';
import FrameDataSubHeader from '../components/FrameDataSubHeader';


const ThemePreview = () => {


  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activeGame = useSelector(activeGameSelector);
  const themeBrightness = useSelector(themeBrightnessSelector);
  const dispatch = useDispatch();

  const [fakeTrigger, setFakeTrigger] = useState("normal");
  let { themeNameSlug }: {themeNameSlug: string} = useParams();


  const THEMEDICT = {
    reddragon: "Red Dragon",
    secondincommand: "Second in Command"
  }	

  return(
    <IonPage className={`themePreview ${themeNameSlug}-${themeBrightness}-theme`}>
      <PageHeader
        componentsToShow={{customBackUrl: "/themestore", popover: false}}
        title={`${THEMEDICT[themeNameSlug]}`}
      />

      

      <IonContent className="themePreview">
        <SubHeader
          adaptToShortScreens={false}
          rowsToDisplay={[
            [
              <><b>Health</b><br />1000</>,
              <><b>Stun</b><br />1050</>,
              <><b>Tap for more</b><br /><IonIcon icon={informationCircle} /></>,
            ],
            [
              <><b>Fwd Dash</b><br />16</>,
              <><b>Back Dash</b><br />24</>,
            ]
          ]}
        />

      <FrameDataSubHeader
        charName={selectedCharacters["playerOne"].name}
        charStats={selectedCharacters["playerOne"].stats}
        activeGame={activeGame}    
      ></FrameDataSubHeader>

        <SegmentSwitcher
          key={"Brightness setting"}
          segmentType={"active-player"}
          valueToTrack={themeBrightness}
          labels={ {light: "Light", dark: "Dark"}}
          clickFunc={ (eventValue) => dispatch(setThemeBrightness(eventValue)) }
        />
        <SegmentSwitcher
          key={"Fake V-Trigger"}
          segmentType={"vtrigger"}
          valueToTrack={fakeTrigger}
          labels={ {normal: "Buy", vtOne: "This", vtTwo: "Theme :D"} }
          clickFunc={ (eventValue) => setFakeTrigger(eventValue) }
        />

      <DataTable previewTable={true} />

      

      </IonContent>
      
    </IonPage>
  )
}

export default ThemePreview;