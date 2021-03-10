import { SET_MODAL_VISIBILITY } from '../actions';

export default function setModalVisibilityReducer(state = {currentModal: "", visible: false}, action) {
  switch(action.type) {
    case SET_MODAL_VISIBILITY:
      return action.data;
    default:
      return state;
    }
}
