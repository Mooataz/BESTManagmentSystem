import React, { useEffect, useState } from 'react'
import {
  Modal,
  Box,
  Typography,
  Stack,
  FormControl,
  FormLabel,
  Input,
  DialogActions,
  Button,
  Backdrop,
  Fade,
  Dialog,
  type SelectChangeEvent,
  Select,
  MenuItem,
  DialogTitle,
  DialogContentText
} from '@mui/material';
type EditRepairModelProps = {
  open: boolean;              // ✅ type primitif
  onClose: () => void;        // ✅ c'est une fonction
  idRepair: number;
  isLoading: boolean;         // ✅ type primitif
  onSubmit?: () => void;      // optionnel si tu veux le gérer plus tard
};

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import theme from '../../Theme/theme';
import { useAppDispatch } from '../../Redux/hooks';
import type { RootState } from '../../Redux/store';
import { useSelector } from 'react-redux';
import { getOneRepair, getRepairsByBranch, UpdateOneRepair } from '../../Redux/Actions/Reception/repairAction';
import { CustomAutocomplete } from '../../Componants/Global/CustomAutocomplete';
import type { Customer, Device, RepairForm } from '../../Redux/Types/repairTypes';
import { getCustomers, getOneCustomer, UpdateOneCustomer } from '../../Redux/Actions/Reception/customerActions';
import { getDistributers } from '../../Redux/Actions/Administration/Distributer';
import { unwrapResult } from '@reduxjs/toolkit';
import { setActuellyBranch } from '../../Redux/recptionSlices/repairSlice';
import { useNotification } from '../../Componants/NotificationContext';
import { InputDate } from '../../Componants/Global/InputDate';
import SelectModelByPicture from './AddRepair/components/SelectModelByPicture';
import { getModelsAuthorised } from '../../Redux/Actions/ModelAndAccessory/Models';
import { UpdateOneDevice } from '../../Redux/Actions/Reception/DeviceActions';
import { getAccessory } from '../../Redux/Actions/Administration/AccessoryActions';
import { getListFault } from '../../Redux/Actions/Administration/ListFaultActions';
import { getCustomerRequest } from '../../Redux/Actions/Administration/RequestCustomerActions';
import { CustomCheckboxSelector } from '../../Componants/Global/CustomCheckboxSelector';
import EditDetails from './EditRepair/EditDetails';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}
function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function EditRepairModel({
  open,
  onClose,
  idRepair,
  onSubmit,
  isLoading
}: EditRepairModelProps) {
  const themes = useTheme();
  const [value, setValue] = React.useState(0);
  const dispatch = useAppDispatch();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const oneRepair = useSelector((state: RootState) => state.repair.oneRepair);

  React.useEffect(() => {
    if (open) {
      if (idRepair) {
        dispatch(getOneRepair(idRepair));

      }
    }

  }, [dispatch, idRepair]);
  React.useEffect(() => {
    dispatch(getCustomers());
    dispatch(getDistributers());

  }, [dispatch])
  const distributer = useSelector((state: RootState) => state.distributer.distributer);
  const customers = useSelector((state: RootState) => state.customer.customer);
  const userr = useSelector((state: RootState) => state.auth.user);
  const user = useSelector((state: RootState) => state.user);
  const { notify } = useNotification();


  const [formCustomer, setFormCustomer] = useState<{ id?: number; name?: string; phone: number; distributer?: number }>({ phone: 0, });
  React.useEffect(() => {
    if (user.branch?.id) {
      dispatch(getRepairsByBranch(user.branch?.id))

    }
  }, [dispatch, user.branch?.id])


  const handleSelectionDistributer = (ids: number) => {
    setFormCustomer({ ...formCustomer, distributer: ids });

  };
  const handleSelectionCustomer = async (ids: number) => {
    const result = await dispatch(getOneCustomer(ids))
    const customer = unwrapResult(result);
    const distributerId =
      customer.distributer && typeof customer.distributer === 'object'
        ? customer.distributer.id
        : customer.distributer;
    setFormCustomer({ ...formCustomer, name: customer.name, phone: customer.phone, distributer: distributerId });

  };
  React.useEffect(() => {
    dispatch(getCustomers());
    dispatch(getDistributers());
    dispatch(setActuellyBranch(user?.branch?.id ?? 0));

  }, [dispatch])
  const handleUpdateCustomer = async () => {

    try {
      await dispatch(UpdateOneCustomer(formCustomer as Customer)).then(() => {
        if (user?.branch?.id !== undefined) {
          dispatch(getRepairsByBranch(user.branch.id));
        }
        notify('Mise à jour avec success', "success");
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      notify(errorMessage, "error");
    }

  };

  {/*-------------------------------------------*/ }
  useEffect(() => {
    const deviceCandidate = oneRepair?.device;

    if (deviceCandidate && typeof deviceCandidate === 'object' && 'serialenumber' in deviceCandidate) {
      const device = deviceCandidate as Device;

      setValueDevice({
        id: device.id,
        serialenumber: device.serialenumber,
        purchaseDate: device.purchaseDate,
        model: device.model,
      });
    }
  }, [oneRepair?.device]);
  const models = useSelector((state: RootState) => state.models.models)
  const handlePurchaseDateChange = (newDate: Date) => {
    setValueDevice((prev) => ({
      ...prev!,
      purchaseDate: newDate,
    }));
  };
  React.useEffect(() => {
    dispatch(getModelsAuthorised())
  }, [dispatch]);
  const handleSelectionModel = (ids: number) => {

    setValueDevice((prev) => ({
      ...prev!,
      model: ids,
    }));
  };

  const [valueDevice, setValueDevice] = React.useState<Device>({
    serialenumber: '', purchaseDate: new Date(),
    model: 0
  });
  const handleUpdateDeviceField = (field: keyof Device, value: any) => {
    if (!valueDevice?.id) {
      notify("Identifiant de l'appareil manquant", "error");
      return;
    }

    dispatch(UpdateOneDevice({ id: valueDevice.id, [field]: value }))

      .then(() => {

        const branch = userr?.branch;
        const branchId = typeof branch === 'number' ? branch : branch?.id;

        if (branchId != null) {
          dispatch(getRepairsByBranch(branchId));
        }

        notify(`Mis à jour avec succès`, "success");
      })
      .catch((err: any) => {
        const message = err?.message || "Erreur lors de la mise à jour";
        notify(message, "error");
      });
  };
 




  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { TransitionComponent: Fade } }}
      >
        <Fade in={open} >
          <Box sx={style}>



            <DialogTitle>Modifier les information</DialogTitle>
            <DialogContentText>Rèparation N° : {idRepair}</DialogContentText> <br />

            <Box sx={{ bgcolor: 'background.paper', width: 600 }}>
              <AppBar position="static">
                <Tabs
                  sx={{ bgcolor: theme.palette.secondary.main, }}
                  value={value}
                  onChange={handleChange}
                  indicatorColor="secondary"
                  textColor="inherit"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  <Tab label="Client" {...a11yProps(0)} />
                  <Tab label="Appareille" {...a11yProps(1)} />
                  <Tab label="Dètailles réparation" {...a11yProps(2)} />
                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0} dir={themes.direction}>
                <CustomAutocomplete
                  data={customers}
                  displayFields={['phone', 'name']}
                  idField="id"
                  label="Client"
                  multiple={false}

                  onChange={handleSelectionCustomer}

                /> <br />
                <FormControl>
                  <FormLabel>Nom client</FormLabel>
                  <Input id="standard-basic"
                    value={formCustomer.name}
                    sx={{ width: '400px' }}
                    onChange={(e) => setFormCustomer({ ...formCustomer, name: e.target.value })}

                  />

                </FormControl><br />
                <FormControl  >
                  <FormLabel>Téléphone</FormLabel>
                  <Input id="standard-basic"
                    type='number'
                    sx={underlineInputStyles}


                    value={formCustomer.phone}
                    onChange={(e) => setFormCustomer({ ...formCustomer, phone: Number(e.target.value) })}
                  />



                </FormControl> <br /> <br />
                <CustomAutocomplete
                  data={distributer}
                  displayFields={['name']}
                  idField="id"
                  label="Distributeur"
                  multiple={false}

                  onChange={handleSelectionDistributer}

                /><br />

                <Button onClick={() => handleUpdateCustomer()}
                  fullWidth
                >Mettre à jour</Button>
              </TabPanel>
              <TabPanel value={value} index={1} dir={themes.direction}>
                <FormLabel>IMEI</FormLabel> <br />

                <Box sx={{ display: 'flex' }}>
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
                        notify("Le numéro de série doit contenir exactement 15 chiffres OU 12 caractères alphanumériques.", "error");
                      }
                    }}
                  />
                  <Button
                    size="medium"
                    variant="outlined"
                    color="info"
                    style={{ width: '160px', marginLeft: '14%' }}
                    loading={isLoading}
                    onClick={() => handleUpdateDeviceField('serialenumber', valueDevice.serialenumber)}
                  >
                    Mettre à jour
                  </Button>
                </Box>


                <br /><br />
                <FormLabel>Date d'achat</FormLabel><br /><br />
                <Box sx={{ display: 'flex' }}>
                  <FormControl>

                    <InputDate onChange={handlePurchaseDateChange} />
                  </FormControl>

                  <Button
                    size="medium"
                    variant="outlined"
                    color="info"
                    style={{ width: '160px', marginLeft: '14%' }}
                    loading={isLoading}
                    onClick={() => handleUpdateDeviceField('purchaseDate', valueDevice.purchaseDate)}
                  >
                    Mettre à jour
                  </Button>

                </Box>

                <br /><br />

                <FormLabel>Modéle</FormLabel>   <br />
                <Box sx={{ display: 'flex' }}>
                  <Box   >
                    <CustomAutocomplete

                      data={models}
                      displayFields={['brand.name', 'name']}
                      idField="id"
                      label="Les modèles"
                      multiple={false}

                      onChange={handleSelectionModel}

                    /><br />
                    <SelectModelByPicture onSelectModel={handleSelectionModel} />
                  </Box>
                  <Button
                    size="medium"
                    variant="outlined"
                    color="info"
                    style={{ width: '160px', marginLeft: '2%' }}
                    loading={isLoading}
                    onClick={() => handleUpdateDeviceField('model', valueDevice.model)}
                  >
                    Mettre à jour
                  </Button>
                </Box>





                <br />

              </TabPanel>
              <TabPanel value={value} index={2} dir={themes.direction}>




                {/* <EditDetails idRepair={Number(idRepair)} /> */}

                {typeof idRepair === 'number' && !isNaN(idRepair) ? (
                  <EditDetails idRepair={Number(idRepair)} />
                ) : (
                  <Typography color="error">ID de réparation invalide</Typography>
                )}

              </TabPanel>
            </Box>
            <DialogActions>
              <Button onClick={() => onClose()}>Fermer</Button>
            </DialogActions>

          </Box>

        </Fade>


      </Modal>
    </div>
  );
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
  width: '400px',

};  