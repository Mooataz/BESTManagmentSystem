import V2BEST from '../../assets/V2BEST.png';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import { useNavigate } from 'react-router-dom';
import { getUserId, handleAuthen } from '../../api/administration/login';
import Button from '@mui/joy/Button';
import * as React from 'react';
import Snackbar  from '@mui/joy/Snackbar';
import   SnackbarProps  from '@mui/joy/Snackbar';
import { useNotification } from '../Componants/NotificationContext';
import { Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setUser } from '../../Redux/userSlice';

 interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
  persistent: HTMLInputElement;
}

interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function Authentification() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false); 
  const { notify } = useNotification();
  const dispatch = useDispatch();
  const [getUser, setGetUser] = React.useState()

  
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
        <form
          onSubmit={async (event: React.FormEvent<SignInFormElement>) => {
            event.preventDefault();
            const formElements = event.currentTarget.elements;
            const data = {
              login: formElements.email.value,
              password: formElements.password.value,
            };
            try {
              const result = await handleAuthen(data.login, data.password);
              
              localStorage.setItem('accessToken', result.token.accessToken);
              navigate('/dashboard');
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "danger");
                setOpen(true);
            }
          }}
          style={{
            width: '80%',
            maxWidth: '600px',
            height:'400px',
            padding: '30px',
            borderRadius: '40px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ marginBottom: '10px' }}>Connexion</h2>
          <Stack spacing={2}>
            
            <Typography   style={{marginRight:'80%', marginTop: '5%',color:'#03719C' }} >Identifiant</Typography>
            <Input id="email" name="email" variant="soft"style={{  borderRadius:'15px',height: '40px' }} />

              <Typography  style={{marginRight:'75%', marginTop: '5%',color:'#03719C',  }} >Mot de passe</Typography>
             
            <Input id="password" name="password" type="password" variant="soft" style={{  borderRadius:'15px',height: '40px'}} />
          </Stack>

          <Button type="submit"   fullWidth style={{ marginTop: '5%' , borderRadius:'30px' }}>
            Se connecter
          </Button>
           
          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.9rem' }}>
            ©Copyright <span style={{color:'#03719C'}}>BEST</span> {new Date().getFullYear()}
          </div> 
        </form>
      </div>

      {/* Image de droite */}
      <div style={{ flex: 1  }}>
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
