import { FrameMeterBlockSegment } from "../types";

/**
 * Takes a string or number and returns a cleaned, single integer for use in
 * calculations and frame meters (etc.). Active frames need to be preassessed
 * to decide whether to use this or parseMultiActive
 * @param valueToParse the string or number you want parsed
 */

export const canParseBasicFrames = (valueToCheck):boolean =>
  valueToCheck != null && (typeof valueToCheck === "number" || (/[0-9]/.test(valueToCheck) && !valueToCheck.startsWith("~")));

export const parseBasicFrames = (valueToParse: string | number): number => {
  if (typeof valueToParse === "number") return valueToParse;

  // Handle cases where a KD appears before a number which we want to return
  if (valueToParse.match(/(KD|Crumple) \+([^\(*,\[]+)/)?.[1]) {
    return parseInt(valueToParse.match(/(KD|Crumple) \+([^\(*,\[]+)/)?.[2], 10);
  }

  // Handle cases with trailing operators, square brackets or other delimiters
  const cleanedValue = valueToParse.split(/[([/~,a-zA-Z]/)[0].replace(/[\+\-\*\/\.]$/, "");

  // Evaluate sums like "12+3"
  if (cleanedValue.includes("+")) {
    try {
      return eval(cleanedValue); // Safe because it's controlled input
    } catch (e) {
      console.error(`Evaluating ${cleanedValue} failed: ${e}`);
      return 1;
    }
  }

  // Convert to number if no further processing is needed
  return parseInt(cleanedValue, 10);
};

/**
 * Takes the startup and active frames of a move and returns an array of the
 * frames on which this move is active 
 * @param startupValue the move's startup
 * @param activeValue the move's active frames
 */
export const parseMultiActiveFrames = (startupValue: string | number, activeValue: string) => {
  const multiActiveArray = [];
  activeValue.replaceAll("*", "(").split("(").forEach(frameChunk => {
    if (!frameChunk.includes(")")) {
      const mostRecentActiveFrame = Number(multiActiveArray.at(-1)) + 1 || parseBasicFrames(startupValue);
      for (let i=0; i<Number(frameChunk); i++) {
        multiActiveArray.push(mostRecentActiveFrame + i);
      }
    } else if (frameChunk.includes(")")) {
      const frameGap = Number(frameChunk.split(")")[0]);
      const activeFrames = Number(frameChunk.split(")")[1]);
      const mostRecentActiveFrame = Number(multiActiveArray.at(-1));
      for (let i = mostRecentActiveFrame + frameGap; i<mostRecentActiveFrame + frameGap + activeFrames; i++) {
        multiActiveArray.push(i +1);
      }
    }
  });

  return multiActiveArray;
};

/**
 * Takes the active frames of a move and returns an array of FrameMeterBlockSegments
 * to be displayed in a frame meter
 * @param valueToParse the string or number you want parsed
 */
export const parseFrameMeterActiveFrames = (valueToParse: string): FrameMeterBlockSegment[] => {
  // Handle cases with square brackets or other delimiters
  const cleanedValue = valueToParse.split("[")[0];

  const segments: FrameMeterBlockSegment[] = [];

  // This regex will capture numbers, multiplication (x), and recovery frames (brackets)
  const regex = /\d+(?:[x]\d+)?|\*\d+|\(\d+\)/g; // Match numbers, x multiplication, recovery frames, and * as a separator
  
  let match;
  
  // Iterate over all matches in the cleanedValue
  while ((match = regex.exec(cleanedValue)) !== null) {
    const value = match[0]; // Get the matched value
    if (value.includes("x")) { // If it's a multiplication pattern
      const [num1, num2] = value.split("x").map(num => parseInt(num, 10));
      segments.push({ length: num1 * num2, type: "active" });
    }
    else if (value.startsWith("(") && value.endsWith(")")) { // If it's a recovery frame (inside brackets)
      if (cleanedValue.endsWith(")")) continue; // Skip (x) parsing if the string ends with ), as this means the number is actually for notes
      const recoveryFrames = parseInt(value.slice(1, -1), 10); // Remove brackets
      segments.push({ length: recoveryFrames, type: "recovery" });
    } 
    else if (value.startsWith("*")) { // If it's a number after a separator (e.g., *20)
      const number = parseInt(value.slice(1), 10); // Remove the asterisk and parse the number
      segments.push({ length: number, type: "active" });
    }
    else { // It's a regular number (active block)
      const number = parseInt(value, 10);
      segments.push({ length: number, type: "active" });
    }
  }

  return segments;
};
