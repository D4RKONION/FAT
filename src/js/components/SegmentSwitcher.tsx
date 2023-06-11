import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
import '../../style/components/SegmentSwitcher.scss';

type SegmentSwitcherProps = {
  segmentType: string,
  valueToTrack: string,
  labels: {[key: string]: string},
  hashtag?: string,
  clickFunc: (segmentValue) => void;
}

const SegmentSwitcher = ({
  segmentType,
  valueToTrack,
  labels,
  hashtag,
  clickFunc,
}: SegmentSwitcherProps) => {


  return(
    <IonSegment className={`segment-switcher ${segmentType}`} value={valueToTrack} onClick={ e => clickFunc(e.currentTarget.value) }>
      {Object.entries(labels).map(
      ([value, label]) =>
        <IonSegmentButton key={value} value={value}>
          <IonLabel>{label}</IonLabel>
        </IonSegmentButton>
      )}
      {segmentType === "stat-chooser" && hashtag !== "false" &&
        <IonSegmentButton value="hashtag" onClick={ e => window.open(`https://twitter.com/search?q=%23${hashtag.substring(1)}`, '_blank')}>
          <IonLabel>{hashtag}</IonLabel>
        </IonSegmentButton>
      }
    </IonSegment>
  )
}



export default SegmentSwitcher;
