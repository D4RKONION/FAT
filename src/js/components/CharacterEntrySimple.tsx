import "../../style/components/CharacterEntrySimple.scss";
import { IonItem } from "@ionic/react";

import { GameName } from "../types";

type Props = {
  charName: string,
  gameName: GameName,
  charColor: string,
  onClickHandler: (userChosenName?: string) => void,
};

const CharacterEntrySimple = ({charName, gameName, charColor, onClickHandler}: Props) => {
  return (
    <IonItem className="character-entry-simple-container" button onClick={() => onClickHandler(charName)}>
      <div className="character-entry-simple">
        <h1>{charName}</h1>
        <div className="img-container">
          <img
            className="silouette"
            src={`${process.env.PUBLIC_URL}/assets/images/characters/${gameName.toLowerCase()}/${charName}.png`}
            style={{backgroundColor: `${charColor}60`}}
          />
        </div>
      </div>
    </IonItem>
  );
};

export default CharacterEntrySimple;