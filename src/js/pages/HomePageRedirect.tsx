import React from 'react';
import { Redirect } from 'react-router';
import { useSelector } from 'react-redux'

const HomePageRedirect = () => {

  const activeGame = useSelector(state => state.activeGameState);
  const selectedCharacters = useSelector(state => state.selectedCharactersState);

  return <Redirect to={`/framedata/${activeGame}/${selectedCharacters["playerOne"].name}`} />
};



export default HomePageRedirect;
