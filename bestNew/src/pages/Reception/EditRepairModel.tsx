import React from 'react'
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
  Fade
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
import { getOneRepair } from '../../Redux/Actions/Reception/repairAction';
 
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
const oneRepair = useSelector((state:RootState) => state.repair.oneRepair);

React.useEffect(() => {
  if(open){
if (idRepair) {
    dispatch(getOneRepair(idRepair));
    console.log('oneRepair?.customer', oneRepair?.customer)
  }
  }
  
}, [dispatch, idRepair]);  

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
    <Typography id="spring-modal-title" variant="h6" component="h2">
                Modifier les information
              </Typography> <br/>
        <Box sx={{ bgcolor: 'background.paper', width: 600 }}>
      <AppBar position="static">
        <Tabs
         sx={{ bgcolor:theme.palette.secondary.main,}}  
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
         fgh  {Number(oneRepair?.customer)}
      </TabPanel>
      <TabPanel value={value} index={1} dir={themes.direction}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2} dir={themes.direction}>
        Item Three
      </TabPanel>
    </Box>
</Box>

           </Fade>
          
          
          </Modal>
    </div>
  );
}
