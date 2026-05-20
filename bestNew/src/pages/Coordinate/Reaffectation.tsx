import React from 'react'
import theme from '../../Theme/theme'
import { Box, Tab, Typography } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import ChangeAssign from './ChangeAssign'
import DeleteAssign from './DeleteAssign'

export default function Reaffectation() {
        const [value, setValue] = React.useState('1');
    
      const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
      };
  return (
    <div><br/><br/>
    <Typography sx={{
                textAlign: 'left',
                color: theme.palette.secondary.main,
                width: '200px',
                fontWeight: 'bold',
                marginBottom: '3%'
            }}> Modifier l'affectation</Typography>
         <Box sx={{ width: '1500px', typography: 'body1' }}>
      <TabContext value={value} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider'  }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example"     sx={{width:'fullWidth'   , marginLeft:'30%' ,color:theme.palette.secondary.main  }}  >
            <Tab label="Ré-affectation" value="1" sx={{width:'700px' }}/>
            <Tab label="Annuler l'affectation." value="2" sx={{width:'700px'}}/>
            
          </TabList> 
        </Box>
        <TabPanel value="1"  ><ChangeAssign /></TabPanel>
        <TabPanel value="2" ><DeleteAssign /></TabPanel>
         
      </TabContext>
    </Box>
      
    </div>
  )
}
