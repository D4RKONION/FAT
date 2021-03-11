import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
import React from 'react';
import '../../style/components/SegmentSwitcher.scss';



const SegmentSwitcher = ({
  segmentType,
  valueToTrack,
  labels,
  clickFunc,
}) => {


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
