import * as React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../Redux/store';
import { useAppDispatch } from '../../../../Redux/hooks';
import { AppBar, Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import { tabsClasses } from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';
import { API_BASE_URL } from '../../../../services/api';
import theme from '../../../../Theme/theme';
import logoFallback from '../../../../assets/BestV2.png';
import { TbPassword } from 'react-icons/tb';
import { BiLogOut } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import MenuButton from './MenuButton';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import { VscStarEmpty } from 'react-icons/vsc';
import { getCompany } from '../../../../Redux/Actions/Administration/Company';
import SideMenuMobile from './SideMenuMobile';
 
const StyledToolbar = styled(Toolbar)({
  width: '100%',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '12px',
  flexShrink: 0,
  [`& ${tabsClasses.flexContainer}`]: {
    gap: '8px',
    p: '8px',
    pb: 0,
  },
});

export default function AppNavbar() {
        const roleColors: Record<string, string> = {
    Administrateur: 'gold',
    Reception: 'pink',
    Coordinateur: 'green',
    Technicien: 'blue',
    Gestionnaire_de_stocks: 'purple',
  };
  const [open, setOpen] = React.useState(false);
;
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
 const dispatch = useAppDispatch();
 const user = useSelector((state: RootState) => state.auth.user);
    const company = useSelector((state: RootState) => state.company.company);    
      React.useEffect(() => {
    dispatch(getCompany());
  }, [dispatch]);


  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: 'auto', md: 'none' },
        boxShadow: 0,
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        top: 'var(--template-frame-height, 0px)',
      }}
    >
      <StyledToolbar variant="regular">
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
            gap: 1,
          }}
        > 
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'center', mr: 'auto' }}
          >
            <IconButton
                      size="medium"
                      color="info"
                      sx={{ display: { xs: 'none', sm: 'inline-flex' }, 
                            borderRadius: '30%',
                            marginLeft:'70px' }}
                    >
                      <img  src={company?.logo ? `${API_BASE_URL}/upload/company/${company.logo}` : logoFallback} 
                            style={{  width: '50px', 
                                      borderRadius: '30px' }} />
                    </IconButton>
            <Typography 
                      variant="h4" 
                      component="h1" 
                      sx={{ color: theme.palette.primary.main,
                        marginLeft:'70%' 
                       }}>
              {company?.name} 
            </Typography>
          </Stack>
         
          <ColorModeIconDropdown /> 
          <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </MenuButton>
          
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </Stack>
      </StyledToolbar>
    </AppBar>
  );
}

export function CustomIcon() {
  return (
    <Box
      sx={{
        width: '1.5rem',
        height: '1.5rem',
        bgcolor: 'black',
        borderRadius: '999px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundImage:
          'linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)',
        color: 'hsla(210, 100%, 95%, 0.9)',
        border: '1px solid',
        borderColor: 'hsl(210, 100%, 55%)',
        boxShadow: 'inset 0 2px 5px rgba(255, 255, 255, 0.3)',
      }}
    >
      <DashboardRoundedIcon color="inherit" sx={{ fontSize: '1rem' }} />
    </Box>
  );
}
