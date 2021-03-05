import { SET_THEME_OWNED } from '../actions';

export default function themesOwnedReducer(state = [], action) {
  switch(action.type) {
    case SET_THEME_OWNED:
      return [...state, action.themeToAdd];
    default:
      return state;
  }
}
