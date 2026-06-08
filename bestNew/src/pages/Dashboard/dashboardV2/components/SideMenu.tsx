import { API_BASE_URL } from '../../../../services/api';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';
import { IconButton } from '@mui/material';
import { getCompany } from '../../../../Redux/Actions/Administration/Company';
import logoFallback from '../../../../assets/BestV2.png';
import type { Company } from '../../../../Redux/Types/administrationTypes';
import { useDispatch } from 'react-redux';
import type { RootState } from '../../../../Redux/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../Redux/hooks';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
     const dispatch = useAppDispatch();
    const company = useSelector((state: RootState) => state.company.company);    
      React.useEffect(() => {
    dispatch(getCompany());
  }, [dispatch]);
         
      

 
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <IconButton
          size="medium"
          color="info"
          sx={{ display: { xs: 'none', sm: 'inline-flex' }, 
                borderRadius: '30%',
                marginLeft:'70px' }}
        >
          <img  src={company?.logo ? `${API_BASE_URL}/upload/company/${company.logo}` : logoFallback} 
                style={{  width: '145px', 
                          borderRadius: '30px' }} />
        </IconButton>
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />

      </Box>

    </Drawer>
  );
}
