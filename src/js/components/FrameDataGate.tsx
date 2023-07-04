import { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveGame, setLandscapeCols } from '../actions';
import { GAME_NAMES } from '../constants/ImmutableGameDetails';
import { activeGameSelector, gameDetailsSelector, landscapeColsSelector } from '../selectors';
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

  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // do an initial frame data load
    const SLUG_GAME_NAME =
      GAME_NAMES.includes(window.location.hash.split("/")[2] as GameName) ? window.location.hash.split("/")[2]
      :  GAME_NAMES.includes(window.location.hash.split("/")[3] as GameName) ? window.location.hash.split("/")[3]
      : null

    const SLUG_CHARACTER_NAME =
    GAME_NAMES.includes(window.location.hash.split("/")[2] as GameName) ? window.location.hash.split("/")[3]
      :  GAME_NAMES.includes(window.location.hash.split("/")[3] as GameName) ? window.location.hash.split("/")[4]
      : null

    if (SLUG_GAME_NAME) {
      dispatch(setLandscapeCols(removeAllSpecificCancels(gameDetails, landscapeCols)))
      // @ts-ignore
      dispatch(setActiveGame(SLUG_GAME_NAME, SLUG_GAME_NAME === activeGame ? false : true)).then(() => setIsReady(true));
    } else {
      // @ts-ignore
      dispatch(setActiveGame(activeGame, false)).then(() => setIsReady(true));
    }
    

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isReady) return null;

  return <>{children}</>;
};

export default FrameDataGate;
