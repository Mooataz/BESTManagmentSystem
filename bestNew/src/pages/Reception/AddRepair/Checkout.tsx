import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CheckCustomer from './components/CheckCustomer.tsx';
import RepairDetailles from './components/RepairDetailles.tsx';
import DeviceInfo from './components/DeviceInfo.tsx';
import { useAppDispatch } from '../../../Redux/hooks.ts';
import { AddCustomer } from '../../../Redux/Actions/Reception/customerActions.ts';
import { AddDevice, deviceHasOpenRepair } from '../../../Redux/Actions/Reception/DeviceActions.ts';
import { CreateRepairPDF } from '../../../Redux/Actions/PDFActions.ts';
import { addRepair, getRepairIncomplet } from '../../../Redux/Actions/Reception/repairAction.ts';
import type { Customer, Device, RepairForm } from '../../../Redux/Types/repairTypes.ts';
import type { RootState } from '../../../Redux/store.ts';
import { useSelector } from 'react-redux';
import { useNotification } from '../../../Componants/NotificationContext.tsx';
import PersonIcon from '@mui/icons-material/Person';
import theme from '../../../Theme/theme.ts';
import { ListItemIcon, ListItemText, Table, TableCell, TableHead, TableRow } from '@mui/material';
import TabletAndroidIcon from '@mui/icons-material/TabletAndroid';
import { getOneDistributer } from '../../../Redux/Actions/Administration/Distributer.ts';
import { getOneModel } from '../../../Redux/Actions/ModelAndAccessory/Models.ts';
import { unwrapResult } from '@reduxjs/toolkit';

const steps = ['Information client', 'Information appareille', 'Détailles réparation'];

export default function Checkout(props: { disableCustomTheme?: boolean }) {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const customerInfo = useSelector((state: RootState) => state.repair.tempCustomer);
  const deviceInfo = useSelector((state: RootState) => state.repair.temDevice);
  const user = useSelector((state: RootState) => state.auth.user);
  const oneDistributeur = useSelector((state: RootState) => state.distributer.oneDistributer);
  const oneModel = useSelector((state: RootState) => state.models.Onemodel);
  const repairs = useSelector((state: RootState) => state.repair.repairs)
  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <CheckCustomer onCustomerChange={setDataCustomer} />;
      case 1:
        return <DeviceInfo onDeviceChange={setDataDevice} />;
      case 2:
        return <RepairDetailles onRepairChange={setDataRepair as unknown as (repair: RepairForm) => void} />;
      default:
        throw new Error('Unknown step');
    }
  }
if (!user?.id || !user.branch) return;
  const branchId = typeof user.branch === 'object' ? user.branch.id : user.branch;
  if (!branchId || isNaN(user.id)) return;

  
       

 
  const [dataCustomer, setDataCustomer] = React.useState<Customer>({
    name: '',
    phone: 0,
    distributer: 0,
  });
  const [dataDevice, setDataDevice] = React.useState<Device>({
    serialenumber: '',
    purchaseDate: new Date(),
    model: 0
  });
  const [dataRepair, setDataRepair] = React.useState<RepairForm>({
    deviceStateReceive: '',
    accessoryIds: [],
    listFaultIds: [],
    customerRequestIds: [],
    userId: user?.id ?? 0,
    actuellybranch: branchId ?? 1,
    historyRepair: [],
  });
  const repair = useSelector((state: RootState) => state.repair)

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = async () => {


    switch (activeStep) {
      case 0:
        dispatch(AddCustomer(dataCustomer)).then(() => {
          setActiveStep(activeStep + 1);
          if (dataCustomer.distributer) {
            if (typeof dataCustomer.distributer === 'object' && dataCustomer.distributer !== null) {
              const id = dataCustomer.distributer.id;
              if (typeof id === 'number') {
                dispatch(getOneDistributer(id));
              }
            } else if (typeof dataCustomer.distributer === 'number') {
              dispatch(getOneDistributer(dataCustomer.distributer));
            }
          }


        });
        break;


      case 1:

        const sn = dataDevice?.serialenumber;

        if (!sn) {
          notify('Numéro de série introuvable', 'error');
          return;
        }

        try {
          const resultAction = await dispatch(deviceHasOpenRepair(sn));
          const isInRepair = unwrapResult(resultAction); // ou resultAction.payload
          if (!isInRepair) {
            dispatch(AddDevice(dataDevice)).then(() => {
              if (dataDevice.model !== undefined) {
                if (typeof dataDevice.model === 'number') {
                  dispatch(getOneModel(dataDevice.model));
                }
              }
              setActiveStep(activeStep + 1);
            });
          } else {
            notify('L\'appareil est déjà en réparation', 'error');
            return;
          }
        } catch (error) {
          notify(`Erreur lors de la vérification: ${error}`, 'error');
        }


        break;

      case 2:
        if (!dataRepair.listFaultIds || dataRepair.listFaultIds.length === 0) {
          alert('Please select at least one fault');
          return;
        }

        const body = {
          accessoryIds: dataRepair.accessoryIds,
          listFaultIds: dataRepair.listFaultIds,
          customerRequestIds: dataRepair.customerRequestIds,
          deviceStateReceive: dataRepair.deviceStateReceive,
          remark: dataRepair.remark || '',
          actuellybranch: branchId ?? 0,
          device: repair.temDevice?.id,
          customer: repair.tempCustomer?.id,
          userId: user.id || 0,

        };

        dispatch(addRepair(body)).then((rep: any) => {
          const id = rep.payload.id;
          
          CreateRepairPDF(id);
          setActiveStep(0);
           /* const msg = encodeURIComponent(`vous avéz dèposer votre appareille IMEI: ${repair.temDevice?.serialenumber} chez notre STE`)
          const phNb = repair.tempCustomer?.phone
          const url = `https://wa.me/${phNb}?text=${msg}`;
          window.open(url, '_blank');   */
        });
        break;

      default:
        break;
    }
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  return (




    <Grid
      container
      sx={{
        height: {
          xs: '100%',
          sm: 'calc(100dvh - var(--template-frame-height, 0px))',
        },
        mt: {
          xs: 4,
          sm: 0,
        },
      }}
    >
      <Grid
        size={{ xs: 12, sm: 5, lg: 4 }}
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          backgroundColor: 'background.paper',
          borderRight: { sm: 'none', md: '1px solid' },
          borderColor: { sm: 'none', md: 'divider' },
          alignItems: 'start',
          pt: 15,
          px: 10,
          gap: 4,
        }}
      >

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            width: '100%',
            maxWidth: 500,
          }}
        >
          {customerInfo ? (
            <>
              <ListItemIcon> <PersonIcon sx={{ color: theme.palette.primary.main, marginLeft: '30%' }} /> Client</ListItemIcon>
              <br />
              <Table sx={{ border: '1px solid #ccc' }}>
                <TableRow sx={{ borderBottom: '2px solid #ccc ' }}>
                  <TableCell component="th" scope="row" sx={{ borderTop: '1px solid #ccc', backgroundColor: '#EEEEEE' }}>Nom</TableCell>
                  <TableCell sx={{ borderTop: '1px solid #ccc', width: '400px' }}> {customerInfo.name}</TableCell>
                </TableRow>

                <TableRow sx={{ borderBottom: '2px solid #ccc ' }}>
                  <TableCell component="th" scope="row" sx={{ borderTop: '1px solid #ccc', backgroundColor: '#EEEEEE' }}>Tèlèphone</TableCell>
                  <TableCell sx={{ borderTop: '1px solid #ccc' }}> {customerInfo.phone}</TableCell>
                </TableRow>
                {customerInfo.distributer ? (
                  <TableRow sx={{ borderBottom: '2px solid #ccc ' }}>
                    <TableCell component="th" scope="row" sx={{ borderTop: '1px solid #ccc', backgroundColor: '#EEEEEE' }}>Distributeur</TableCell>
                    <TableCell> {oneDistributeur?.name}</TableCell>
                  </TableRow>
                ) : null}


              </Table>
            </>
          ) : null}
          <br /><br />
          {deviceInfo ? (
            <>
              <ListItemIcon><TabletAndroidIcon sx={{ color: theme.palette.primary.main, marginLeft: '30%' }} /> Appareille</ListItemIcon>
              <br />
              <Table sx={{ border: '1px solid #ccc ' }}>
                <TableRow sx={{ borderBottom: '2px solid #ccc ' }}>
                  <TableCell component="th" scope="row" sx={{ borderTop: '1px solid #ccc', backgroundColor: '#EEEEEE' }} >Imei</TableCell>
                  <TableCell> {deviceInfo.serialenumber}</TableCell>
                </TableRow>
                <TableRow sx={{ borderBottom: '2px solid #ccc ' }}>
                  <TableCell component="th" scope="row" sx={{ borderTop: '1px solid #ccc', backgroundColor: '#EEEEEE' }}>Date d'achat</TableCell>
                  <TableCell>  {new Date(deviceInfo.purchaseDate!).toISOString().split('T')[0]} </TableCell>
                </TableRow>
                <TableRow sx={{ borderBottom: '2px solid #ccc ' }}>
                  <TableCell component="th" scope="row" sx={{ borderTop: '1px solid #ccc', backgroundColor: '#EEEEEE' }}> Modèle</TableCell>
                  <TableCell>
                    {typeof oneModel?.brand === 'object' && !Array.isArray(oneModel.brand)
                      ? oneModel.brand.name
                      : ''}
                    {oneModel?.name}
                  </TableCell>


                </TableRow>
                <TableRow sx={{ borderBottom: '2px solid #ccc ' }}>
                  <TableCell component="th" scope="row" sx={{ borderTop: '1px solid #ccc', backgroundColor: '#EEEEEE' }}> Type de modèle</TableCell>
                  <TableCell>
                    {typeof oneModel?.typeModel === 'object' && !Array.isArray(oneModel.typeModel)
                      ? oneModel.typeModel.description
                      : ''}
                  </TableCell>


                </TableRow>
              </Table></>
          ) : null}
        </Box>
      </Grid>
      <Grid
        size={{ sm: 12, md: 7, lg: 8 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          width: '100%',
          backgroundColor: { xs: 'transparent', sm: 'background.default' },
          alignItems: 'start',
          pt: { xs: 0, sm: 16 },
          px: { xs: 2, sm: 10 },
          gap: { xs: 4, md: 8 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: { sm: 'space-between', md: 'flex-end' },
            alignItems: 'center',
            width: '100%',
            maxWidth: { sm: '100%', md: 600 },
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexGrow: 1,
            }}
          >
            <Stepper
              id="desktop-stepper"
              activeStep={activeStep}
              sx={{ width: '100%', height: 40 }}
            >
              {steps.map((label) => (
                <Step
                  sx={{ ':first-child': { pl: 0 }, ':last-child': { pr: 0 } }}
                  key={label}
                >
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            width: '100%',
            maxWidth: { sm: '100%', md: 600 },
            maxHeight: '720px',
            gap: { xs: 5, md: 'none' },
          }}
        >
          <Stepper
            id="mobile-stepper"
            activeStep={activeStep}
            alternativeLabel
            sx={{ display: { sm: 'flex', md: 'none' } }}
          >
            {steps.map((label) => (
              <Step
                sx={{
                  ':first-child': { pl: 0 },
                  ':last-child': { pr: 0 },
                  '& .MuiStepConnector-root': { top: { xs: 6, sm: 12 } },
                }}
                key={label}
              >
                <StepLabel
                  sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '70px' } }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Stack spacing={2} useFlexGap>
              {'fin'} {/************************************************************/}
            </Stack>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box
                sx={[
                  {
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', sm: 'row' },
                    alignItems: 'end',
                    flexGrow: 1,
                    gap: 1,
                    pb: { xs: 10, sm: 0 },
                    mt: { xs: 1, sm: 0 },
                    mb: '90px',
                  },
                  activeStep !== 0
                    ? { justifyContent: 'space-between' }
                    : { justifyContent: 'flex-end' },
                ]}
              >
                {activeStep !== 0 && (
                  <Button
                    startIcon={<ChevronLeftRoundedIcon />}
                    onClick={handleBack}
                    variant="text"
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  >
                    Ancien
                  </Button>
                )}
                {activeStep !== 0 && (
                  <Button
                    startIcon={<ChevronLeftRoundedIcon />}
                    onClick={handleBack}
                    variant="outlined"
                    fullWidth
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                  >
                    Prècedent
                  </Button>
                )}
                <Button
                  variant="contained"
                  endIcon={<ChevronRightRoundedIcon />}
                  onClick={handleNext}
                  sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                >
                  {activeStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </Grid>
    </Grid>

  );
}
