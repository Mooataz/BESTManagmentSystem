import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import V2BEST from '../../assets/V2BEST.png';
 import { useNavigate } from 'react-router-dom';
import { getUserId, handleAuthen } from '../../api/administration/login';
  import { Button, FormHelperText, Input, Stack, Typography } from '@mui/material';
 import { setUser } from '../../Redux/auth/userSlice';
import { loginUser } from '../../Redux/Actions/authAction';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import type { AppDispatch, RootState } from '../../Redux/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { clearError } from '../../Redux/auth/authSlice'
import { useAppDispatch } from '../../Redux/hooks'
import { useNotification } from '../../Componants/NotificationContext';
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
 ;

function Authentification() {
const [open, setOpen] = React.useState(false);
  const { notify } = useNotification();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state: RootState) => state.auth);
React.useEffect(() => {
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
            const adaptedUser  = {
            ...resultAction.payload,
            role: Array.isArray(resultAction.payload.role)
              ? resultAction.payload.role
              : [resultAction.payload.role]
           };

        dispatch(setUser(adaptedUser));
        notify('Connexion réussie!', 'success');
        reset(); // Réinitialise le formulaire
        navigate('/dashboard');
      } else if (loginUser.rejected.match(resultAction)) {
        // La notification est déjà gérée par l'effet sur 'error'
        setOpen(true);
      }

       
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      notify(errorMessage, "error");
      setOpen(true);
    }
  }
    return(
        <div style={{ display: 'flex', width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
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
                                <Typography style={{ marginRight: '70%', marginTop: '5%', color: '#03719C' }} >Identifiant</Typography>
                                <Input id="login"   style={{ marginLeft: '10%', height: '40px',width:'77%' }} required
                                    {...register('login')}/>
                                {errors.login && (
                                            <FormHelperText
                                                style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}
                                            >
                                                {errors.login.message}
                                            </FormHelperText>
                                            )}

                            <Typography style={{ marginRight: '65%', marginTop: '5%', color: '#03719C', }} >Mot de passe</Typography>

                            <Input id="password" type="password"  style={{marginLeft: '10%', height: '40px',width:'77%' }} required
                                {...register('password')} />
                            </Stack>





                            <Button type="submit"   variant="contained" style={{ marginTop: '10%', borderRadius: '30px',width:'80%' }}>
                                Se connecter
                            </Button>



                        <div style={{ marginTop: '10%', textAlign: 'center', fontSize: '0.9rem' }}>
                                    ©Copyright <span style={{ color: '#03719C' }}>BEST</span> {new Date().getFullYear()}
                                </div>
                        </form>




                </div>


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
        </div>
    )
}
export default Authentification;