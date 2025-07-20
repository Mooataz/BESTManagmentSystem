import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Box, FormLabel, Input } from '@mui/material';
import type { Customer, Device } from '../../../../Redux/Types/repairTypes';
import { useNotification } from '../../../../Componants/NotificationContext';
import { InputDate } from '../../../../Componants/Global/InputDate';
import { useAppDispatch } from '../../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../Redux/store';
import { getModelsAuthorised } from '../../../../Redux/Actions/ModelAndAccessory/Models';
import { CustomAutocomplete } from '../../../../Componants/Global/CustomAutocomplete';
import SelectModelByPicture from './SelectModelByPicture';
import { getDistributers } from '../../../../Redux/Actions/Administration/Distributer';

 

export default function DeviceInfo({
  onDeviceChange,
}: {
  onDeviceChange: (device: Device) => void;
}) {
  const { notify } = useNotification();
  const dispatch = useAppDispatch();
  const models = useSelector( (state: RootState) =>state.models.models)
   const handlePurchaseDateChange = (newDate: Date) => {
  setValueDevice((prev) => ({
    ...prev!,
    purchaseDate: newDate,
  }));
};

React.useEffect( () => {
  dispatch(getModelsAuthorised())
},[dispatch]);
  
 const handleSelectionModel = (ids : number) => {
 
    setValueDevice((prev) => ({
    ...prev!,
    model: ids,
  }));
    };

  const [valueDevice, setValueDevice] = React.useState<Device >({serialenumber:'',purchaseDate: new Date(),  
                                                                        model: 0}); 
   React.useEffect(() => {
    onDeviceChange(valueDevice);
   
  }, [ valueDevice]);
 
 
return (
<>
<form>
 
  <FormLabel>IMEI</FormLabel> <br/>
  <Input
  required
   
  sx={underlineInputStyles}
  value={valueDevice?.serialenumber ?? ""}
  onChange={(e) => {
    const input = e.target.value;
    const clean = input.replace(/[^a-zA-Z0-9]/g, '');

    const isAllDigits = /^\d+$/.test(clean);

    if (
      (isAllDigits && clean.length <= 15) ||
      (!isAllDigits && clean.length <= 12)
    ) {
      setValueDevice({
        ...valueDevice!,
        serialenumber: clean,
      });
    }
  }}
  onBlur={(e) => {
    const value = e.target.value;
    const isAllDigits = /^\d{15}$/.test(value);
    const isAlphaNum = /^[a-zA-Z0-9]{12}$/.test(value);

    if (!(isAllDigits || isAlphaNum)) {
      setValueDevice({
        ...valueDevice!,
        serialenumber: '',
      });
      notify("Le numéro de série doit contenir exactement 15 chiffres OU 12 caractères alphanumériques.","error");
    }
  }}
/><br/><br/>
 
<FormLabel>Date d'achat</FormLabel><br/><br/>
<InputDate onChange={handlePurchaseDateChange} /> <br/><br/>

 <FormLabel>Modéle</FormLabel>   <br/>  
  <Box sx={{marginLeft:'17%'}} >
     <CustomAutocomplete
    
             data={models}
             displayFields={['brand.name','name']}
             idField="id"
             label="Les modèles"
             multiple={false}
 
               onChange={handleSelectionModel}  
 
           /></Box>
 <br/> 
           <SelectModelByPicture onSelectModel={handleSelectionModel}/>
   
</form>
</>
  );
}
const underlineInputStyles = {
    width: 400,
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
     

};