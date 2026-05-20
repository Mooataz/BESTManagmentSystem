import React, { useEffect, useMemo, useState } from 'react'
import { getAllPartPrice } from '../../../Redux/Actions/stock/PartPriceActions'
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import DynamicTable from '../../../Componants/Global/TableComponat';
import AddPartPrice from './AddPartPrice';
import { Button, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import theme from '../../../Theme/theme';
import UpdatePartPrice from './UpdatePartPrice';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import EditIcon from '@mui/icons-material/Edit';

export default function ListPartPrice() {
    const dispatch = useAppDispatch();
    const partsPrice = useSelector((state: RootState) => state.PartPrice.PartPrice)
    useEffect(() => {
        dispatch(getAllPartPrice())
    }, [dispatch])

    const [selectedRow, setSelectedRow] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const handelOpenEdit = (row: any) => {
        setSelectedRow(row);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setOpenEdit(false);
    };
    const actions: TableAction[] = [{
        icon: <EditIcon style={{ color: theme.palette.primary.main }} />,
        onClick: (row: any) => handelOpenEdit(row)
    }]
{/*
    -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    Begin Multi-Select Filters
*/}
 const [filters, setFilters] = useState({
    Marque: [] as string[],
    Modèle: [] as string[],
    Pièce: [] as string[],
    Prix: [] as string[],
    NiveauRèparation: [] as string[],
    FraisRéparation: [] as string[],
  });

   const handleFilterChange = (field: string, value: string[]) => {
    setFilters({ ...filters, [field]: value });
  };
 const filteredRows = useMemo(() => {
  return partsPrice.filter((row: any) => {
    return (
      // ✅ Filtre Marque
      (filters.Marque.length === 0 ||
        filters.Marque.includes(row.model?.brand?.name)) &&

      // ✅ Filtre Modèle
      (filters.Modèle.length === 0 ||
        filters.Modèle.includes(row.model?.name)) &&

      // ✅ Filtre Pièce
      (filters.Pièce.length === 0 ||
        filters.Pièce.includes(row.allPart?.description)) &&

      // ✅ Filtre Prix
      (filters.Prix.length === 0 ||
        filters.Prix.includes(row.price?.toString())) &&

      // ✅ Filtre Niveau de Réparation
      (filters.NiveauRèparation.length === 0 ||
        filters.NiveauRèparation.includes(row.levelRepair?.name)) &&

      // ✅ Filtre Frais de Réparation
      (filters.FraisRéparation.length === 0 ||
        filters.FraisRéparation.includes(row.levelRepair?.price?.toString()))
    );
  });
}, [partsPrice, filters]);

const getUniqueOptions = (key: keyof typeof filters): string[] => {
  const values = partsPrice.flatMap((row: any) => {
    switch (key) {
        case 'Marque': return row.model?.brand?.name ? [row.model.brand.name] : [];
        case 'Modèle': return row.model?.name ? [row.model.name] : [];
        case 'Pièce': return row.allPart?.description ? [row.allPart.description] : [];
        case 'Prix': return row.price ? [row.price.toString()] : [];
        case 'NiveauRèparation': return row.levelRepair?.name ? [row.levelRepair.name] : [];
        case 'FraisRéparation':
        return row.levelRepair?.price
          ? [row.levelRepair.price.toString()]
          : [];

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

{/*
    -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
    End Multi-Select Filters
*/}
    return (
        <div>

            <Typography sx={{
                textAlign: 'left',
                color: theme.palette.secondary.main,
                width: '200px',
                fontWeight: 'bold',
                marginBottom: '3%'
            }} >List des prix</Typography   >
            <AddPartPrice /> <br /> <br />

            <Grid container spacing={2} sx={{ mb: 2 }}>
                 {renderMultiSelect('Marque', 'Marque')}
                {renderMultiSelect('Modèle', 'Modèle')}
                {renderMultiSelect('Pièce', 'Pièce')}
                {renderMultiSelect('Prix', 'Prix')}
                {renderMultiSelect('Niveau rèparation', 'NiveauRèparation')}
                {renderMultiSelect('Frais réparation', 'FraisRéparation')}
             
            </Grid>
            <DynamicTable
                rows={filteredRows}
                columnLabels={{
                    'id': 'Code',
                    'model.brand.name': 'Marque',
                    'model.name': 'Modèle',
                    'allPart.description': 'Pièce',
                    'price': 'Prix',
                    'levelRepair.name': 'Niveau rèparation',
                    'levelRepair.price': 'Frais réparation'

                }}
                columnsToShow={[
                    'id',
                    'model.brand.name',
                    'model.name',
                    'allPart.description',
                    'price',
                    'levelRepair.name',
                    'levelRepair.price',

                ]}
                actions={actions}
            />

            {selectedRow && (
                <UpdatePartPrice
                    partPrice={selectedRow}
                    open={openEdit}
                    onClose={handleCloseEdit}
                />
            )}
        </div>
    )
}
