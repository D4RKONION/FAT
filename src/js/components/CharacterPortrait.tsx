import '../../style/components/CharacterPortrait.scss';
import { GameName } from '../types';

type CharacterPortraitProps = {
  charName: string;
  charThreeLetterCode?: string;
  game: GameName;
  selected?: Boolean;
  charColor: string;
  remoteImage: Boolean;
  showName: Boolean;
  onClick?: () => void;
}

const CharacterPortrait = ( {charName, charThreeLetterCode, game, selected, charColor, remoteImage, showName, onClick }: CharacterPortraitProps ) => {

  return(
    <div
      className="character-block"
      style={{ background: `${charColor}`}}
      onClick={onClick}
    >
      <img
        alt={`${charName} portrait`}
        src={
          remoteImage ?
            //no image
            `https://fullmeter.com/fatfiles/test/${game}/images/characters/${charName}.png`
          : //local image
            `${process.env.PUBLIC_URL}/assets/images/characters/${game.toLowerCase()}/${charName}.png`
        }
      />
      {showName &&
        <h2 className={selected ? "selected" : "not-selected"}>{charThreeLetterCode ? charThreeLetterCode : charName}</h2>
      }
    </div>
  )
}


export default CharacterPortrait;