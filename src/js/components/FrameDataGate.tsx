import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setActiveGame } from '../actions';
import { activeGameSelector, frameDataSelector } from '../selectors';

type FrameDataGateProps = {
  children: ReactNode;
};

/** Loads the frame data asynchronously from storage on first load, and prevents any
 *  children from rendering until the frame data is available. */
const FrameDataGate = ({ children }: FrameDataGateProps) => {
  const dispatch = useDispatch();
  const activeGame = useSelector(activeGameSelector);
  const frameData = useSelector(frameDataSelector);

  useEffect(() => {
    // do an initial frame data load
    dispatch(setActiveGame(activeGame, false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!frameData) return null;

  return <>{children}</>;
};

export default FrameDataGate;
