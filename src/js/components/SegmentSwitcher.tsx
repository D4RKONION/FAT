import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
import '../../style/components/SegmentSwitcher.scss';

type SegmentSwitcherProps = {
  segmentType: string,
  valueToTrack: string,
  labels: {[key: string]: string},
  clickFunc: (segmentValue) => void;
}

const SegmentSwitcher = ({
  segmentType,
  valueToTrack,
  labels,
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
    </IonSegment>
  )
}



export default SegmentSwitcher;
