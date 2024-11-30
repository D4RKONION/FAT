export const createSegmentSwitcherObject = (selectedCharacterSpecificStates) => {
  const segmentSwitcherObject = {
    normal: "Normal",
  };
  selectedCharacterSpecificStates &&
    selectedCharacterSpecificStates.forEach(stateName => {
      segmentSwitcherObject[stateName] = stateName;
    });

  return segmentSwitcherObject;
};