
import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,

  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
} from '@mui/material';
import { type SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { TableProps } from '../../Redux/Types/repairTypes';
import theme from '../../Theme/theme';
import { PiEmptyThin } from "react-icons/pi";

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

const DynamicTable: React.FC<TableProps> = ({
  rows,
  clickedRowId,
  columnsToShow,
  columnLabels,
  actions,
  onChecked,
  enableChecked
}) => {
  const { t } = useTranslation();
  const [Lines, setLines] = useState(10);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
useEffect(() => {
  if (!rows.length) {
    setSelectedIds([]);
    onChecked?.([]);
  }
}, [rows.length]);
  /* useEffect(() => {
    setSelectedIds([]);
    // Décaler onChecked à la boucle d'event suivante pour éviter les effets indésirables
    setTimeout(() => {
      if (onChecked) onChecked([]);
    }, 0);
  }, [rows]); */

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  const visibleColumns =
    columnsToShow && columnsToShow.length > 0 ? columnsToShow : columns;

  const totalPages = Math.ceil(rows.length / Lines);
  const paginatedRows = Array.isArray(rows)
    ? rows.slice((page - 1) * Lines, page * Lines)
    : [];

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prevSelected) => {
      const isSelected = prevSelected.includes(id);
      const updated = isSelected
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id];

      if (onChecked) {
        onChecked(updated);
      }

      return updated;
    });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleLinesChange = (e: SelectChangeEvent<number>) => {
    const newLines = Number(e.target.value);
    setLines(newLines);
    setPage(1);
  };

  // ✅ Aucun hook en-dessous de ce return
  if (rows.length === 0) {
    return <Box
      sx={{
        color: 'gray'
      }}
    ><PiEmptyThin />{'  - - -  Aucune donnée à afficher  - - -  '} <PiEmptyThin /></Box>;
  }
 
  
  return (
    <> <br /><br /><br />
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {enableChecked && <TableCell padding="checkbox" />}
            {visibleColumns.map((col) => (
              <TableCell
                key={col}
                style={{
                  border: '1px solid #ccc',
                  padding: '8px',
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                }}
              >
                {columnLabels?.[col] || col}
              </TableCell>
            ))}

            {
              actions ? (<TableCell
                style={{
                  border: '1px solid #ccc',
                  padding: '8px',
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                }}
              >
                Actions
              </TableCell>) : (null)
            }

          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedRows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{
                backgroundColor: clickedRowId === row.id ? '#e0f7fa' : 'inherit',
                transition: 'background-color 0.3s ease',
              }}
            >
              {enableChecked && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onChange={() => handleCheckboxChange(row.id)}
                    color="primary"
                  />
                </TableCell>
              )}

              {visibleColumns.map((col) => {
                let value = getNestedValue(row, col);

                return (
                  <TableCell key={col} style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {Array.isArray(value) ? (
                      value.length ? (
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          {value.map((item, index) => (
                            <li key={index}>
                              {typeof item === 'object' && item !== null
                                ? item.name ?? JSON.stringify(item)
                                : item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        '[]'
                      )
                    ) : typeof value === 'object' && value !== null ? (
                      value.name ?? JSON.stringify(value)
                    ) : value === undefined || value === null ? (
                      ''
                    ) : col === 'status' ? (
                      value === 'Autoriser' ? (
                        <Card sx={{ borderColor: 'green', borderRadius: '50px' }}>{value}</Card>
                      ) : (
                        <Card sx={{ borderColor: 'red', borderRadius: '50px' }}>{value}</Card>
                      )
                    ) : col.toLowerCase().includes('date') && !isNaN(Date.parse(value)) ? (
                      <>
                        {new Date(value).toISOString().split('T')[0]} <br />
                        {new Date(value).toTimeString().split(' ')[0]}
                      </>
                    ) : (
                      value
                    )}
                  </TableCell>
                );
              })}

            

              {actions && (
                <TableCell style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {(typeof actions === 'function' ? actions(row) : actions).map((action, index) => (
                    <span
                      key={index}
                      onClick={() => action.onClick(row)}
                      style={{ marginLeft: '20px', cursor: 'pointer' }}
                    >
                      {action.icon}
                    </span>
                  ))}
                </TableCell>
              )}

            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ display: 'flex', marginLeft: '25%', marginTop: '5%' }}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="select-lines-label">Lignes</InputLabel>
          <Select
            labelId="select-lines-label"
            id="select-lines"
            value={Lines}
            onChange={handleLinesChange}
            label="Nombre de lignes"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={500}>500</MenuItem>
          </Select>
        </FormControl>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          color="primary"
          sx={{ marginTop: '3%', marginLeft: '144px' }}
        />
        <Box
      sx={{
        color: 'gray',
        marginTop: '3%', marginLeft: '50px'
      }}
    > {`Total: ${rows.length}` }   </Box>
      </Box>
    </>
  );
};

export default DynamicTable;


 