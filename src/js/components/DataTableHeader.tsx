
import "../../style/components/DataTableRow.scss";
import "../../style/components/DataTableHeader.scss";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setModalVisibility } from "../actions";
import { advantageModifiersSelector } from "../selectors";

type Props = {
  colsToDisplay: Record<string, any>;
  moveType: string;
  xScrollEnabled: boolean;
  sample?: boolean;
  noPlural?: boolean;
  noStick?: boolean
};

const DataTableHeader = ({colsToDisplay, moveType, xScrollEnabled, sample, noPlural, noStick}: Props) => {
  const rawDriveRush = useSelector(advantageModifiersSelector).rawDriveRushActive;
  const counterHit = useSelector(advantageModifiersSelector).counterHitActive;
  const vsBurntoutOpponent = useSelector(advantageModifiersSelector).vsBurntoutOpponentActive;

  const dispatch = useDispatch();

  const advantageIncreaseAmount = (headerName) => {
    if (headerName === "onHit") {
      return `(+${(rawDriveRush ? 4 : 0) + (counterHit ? 2 : 0)})`;
    } else if (headerName === "onBlock") {
      return `(+${(rawDriveRush ? 4 : 0) + (vsBurntoutOpponent ? 4 : 0)})`;
    }
  };

  return (
    <tr style={noStick ? {position: "relative"} : {}} className={`DataTableRow DataTableHeader ${xScrollEnabled ? "xScroll" : "fixed"}`} onClick={() => sample !== true && dispatch(setModalVisibility({ currentModal: "landscapeOptions", visible: true }))} >
      <th style={{textTransform: "capitalize"}} className="cell move-name">{moveType}{moveType !== "Move Name" && !noPlural && "s"}</th>
      {Object.keys(colsToDisplay).map(headerName =>
        <th className="cell" key={headerName}>
          {colsToDisplay[headerName]} {((headerName === "onHit" && (rawDriveRush || counterHit)) || (headerName === "onBlock" && (rawDriveRush || vsBurntoutOpponent))) && advantageIncreaseAmount(headerName)}
        </th>
      )}
    </tr>
  );
};

export default memo(DataTableHeader);