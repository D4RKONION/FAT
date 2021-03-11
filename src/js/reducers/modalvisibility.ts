import { AppModal } from "../types";

type ModalVisibilityReducerState = {
  currentModal: AppModal;
  visible: Boolean;
};

type ModalVisibilityReducerAction = {
  type: 'SET_MODAL_VISIBILITY',
  data: {
    currentModal: AppModal,
    visible: Boolean
  }
}

const defaultState: ModalVisibilityReducerState = {currentModal: "whatsNew", visible: false};

export const modalVisibilityReducer = (state = defaultState, action: ModalVisibilityReducerAction) => {
  switch(action.type) {
    case 'SET_MODAL_VISIBILITY':
      return action.data;
    default:
      return state;
    }
}
