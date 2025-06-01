import * as React from 'react';
import { useColorScheme } from '@mui/joy/styles';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import Tooltip from '@mui/joy/Tooltip';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import ListDivider from '@mui/joy/ListDivider';
import { VscStarEmpty } from "react-icons/vsc";
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import BEST from '../../../assets/BEST.png'
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, handleLogout } from '../../../api/administration/login';
import { TbPassword } from "react-icons/tb";
import { getCompany } from '../../../api/administration/Company';
import { getAgencies } from '../../../api/administration/Agencies';
import { AgencieList } from '../../Administration/Users/Employees';
import { useTranslation } from 'react-i18next';
import Switch from '@mui/joy/Switch';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { setBranch } from '../../../Redux/userSlice';
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
    return <IconButton size="sm" variant="outlined" color="primary" />;
  }
  return (
    <Tooltip title="Change theme" variant="outlined">
      <IconButton
        data-screenshot="toggle-mode"
        size="sm"
        variant="plain"
        color="neutral"
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
  return (
    <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'space-between' }}>
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
          size="md"
          variant="outlined"
          color="neutral"
          sx={{ display: { xs: 'none', sm: 'inline-flex' }, borderRadius: '30%' }}
        >
          <img src={company?.logo ? `http://localhost:3000/upload/company/${company.logo}` : "https://via.placeholder.com/150"} style={{ width: '110px' }} />
        </IconButton>
        <Button
          variant="plain"
          color="neutral"
          component="a"
          href="/dashboard"
          size="sm"
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
          <AgencieList
            agencies={agencies}
            onSelect={(agency) => {
              if (agency) {
                dispatch(setBranch(agency)); // Met à jour Redux avec la nouvelle agence
              }
            }}
          />

        ) : (
          <Typography level="body-sm">
            {t('Agence')} : {user?.branch?.name || '-'}
          </Typography>
        )}

<Stack direction="row" spacing={2} alignItems="center">
      <Typography level="body-sm">Fr</Typography>

      <Switch
        checked={isEnglish}
        onChange={handleToggle}
        
      />

      <Typography level="body-sm">En</Typography>
    </Stack>

        <ColorSchemeToggle />
        <Dropdown>
          <MenuButton
            variant="plain"
            size="sm"
            sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '9999999px' }}
          >
            <Avatar alt="Remy Sharp" src="/broken-image.jpg">
              {user?.name[0]}
            </Avatar>
          </MenuButton>
          <Menu
            placement="bottom-end"
            size="sm"
            sx={{
              zIndex: '99999',
              p: 1,
              gap: 1,
              '--ListItem-radius': 'var(--joy-radius-sm)',
            }}
          >
            <MenuItem>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar alt="Remy Sharp" src="/broken-image.jpg">
                  {user?.name[0]}
                </Avatar>
                <Box sx={{ ml: 1.5 }}>
                  <Typography level="title-sm" textColor="text.primary">
                    {user?.name}- 
                  </Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    {user?.role.map((role: string) => (
                      <div className='flex flex-item'><VscStarEmpty color={roleColors[role]} /> {role}</div>
                    ))}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <ListDivider />
            <MenuItem  onClick={handleNavigation}>


              <TbPassword />
              {t('Upassword')}



            </MenuItem>

            <ListDivider />


            <ListDivider />
            <MenuItem onClick={onLogoutClick}>
              <div style={{ color: 'red' }}>
                <LogoutRoundedIcon />
              </div>

              {t('Logout')}
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
    </Box>
  );
}
