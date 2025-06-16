import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useNavigate } from 'react-router-dom';
import {  Box, Button, Stack, Switch, Tooltip, Typography, useColorScheme } from '@mui/material';
import { IconButton } from '@mui/material';
import { getCurrentUser, handleLogout } from '../../api/administration/login';
import { getAgencies } from '../../api/administration/Agencies';
import { getCompany } from '../../api/administration/Company';
import theme from '../../Theme/theme';
import { setBranch } from '../../Redux/auth/userSlice';
 import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { VscStarEmpty } from "react-icons/vsc";
import { TbPassword } from "react-icons/tb";
import SelectAgencie from '../../Componants/getAgence';

 interface Company {
  id: number;
  name: string;
  headquarterslocation: string;
  taxRegisterNumber: string;
  rib: number;
  logo: string;
  bank: string;
  quantityAlertStock: number;
}
interface Agency {
  id: number;
  name: string;
  phone: number;
  email: string;
  location: string;
}
type User = {
  id: number;
  name: string;
  phone: number;
  password: string;
  createdDate: string;
  status: string;
  login: string;
  role: string[];
  branch: Agency
};
function ColorSchemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="small"   color="primary" />;
  }
  return (
    <Tooltip title="Change theme"  >
      <IconButton
        data-screenshot="toggle-mode"
        size="small"
         
        color="primary"
        sx={{ alignSelf: 'center' }}
        onClick={() => {
          if (mode === 'light') {
            setMode('dark');
          } else {
            setMode('light');
          }
        }}
      >
        {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default function Header() {
      const roleColors: Record<string, string> = {
    Administrateur: 'gold',
    Reception: 'pink',
    Coordinateur: 'green',
    Technicien: 'blue',
    Gestionnaire_de_stocks: 'purple',
  };
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [company, setCompany] = React.useState<Company>();
  const [agencies, setAgencies] = React.useState<Agency[]>([]);
    
  const user = useSelector((state: RootState) => state.auth.user);
  const userr = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
 
  React.useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user); // Mise à jour de l'état avec l'utilisateur récupéré
    };

    fetchUser();
  }, []);

  const onLogoutClick = async () => {
    try {
      await handleLogout();
      navigate('/');
    } catch (error) {
      alert('Erreur lors de la déconnexion');
    }
  };
 const fetchUsers = async () => {
    try {
      const usersData = await getCompany();
      setCompany(usersData);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error);
    }
  };

  React.useEffect(() => {
    getAgencies().then((data) => setAgencies(data));
    fetchUsers();
  }, []);
const handleNavigation = () => {
  if (user) {
    navigate(`/dashboard/Updatepassword/${user.id}`);
  }
};

  const { i18n } = useTranslation();
  const { t } = useTranslation();

  // Détecte la langue actuelle
  const isEnglish = i18n.language === 'en';
   // Change la langue quand on toggle
  const handleToggle = () => {
    const newLang = isEnglish ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
        <Box sx={{ display: 'flex',    justifyContent: 'space-between' }}>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          display: { xs: 'none', sm: 'flex' },
        }}
      >
         <IconButton
          size="medium"
           color="info"
          sx={{ display: { xs: 'none', sm: 'inline-flex' }, borderRadius: '30%' }}
        >
          <img   src={company?.logo ? `http://localhost:3000/upload/company/${company.logo}` : "https://via.placeholder.com/150"} style={{ width: '110px',borderRadius: '30px' }} />
        </IconButton>
        <Button
           
          component="a"
          href="/dashboard"
          size="small"
          sx={{ alignSelf: 'center' }}
        >
          {company?.name}
        </Button>
 
      </Stack>
            <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1.5,
          alignItems: 'center',
        }}
      > 
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
            {t('Agence')} : {user?.branch?.name || '-'} 
          </Typography>
        )}

        <Stack direction="row" spacing={2} alignItems="center">
      <Typography  style={{color:theme.palette.primary.main}} >Fr</Typography>

      <Switch
        checked={isEnglish}
        onChange={handleToggle} 
      />

      <Typography  style={{color:theme.palette.secondary.main}}>En</Typography>
    </Stack>
    {/*___________________________________________*/}
     <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
         
        <Tooltip title={"Compte " + user.name}>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>{user?.name[0]}</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
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
          {user?.role.map((role: string) => (
                      <div className='flex flex-item'><VscStarEmpty color={roleColors[role]} /> {role}</div>
                    ))}
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
            <Logout fontSize="small" />
          </ListItemIcon>
           {t('Logout')}
        </MenuItem>
      </Menu>
    </React.Fragment>
    
      </Box>
    </Box>
  )
}
