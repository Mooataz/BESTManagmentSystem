import { API_BASE_URL } from '../../../services/api';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import theme from '../../../Theme/theme';
import { useNotification } from '../../../Componants/NotificationContext';
import { useAppDispatch } from '../../../Redux/hooks';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { clearError } from '../../../Redux/auth/authSlice';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginUser } from '../../../Redux/Actions/authAction';
import { setUser, type UserState } from '../../../Redux/auth/userSlice';
import { FormHelperText } from '@mui/material';
import LogoBest from '../../../assets/LogoBest.png'
import { getCompany } from '../../../Redux/Actions/Administration/Company';
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '600px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

interface LoginFormData {
  login: string;
  password: string;
}


export default function SignIn(props: { disableCustomTheme?: boolean }) {

  const [open, setOpen] = React.useState(false);
  const { notify } = useNotification();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state: RootState) => state.auth);
  const company = useSelector((state: RootState) => state.company.company);   

  React.useEffect(() => {
    dispatch(getCompany());
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validationSchema = Yup.object().shape({
    login: Yup.string().required('Login requis'),
    password: Yup.string().required('Le mot de passe est requis'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData>({
    resolver: yupResolver(validationSchema)
  });
  const onSubmit = async (formData: LoginFormData) => {
    try {
      const resultAction = await dispatch(loginUser(formData))

      if (loginUser.fulfilled.match(resultAction)) {
        const adaptedUser: UserState = {
          id: resultAction.payload.id ?? 0,
          login: resultAction.payload.login,
          name: resultAction.payload.name,
          status: resultAction.payload.status,
          token: resultAction.payload.token,
          role: Array.isArray(resultAction.payload.role)
            ? resultAction.payload.role
            : [resultAction.payload.role],
        };

        dispatch(setUser(adaptedUser));
        notify('Connexion réussie!', 'success');
        reset(); // Réinitialise le formulaire
        navigate('/dashboard');
      } else if (loginUser.rejected.match(resultAction)) {
         notify(`${resultAction.payload}`, "error");
        setOpen(true);
      }


    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      notify(errorMessage, "error");
      setOpen(true);
    }
  }

  //-----------------------------------------------------------

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card variant="outlined">
   
          <Box
            sx={{
              display: 'flex'
            }}>
            <Box component="img"
              src={company?.logo ? `${API_BASE_URL}/upload/company/${company.logo}` : LogoBest}
              alt="Logo entreprise"
              sx={{
                maxHeight: 70,
                width: '170px',
                borderRadius: '30px'  
              }} />
            <Typography
              component="h4"
              variant="h4"
              sx={{
                width: '100%',
                fontSize: 'clamp(1rem, 8vw, 0.15rem)',
                color: theme.palette.primary.main
              }}
            >
              <br/>
              {company?.name}
            </Typography>
          </Box>



          <Typography
            component="h6"
            variant="h6"
            sx={{ width: '100%', fontSize: 'clamp(0.7rem, 5vw, 1.15rem)' }}
          >
            Se connecter
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel  >Login</FormLabel>
              <TextField

                id="login"
                type="text"

                placeholder="Utilisateur"
                autoComplete="login"
                autoFocus
                required
                fullWidth
                variant="outlined"

                {...register('login')}
              />
              {errors.login && (
                <FormHelperText
                  style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}
                >
                  {errors.login.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Mots de passe</FormLabel>
              <TextField

                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"

                {...register('password')}
              />
            </FormControl>
            <br></br>

            <Button
              type="submit"
              fullWidth


              sx={{
                color: 'white',
                backgroundColor: theme.palette.primary.main
              }}
            >
              Connecte
            </Button>

          </Box>
          <Divider></Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <Typography sx={{ textAlign: 'center' }}>
              ©Copyright <span style={{ color: theme.palette.primary.main }}>BEST</span> {new Date().getFullYear()}

            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
