 import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import theme from '../../../Theme/theme';
import { useParams } from 'react-router-dom';
import { useNotification } from '../../../Componants/NotificationContext';
import { updatePassword } from '../../../Redux/Actions/Administration/EmployèesActions';
import { useAppDispatch } from '../../../Redux/hooks';
 
const UpdateUserPassword: React.FC = () => {
     const { userId } = useParams<{ userId: string }>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
const { notify } = useNotification();
 const dispatch = useAppDispatch();
const handleSubmit = async () => {
  if (newPassword !== confirmPassword) {
    notify("Les mots de passe ne correspondent pas.", "error");

    return;
  }

try {
     dispatch(updatePassword({
      id: Number(userId), // userId récupéré via useParams()
      currentPassword,
      newPassword,
    })) 
     
    notify("Mot de passe mise à jour avec succès !", "success");
} catch (err) {
 
 const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");
}

} 


  
  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8 }}>
      <Card variant="outlined">
        <CardContent><br/>
          <Typography variant="h6" sx={{color: theme.palette.secondary.main}} gutterBottom>
            Mettre à jour le mot de passe
          </Typography><br/><br/>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              
                <TextField
                  fullWidth
                  type="password"
                  label="Mot de passe actuel"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />  <br/>
               

               
                <TextField
                  fullWidth
                  type="password"
                  label="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                /><br/>
              

               
                <TextField
                  fullWidth
                  type="password"
                  label="Confirmer le nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                /><br/>
               

               
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  type="submit"
                >
                  Mettre à jour
                </Button><br/>
              
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UpdateUserPassword;