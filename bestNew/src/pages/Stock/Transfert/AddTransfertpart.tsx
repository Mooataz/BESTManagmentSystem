import { Box, Button, Checkbox, FormControl, FormLabel, Grid, Input, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import type { TransfertPR, TypeBranchTransfert } from '../../../Redux/Types/Stock';
import { getAgencies } from '../../../Redux/Actions/Administration/AgenciesActions';
import { CustomAutocomplete } from '../../../Componants/Global/CustomAutocomplete';
import { getTotransfert } from '../../../Redux/Actions/stock/EtatStockActions';
import { AddOneTransfert, GetSendTransfert } from '../../../Redux/Actions/stock/TransfertAction';
import DynamicTable from '../../../Componants/Global/TableComponat';

export default function AddTransfertpart() {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const user = useSelector((state: RootState) => state.auth.user);
  const allStockPart = useSelector((state: RootState) => state.stockParts.stockParts)
    const getBranchId = (branch: number | { id: number } | undefined): number | undefined =>
      typeof branch === 'number' ? branch : branch?.id;

    const currentbranch = getBranchId(user?.branch);
  const branches = useSelector((state: RootState) => {
    const allbranch = state.agencies.Agency
  
    return allbranch.filter(branch => branch.id !== currentbranch)
  })


  const handleSelectionBranch = async (ids: number) => {

    setFormtransfert({ ...formtransfert, tobranch: ids });

  };

  useEffect(() => {
    dispatch(getAgencies())
  }, [dispatch, user?.id, currentbranch])

  const [formtransfert, setFormtransfert] = useState<TransfertPR>({
    delivredBy: '',
    sendingDate: new Date(),
    frombranch: currentbranch || 0,
    sendUser: user?.id || 0,
    tobranch: 0,
    stockPartIds: [],
    type: 'Pieces',
    state: 'Encours',
    typePart: '',
    remark: ''

  })

  const [dataTransfert, setDataTansfert] = useState<TypeBranchTransfert>({
    typePart: formtransfert.typePart || '',
    branchId: currentbranch || 0,
  })

  useEffect(() => {
    if (dataTransfert.typePart) {
      dispatch(getTotransfert(dataTransfert))
    }


  }, [currentbranch, dispatch, dataTransfert.typePart])

  const handleSubmit = async () => {
    try {
      const hasStockParts = (formtransfert.stockPartIds ?? []).length > 0;

      if (!hasStockParts) {
        notify("Veuillez sélectionner au moins une pièce", "error");
        return;
      }

      const payload: any = {
        ...formtransfert,
        sendingDate: new Date(),
        typePart: formtransfert.typePart || '',
        stockPartIds: formtransfert.stockPartIds,

        // ✅ Champs requis ou attendus par l'entité
        remark: formtransfert.remark,                    // défaut obligatoire
        receivedDate: null,           // champ nullable mais doit exister
        receiveUser: null,            // champ nullable mais doit exister
      };

      // ❌ Supprime uniquement ce que le backend ne veut pas
      delete payload.stockPart;
      delete payload.repair;

      const result = await dispatch(AddOneTransfert(payload));

      if (AddOneTransfert.fulfilled.match(result)) {
        if (currentbranch) {
          dispatch(GetSendTransfert(currentbranch));
        }
        dispatch(getTotransfert(dataTransfert))
        notify('Transfert ajouté avec succès', 'success');
      } else {
        notify(result.payload as string || 'Erreur lors de l’ajout', 'error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      notify(errorMessage, "error");
    }
  };



  const [filters, setFilters] = useState({
    materialCode: [] as string[],
    description: [] as string[],
    model: [] as string[],
    caseName: [] as string[],

  });
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

        (filters.caseName.length === 0 || filters.caseName.includes(row.bin?.name))

      );
    });
  }, [allStockPart, filters]);


  const handleFilterChange = (field: string, value: string[]) => {
    setFilters({ ...filters, [field]: value });
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

        default:
          return [];
      }
    });
    return Array.from(new Set(values)).sort();
  };
  const renderMultiSelect = (label: string, field: keyof typeof filters) => (
    <Grid sx={{ width: '200px' }} >
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          multiple
          value={filters[field]}
          onChange={(e) => {
            const value = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
            handleFilterChange(field, value as string[]);
          }}

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
  return (
    <Box>
      <Typography sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%' }} >Transfert</Typography   >

      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>

        <FormLabel></FormLabel><br />
        <CustomAutocomplete
          data={branches}
          displayFields={['name']}
          idField="id"
          label="Destination"
          multiple={false}

          onChange={handleSelectionBranch}

        />
        <Box>
          <FormLabel>  Type de pièces </FormLabel><br />
          <Select
            sx={{ width: '300px' }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={formtransfert.typePart}
            onChange={(e) => {
              setFormtransfert({ ...formtransfert, typePart: e.target.value, stockPartIds: [] });
              setDataTansfert({ ...dataTransfert, typePart: e.target.value })
            }}
          >
            <MenuItem value={'Bon'}>Bon</MenuItem>
            <MenuItem value={'Défectueux'}>Défectueux</MenuItem>

          </Select>
        </Box>


        <Box>
          <FormLabel>  Livrer par </FormLabel><br />
          <Input sx={underlineInputStyles} value={formtransfert.delivredBy} onChange={(e) => setFormtransfert({ ...formtransfert, delivredBy: e.target.value })} />
        </Box>
        <Box>
          <FormLabel>  Remarque </FormLabel><br />
          <Input sx={underlineInputStyles} value={formtransfert.remark} onChange={(e) => setFormtransfert({ ...formtransfert, remark: e.target.value })} />
        </Box>
      </Box> <br />


      <Box>
        <Grid container spacing={3} sx={{ mb: 3, marginLeft: '20%' }}>
          {renderMultiSelect('Material Code', 'materialCode')}
          {renderMultiSelect('Pièce', 'description')}
          {renderMultiSelect('Modèle compatible', 'model')}
          {renderMultiSelect('Case', 'caseName')}


        </Grid> <br />

        <DynamicTable
          rows={filteredRows}
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
          enableChecked={true} // ✅ Active la sélection
          onChecked={(ids: number[]) => setFormtransfert({ ...formtransfert, stockPartIds: ids })}
        />

      </Box>


      <Button onClick={handleSubmit}>Confirmer</Button>
    </Box>
  )
}
const underlineInputStyles = {
  '--Input-radius': '0px',
  borderBottom: '2px solid',
  borderColor: 'neutral.outlinedBorder',
  '&:hover': {
    borderColor: 'neutral.outlinedHoverBorder',
  },
  '&::before': {
    border: '1px solid var(--Input-focusedHighlight)',
    transform: 'scaleX(0)',
    left: 0,
    right: 0,
    bottom: '-2px',
    top: 'unset',
    transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
    borderRadius: 0,
  },
  '&:focus-within::before': {
    transform: 'scaleX(1)',
  },
  width: '300px',

};

