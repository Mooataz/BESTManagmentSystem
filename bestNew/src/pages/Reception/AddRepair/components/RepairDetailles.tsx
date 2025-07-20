import * as React from 'react';
import Stack from '@mui/material/Stack';
import { useAppDispatch } from '../../../../Redux/hooks';
import { getAccessory } from '../../../../Redux/Actions/Administration/AccessoryActions';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../Redux/store';
import { getListFault } from '../../../../Redux/Actions/Administration/ListFaultActions';
import { FormControl, FormLabel, Input } from '@mui/material';
import { CustomAutocomplete } from '../../../../Componants/Global/CustomAutocomplete';
import CustomCheckBox from '../../../../Componants/Global/CustomCheckBox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import { CustomCheckboxSelector } from '../../../../Componants/Global/CustomCheckboxSelector';
import type { Customer, RepairForm } from '../../../../Redux/Types/repairTypes';
import { getCustomerRequest } from '../../../../Redux/Actions/Administration/RequestCustomerActions';
import { getDistributers } from '../../../../Redux/Actions/Administration/Distributer';
export default function RepairDetailles({
  onRepairChange,
}: {
  onRepairChange: (repair: RepairForm) => void;
}) {
  const dispatch = useAppDispatch();
  const accessory = useSelector((state: RootState) => state.accessory.accessory);
  const ListFault = useSelector((state: RootState) => state.listfault.listFault);
  const customerRequests = useSelector((state: RootState) => state.CustomerRequest.customerRequest);
  const user = useSelector((state: RootState) => state.user);
  React.useEffect(() => {
    dispatch(getAccessory());
    dispatch(getListFault());
    dispatch(getCustomerRequest())
  

  }, [dispatch])

  interface FormDataa {
  deviceStateReceive: string;
  accessoryIds: number[];
  listFaultIds: number[];
  customerRequestIds: number[];
  remark: string;
  userId: number |null;
  actuellybranch: number    | undefined;
}
const [formData, setFormData] = React.useState <FormDataa>({
  deviceStateReceive:'',
  accessoryIds:[],
  listFaultIds:[],
  customerRequestIds:[],
  remark:'',
  userId:user?.id ,
 actuellybranch: user?.branch?.id ?? 1,  
   
})

 React.useEffect(() => {
   
    onRepairChange(formData);
  }, [formData]);
  const handleSelectionListFault = (ids: number[]  ) => {
    setFormData({...formData, listFaultIds:ids });
  };

  const handleSelectionCustomerRequest = (ids: number[] ) => {
    setFormData({...formData, customerRequestIds:ids });
  };

  const handleChange = (event: SelectChangeEvent) => {
    setFormData({...formData, deviceStateReceive:event.target.value })
     
  };
   
  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
      <form>

        <CustomCheckboxSelector
          data={accessory}
          displayFields={['name']}
          returnField="id"
          title='Accessoire'
          //maxSelection={3}
          onChange={(values) => setFormData({...formData, accessoryIds:values })}
        />



        <FormControl>
          <CustomAutocomplete
            data={ListFault}
            displayFields={['name']}
            idField="id"
            label="List des problème"
            multiple={true}

            onChange={handleSelectionListFault}

          />
        </FormControl> <br /> <br />

        <FormControl>
          <CustomAutocomplete
            data={customerRequests}
            displayFields={['name']}
            idField="id"
            label="Demande client"
            multiple={true}

            onChange={handleSelectionCustomerRequest}

          />
        </FormControl> <br /> <br />
        <FormLabel>Etat de l'appareille</FormLabel><br />
        <FormControl variant="standard" sx={{ m: 1, minWidth: 400 }}>

          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            onChange={handleChange}

          >

            <MenuItem value={'Bon condition'}>Bon condition</MenuItem>
            <MenuItem value={'Rayé'}>Rayé</MenuItem>
            <MenuItem value={'Cassè'}>Cassè</MenuItem>
            <MenuItem value={'Brulè'}>Brulè</MenuItem>
            <MenuItem value={'Trace d\'intervention'}>Trace d'intervention</MenuItem>
          </Select>
        </FormControl> <br/> <br/>

        <FormLabel>Remarque</FormLabel><br />
          <Input id="standard-basic"
          sx={{width:'400px'}}
            value={formData.remark}
            onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
        />
          
      </form>


    </Stack>
  );
}
