import React, { useCallback, useMemo, useState } from 'react'
import { getByBranchStep } from '../../Redux/Actions/Reception/repairAction';
import { useAppDispatch } from '../../Redux/hooks';
import { useNotification } from '../../Componants/NotificationContext';
import type { RootState } from '../../Redux/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { Customer, OutputListForm, RepairForm, TableAction } from '../../Redux/Types/repairTypes';
import { Box, Button, Checkbox, FormControl, FormLabel, Grid, Input, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import theme from '../../Theme/theme';
import DynamicTable from '../../Componants/Global/TableComponat';
import { addHistoryRepair } from '../../Redux/Actions/Reception/History';
import { CustomAutocomplete } from '../../Componants/Global/CustomAutocomplete';
import { AddCustomer, getCustomers, getOneCustomer } from '../../Redux/Actions/Reception/customerActions';
import { getDistributers } from '../../Redux/Actions/Administration/Distributer';
import { setActuellyBranch } from '../../Redux/recptionSlices/repairSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { addOutPut } from '../../Redux/Actions/Reception/OutputRepairsActions';

export default function Recuperation() {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const userr = useSelector((state: RootState) => state.auth.user);
    const repairs = useSelector((state: RootState) => state.repair.repairs)
    
    const [results, setResults] = useState<RepairForm[]>([]);

    const getLastStep = (history: any[] = []) => {
        if (!Array.isArray(history) || history.length === 0) return '-';

        const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return sorted[0]?.step ?? '-';
    };

    if (!userr?.id || !userr?.branch) return;

    const branchId = typeof userr.branch === 'object' ? userr.branch.id : userr.branch;
    if (!branchId || isNaN(userr.id)) return;

    React.useEffect(() => {
        // Vérifier si userr ou branchId est absent
        if (!userr?.id || !userr?.branch) return;

        const branchId = typeof userr.branch === 'object' ? userr.branch.id : userr.branch;
        if (!branchId || isNaN(userr.id)) return;

        dispatch(getByBranchStep({
            branch: branchId,
            step: 'Prêt à récupérer'
        }))
            .then((resultAction) => {
                if (getByBranchStep.fulfilled.match(resultAction)) {
                    setResults(resultAction.payload);
                } else {
                    notify(
                        `Erreur lors du chargement : ${resultAction.payload}`,
                        'error'
                    );
                }
            });

    }, [dispatch, userr, notify]);
    //------------------------------------------
    const [formCustomer, setFormCustomer] = React.useState<Customer>({
        name: '',
        phone: 0,
        distributer: 1,
    })
    const customers = useSelector((state: RootState) => state.customer.customer);
    const distributer = useSelector((state: RootState) => state.distributer.distributer);
    React.useEffect(() => {
        dispatch(getCustomers());
        dispatch(getDistributers());
        dispatch(setActuellyBranch(branchId ?? 0));

    }, [dispatch])

    const handleSelectionDistributer = (ids: number) => {
        setFormCustomer({ ...formCustomer, distributer: ids });

    };
    const handleSelectionCustomer = async (ids: number) => {
        const result = await dispatch(getOneCustomer(ids))
        const customer = unwrapResult(result);
        setFormCustomer({ ...formCustomer, name: customer.name, phone: customer.phone, distributer: customer.distributer });

    };
    const handleSetPhone = async (nb: number) => {
        setFormCustomer({ ...formCustomer, phone: nb })
    }
    const [selected, setSelected] = useState<number[]>([]);
    const [returned, setReturned] = useState<OutputListForm>({
        date: new Date(),
        remark: '',
        user: userr.id,
        customer: 0,
        repairIds: [],
    })
    const Returned = async () => {
        const resCustomer = await dispatch(AddCustomer(formCustomer));

        if (AddCustomer.fulfilled.match(resCustomer)) {
            const payloadCustomerId = resCustomer.payload.id || 0;

            // On crée un objet final à envoyer au backend
            const outputData: OutputListForm = {
                ...returned,
                customer: payloadCustomerId,
                repairIds: selected
            };

            const resAddOutPut = await dispatch(addOutPut(outputData));

            if (addOutPut.fulfilled.match(resAddOutPut)) {
                outputData.repairIds?.forEach((item) => {
                    dispatch(addHistoryRepair({
                        date: new Date(),
                        step: 'Récupérer',
                        user: { id: userr.id || 0 },
                        repair: item || 0
                    }));
                });

                notify('Récupération terminée', 'success');

                dispatch(getByBranchStep({
                    branch: branchId,
                    step: 'Prêt à récupérer'
                }))
                    .then((resultAction) => {
                        if (getByBranchStep.fulfilled.match(resultAction)) {
                            setResults(resultAction.payload);
                        } else {
                            notify(`Erreur lors du chargement : ${resultAction.payload}`, 'error');
                        }
                    });
            }
        }
    };


        const [filters, setFilters] = useState({

        id: [] as string[],
        customername: [] as string[],
        customerphone: [] as number[],
        deviceid: [] as number[],
        deviceserialenumber: [] as string[],
        devicemodelname: [] as string[],
        devicemodelbrandname: [] as string[],
        distributername: [] as string[],
    });
 const filteredRows = useMemo(() => {
  return results.filter((row: any) => {
    return (
      (filters.id.length === 0 || filters.id.includes(String(row.id))) &&

      (filters.customername.length === 0 || filters.customername.includes(row.customer?.name)) &&

      (filters.customerphone.length === 0 || filters.customerphone.includes(Number(row.customer?.phone))) &&

      (filters.deviceid.length === 0 || filters.deviceid.includes(Number(row.device?.id))) &&

      (filters.deviceserialenumber.length === 0 || filters.deviceserialenumber.includes(row.device?.serialenumber)) &&

      (filters.devicemodelname.length === 0 || filters.devicemodelname.includes(row.device?.model?.name)) &&

      (filters.devicemodelbrandname.length === 0 || filters.devicemodelbrandname.includes(row.device?.model?.brand?.name)) &&

      (filters.distributername.length === 0 || filters.distributername.includes(row.customer?.distributer?.name))
    );
  });
}, [results, filters]);

const getUniqueOptions = (key: keyof FiltersType): string[] => {
  const values = results.flatMap((row: any) => {
    switch (key) {
      case 'customername':
        return row.customer?.name ? [row.customer.name] : [];
      case 'customerphone':
        return row.customer?.phone ? [String(row.customer.phone)] : [];
        
      case 'deviceid':
        return row.device?.id ? [String(row.device.id)] : [];
      case 'deviceserialenumber':
        // ⚠️ ton DynamicTable montre "device.serialenumber" (avec un "e" minuscule)
        return row.device?.serialenumber ? [row.device.serialenumber] : [];
      case 'devicemodelname':
        return row.device?.model?.name ? [row.device.model.name] : [];
      case 'devicemodelbrandname':
        return row.device?.model?.brand?.name ? [row.device.model.brand.name] : [];
      case 'id':
        return row.id ? [String(row.id)] : [];
        case 'distributername':
  return row.customer?.distributer?.name ? [row.customer.distributer.name] : [];

      default:
        return [];
    }
  });

  return Array.from(new Set(values)).sort();
};



    const handleFilterChange = <K extends keyof FiltersType>(
        field: K,
        value: string[]
    ) => {
        // Si le filtre est censé contenir des nombres, on convertit les strings en number
        const parsedValue =
            field === 'customerphone' || field === 'deviceid'
                ? (value.map(Number) as FiltersType[K])
                : (value as FiltersType[K]);

        setFilters({ ...filters, [field]: parsedValue });
    };



   
    type FiltersType = {
        id: string[];
        customername: string[];
        customerphone: number[];
        deviceid: number[];
        deviceserialenumber: string[];
        devicemodelname: string[];
        devicemodelbrandname: string[];
          distributername: string[];
    };

    const renderMultiSelect = <K extends keyof FiltersType>(label: string, field: K) => (
        <Grid sx={{ width: '200px' }}>
            <FormControl fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select
                    multiple
                    value={filters[field] as any}
                    onChange={(e) => handleFilterChange(field, e.target.value as string[])}

                    input={<OutlinedInput label={label} />}
                    renderValue={(selected) => (selected as any[]).join(', ')}
                    MenuProps={{
                        PaperProps: {
                            style: { maxHeight: 300, width: '200px' },
                        },
                    }}
                >
                    {getUniqueOptions(field).map((option) => (
                        <MenuItem key={option} value={option}>
                            <Checkbox checked={(filters[field] as any).includes(option)} />
                            <ListItemText primary={option} />
                        </MenuItem>
                    ))}

                </Select>
            </FormControl>
        </Grid>
    );

    return (
        <Box>
            <Typography
                sx={{
                    textAlign: 'left',
                    fontWeight: 'bold',
                    marginBottom: '3%',
                    color: theme.palette.secondary.main
                }} >Rècuperation</Typography   >
            <br />
            <CustomAutocomplete
                data={customers}
                displayFields={['phone', 'name']}
                idField="id"
                label="Client"
                multiple={false}

                onChange={handleSelectionCustomer}

            /> <br />
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-around'
            }}>
                <br />
                <FormControl>
                    <FormLabel>Nom client</FormLabel>
                    <Input id="standard-basic"
                        value={formCustomer.name}
                        onChange={(e) => setFormCustomer({ ...formCustomer, name: e.target.value })} />
                </FormControl>
                <br />
                <FormControl>
                    <FormLabel>Téléphone</FormLabel>
                    <Input id="standard-basic"
                        type='number'
                        value={formCustomer.phone}
                        onChange={(e) => handleSetPhone(Number(e.target.value))}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Distributeur </FormLabel>

                    <CustomAutocomplete
                        data={distributer}
                        displayFields={['name']}
                        idField="id"
                        label="Distributeur"
                        multiple={false}
                        onChange={handleSelectionDistributer}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Remarque</FormLabel>
                    <Input id="standard-basic"
                        value={returned.remark}
                        onChange={(e) => setReturned({ ...returned, remark: e.target.value })}
                    />
                </FormControl>
            </Box> <br />

            <Button onClick={Returned}
                sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    width: '100%',
                    ":hover": { backgroundColor: theme.palette.secondary.main }
                }}
            >Rècuperer</Button> <br /> <br />

            <Grid container spacing={2} sx={{ mb: 2 }}>
                {renderMultiSelect('Reparation', 'id')}
                {renderMultiSelect('Nom client', 'customername')}
                {renderMultiSelect('Téléphone', 'customerphone')}
                {renderMultiSelect('Distributeur', 'distributername')} 
                {renderMultiSelect('Appareille n°', 'deviceid')}
                {renderMultiSelect('Imei', 'deviceserialenumber')}
                {renderMultiSelect('Modéle', 'devicemodelname')}
                {renderMultiSelect('Marque', 'devicemodelbrandname')}
            </Grid>



            <DynamicTable
                rows={filteredRows.map((r:any) => ({
                    ...r,
                    lastStep: getLastStep(r.historyRepair)
                }))}

                columnLabels={{
                    'id': 'Reparation',
                    'customer.name': 'Nom client',
                    'customer.phone': 'Téléphone',
                    'device.id': 'Appareille n°',
                    'device.serialenumber': 'Imei',
                    'device.model.brand.name': 'Marque',
                    'device.model.name': 'Modéle',
                    'deviceStateReceive': 'État appareille',
                    lastStep: 'Dernier état',
                }}

                columnsToShow={['id',
                    'customer.name',
                    'customer.phone',
                    'device.id',
                    'device.serialenumber',
                    'device.model.brand.name',
                    'device.model.name',
                    'deviceStateReceive',
                    'lastStep'
                ]}

                enableChecked={true}
                onChecked={setSelected}

            />
        </Box>
    )
}
