import { useDispatch, useSelector } from "react-redux";

import { setDataTableColumns, setPlayer } from "../actions";
import { dataTableSettingsSelector, gameDetailsSelector, selectedCharactersSelector } from "../selectors";
import { handleNewCharacterLandscapeCols } from "./landscapecols";

export const useCalcCharacterSelect = () => {
  const dispatch = useDispatch();
  const gameDetails = useSelector(gameDetailsSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const autoSetCharacterSpecificColumnsOn = useSelector(dataTableSettingsSelector).autoSetCharacterSpecificColumnsOn;
  const dataTableColumns = useSelector(dataTableSettingsSelector).tableColumns;

  return (charName) => {
    dispatch(setDataTableColumns(handleNewCharacterLandscapeCols(
      gameDetails,
      selectedCharacters["playerTwo"].name,
      charName,
      autoSetCharacterSpecificColumnsOn,
      dataTableColumns
    )));
  
    dispatch(setPlayer("playerTwo", charName));
  };
};