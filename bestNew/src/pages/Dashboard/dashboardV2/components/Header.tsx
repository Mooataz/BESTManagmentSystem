import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

import Search from './Search';
import { Avatar, Badge, Box, createTheme, Divider, IconButton, ListItemIcon, Menu, MenuItem, Paper, Tooltip, Typography } from '@mui/material';
import { VscStarEmpty } from 'react-icons/vsc';
import { TbPassword } from 'react-icons/tb';
import { BiLogOut } from 'react-icons/bi';
 import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../Redux/store';
import { setBranch } from '../../../../Redux/auth/authSlice';
import type { Agency } from '../../../../Redux/Types/Stock';
import { handleLogout } from '../../../../Redux/Actions/authAction';
import SelectAgencie from '../../../../Componants/getAgence';
 import theme from '../../../../Theme/theme'
import { getAgencies } from '../../../../Redux/Actions/Administration/AgenciesActions';
import { CustomAutocomplete } from '../../../../Componants/Global/CustomAutocomplete';
import { getStockAlerts } from '../../../../Redux/Actions/stock/StockAlertActions';
export default function Header() {
const { t } = useTranslation();
const navigate = useNavigate()
const dispatch = useAppDispatch();
 
 // const [agencies, setAgencies] = React.useState<Agency[]>([]);
  const agencies   = useSelector((state: RootState) => state.agencies.Agency)
   const company   = useSelector((state: RootState) => state.company.company)
  const stockAlert = useSelector((state: RootState) => state.stockAlert)
  const user = useSelector((state: RootState) => state.auth.user);
  const branchId = user?.branch && typeof user.branch === 'object' && 'id' in user.branch ? (user.branch as any).id : undefined;

  React.useEffect(() => {
    dispatch(getAgencies())
  }, [dispatch]);

  React.useEffect(() => {
    if (!branchId || !user?.id) return;
    const userId: number = user.id;
    dispatch(getStockAlerts({ branchId, userId }));
    const interval = setInterval(() => {
      dispatch(getStockAlerts({ branchId, userId }));
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch, branchId, user?.id]);
 
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

         
         <NotificationBell
           alerts={stockAlert.alerts}
           unreadCount={stockAlert.unreadCount}
           agencies={agencies}
         />
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

function NotificationBell({
  alerts,
  unreadCount,
  agencies,
}: {
  alerts: any[];
  unreadCount: number;
  agencies: any[];
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsRoundedIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: { maxHeight: 400, width: 360, p: 1 },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Typography variant="subtitle1" sx={{ px: 1, fontWeight: 600, color: '#B71C1C' }}>
          Alertes 
        </Typography>
        <Divider sx={{ my: 1 }} />
        {alerts.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              Aucune alerte
            </Typography>
          </MenuItem>
        ) : (
          alerts.map((alert) => (
            <Box key={alert.id} sx={{ px: 1, py: 0.5 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  bgcolor: alert.isRead ? 'transparent' : 'action.hover',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.selected' },
                }}
                onClick={() => window.open(
                  `http://localhost:3000/apiApp/stock-alert/${alert.id}/pdf/${alert.branchId}`,
                  '_blank',
                )}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 13 }}>
                      {alert.type === 'reception' ? 'Alerte de réception' : alert.type === 'affectation' ? "Alerte d'affectation" : alert.type === 'reparation' ? 'Alerte de réparation' : alert.type === 'cq' ? 'Alerte CQ' : alert.type === 'bloque' ? 'Alerte blocage' : 'Alerte de stock'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {alert.branchName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Box>
          ))
        )}
      </Menu>
    </>
  );
}
