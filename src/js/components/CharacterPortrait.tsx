import '../../style/components/CharacterPortrait.scss';
import { GameName } from '../types';

type CharacterPortraitProps = {
  charName: string;
  charThreeLetterCode?: string;
  game: GameName;
  selected?: Boolean;
  charColor: string;
  showName: Boolean
  onClick?: () => void;
}

const CharacterPortrait = ( {charName, charThreeLetterCode, game, selected, charColor, showName, onClick }: CharacterPortraitProps ) => {

  return(
    <div
      className="character-block"
      style={{ background: `${charColor}`}}
      onClick={onClick}
    >
      <img alt={`${charName} portrait`} src={`${process.env.PUBLIC_URL}/assets/images/characters/${game.toLowerCase()}/${charName}.png`} />
      {showName &&
        <h2 className={selected ? "selected" : "not-selected"}>{charThreeLetterCode ? charThreeLetterCode : charName}</h2>
      }
    </div>
  )
}


export default CharacterPortrait;