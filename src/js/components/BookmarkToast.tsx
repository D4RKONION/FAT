import { IonToast } from "@ionic/react";

type Props = {
  toastVisible: boolean,
  dismissToast: () => void,
  message: string
};

const BookmarkToast = ({toastVisible, dismissToast, message}: Props) => {

  return(
    <IonToast
      isOpen={toastVisible}
      onDidDismiss={() => dismissToast()}
      message={message}
      position="bottom"
      duration={1300}
    />
  )
}

export default BookmarkToast;
