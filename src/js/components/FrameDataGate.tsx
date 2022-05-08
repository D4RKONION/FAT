import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setActiveGame } from '../actions';
import { activeGameSelector } from '../selectors';

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
    // @ts-ignore
    dispatch(setActiveGame(activeGame, false)).then(() => setIsReady(true));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isReady) return null;

  return <>{children}</>;
};

export default FrameDataGate;
