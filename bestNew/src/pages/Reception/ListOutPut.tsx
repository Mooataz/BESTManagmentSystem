import React, { useMemo, useState } from 'react'
import { useAppDispatch } from '../../Redux/hooks';
import { useNotification } from '../../Componants/NotificationContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import type { TableAction } from '../../Redux/Types/repairTypes';
import { GetOutPutBranch } from '../../Redux/Actions/Reception/OutputRepairsActions';
import { Box, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import theme from '../../Theme/theme';
import DynamicTable from '../../Componants/Global/TableComponat';
import { TbListDetails } from "react-icons/tb";
import ShowDetailsReturn from './ShowDetailsReturn';

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

type FiltersType = {
  id: string[];
  'customer.name': string[];
  'customer.phone': string[];
  remark: string[];
  date: string[];
  'user.name': string[];
};

export default function ListOutPut() {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const userr = useSelector((state: RootState) => state.auth.user);
    const ListOut = useSelector((state: RootState) => state.OutputList.out)

    React.useEffect(() => {

        if (!userr?.id || !userr?.branch) return;

        const branchId = typeof userr.branch === 'object' ? userr.branch.id : userr.branch;
        if (!branchId || isNaN(userr.id)) return;

   dispatch(GetOutPutBranch(branchId))
    .then((resultAction) => {
        if (!GetOutPutBranch.fulfilled.match(resultAction)) {
            const errorMessage = (resultAction.payload as { message?: string })?.message || 'Erreur inconnue';
            notify(`Erreur lors du chargement : ${errorMessage}`, 'error');
        }
    });

    }, [dispatch, userr, notify]);

    const [filters, setFilters] = useState<FiltersType>({
        id: [],
        'customer.name': [],
        'customer.phone': [],
        remark: [],
        date: [],
        'user.name': [],
    });

    const filteredRows = useMemo(() => {
        return ListOut.filter((row: any) => {
            return (
                (filters.id.length === 0 || filters.id.includes(String(getNestedValue(row, 'id')))) &&
                (filters['customer.name'].length === 0 || filters['customer.name'].includes(String(getNestedValue(row, 'customer.name') ?? ''))) &&
                (filters['customer.phone'].length === 0 || filters['customer.phone'].includes(String(getNestedValue(row, 'customer.phone') ?? ''))) &&
                (filters.remark.length === 0 || filters.remark.includes(String(getNestedValue(row, 'remark') ?? ''))) &&
                (filters.date.length === 0 || filters.date.includes(String(getNestedValue(row, 'date') ?? ''))) &&
                (filters['user.name'].length === 0 || filters['user.name'].includes(String(getNestedValue(row, 'user.name') ?? '')))
            );
        });
    }, [ListOut, filters]);

    const getUniqueOptions = (key: keyof FiltersType): string[] => {
        const values = ListOut.flatMap((row: any) => {
            const val = getNestedValue(row, key);
            return val != null ? [String(val)] : [];
        });
        return Array.from(new Set(values)).sort();
    };

    const handleFilterChange = (field: keyof FiltersType, value: string[]) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const renderMultiSelect = (label: string, field: keyof FiltersType) => (
        <Box sx={{ minWidth: 180, flex: '1 1 180px' }}>
            <FormControl fullWidth size="small">
                <InputLabel>{label}</InputLabel>
                <Select
                    multiple
                    value={filters[field]}
                    onChange={(e) => handleFilterChange(field, e.target.value as string[])}
                    input={<OutlinedInput label={label} />}
                    renderValue={(selected) => (selected as string[]).join(', ')}
                    MenuProps={{
                        PaperProps: { style: { maxHeight: 300 } },
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
        </Box>
    );

    const [openDetails, setOpenDetails] = React.useState(false);
    const [row, setRow] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const handleCloseDetails = () => setOpenDetails(false);
   
  const handelOpenDetailes = (id: number) => {
    setRow(id);
    setOpenDetails(true);
  }

       const actions: TableAction[] = [
  {
    icon: <TbListDetails  style={{ color: theme.palette.primary.main  }} />,
    onClick: (row: any) => handelOpenDetailes(row.id)
  }]

    return (
        <Box>
            <Typography
                sx={{
                    textAlign: 'left',
                    fontWeight: 'bold',
                    marginBottom: '3%',
                    color: theme.palette.secondary.main
                }} >List des rècuperation</Typography>
            <br />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                {renderMultiSelect('N°', 'id')}
                {renderMultiSelect('Récupérer par', 'customer.name')}
                {renderMultiSelect('Téléphone', 'customer.phone')}
                {renderMultiSelect('Remarque', 'remark')}
                {renderMultiSelect('Date sortie', 'date')}
                {renderMultiSelect('Sortie par', 'user.name')}
            </Box>

            <DynamicTable
                rows={filteredRows}

                columnLabels={{
                    'id': 'N°',
                    'customer.name': 'Rècuperer par',
                    'customer.phone': 'Téléphone',
                    'remark': 'Remarque',
                    'date': 'Sortie le',
                    'user.name': 'Sortie par'
                }}

                columnsToShow={['id',
                    'customer.name',
                    'customer.phone',
                    'remark',
                    'date',
                    'user.name'
                ]}
                actions={actions}
            />

            <ShowDetailsReturn
                    open={openDetails}
                    onClose={handleCloseDetails}
                    idOut={row}
                    isLoading={isLoading}
                  />
        </Box>
    )
}
