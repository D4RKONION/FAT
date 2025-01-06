import { IonModal } from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { setModalVisibility } from "../actions";
import { modalVisibilitySelector } from "../selectors";
import ChunkyButton from "./ChunkyButton";

const PremiumEncouragementModal = () => {
  const modalVisibility = useSelector(modalVisibilitySelector);

  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <IonModal
      className="premium-encouragement-modal"
      initialBreakpoint={1} breakpoints={[0, 1]}
      isOpen={modalVisibility.visible && modalVisibility.currentModal === "premiumEncouragement"}
      onDidDismiss={() => modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "premiumEncouragement", visible: false }))}>
      <h2>Thanks for using FAT!</h2>
      <p>You can unlock extra themes, bookmarks, character select layouts and more by upgrading to premium!</p>
      <ChunkyButton
        onClick={() => {
          modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "premiumEncouragement", visible: false }));
          history.push("/settings/premium");
        }}>Consider Premium!
      </ChunkyButton>
      <button onClick={() => modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "premiumEncouragement", visible: false }))}>Maybe later</button>
    </IonModal>
  );
};

export default PremiumEncouragementModal;

