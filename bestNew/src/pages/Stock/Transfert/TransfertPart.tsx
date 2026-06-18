import React from 'react'
import AddTransfert from './AddTransfertpart'
import AddTransfertpart from './AddTransfertpart'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Typography } from '@mui/material';
import theme from '../../../Theme/theme';
import ListSendingTransfert from './ListSendingTransfert';
import AcceptePart from './AcceptePart';
 
export default function TransfertPart() {
    const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <div> <br/><br/>
    <Typography sx={{
                textAlign: 'left',
                color: theme.palette.secondary.main,
                width: '200px',
                fontWeight: 'bold',
                marginBottom: '3%'
            }}> Envoyez un transfert.</Typography>
         <Box sx={{ width: '1500px', typography: 'body1' }}>
      <TabContext value={value} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example"     
          sx={{width:'fullWidth'   , marginLeft:'10%'  }}  >
            <Tab label="List d'envoie"            value="1" sx={{width:'700px' }}/>
            <Tab label="Accepter un transfert."   value="2" sx={{width:'700px'}}/>
            <Tab label="Appliquez un transfert."  value="3" sx={{width:'700px'}}/>
            
          </TabList> 
        </Box>
        <TabPanel value="1"  ><ListSendingTransfert /></TabPanel>
        <TabPanel value="2"  ><AcceptePart /></TabPanel>
        <TabPanel value="3" ><AddTransfertpart onCreated={() => setValue('1')} /></TabPanel>
         
      </TabContext>
    </Box>
    </div>
  )
}
