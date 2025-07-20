import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Input, Radio, Slide, Stack } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React, { useState } from 'react'
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import type { FormLisFrais } from '../../../Redux/Types/administrationTypes';
import { GetAllFrais, UpdateFrais } from '../../../Redux/Actions/Administration/AutresFraisActions';
import { BiBox } from 'react-icons/bi';
interface UpdateProps {
  frais: any;
  open: boolean;
  onClose: () => void;
}
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function UpdateAutresFrais({ frais, open, onClose }: UpdateProps) {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const [isLoading, setIsLoading] = React.useState(false);
  const [description, setDescription] = useState<FormLisFrais>({
    id: frais.id,
    name: frais.name,
    price: frais.price,
    status: frais.status
  })
  React.useEffect(() => {
    if (frais) {

      setDescription({ id: frais.id, name: frais.name, price: frais.price, status: frais.status })

    }
  }, [frais]);
const controlProps = (item: string) => ({
  checked: description.status === item,
  onChange: handleStatusChange,
  value: item,
  name: 'status-radio',
  inputProps: { 'aria-label': item },
});
const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const newStatus = event.target.value;
  
  setDescription({ ...description, status: newStatus });
};
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await dispatch(UpdateFrais(description))
        .then(() => {
          dispatch(GetAllFrais())
          notify("Mise à jour avec succès !", "success");
          onClose()
          setIsLoading(false);
        })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      notify(errorMessage, "error");
    }

  }
  return (
    <Box>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Modifier un frais"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel> Nom</FormLabel>
              <Box sx={{ display: 'flex' }}>
                <Input sx={underlineInputStyles} value={description.name} onChange={(e) => setDescription({ ...description, name: e.target.value })} />
                <Button size="medium" variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                  onClick={() => handleSubmit()} > Mettre à jour</Button>

              </Box>
            </FormControl>
            <FormControl>
              <FormLabel> Prix</FormLabel>
              <Box sx={{ display: 'flex' }}>
                <Input sx={underlineInputStyles} value={description.price} onChange={(e) => setDescription({ ...description, price: Number(e.target.value) })} type='number' />
                <Button size="medium" variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                  onClick={() => handleSubmit()} > Mettre à jour</Button>

              </Box>
            </FormControl>
            <FormControl>
              <FormLabel> Status</FormLabel>
              <Box sx={{ display: 'flex' }}>
                <Radio {...controlProps('Autoriser')} color="success" /> Autoriser
                <Radio {...controlProps('Bloqué')} color="error" /> Bloqué
                <Button size="medium" variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '44%' }} loading={isLoading}
                  onClick={() => handleSubmit()} > Mettre à jour</Button>

              </Box>
            </FormControl>

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fermer</Button>

        </DialogActions>
      </Dialog>
    </Box>
  )
}
const underlineInputStyles = {
  '--Input-radius': '0px',
  borderBottom: '2px solid',
  borderColor: 'neutral.outlinedBorder',
  '&:hover': {
    borderColor: 'neutral.outlinedHoverBorder',
  },
  '&::before': {
    border: '1px solid var(--Input-focusedHighlight)',
    transform: 'scaleX(0)',
    left: 0,
    right: 0,
    bottom: '-2px',
    top: 'unset',
    transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
    borderRadius: 0,
  },
  '&:focus-within::before': {
    transform: 'scaleX(1)',
  },
  width: '500px',

};