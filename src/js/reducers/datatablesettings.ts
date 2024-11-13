import { MoveAdvantageIndicator, TableType } from "../types";

type DataTableSettingsReducerAction = {
  type: 'SET_MOVE_ADVANTAGE_COLORS' | 'SET_MOVE_ADVANTAGE_INDICATOR' | 'SET_COMPACT_VIEW' | 'SET_DATA_TABLE_COLUMNS' | 'SET_AUTO_SET_CHARACTER_SPECIFIC_COLUMNS' | 'SET_TABLE_TYPE' | 'SET_AUTO_SCROLL_ENABLED' | 'SET_MOVE_TYPE_HEADERS_ON';
  moveAdvantageColorsOn: boolean;
  moveAdvantageIndicator: MoveAdvantageIndicator;
  compactViewOn: boolean;
  tableType: TableType;
  autoScrollEnabled: boolean;
  moveTypeHeadersOn: boolean;
  autoSetCharacterSpecificColumnsOn: boolean;
  tableColumns: {[key: string]: string};
}

const defaultState = {
  moveAdvantageColorsOn: true,
  moveAdvantageIndicator: 'text',
  compactViewOn: true,
  tableType: "fixed",
  autoScrollEnabled: true,
  moveTypeHeadersOn: true,
  autoSetCharacterSpecificColumnsOn: true,
  tableColumns: {startup: "S", active: "A", recovery: "R", onBlock: "oB", onHit: "oH", onPC:"onPC", xx: "xx", dmg: "dmg", atkLvl: "lvl", DRoH: "dr-oH", DRoB: "dr-oB" },
}

export const dataTableSettingsReducer = (state = defaultState, action: DataTableSettingsReducerAction) => {
  switch(action.type) {

    case 'SET_MOVE_ADVANTAGE_COLORS':
      return {
        ...state,
        "moveAdvantageColorsOn": action.moveAdvantageColorsOn
      }

    case 'SET_MOVE_ADVANTAGE_INDICATOR':
      return {
        ...state,
        "moveAdvantageIndicator": action.moveAdvantageIndicator
      }

    case 'SET_COMPACT_VIEW':
      return {
        ...state,
        "compactViewOn": action.compactViewOn
      }
    
    case 'SET_TABLE_TYPE':
      return {
        ...state,
        "tableType": action.tableType
      }
    
    case 'SET_AUTO_SCROLL_ENABLED':
      return {
        ...state,
        "autoScrollEnabled": action.autoScrollEnabled
      }

    case 'SET_MOVE_TYPE_HEADERS_ON':
      return {
        ...state,
        "moveTypeHeadersOn": action.moveTypeHeadersOn
      }

        
    case 'SET_AUTO_SET_CHARACTER_SPECIFIC_COLUMNS':
      return {
        ...state,
        "autoSetCharacterSpecificColumnsOn": action.autoSetCharacterSpecificColumnsOn
      }

    case 'SET_DATA_TABLE_COLUMNS':
      return {
        ...state,
        "tableColumns": action.tableColumns
      }

    default:
      return state;
  }
}