 
import React, { useState, useMemo, useCallback } from 'react';
import {
  Box, Typography, Button, Grid, Select, MenuItem,
  InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText
} from '@mui/material';


import * as XLSX from 'xlsx';
import type { RootState } from '../../Redux/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../Redux/hooks';
import { getAllStockPartBranch } from '../../Redux/Actions/stock/EtatStockActions';
import DynamicTable from '../../Componants/Global/TableComponat';
import theme from '../../Theme/theme';
import type { TableAction } from '../../Redux/Types/repairTypes';
import { TbListDetails } from 'react-icons/tb';
import { BsPrinter } from 'react-icons/bs';
import ShowHistoryPart from './ShowHistoryPart';
 
export default function EtatStock() {
  const dispatch = useAppDispatch();
  const userr = useSelector((state: RootState) => state.auth.user);
  const allStockPart = useSelector((state: RootState) => state.stockParts.stockPartsBranch);
  const getBranchId = (branch: number | { id: number } | undefined): number | undefined =>
      typeof branch === 'number' ? branch : branch?.id;

    const currentbranch = getBranchId(userr?.branch);

  const [filters, setFilters] = useState({
    materialCode: [] as string[],
    description: [] as string[],
    model: [] as string[],
    caseName: [] as string[],
    caseType: [] as string[],
  });
  React.useEffect(() => {
    if (currentbranch) {
      dispatch(getAllStockPartBranch(currentbranch));
    }
  }, [currentbranch, dispatch]);

 
  const handleFilterChange = (field: string, value: string[]) => {
    setFilters({ ...filters, [field]: value });
  };
  // Extraire options uniques

  const filteredRows = useMemo(() => {
    return allStockPart.filter((row: any) => {

      return (

        (filters.materialCode.length === 0 || filters.materialCode.includes(row.reference?.materialCode)) &&
        (filters.description.length === 0 || filters.description.includes(row.reference?.allpart?.description)) &&
        (filters.model.length === 0 ||
          (Array.isArray(row.reference?.model) &&
            row.reference.model.some((m: any) => {
              const modelName = typeof m === 'string' ? m : m?.name;
              return filters.model.includes(modelName);
            }))
        ) &&

        (filters.caseName.length === 0 || filters.caseName.includes(row.bin?.name)) &&
        (filters.caseType.length === 0 || filters.caseType.includes(row.bin?.type))
      );
    });
  }, [allStockPart, filters]);
  
  const handleExport = () => {
    const data = filteredRows.map((row: any) => ({
      Code: row.id,
      'Material Code': row.reference?.materialCode,
      'Pièce': row.reference?.allpart?.description,
      'Modèle compatible': Array.isArray(row.reference?.model)
        ? row.reference.model
          .map((m: any) => typeof m === 'string' ? m : m?.name)
          .filter((name: any) => typeof name === 'string' && name.trim() !== '')
          .join(', ')
        : '',
      'Imei': row.serialnumber,
      'Case': row.bin?.name,
      'Type case': row.bin?.type,
      'Remarque': row.remark,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "État de stock");
    XLSX.writeFile(workbook, "etat-stock-filtré.xlsx");
  };
  const getUniqueOptions = (key: keyof typeof filters): string[] => {
    const values = allStockPart.flatMap((row: any) => {
      switch (key) {
        case 'materialCode':
          return row.reference?.materialCode ? [row.reference.materialCode] : [];
        case 'description':
          return row.reference?.allpart?.description ? [row.reference.allpart.description] : [];
        case 'model':
          return Array.isArray(row.reference?.model)
            ? row.reference.model
              .map((m: any) => (typeof m === 'string' ? m : m?.name))
              .filter((name: any) => typeof name === 'string' && name.trim() !== '')
            : [];
        case 'caseName':
          return row.bin?.name ? [row.bin.name] : [];
        case 'caseType':
          return row.bin?.type ? [row.bin.type] : [];
        default:
          return [];
      }
    });
    return Array.from(new Set(values)).sort();
  };
  const renderMultiSelect = (label: string, field: keyof typeof filters) => (
    <Grid sx={{width:'200px'}} >
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          multiple
          value={filters[field]}
          onChange={(e) => handleFilterChange(field, e.target.value as string[])}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
                width: '200px'
              }
            }
          }}
        >
          {getUniqueOptions(field).map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={filters[field].includes(option)} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const handleSelectionChange = useCallback((ids: number[]) => {
    setSelectedIds(ids);
  }, []);

  const handlePrintTickets = useCallback(async () => {
    if (!selectedIds.length) return;
    try {
      const res = await fetch('http://localhost:3000/stock-parts/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!res.ok) throw new Error('Failed to generate tickets');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      console.error('Print tickets error:', err);
    }
  }, [selectedIds]);

  const [row, setRow] = useState(0);
    const actions: TableAction[] = [ 
   
 
  {
    icon: <TbListDetails  style={{ color: theme.palette.primary.main  }} />,
    onClick: (row: any) => handelOpenDetailes(row.id)
  }]
   const [openDetails, setOpenDetails] = React.useState(false);
   const handleCloseDetails = () => setOpenDetails(false);
  const handelOpenDetailes = (id: number) => {
    setRow(id);
    setOpenDetails(true);

  }
  return (
    <Box>
      <Typography variant="h5" gutterBottom>État de stock</Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {renderMultiSelect('Material Code', 'materialCode')}
        {renderMultiSelect('Pièce', 'description')}
        {renderMultiSelect('Modèle compatible', 'model')}
        {renderMultiSelect('Case', 'caseName')}
        {renderMultiSelect('Type case', 'caseType')}
        <Grid sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            onClick={handlePrintTickets}
            variant="outlined"
            disabled={!selectedIds.length}
            sx={{
              borderColor: theme.palette.secondary.main,
              minWidth: '140px',
            }}
          >
            <BsPrinter style={{ marginRight: 6 }} />
            Ticket(s) ({selectedIds.length})
          </Button>
          <Button 
                onClick={handleExport} 
                variant="outlined" 
                sx={{
                  borderColor:theme.palette.secondary.main
                }}
                fullWidth>
            Exporter Excel
          </Button>
        </Grid>
      </Grid>
      <DynamicTable
        rows={filteredRows}
        enableChecked
        onChecked={handleSelectionChange}
        columnLabels={{
          'id': 'Code',
          'reference.materialCode': 'Material Code',
          'reference.allpart.description': 'Pièce',
          'reference.model': 'Modèle compatible',
          'serialnumber': 'Imei',
          'bin.name': 'Case',
          'bin.type': 'Type case',
          'remark': 'Remarque'
        }}
        columnsToShow={[
          'id',
          'reference.materialCode',
          'reference.allpart.description',
          'reference.model',
          'serialnumber',
          'bin.name',
          'bin.type',
          'remark'
        ]}
         actions={actions}
      />

<ShowHistoryPart
              open={openDetails}
              onClose={handleCloseDetails}
              idPart={row}
               
            />

       
    </Box>
  );
}