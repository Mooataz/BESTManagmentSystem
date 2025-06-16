import { Box, Pagination, Stack, Table, TableCell } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import { TableBody, TableHead } from '@mui/material';
import React, { useState } from 'react';
import TableRow from '@mui/material/TableRow'
import { useTranslation } from 'react-i18next';
import type { TableProps } from '../../Redux/Types/repairTypes';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}
const DynamicTable: React.FC<TableProps> = ({ rows, columnsToShow, columnLabels, actions }) => {
  const { t } = useTranslation();
  const userr = useSelector((state: RootState) => state.user);
  const [Lines, setLines] = React.useState(10); // Lignes par page
  const [page, setPage] = useState(1); // Page actuelle
  
  if (rows.length === 0) {
    return <p>{t('NoData')}</p>;
  }
  const columns = Object.keys(rows[0]);
  const visibleColumns = columnsToShow && columnsToShow.length > 0
    ? columnsToShow
    : columns;


    // ✅ Pagination logic
  const totalPages = Math.ceil(rows.length / Lines);
  const paginatedRows = rows.slice((page - 1) * Lines, page * Lines);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

const handleLinesChange = (e: SelectChangeEvent<number>) => {
  const newLines = e.target.value;
  setLines(newLines);
  setPage(1);
};


  return (
    <>
      <Table sx={{ minWidth: 650 }} >
        <TableHead>
          <TableRow>
            {visibleColumns.map((col) => (
              <TableCell key={col} style={{ border: '1px solid #ccc', padding: '8px', color: "#135188", fontWeight: "bold", }}>
                {/*  {t(col)}*/} {columnLabels?.[col] || col}
              </TableCell>
            ))}
            <th style={{ border: '1px solid #ccc', padding: '8px', color: "#135188", fontWeight: "bold", }}>Actions</th>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row, idx) => (
            <TableRow key={idx}>
              {visibleColumns.map((col) => (
                <TableCell key={col} style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {getNestedValue(row, col)}
                </TableCell>
              ))}
              {actions && (<TableCell style={{ border: '1px solid #ccc', padding: '8px' }}> {actions.map((action, index) => (<span key={index} onClick={() => action.onClick(row)} style={{ marginLeft: '20px' }}>
                {action.icon}
              </span>))}</TableCell>)}

            </TableRow>
          ))}
        </TableBody>

        
      </Table>

      
      <Box sx={{display:'flex',marginLeft: '25%', marginTop: '5%'}}>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-standard-label">Lignes</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={Lines}
          onChange={handleLinesChange}
          label="Nombre de lignes"
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>
      <Pagination count={totalPages} 
                  page={page}
                  onChange={handlePageChange}
                  variant="outlined" 
                  color="primary" 
                  sx={{ marginTop: '3%',marginleft:'144px'}}  />
    
    </Box>
    </>
  );
};
export default DynamicTable;