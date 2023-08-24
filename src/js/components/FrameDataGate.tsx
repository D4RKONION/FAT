import { ReactNode, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveGame, setLandscapeCols, setPlayer, setPlayerAttr } from '../actions';
import { GAME_NAMES } from '../constants/ImmutableGameDetails';
import { activeGameSelector, gameDetailsSelector, landscapeColsSelector, selectedCharactersSelector } from '../selectors';
import { GameName } from '../types';
import { removeAllSpecificCancels } from '../utils/landscapecols';

type FrameDataGateProps = {
  children: ReactNode;
};

/** Loads the frame data asynchronously from storage on first load, and prevents any
 *  children from rendering until the frame data is available. */
const FrameDataGate = ({ children }: FrameDataGateProps) => {
  const dispatch = useDispatch();
  const activeGame = useSelector(activeGameSelector);
  const landscapeCols = useSelector(landscapeColsSelector);
  const gameDetails = useSelector(gameDetailsSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  
  const slugs = useRef({
    game: GAME_NAMES.includes(decodeURIComponent(window.location.hash.split("/")[2]) as GameName) ? decodeURIComponent(window.location.hash.split("/")[2])
    : GAME_NAMES.includes(decodeURIComponent(window.location.hash.split("/")[3]) as GameName) ? decodeURIComponent(window.location.hash.split("/")[3])
    : null,
    char: gameDetails.characterList.includes(decodeURIComponent(window.location.hash.split("/")[3])) ? decodeURIComponent(window.location.hash.split("/")[3])
    : gameDetails.characterList.includes(decodeURIComponent(window.location.hash.split("/")[4])) ? decodeURIComponent(window.location.hash.split("/")[4])
    : null,
    state: gameDetails.characterStates.includes(decodeURIComponent(window.location.hash.split("/")[5])) ? decodeURIComponent(window.location.hash.split("/")[5])
    : gameDetails.specificCharacterStates?.[decodeURIComponent(window.location.hash.split("/")[3])]?.includes(decodeURIComponent(window.location.hash.split("/")[5])) ? decodeURIComponent(window.location.hash.split("/")[5])
    : gameDetails.specificCharacterStates?.[decodeURIComponent(window.location.hash.split("/")[4])]?.includes(decodeURIComponent(window.location.hash.split("/")[5])) ? decodeURIComponent(window.location.hash.split("/")[5])
    : null,
    move: Object.keys(selectedCharacters["playerOne"].frameData).filter(moveName => 
      selectedCharacters["playerOne"].frameData[moveName].moveName === decodeURIComponent(window.location.hash.split("/")[6])
    )[0]
  })

  const [gameIsSetup, setGameIsSetup] = useState(false);
  const [characterIsSetup, setCharacterIsSetup] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // do an initial frame data load
    if (slugs.current.game) {
      if (gameDetails) {
        dispatch(setLandscapeCols(removeAllSpecificCancels(gameDetails, landscapeCols)))
      }
      console.log("URL game mismatch");
      // @ts-ignore
      dispatch(setActiveGame(slugs.current.game, slugs.current.game === activeGame ? false : true)).then(() => setGameIsSetup(true));
    } else {
    // @ts-ignore
    dispatch(setActiveGame(activeGame, false)).then(() => setGameIsSetup(true));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // After the frame data load, check for a character mismatch or state mismatch supplied by the URL
  // State first as changing the state has the side effect of changing the character
  useEffect(() => {

    if (gameIsSetup) {

      if (slugs.current.state && selectedCharacters["playerOne"].vtState !== slugs.current.state) {
        console.log("URL state mismatch");
        // @ts-ignore
        dispatch(setPlayerAttr("playerOne", slugs.current.char, {vtState: slugs.current.state})).then(() => setCharacterIsSetup(true));;
      } else if (slugs.current.char && selectedCharacters["playerOne"].name !== slugs.current.char) {
          console.log("URL character mismatch");
          // @ts-ignore
          dispatch(setPlayer("playerOne", slugs.current.char)).then(() => setCharacterIsSetup(true));
      } else {
        setCharacterIsSetup(true)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameIsSetup])
  

  // Finally, once the character is setup we can check for a move mismatch supplied by the URL
  useEffect(() => {
    if (characterIsSetup) {
      if (slugs.current.move && selectedCharacters["playerOne"].selectedMove !== slugs.current.move) {
        console.log("URL move mismatch");
        // @ts-ignore
        dispatch(setPlayerAttr("playerOne", slugs.current.char, {selectedMove: slugs.current.move})).then(() => setIsReady(true));;
      } else {
        setIsReady(true);
      }
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterIsSetup])

  if (!isReady) return null;

  return <>{children}</>;
};

export default FrameDataGate;
