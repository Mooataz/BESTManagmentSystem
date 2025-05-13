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
import { getCurrentUser, handleLogout } from '../../../api/login';
import { TbPassword } from "react-icons/tb";





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
    Administarteur: 'gold',
    Reception: 'pink',
    Coordinateur: 'green',
    Technicien: 'blue',
    Gestionnaire_de_stocks: 'purple',
  };
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState<{ name: string; role: string[] }>({ name: '', role: [] });
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

  const [open, setOpen] = React.useState(false);
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
          sx={{ display: { xs: 'none', sm: 'inline-flex' }, borderRadius: '50%' }}
        >
          <img src={BEST} style={{ width: '40px' }} />
        </IconButton>
        <Button
          variant="plain"
          color="neutral"
          component="a"
          href="/dashboard"
          size="sm"
          sx={{ alignSelf: 'center' }}
        >
          Bright Electronic Solutions Technology
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



        <ColorSchemeToggle />
        <Dropdown>
          <MenuButton
            variant="plain"
            size="sm"
            sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '9999999px' }}
          >
            <Avatar alt="Remy Sharp" src="/broken-image.jpg">
              {currentUser.name[0]}
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
                  {currentUser.name[0]}
                </Avatar>
                <Box sx={{ ml: 1.5 }}>
                  <Typography level="title-sm" textColor="text.primary">
                    {currentUser.name}
                  </Typography>
                  <Typography level="body-xs" textColor="text.tertiary">
                    {currentUser.role.map((role: string) => (
                      <div className='flex flex-item'><VscStarEmpty color={roleColors[role]} /> {role}</div>
                    ))}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <ListDivider />
            <MenuItem >


              <TbPassword />
              Modifier mots de passe



            </MenuItem>

            <ListDivider />


            <ListDivider />
            <MenuItem onClick={onLogoutClick}>
              <div style={{ color: 'red' }}>
                <LogoutRoundedIcon />
              </div>

              Se dèconnecter
            </MenuItem>
          </Menu>
        </Dropdown>
      </Box>
    </Box>
  );
}
