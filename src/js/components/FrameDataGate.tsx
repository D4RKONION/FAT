import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setActiveGame } from '../actions';
import { GAME_NAMES } from '../constants/ImmutableGameDetails';
import { activeGameSelector } from '../selectors';
import { GameName } from '../types';

type FrameDataGateProps = {
  children: ReactNode;
};

/** Loads the frame data asynchronously from storage on first load, and prevents any
 *  children from rendering until the frame data is available. */
const FrameDataGate = ({ children }: FrameDataGateProps) => {
  const dispatch = useDispatch();
  const activeGame = useSelector(activeGameSelector);

  const [isReady, setIsReady] = useState(false);
  
 

  useEffect(() => {
    // do an initial frame data load
    if (GAME_NAMES.includes(window.location.hash.split("/")[2] as GameName)) {
      // @ts-ignore
      dispatch(setActiveGame(window.location.hash.split("/")[2], true)).then(() => setIsReady(true));
    } else if (GAME_NAMES.includes(window.location.hash.split("/")[3] as GameName)) {
      // @ts-ignore
      dispatch(setActiveGame(window.location.hash.split("/")[3], true)).then(() => setIsReady(true));
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
