type LandscapeColsReducerState = {[key: string]: string}

type LandscapeColsReducerAction = {
  type: 'SET_LANDSCAPE_COLS';
  listOfCols: {[key: string]: string};
}

const defaultState: LandscapeColsReducerState = {startup: "S", active: "A", recovery: "R", onBlock: "oB", onHit: "oH", onPC:"onPC", xx: "xx", dmg: "dmg", atkLvl: "lvl", DRoH: "dr-oH", DRoB: "dr-oB" };

export const landscapeColsReducer = (state = defaultState, action: LandscapeColsReducerAction) => {
	switch(action.type) {
    case 'SET_LANDSCAPE_COLS':
      return action.listOfCols;
    default:
      return state;
	}
}
