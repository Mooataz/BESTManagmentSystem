import { Box, Pagination, Stack, Table, TableCell } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import { TableBody, TableHead } from '@mui/material';
import React from 'react';
import TableRow from '@mui/material/TableRow'
import { useTranslation } from 'react-i18next';
import type { TableProps } from '../../Redux/Types/repairTypes';
 function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}
const DynamicTable: React.FC<TableProps> = ({ rows, columnsToShow , columnLabels ,actions   }) => {
  const { t } = useTranslation();
  if (rows.length === 0) { 
    return <p>{t('NoData')}</p>;
  }
  const columns = Object.keys(rows[0]);
const visibleColumns = columnsToShow && columnsToShow.length > 0
    ? columnsToShow
    : columns;
  return (
    <>
      <Table sx={{ minWidth: 650 }} >
        <TableHead>
          <tr>
            {visibleColumns.map((col) => (
              <th key={col} style={{ border: '1px solid #ccc', padding: '8px', color: "#135188", fontWeight: "bold", }}>
                {/*  {t(col)}*/} {columnLabels?.[col] || col}
              </th>
            ))}
            <th style={{ border: '1px solid #ccc', padding: '8px', color: "#135188", fontWeight: "bold", }}>Actions</th>
          </tr>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {visibleColumns.map((col) => (
                <td key={col} style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {getNestedValue(row, col)}
                </td>
              ))}
                {actions && ( <td  style={{ border: '1px solid #ccc', padding: '8px' }}> {actions.map( (action, index) =>(<span key={index} onClick={ () => action.onClick(row)}>
                {action.icon}
              </span>) )}</td>)}
              
            </tr>
          ))}
        </TableBody>
       </Table>
 
    </>
  );
};
export default DynamicTable;