
import "../../style/components/DataTableRow.scss";
import "../../style/components/DataTableHeader.scss";
import { IonIcon } from "@ionic/react";
import { arrowDown, arrowUp } from "ionicons/icons";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setModalVisibility } from "../actions";
import { advantageModifiersSelector } from "../selectors";

type Props = {
  colsToDisplay: Record<string, any>;
  moveType: string;
  xScrollEnabled: boolean;
  onClick?: (headerName: string) => void;
  sortKey?: string;
  sortAscending?: boolean;
  sample?: boolean;
  noPlural?: boolean;
  noStick?: boolean
};

const DataTableHeader = ({colsToDisplay, moveType, xScrollEnabled, onClick, sortKey, sortAscending, sample, noPlural, noStick}: Props) => {
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

  console.log(sortKey);

  return (
    <tr
      style={noStick ? {position: "relative"} : {}}
      className={`DataTableRow DataTableHeader ${xScrollEnabled ? "xScroll" : "fixed"}`}
    >
      <th style={{textTransform: "capitalize"}} className="cell move-name" onClick={() => onClick ? onClick(undefined) : sample !== true && dispatch(setModalVisibility({ currentModal: "landscapeOptions", visible: true }))} >{moveType}{moveType !== "Move Name" && !noPlural && "s"}</th>
      {Object.keys(colsToDisplay).map(headerName =>
        <th
          className="cell"
          key={headerName}
          onClick={() => onClick ? onClick(headerName) : sample !== true && dispatch(setModalVisibility({ currentModal: "landscapeOptions", visible: true }))} 
        >
          {colsToDisplay[headerName]} {((headerName === "onHit" && (rawDriveRush || counterHit)) || (headerName === "onBlock" && (rawDriveRush || vsBurntoutOpponent))) && advantageIncreaseAmount(headerName)}{sortKey && sortKey === headerName && <IonIcon icon={sortAscending ? arrowUp : arrowDown} />}
        </th>
      )}
    </tr>
  );
};

export default memo(DataTableHeader);