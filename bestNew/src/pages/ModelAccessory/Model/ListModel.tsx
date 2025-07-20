import React, { useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { getAllModel } from '../../../Redux/Actions/ModelAndAccessory/Models';
import theme from '../../../Theme/theme';
import { Box, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import CardModel from './CardModel';
import AjouteModel from './AjouteModel';

export default function ListModel() {
  const dispatch = useAppDispatch();
  const models = useSelector((state: RootState) => state.models.models);

  useEffect(() => {
    dispatch(getAllModel())
  }, [dispatch])
    const [filters, setFilters] = useState({
      brand: [] as string[],
      name: [] as string[],
       
      typeModel: [] as string[],
       
    });
    const filteredRows = useMemo(() => {
      return models.filter((row: any) => {
  
        return (
  
          (filters.brand.length === 0 || filters.brand.includes(row.brand?.id )) &&
          (filters.name.length === 0 || filters.name.includes(row.name ))  &&
           (filters.typeModel.length === 0 || filters.typeModel.includes(row.typeModel.id ))  
        );
      });
    }, [models, filters]);
      const handleFilterChange = (field: string, value: string[]) => {
    setFilters({ ...filters, [field]: value });
  };
const getUniqueOptions = (
  key: keyof typeof filters
): { label: string; value: string }[] => {
  const rawOptions = models.map((row: any) => {
    switch (key) {
      case 'brand':
        console.log("BRAND DATA:", row.brand);
        return row.brand?.id && row.brand?.name
          ? { label: row.brand.name, value: row.brand.id }
          : null;
      case 'name':
        return row.name
          ? { label: row.name, value: row.name }
          : null;
      case 'typeModel':
        return row.typeModel?.id && row.typeModel?.description
          ? { label: row.typeModel.description, value: row.typeModel.id }
          : null;
      default:
        return null;
    }
  }).filter((opt): opt is { label: string; value: string } => !!opt && !!opt.label);

  // Supprimer les doublons
  const uniqueMap = new Map<string, { label: string; value: string }>();
  for (const opt of rawOptions) {
    if (!uniqueMap.has(opt.value)) {
      uniqueMap.set(opt.value, opt);
    }
  }

  return Array.from(uniqueMap.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
};



const renderMultiSelect = (label: string, field: keyof typeof filters) => {
  const options = getUniqueOptions(field);
  return (
    <Grid sx={{ width: '300px' }}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          multiple
          value={filters[field]}
          onChange={(e) => handleFilterChange(field, e.target.value as string[])}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => {
            const selectedLabels = selected.map(
              (val) => options.find((o) => o.value === val)?.label || val
            );
            return selectedLabels.join(', ');
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
                width: '300px'
              }
            }
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={filters[field].includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );
};

  return (
    <div>
      <Typography sx={{
        textAlign: 'left',
        fontWeight: 'bold',
        marginBottom: '3%',
        color: theme.palette.secondary.main, width: '200px'
      }} >
        List des modèles</Typography   >

      <AjouteModel />
      <Grid container spacing={2} sx={{ mb: 2 , marginLeft:'20%'}}>
        {renderMultiSelect('Marque', 'brand')}
        {renderMultiSelect('Nom Modèle', 'name')}
        {renderMultiSelect('Type modèle', 'typeModel')}
        
         
      </Grid>
      <Box
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 3fr)',
          gap: 2,
        }}
      >

        {
          Array.isArray(models)
            ? filteredRows.map((item) => <CardModel key={item.id} {...item} />)
            : <Typography>Aucune modèle trouvée.</Typography>
        }

      </Box>
    </div>
  )
}
