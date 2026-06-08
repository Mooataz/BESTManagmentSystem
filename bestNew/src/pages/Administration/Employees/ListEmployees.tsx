import React, { useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { getusers } from '../../../Redux/Actions/Administration/EmployèesActions';
import DynamicTable from '../../../Componants/Global/TableComponat';
import { Box, Button, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import UpdateEmployèes from './UpdateEmployees';
import ModeIcon from '@mui/icons-material/Mode';
import theme from '../../../Theme/theme';
import AddIcon from '@mui/icons-material/Add';
import AddEmploye from './AddEmploye';

export default function ListEmployees() {
  const dispatch = useAppDispatch();
  const empl = useSelector((state:RootState) => state.Employèes.Employèes)

  const [selectedEmploye, setSelectedEmploye] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({
    agence: [], status: [], role: []
  });
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const users = useMemo(() => {
    const all = Array.isArray(empl) ? empl : [];
    const filtered = all.filter((row: any) => !row.role?.includes("Administrateur"));

    return filtered.filter((row: any) => {
      if (filters.agence.length > 0) {
        const branchName = row.branch?.name ?? '';
        if (!filters.agence.includes(branchName)) return false;
      }
      if (filters.status.length > 0) {
        if (!filters.status.includes(row.status)) return false;
      }
      if (filters.role.length > 0) {
        const hasRole = (row.role ?? []).some((r: string) => filters.role.includes(r));
        if (!hasRole) return false;
      }
      if (dateRange.from) {
        const d = new Date(row.createdDate);
        if (d < new Date(dateRange.from)) return false;
      }
      if (dateRange.to) {
        const d = new Date(row.createdDate);
        if (d > new Date(dateRange.to + 'T23:59:59')) return false;
      }
      return true;
    });
  }, [empl, filters, dateRange]);

  useEffect(() => {
    dispatch(getusers())
  }, [dispatch])

  const handleFilterChange = (field: string, value: string[]) => {
    setFilters({ ...filters, [field]: value });
  };

  const getUniqueOptions = (field: string): string[] => {
    const all = Array.isArray(empl) ? empl : [];
    switch (field) {
      case 'agence': {
        const v = all.map((u: any) => u.branch?.name).filter(Boolean) as string[];
        return Array.from(new Set(v)).sort();
      }
      case 'status':
        return ['Autoriser', 'Bloqué'];
      case 'role': {
        const v = all.flatMap((u: any) => u.role ?? []) as string[];
        return Array.from(new Set(v)).sort();
      }
      default: return [];
    }
  };

  const renderMultiSelect = (label: string, field: string) => (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={filters[field] ?? []}
        onChange={(e) => handleFilterChange(field, e.target.value as string[])}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => selected.join(', ')}
        MenuProps={{ PaperProps: { style: { maxHeight: 260 } } }}
      >
        {getUniqueOptions(field).map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={(filters[field] ?? []).includes(option)} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

const handelOpenEdit = (employe: any) => {
  setSelectedEmploye(employe);
  setOpenEdit(true);
};
   
 const handleCloseEdit = () => {
  setOpenEdit(false);
};

       const actions: TableAction[] = [{
          icon: <ModeIcon style={{ color: theme.palette.primary.main }} /> ,
          onClick: (row: any) =>   handelOpenEdit(row)  
      } ]
      
  return (
     <div style={{ padding: '20px' }}>
      <Typography sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%', color: theme.palette.secondary.main, width: '200px' }} >List des employèes</Typography>
      <AddEmploye />

      <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
        <Grid size={2.4}>
          {renderMultiSelect('Agence', 'agence')}
        </Grid>
        <Grid size={2.4}>
          {renderMultiSelect('Status', 'status')}
        </Grid>
        <Grid size={2.4}>
          {renderMultiSelect('Role', 'role')}
        </Grid>
        <Grid size={2}>
          <TextField fullWidth size="small" label="Date début" type="date"
            value={dateRange.from}
            onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={2}>
          <TextField fullWidth size="small" label="Date fin" type="date"
            value={dateRange.to}
            onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <DynamicTable
        rows={users}

        columnLabels={{
          'id': 'Id',
          'name': 'Nom',
          'phone': 'Téléphone',
          'createdDate': 'Date d\'inscription',
          'status': 'Status',
          'login': 'Login',
          'role': 'Role',
          'branch.name': 'Agence'
        }}

        columnsToShow={['id',
          'name',
          'phone',
          'createdDate',
          'status',
          'login',
          'role',
          'branch.name']}

          actions = {actions}     
      />

      {selectedEmploye && (
        <UpdateEmployèes
          employe={selectedEmploye}
          open={openEdit}
          onClose={handleCloseEdit}
        />
      )}
    </div>
  )
}
