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
        // Catch failed image fetches
        // https://stackoverflow.com/a/48222599
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src=`${process.env.PUBLIC_URL}/assets/images/characters/ggst/Axl.png`;
        }}
        src={
          remoteImage ?
            //fetch the image from the server
            `https://fullmeter.com/fatfiles/test/${game}/images/characters/${charName}.png`
          : //local app image
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