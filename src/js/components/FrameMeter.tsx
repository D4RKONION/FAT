import styles from "../../style/components/FrameMeter.module.scss";

type Props = {
  moveData: {
    startup: number | string;
    active: number | string;
    recovery: number | string;
  };
  wrap: boolean
};

const FrameMeter = ({ moveData, wrap }: Props) => {
  // Helper function to parse active frame strings like "2(3)2(23)3"
  const parseActiveFrames = (value: string) => {
    const segments: { length: number; type: string }[] = [];
    const regex = /(\d+)|\((\d+)\)/g;
    let match;

    while ((match = regex.exec(value)) !== null) {
      if (match[1]) {
        // Regular active blocks (e.g., "2" or "3")
        segments.push({ length: parseInt(match[1], 10), type: "active" });
      } else if (match[2]) {
        // Special blocks inside parentheses (e.g., "(23)")
        segments.push({ length: parseInt(match[2], 10), type: "startup" });
      }
    }
    return segments;
  };

  // Helper function to clean and evaluate a frame value
  const evaluateFrameValue = (value: string | number) => {
    if (typeof value === "number") return value;

    // Handle cases with square brackets or other delimiters
    const cleanedValue = value.split("[")[0].split(/[([/~]/)[0];

    // Check if the value contains "land" or "+land"
    const landRegex = /(\d+)(\s?\+?land)$/;
    const landMatch = cleanedValue.match(landRegex);
    if (landMatch) {
      // If "land" is found, take the number before it
      return parseInt(landMatch[1], 10);
    }

    // Evaluate sums like "12+3"
    if (cleanedValue.includes("+")) {
      return eval(cleanedValue); // Safe because it's controlled input
    }

    // Convert to number if no further processing is needed
    return parseInt(cleanedValue, 10);
  };

  // Helper function to handle invalid or empty values
  const handleInvalidValue = () => {
    return [{ length: 1, type: "invalid" }];
  };

  return (
    <div className={styles.FrameMeter} style={{flexWrap: wrap ? "wrap": "nowrap"}}>
      {Object.keys(moveData).map(moveStage => {
        const moveStageValue = moveData[moveStage];

        // If the value is invalid (blank or contains letters), render a "?"
        if (!moveStageValue || (!/^\d+(\+land|\s*land)?$/.test(String(moveStageValue)) && /[a-zA-Z]/.test(String(moveStageValue)))) {
          const invalidFrameSegments = handleInvalidValue();
          return invalidFrameSegments.map((segment) =>
            [...Array(segment.length)].map((_, index) => {
              return (
                <div
                  key={`${moveStage}-${index}`}
                  className={`${styles["unknown"]} ${styles.FrameBlock}`}
                >?</div>
              );
            })
          );
        }

        // Special handling for active frames with brackets
        const frameSegments =
          moveStage === "active" && typeof moveStageValue === "string" && moveStageValue.includes("(")
            ? parseActiveFrames(moveStageValue)
            : [{ length: evaluateFrameValue(moveStageValue), type: moveStage }];

        // Render the frame segments
        return frameSegments.map((segment) => {
          const segmentValue = segment.length.toString();
          const valueLength = segmentValue.length; // Used to decide when to print a number to the bar

          return [...Array(segment.length)].map((_, index) => {
            const digitIndex = valueLength - (segment.length - index);

            return (
              <div
                key={`${moveStage}-${index}`}
                className={`${styles[segment.type]} ${styles.FrameBlock}`}
              >
                {digitIndex >= 0 && digitIndex < valueLength ? segmentValue[digitIndex] : ""}
              </div>
            );
          });
        });
      })}
    </div>
  );
};

export default FrameMeter;
