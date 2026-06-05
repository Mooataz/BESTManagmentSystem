import { API } from '../../services/api';
import React, { useEffect, useMemo, useState } from 'react'
import { Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import theme from '../../Theme/theme';
import DynamicTable from '../../Componants/Global/TableComponat';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';

export default function ViewPartsAvailablePrice() {
    const user = useSelector((state: RootState) => state.auth.user);
    const branchId = typeof user?.branch === 'object' ? user.branch.id : user?.branch;

    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        if (!branchId) return;
        API.get(`/parts-price/view-data?branchId=${branchId}`)
            .then(r => r.data)
            .then(res => setData((res.data ?? []).map((row: any) => ({
                ...row,
                stockDisplay: (row.stockCount ?? 0) > 0 ? 'Disponible' : 'Non disponible'
            }))))
            .catch(() => setData([]));
    }, [branchId]);

    const columns = [
        { key: 'brandName', label: 'Marque' },
        { key: 'modelName', label: 'Modèle' },
        { key: 'typeModelName', label: 'Type Modèle' },
        { key: 'allPartDescription', label: 'Pièce' },
        { key: 'calculatedPrice', label: 'Prix calculé' },
        { key: 'stockDisplay', label: 'Disponibilité' },
    ];

    const [filters, setFilters] = useState<Record<string, string[]>>({});

    const handleFilterChange = (field: string, value: string[]) => {
        setFilters({ ...filters, [field]: value });
    };

    const filteredRows = useMemo(() => {
        return data.filter((row: any) => {
            return columns.every((col) => {
                const selected = filters[col.key];
                if (!selected || selected.length === 0) return true;
                const cellValue = String(row[col.key] ?? '');
                return selected.includes(cellValue);
            });
        });
    }, [data, filters]);

    const getUniqueOptions = (field: string): string[] => {
        const values = data.map((r: any) => String(r[field] ?? '')).filter(Boolean);
        return Array.from(new Set(values)).sort();
    };

    const renderMultiSelect = (label: string, field: string) => (
        <Grid sx={{ width: '180px' }} key={field}>
            <FormControl fullWidth size="small">
                <InputLabel>{label}</InputLabel>
                <Select
                    multiple
                    value={filters[field] ?? []}
                    onChange={(e) => handleFilterChange(field, e.target.value as string[])}
                    input={<OutlinedInput label={label} />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={{
                        PaperProps: { style: { maxHeight: 260, width: '200px' } }
                    }}
                >
                    {getUniqueOptions(field).map((option) => (
                        <MenuItem key={option} value={option}>
                            <Checkbox checked={(filters[field] ?? []).includes(option)} />
                            <ListItemText primary={option} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    );

    const columnLabels: Record<string, string> = {};
    const columnsToShow: string[] = [];
    columns.forEach(c => { columnLabels[c.key] = c.label; columnsToShow.push(c.key); });

    return (
        <div>
            <Typography sx={{
                textAlign: 'left',
                color: theme.palette.secondary.main,
                fontWeight: 'bold',
                marginBottom: '3%'
            }}>
                Pièces : Disponibilité / Prix
            </Typography>

            <Grid container spacing={1} sx={{ mb: 2 }}>
                {columns.map(c => renderMultiSelect(c.label, c.key))}
            </Grid>

            <DynamicTable
                rows={filteredRows}
                columnLabels={columnLabels}
                columnsToShow={columnsToShow}
            />
        </div>
    )
}
