import '../../style/components/DataTableRow.scss';

type Props = {
  moveName: string;
  moveData: Record<string, any>;
  colsToDisplay: Record<string, any>;
  xScrollEnabled: boolean;
}

const DataTableRow = ({moveName, moveData, colsToDisplay, xScrollEnabled}: Props) => {  
  return (

    <tr className={`DataTableRow ${xScrollEnabled ? "xScroll" : "fixed"}`}>
      <td className="cell move-name">{moveName}</td>
      {Object.keys(colsToDisplay).map(detailKey =>
        <td className="cell data-point-scroll" key={`cell-entry-${detailKey}`}>
          {moveData[detailKey]}
        </td>
      )}
    </tr>
  )
}

export default DataTableRow;