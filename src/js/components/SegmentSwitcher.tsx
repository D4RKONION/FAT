import { IonLabel, IonSegment, IonSegmentButton } from "@ionic/react";
import "../../style/components/SegmentSwitcher.scss";

type SegmentSwitcherProps = {
  passedClassNames?: string,
  segmentType: string,
  valueToTrack: string,
  labels: {[key: string]: string},
  hashtag?: string,
  clickFunc: (segmentValue) => void;
};

const SegmentSwitcher = ({
  passedClassNames,
  segmentType,
  valueToTrack,
  labels,
  hashtag,
  clickFunc,
}: SegmentSwitcherProps) => {
  return (
    <IonSegment className={`segment-switcher ${passedClassNames} ${segmentType}`} value={valueToTrack} onIonChange={e => clickFunc(e.detail.value)}>
      {Object.entries(labels).map(
        ([value, label]) =>
          <IonSegmentButton key={value} value={value}>
            <IonLabel>{label}</IonLabel>
          </IonSegmentButton>
      )}
      {segmentType === "stat-chooser" && hashtag !== "false" &&
        <IonSegmentButton value="hashtag" onClick={() => window.open(`https://twitter.com/search?q=%23${hashtag.substring(1)}`, "_blank")}>
          <IonLabel>{hashtag}</IonLabel>
        </IonSegmentButton>
      }
    </IonSegment>
  );
};

export default SegmentSwitcher;
