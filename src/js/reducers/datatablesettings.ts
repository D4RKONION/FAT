type DataTableSettingsReducerAction = {
  type: 'SET_MOVE_ADVANTAGE_COLORS' | 'SET_COMPACT_VIEW' | 'SET_DATA_TABLE_COLUMNS' | 'SET_AUTO_SET_CHARACTER_SPECIFIC_COLUMNS';
  moveAdvantageColorsOn: boolean;
  compactViewOn: boolean;
  autoSetCharacterSpecificColumnsOn: boolean;
  tableColumns: {[key: string]: string};
}

const defaultState = {
  moveAdvantageColorsOn: true,
  compactViewOn: true,
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

    case 'SET_COMPACT_VIEW':
      return {
        ...state,
        "compactViewOn": action.compactViewOn
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