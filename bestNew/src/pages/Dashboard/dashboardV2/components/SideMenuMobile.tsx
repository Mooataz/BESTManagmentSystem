import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
  import MenuContent from './MenuContent';
 import type { RootState } from '../../../../Redux/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../../Redux/hooks';
 import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { handleLogout } from '../../../../Redux/Actions/authAction';

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {
  const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const { t } = useTranslation();
    const user = useSelector((state: RootState) => state.user);
   const onLogoutClick = async () => {
     try {
       await handleLogout();
       navigate('/');
     } catch (error) {
       alert('Erreur lors de la déconnexion');
     }
   }
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Avatar
              sizes="small"
              alt={user.name}
              src="/static/images/avatar/7.jpg"
              sx={{ width: 24, height: 24 }}
            />
            <Typography component="p" variant="h6">
              {user.name}
            </Typography>
          </Stack>
           
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        
        <Stack sx={{ p: 2 }}>
          <Button variant="outlined" 
                  fullWidth 
                  startIcon={<LogoutRoundedIcon />}
                   onClick={onLogoutClick}>
            Se dèconnecter
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
