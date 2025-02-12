import styles from "../../style/components/FrameMeter.module.scss";
import { FrameMeterBlockSegment } from "../types";
import { parseFrameMeterActiveFrames, parseBasicFrames } from "../utils/ParseFrameData";

type Props = {
  moveData: {
    [key in "startup" | "active" | "recovery"]: number | string;
  };
  wrap: boolean;
};

const FrameMeter = ({ moveData, wrap }: Props) => {
  return (
    <div
      className={styles.FrameMeter}
      style={{ flexWrap: wrap ? "wrap" : "nowrap" }}
    >
      {Object.keys(moveData).map(moveStage => {
        const moveStageValue = moveData[moveStage];
        let frameSegments : FrameMeterBlockSegment[];
        
        // Ensure that the value is defined and that it has at least one number in it
        if (moveStageValue && !/^(?!.*\d).*$/.test(String(moveStageValue))) {
          // if it's an active stage that needs to be broken a part, deal with that
          if (moveStage === "active" && typeof moveStageValue === "string" && /[(*,]/.test(moveStageValue)) {
            frameSegments = parseFrameMeterActiveFrames(moveStageValue);
          // otherwise, use basic parsing
          } else {
            frameSegments = [{ length: moveStage === "startup" ? parseBasicFrames(moveStageValue) - 1 : parseBasicFrames(moveStageValue), type: moveStage as "startup" | "active" | "recovery" }]; // -1 for startup moves!
          }
        // if the value is undefined or there's no numbers in it to be parsed
        // (only words), we'll print a "?"
        } else {
          frameSegments = [{ length: 1, type: "invalid" }];
        }

        // Render the frame segments
        return frameSegments.map(segment => {
          const segmentValue = segment.length.toString(); // The number to print in the last block
          const valueLength = segmentValue.length; // Used to decide when to print a number to the bar

          return [...Array(segment.length)].map((_, index) => {
            const digitIndex = valueLength - (segment.length - index); // we use this to print large numbers across multiple blocks

            return (
              <div
                key={`${moveStage}-${index}`}
                className={`${styles[segment.type]} ${styles.FrameBlock}`}
              >
                {segment.type === "invalid" ? "?" : digitIndex >= 0 && digitIndex < valueLength ? segmentValue[digitIndex] : ""}
              </div>
            );
          });
        });
      })}
    </div>
  );
};

export default FrameMeter;
