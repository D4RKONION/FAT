import { SET_LANDSCAPE_COLS } from '../actions';

export default function landscapeColsReducer(state = {startup: "S", active: "A", recovery: "R", onBlock: "oB", onHit: "oH", damage:"dmg", stun:"stun", kd:"kd", kdr:"kdr", kdrb:"kdrb"}, action) {
	switch(action.type) {
    case SET_LANDSCAPE_COLS:
      return action.listOfCols;
    default:
      return state;
	}
}
