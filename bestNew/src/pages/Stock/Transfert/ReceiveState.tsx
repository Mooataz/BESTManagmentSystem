import { Box, Tab, Typography } from '@mui/material';
import React from 'react'
import theme from '../../../Theme/theme';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ListAccepter from './ListAccepter';
import EnAttente from './EnAttente';

export default function ReceiveState() {
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
            }}> Accepte un transfert.</Typography>
         <Box sx={{ width: '1500px', typography: 'body1' }}>
      <TabContext value={value} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example"     sx={{width:'fullWidth'   , marginLeft:'30%'  }}  >
            <Tab label="List accepter" value="1" sx={{width:'700px' }}/>
            <Tab label="En attente." value="2" sx={{width:'700px'}}/>
            
          </TabList> 
        </Box>
        <TabPanel value="1"  ><ListAccepter /></TabPanel>
        <TabPanel value="2" ><EnAttente /></TabPanel>
         
      </TabContext>
    </Box>
    </div>
  )
}
