import { API } from '../../../services/api';
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { getAllPartPrice } from '../../../Redux/Actions/stock/PartPriceActions'
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import DynamicTable from '../../../Componants/Global/TableComponat';
import AddPartPrice from './AddPartPrice';
import { Button, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Typography, Snackbar, Alert } from '@mui/material';
import theme from '../../../Theme/theme';
import UpdatePartPrice from './UpdatePartPrice';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import EditIcon from '@mui/icons-material/Edit';
import * as XLSX from 'xlsx';

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
    const [importResult, setImportResult] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

    const downloadTemplate = useCallback(async () => {
      const wb = XLSX.utils.book_new();
      const data = [
        { Marque: 'Apple', Modèle: 'iPhone 13', Pièce: 'Écran', Prix: 45000, 'Niveau réparation': 'Niveau 1' },
        { Marque: 'Samsung', Modèle: 'Galaxy S22', Pièce: 'Batterie', Prix: 12000, 'Niveau réparation': 'Niveau 2' },
      ];
      const ws1 = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws1, 'Import Prix');

      try {
        const res = await API.get('/parts-price/references');
        const refs = res.data?.data;
        if (refs) {
          const maxLen = Math.max(refs.brands.length, refs.models.length, refs.allParts.length, refs.levelRepairs.length);
          const refData: any[] = [];
          for (let i = 0; i < maxLen; i++) {
            refData.push({
              Marque: refs.brands[i] ?? '',
              Modèle: refs.models[i] ?? '',
              Pièce: refs.allParts[i] ?? '',
              'Niveau réparation': refs.levelRepairs[i] ?? '',
            });
          }
          const ws2 = XLSX.utils.json_to_sheet(refData);
          XLSX.utils.book_append_sheet(wb, ws2, 'Références');
        }
      } catch {}

      XLSX.writeFile(wb, 'modele-import-prix.xlsx');
    }, []);

    const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const workbook = XLSX.read(ev.target?.result, { type: 'binary' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
          if (!rows.length) {
            setImportResult({ open: true, message: 'Fichier vide', severity: 'error' });
            return;
          }
          const body = rows.map((r: any) => ({
            brandName: String(r.Marque || '').trim(),
            modelName: String(r.Modèle || '').trim(),
            allPartDescription: String(r.Pièce || '').trim(),
            price: Number(r.Prix),
            levelRepairName: String(r['Niveau réparation'] || '').trim() || undefined,
          }));
          const res = await API.post('/parts-price/import', { rows: body });
          const result = res.data;
          if (res.status !== 200 && res.status !== 201) throw new Error(result.message || 'Erreur import');
          const { imported, errors } = result.data;
          const msg = `${imported} ligne(s) importée(s)` + (errors?.length ? `, ${errors.length} erreur(s)` : '');
          setImportResult({ open: true, message: msg, severity: errors?.length ? 'error' : 'success' });
          dispatch(getAllPartPrice());
        } catch (err: any) {
          setImportResult({ open: true, message: err.message, severity: 'error' });
        }
      };
      reader.readAsBinaryString(file);
      e.target.value = '';
    }, [dispatch]);

    return (
        <div>

            <Typography sx={{
                textAlign: 'left',
                color: theme.palette.secondary.main,
                width: '200px',
                fontWeight: 'bold',
                marginBottom: '3%'
            }} >List des prix</Typography   >
            <AddPartPrice />
            <Button variant="outlined" sx={{ ml: 2, borderColor: theme.palette.secondary.main }} onClick={downloadTemplate}>
              Modèle Excel
            </Button>
            <Button variant="outlined" component="label" sx={{ ml: 1, borderColor: theme.palette.secondary.main }}>
              Importer Excel
              <input type="file" hidden accept=".xlsx,.xls" onChange={handleFileUpload} />
            </Button>
            <br /> <br />

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
            <Snackbar open={importResult.open} autoHideDuration={4000} onClose={() => setImportResult({ ...importResult, open: false })}>
              <Alert severity={importResult.severity} onClose={() => setImportResult({ ...importResult, open: false })}>
                {importResult.message}
              </Alert>
            </Snackbar>
        </div>
    )
}
