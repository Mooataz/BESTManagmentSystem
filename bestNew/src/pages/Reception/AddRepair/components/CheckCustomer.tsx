import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import { Box, Button, Collapse, FormControl, FormHelperText, IconButton, Input, ListItemButton, ListItemIcon, ListItemText, TextField, Tooltip } from '@mui/material';
import { CustomAutocomplete } from '../../../../Componants/Global/CustomAutocomplete';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import type { Customer } from '../../../../Redux/Types/repairTypes';
import { useAppDispatch } from '../../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../Redux/store';
import { getDistributers } from '../../../../Redux/Actions/Administration/Distributer';
import AddIcon from '@mui/icons-material/Add';
import { getCustomers, getOneCustomer } from '../../../../Redux/Actions/Reception/customerActions';
import { setActuellyBranch } from '../../../../Redux/recptionSlices/repairSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNotification } from '../../../../Componants/NotificationContext';
const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Nom requis'),
  phone: Yup.number()
    .typeError('Numéro invalide')
    .min(20000000, 'Min: 20 000 000')
    .max(99999999, 'Max: 99 999 999')
    .required('Téléphone requis'),
});


export default function CheckCustomer({
  onCustomerChange,
}: {
  onCustomerChange: (customer: Customer) => void;
}) {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const user = useSelector((state: RootState) => state.user);
  const customers = useSelector((state: RootState) => state.customer.customer);
  const distributer = useSelector((state: RootState) => state.distributer.distributer);
  const oneCustomer = useSelector((state: RootState) => state.customer.oneCustomer);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Customer>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      phone: 0,
      distributer: 1,
    }
  });

  const [formCustomer, setFormCustomer] = React.useState<Customer>({
    name: '',
    phone: 0,
    distributer: 1,
  })

  React.useEffect(() => {
    dispatch(getCustomers());
    dispatch(getDistributers());
    dispatch(setActuellyBranch(user?.branch?.id ?? 0));

  }, [dispatch])

  React.useEffect(() => {
    if (formCustomer.phone>=20000000 && formCustomer.phone<=99999999 ){
        onCustomerChange(formCustomer);
    } else {
      notify('Le numèro de tèlèphone doit ètre entre 20000000 et 99999999','error')
    }
    
  }, [formCustomer]);
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
  return (
    <>

      <Grid container spacing={3}>

        <form  /*  onSubmit={handleSubmit(onSubmit)}  */ >
          <CustomAutocomplete
            data={customers}
            displayFields={['phone', 'name']}
            idField="id"
            label="Client"
            multiple={false}

            onChange={handleSelectionCustomer}

          />
          <br /><br />
          <Box sx={{
            display: 'flex',
            marginTop: '2px',
            gap: 4
          }}>

            <FormControl>
              <FormLabel>Nom client</FormLabel>
              <Input id="standard-basic"
                value={formCustomer.name}

                onChange={(e) => setFormCustomer({ ...formCustomer, name: e.target.value })}

              />

            </FormControl>

            <FormControl sx={{
              marginLeft: '20px'
            }}>
              <FormLabel>Téléphone</FormLabel>
                   <Input id="standard-basic"
                type='number'
                
                error={!!errors.phone}
                 
                value={formCustomer.phone}
                onChange={(e) =>   handleSetPhone( Number(e.target.value)  )   }
              />  
              

              {errors.phone && (
                <FormHelperText
                  style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}
                >
                  {errors.phone.message}
                </FormHelperText>
              )}
              <FormHelperText>{errors.phone?.message}</FormHelperText>
            </FormControl>
          </Box>
          <br /><br />

          <CustomAutocomplete
            data={distributer}
            displayFields={['name']}
            idField="id"
            label="Distributeur"
            multiple={false}

            onChange={handleSelectionDistributer}

          />
          <br /><br />





        </form>




      </Grid>
    </>
  );
}
