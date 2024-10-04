import { useDispatch } from 'react-redux';
import '../../style/components/DataTableRow.scss';
import '../../style/components/DataTableHeader.scss';
import { setModalVisibility } from '../actions';


type Props = {
  colsToDisplay: Record<string, any>;
  moveType: string;
  xScrollEnabled: boolean;
}

const DataTableHeader = ({colsToDisplay, moveType, xScrollEnabled}: Props) => {

  const dispatch = useDispatch();

  return (
      <tr className={`DataTableRow DataTableHeader ${xScrollEnabled ? "xScroll" : "fixed"}`} onClick={() => dispatch(setModalVisibility({ currentModal: "landscapeOptions", visible: true }))} >
        <th style={{textTransform: "capitalize"}} className="cell move-name">{moveType}s</th>
        {Object.keys(colsToDisplay).map(headerName =>
          <th className="cell data-point-scroll" key={headerName}>
            {colsToDisplay[headerName]}
          </th>
        )}
      </tr>
  )
}

export default DataTableHeader;