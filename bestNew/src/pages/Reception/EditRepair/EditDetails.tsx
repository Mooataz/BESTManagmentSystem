import React from 'react'
import type { RootState } from '../../../Redux/store';
import { useSelector } from 'react-redux';
import { getAccessory } from '../../../Redux/Actions/Administration/AccessoryActions';
import { getListFault } from '../../../Redux/Actions/Administration/ListFaultActions';
import { getCustomerRequest } from '../../../Redux/Actions/Administration/RequestCustomerActions';
import { useAppDispatch } from '../../../Redux/hooks';
import { Box, Button, FormLabel, Input, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useNotification } from '../../../Componants/NotificationContext';
import type { RepairForm } from '../../../Redux/Types/repairTypes';
import { getRepairsByBranch, UpdateOneRepair } from '../../../Redux/Actions/Reception/repairAction';
import { CustomAutocomplete } from '../../../Componants/Global/CustomAutocomplete';
import { CustomCheckboxSelector } from '../../../Componants/Global/CustomCheckboxSelector';

export default function EditDetails(idRepair:any  ) {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const userr = useSelector((state: RootState) => state.auth.user);
    const user = useSelector((state: RootState) => state.user);
    const accessory = useSelector((state: RootState) => state.accessory.accessory);
    const ListFault = useSelector((state: RootState) => state.listfault.listFault);
    const customerRequests = useSelector((state: RootState) => state.CustomerRequest.customerRequest);
React.useEffect(() => {
  if (isNaN(Number(idRepair.idRepair))) {
     
    return;
  }
}, [idRepair]);
    React.useEffect(() => {
        dispatch(getAccessory());
        dispatch(getListFault());
        dispatch(getCustomerRequest())


    }, [dispatch])
    interface FormDataa {
        id: number;
        deviceStateReceive?: string;
        accessoryIds?: number[];
        listFaultIds?: number[];
        customerRequestIds?: number[];
        remark?: string;
        userId?: number | null;
        actuellybranch?: number | undefined;
    }
    const [formData, setFormData] = React.useState<FormDataa>({
        id: idRepair,
        deviceStateReceive: '',
        accessoryIds: [],
        listFaultIds: [],
        customerRequestIds: [],
        remark: '',
        userId: user?.id,


    })
    const handleSelectionListFault = (ids: number[]) => {
        setFormData({ ...formData, listFaultIds: ids });
    };

    const handleSelectionCustomerRequest = (ids: number[]) => {
        setFormData({ ...formData, customerRequestIds: ids });
    };

    const handleChangeRemark = (event: SelectChangeEvent) => {
        setFormData({ ...formData, deviceStateReceive: event.target.value })

    };
    const handleUpdateRepair = (field: keyof RepairForm, value: any) => {



        dispatch(UpdateOneRepair({ id:   idRepair.idRepair , [field]: value }))

            .then(() => {
                try {
                    const branch = userr?.branch;
                    const branchId = typeof branch === 'number' ? branch : branch?.id;
                  

                    if (branchId !== undefined) {
                        dispatch(getRepairsByBranch(branchId));
                    }

                    notify(`Mis à jour avec succès`, "success");
                } catch (error) {

                    notify("Erreur lors de la mise à jour", "error");
                }

            })

    };
    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: '400px' }}>
                    <CustomCheckboxSelector
                        data={accessory}
                        displayFields={['name']}
                        returnField="id"
                        title='Accessoire'
                        //maxSelection={3}
                        onChange={(values) => setFormData({ ...formData, accessoryIds: values })}
                    />
                </Box>

                <Button
                    size="medium"
                    variant="outlined"
                    color="info"
                    style={{ width: '160px', marginLeft: '14%' }}

                    onClick={() => handleUpdateRepair('accessoryIds', formData.accessoryIds)}
                >
                    Mettre à jour
                </Button>
            </Box> <br />
            <Box sx={{ display: 'flex' }}>
                <CustomAutocomplete
                    data={ListFault}
                    displayFields={['name']}
                    idField="id"
                    label="List des problème"
                    multiple={true}

                    onChange={handleSelectionListFault}

                />
                <Button
                    size="medium"
                    variant="outlined"
                    color="info"
                    style={{ width: '160px', marginLeft: '14%' }}

                    onClick={() => handleUpdateRepair('listFaultIds', formData.listFaultIds)}
                >
                    Mettre à jour
                </Button>
            </Box> <br />

            <Box sx={{ display: 'flex' }}>
                <CustomAutocomplete
                    data={customerRequests}
                    displayFields={['name']}
                    idField="id"
                    label="Demande client"
                    multiple={true}

                    onChange={handleSelectionCustomerRequest}

                />
                <Button
                    size="medium"
                    variant="outlined"
                    color="info"
                    style={{ width: '160px', marginLeft: '14%' }}

                    onClick={() => handleUpdateRepair('customerRequestIds', formData.customerRequestIds)}
                >
                    Mettre à jour
                </Button>
            </Box> <br />

            <FormLabel>Etat de l'appareille</FormLabel><br />
            <Box sx={{ display: 'flex' }}>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    onChange={handleChangeRemark}
                    sx={{ width: '400px' }}
                >

                    <MenuItem value={'Bon condition'}>Bon condition</MenuItem>
                    <MenuItem value={'Rayé'}>Rayé</MenuItem>
                    <MenuItem value={'Cassè'}>Cassè</MenuItem>
                    <MenuItem value={'Brulè'}>Brulè</MenuItem>
                    <MenuItem value={'Trace d\'intervention'}>Trace d'intervention</MenuItem>
                </Select>
                <Button
                    size="medium"
                    variant="outlined"
                    color="info"
                    style={{ width: '160px', marginLeft: '14%' }}

                    onClick={() => handleUpdateRepair('deviceStateReceive', formData.deviceStateReceive)}
                >
                    Mettre à jour
                </Button>
            </Box> <br />

            <FormLabel>Remarque</FormLabel><br />
            <Box sx={{ display: 'flex' }}>
                <Input id="standard-basic"
                    sx={{ width: '400px' }}
                    value={formData.remark}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                />
                <Button
                    size="medium"
                    variant="outlined"
                    color="info"
                    style={{ width: '160px', marginLeft: '14%' }}

                    onClick={() => handleUpdateRepair('remark', formData.remark)}
                >
                    Mettre à jour
                </Button>
            </Box> <br />
        </div>
    )
}
