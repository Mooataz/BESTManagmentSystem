import V2BEST from '../../assets/V2BEST.png';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import { useNavigate } from 'react-router-dom';
import { handleAuthen } from '../../api/login';
import Button from '@mui/joy/Button';

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
            } catch (error: any) {
              alert(error);
            }
          }}
          style={{
            width: '80%',
            maxWidth: '400px',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ marginBottom: '20px' }}>Connexion</h2>
          <Stack spacing={2}>
            <label htmlFor="email">Identifiant</label>
            <Input id="email" name="email" variant="soft" />

            <label htmlFor="password">Mot de passe</label>
            <Input id="password" name="password" type="password" variant="soft" />
          </Stack>

          <Button type="submit" variant="outlined" fullWidth style={{ marginTop: '20px' }}>
            Se connecter
          </Button>

          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.9rem' }}>
            © BEST {new Date().getFullYear()}
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
    </div>
  );
}

export default Authentification;
