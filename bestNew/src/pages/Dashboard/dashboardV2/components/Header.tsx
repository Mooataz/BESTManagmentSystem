import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

import Search from './Search';
import { Avatar, Box, createTheme, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { VscStarEmpty } from 'react-icons/vsc';
import { TbPassword } from 'react-icons/tb';
import { BiLogOut } from 'react-icons/bi';
 import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../Redux/store';
import { setBranch } from '../../../../Redux/auth/userSlice';
import type { Agency } from '../../../../Redux/Types/Stock';
import { handleLogout } from '../../../../Redux/Actions/authAction';
import SelectAgencie from '../../../../Componants/getAgence';
 import theme from '../../../../Theme/theme'
import { getAgencies } from '../../../../Redux/Actions/Administration/AgenciesActions';
import { CustomAutocomplete } from '../../../../Componants/Global/CustomAutocomplete';
export default function Header() {
const { t } = useTranslation();
const navigate = useNavigate()
const dispatch = useAppDispatch();
 
 // const [agencies, setAgencies] = React.useState<Agency[]>([]);
  const agencies   = useSelector((state: RootState) => state.agencies.Agency)
   const company   = useSelector((state: RootState) => state.company.company)
  React.useEffect(() => {
    dispatch(getAgencies()  )
    
  }, [dispatch]);  
 const user = useSelector((state: RootState) => state.auth.user);
 
         const roleColors: Record<string, string> = {
    Administrateur: 'gold',
    Reception: 'pink',
    Coordinateur: 'green',
    Technicien: 'blue',
    Gestionnaire_de_stocks: 'purple',
  };
      const onLogoutClick = async () => {
        try {
          await handleLogout();
          navigate('/');
        } catch (error) {
          alert('Erreur lors de la déconnexion');
        }
      };
  const handleNavigation = () => {
    if (user) {
      navigate(`/dashboard/Updatepassword/${user.id}`);
    }
  };
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const opens = Boolean(anchorEl);
        const handleClick = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
          setAnchorEl(null);
        };

 

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <Typography variant="h4" component="h1" sx={{ color: theme.palette.primary.main }}>
              {company?.name} 
            </Typography>
      <Stack direction="row" sx={{ gap: 1 }}>
         {user?.role.includes('Administrateur') ? (
         
           <SelectAgencie 
           
            agencies={agencies}
            onSelect={(agency: any) => {
              if (agency) {
                dispatch(setBranch(agency)); // Met à jour Redux avec la nouvelle agence
              }
            }}
          />  

        ) : (
          <Typography  >
           {t('Agence')} : {(typeof user?.branch === 'object' && 'name' in user.branch) ? user.branch.name : '-'}

          </Typography>
        )}

         
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />
                         <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
         
        <Tooltip title={"Compte " + user?.name}>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={opens ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={opens ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>{user?.name[0]}</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={opens}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> {user?.name}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ul style={{ listStyle: 'none', margin: 0, paddingLeft: '1rem' }}>
            {user?.role.map((role: string, index: number) => (
              <li key={index}>
                <VscStarEmpty color={roleColors[role]} /> {role}
              </li>
            ))}
          </ul>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleNavigation}>
          <ListItemIcon>
             <TbPassword />
          </ListItemIcon>
          {t('Upassword')}
        </MenuItem>
          <Divider />
        <MenuItem onClick={onLogoutClick}>
          <ListItemIcon>
            <BiLogOut fontSize="small" />
          </ListItemIcon>
           {t('Logout')}
        </MenuItem>
      </Menu>
    </React.Fragment>
      </Stack>
    </Stack>
  );
}
