import V2BEST from '../../assets/V2BEST.png';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import { useNavigate } from 'react-router-dom';
import { getUserId, handleAuthen } from '../../api/administration/login';
import Button from '@mui/joy/Button';
import * as React from 'react';
import Snackbar from '@mui/joy/Snackbar';
import SnackbarProps from '@mui/joy/Snackbar';
import { useNotification } from '../Componants/NotificationContext';
import { FormHelperText, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../Redux/userSlice';
import { loginUser } from '../../Redux/Actions/authAction'; 
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import type { AppDispatch, RootState } from '../../Redux/store';
import { yupResolver } from '@hookform/resolvers/yup';
 import  {clearError} from '../../Redux/authSlice'
 import { useAppDispatch } from '../../Redux/hooks'
interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}
interface LoginFormData {
  login: string;
  password: string;
}
interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function Authentification() {
 
  const [open, setOpen] = React.useState(false);
  const { notify } = useNotification();
 // const dispatch = useDispatch<AppDispatch>();
 
const dispatch = useAppDispatch();

   const navigate = useNavigate();
    const { error  } = useSelector((state: RootState) => state.auth);
  // Initialisation du formulaire


  // Effet pour gérer les erreurs globales

React.useEffect(() => {
  if (error) {
    dispatch(clearError()); // ✅ Cela doit fonctionner maintenant
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
            notify('Connexion réussie!', 'success');
             reset(); // Réinitialise le formulaire
            navigate('/dashboard');
          } else if (loginUser.rejected.match(resultAction)) {
        // La notification est déjà gérée par l'effet sur 'error'
        setOpen(true);
      }
          
          /* console.log('user: ', resultAction)
          navigate('/dashboard'); */
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      notify(errorMessage, "danger");
      setOpen(true);
    }
  }
   
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      {/* Bloc de login */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#FAFAFA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}
 
          style={{
            width: '80%',
            maxWidth: '600px',
            height: '500px',
            padding: '30px',
            borderRadius: '40px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ marginBottom: '10px' }}>Connexion</h2>
          <Stack spacing={2}>

            <Typography style={{ marginRight: '80%', marginTop: '5%', color: '#03719C' }} >Identifiant</Typography>
            <Input id="login" variant="soft" style={{ borderRadius: '15px', height: '40px' }} required
              {...register('login')}
               
              color={errors.login ? 'danger' : 'neutral'}
            />
            {errors.login && (
              <FormHelperText
                style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}
              >
                {errors.login.message}
              </FormHelperText>
            )}
            <Typography style={{ marginRight: '75%', marginTop: '5%', color: '#03719C', }} >Mot de passe</Typography>

            <Input id="password" type="password" variant="soft" style={{ borderRadius: '15px', height: '40px' }} required
              {...register('password')} />
          </Stack>

          <Button type="submit" fullWidth style={{ marginTop: '10%', borderRadius: '30px' }}

          >
            Se connecter
          </Button>

          <div style={{ marginTop: '10%', textAlign: 'center', fontSize: '0.9rem' }}>
            ©Copyright <span style={{ color: '#03719C' }}>BEST</span> {new Date().getFullYear()}
          </div>
        </form>
      </div>

      {/* Image de droite */}
      <div style={{ flex: 1 }}>
        <img
          src={V2BEST}
          alt="background"
          style={{
            width: '100%',
            height: '100%',
          }}
        />

      </div>
      <Stack spacing={2} sx={{ alignItems: 'center' }}>



      </Stack>
    </div>
  );
}

export default Authentification;
