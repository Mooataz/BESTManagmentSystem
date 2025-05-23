import * as React from 'react';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { useParams } from 'react-router-dom';
import {  updatePassword } from '../../api/administration/user';
import { useNotification } from './NotificationContext';
export default function Updatepassword(){
    const { userId } = useParams<{ userId: string }>();
const [currentPassword, setCurrentPassword] = React.useState('');
const [newPassword, setNewPassword] = React.useState('');
const [newPassword2, setNewPassword2] = React.useState('');
const { notify } = useNotification();
const handleSubmit = async () => {
  if (newPassword !== newPassword2) {
    notify("Les mots de passe ne correspondent pas.", "danger");

    return;
  }

try {
    await updatePassword({
      id: Number(userId), // userId récupéré via useParams()
      currentPassword,
      newPassword,
    });
     
    notify("Mot de passe mise à jour avec succès !", "success");
} catch (err) {
 
 const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "danger");
}

}

  
    return(
        <div>
             <Card
      variant="outlined"
      sx={{
        maxHeight: 'max-content',
        maxWidth: '100%',
        mx: 'auto',
        // to make the demo resizable
        overflow: 'auto',
        resize: 'horizontal',
      }}
    >
      <Typography level="title-lg" startDecorator={<InfoOutlined />}>
        Modifier mots de passe
      </Typography>
      <Divider inset="none" />
      <CardContent
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
          gap: 1.5,
        }}
      >
        <FormControl sx={{ gridColumn: '1/-1' }}>
          <FormLabel>Mots de passe actuelle</FormLabel>
          <Input value={currentPassword} onChange={(e) => setCurrentPassword(  e.target.value   )}  />
           
        </FormControl>
        <FormControl>
          <FormLabel>Nouvelle mots de passe</FormLabel>
          <Input  value={newPassword} onChange={(e) => setNewPassword(  e.target.value   )} />
        </FormControl>
        <FormControl>
          <FormLabel>Confirmer mots de passe</FormLabel>
          <Input  value={newPassword2} onChange={(e) => setNewPassword2(  e.target.value   )} />
        </FormControl>
 
         <CardActions sx={{ gridColumn: '1/-1' }}>
          <Button variant="soft" color="primary" onClick={handleSubmit}>
            Mettre à jour
          </Button>
        </CardActions>
      </CardContent>
    </Card>
        </div>
    )
}