import React from 'react';
import { } from '@ionic/react';

import '../../style/components/CharacterPortrait.scss';

type CharacterPortraitProps = {
  charName: string;
  charThreeLetterCode?: string;
  game: string;
  selected?: Boolean;
  charColor: string;
  onClick?: () => void;
}

const CharacterPortrait = ( { charName, charThreeLetterCode, game, selected, charColor, onClick }: CharacterPortraitProps ) => {
  
  return(
    <div
      className="character-block"
      style={{ background: `radial-gradient(circle, ${charColor}94 0%, ${charColor}c7 38%, ${charColor} 100%)`}}
      onClick={onClick}
    >
      <img alt={`${charName} portrait`} src={`${process.env.PUBLIC_URL}/assets/images/characters/${game}/${charName}.png`} />
      <h2 className={selected ? "selected" : "not-selected"}>{charThreeLetterCode ? charThreeLetterCode : charName}</h2>
    </div>
  )
}


export default CharacterPortrait;