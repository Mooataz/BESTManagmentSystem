import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Input, Radio, Slide } from '@mui/material';
import React, { useState } from 'react'
import theme from '../../../Theme/theme';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import type { TransitionProps } from '@mui/material/transitions';
import type { FormLisFrais } from '../../../Redux/Types/administrationTypes';
import { AddFrais, GetAllFrais } from '../../../Redux/Actions/Administration/AutresFraisActions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function ADDAutreFrais() {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => { setOpen(true); };

    const handleClose = () => { setOpen(false); };
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
    const [description, setDescription] = useState<FormLisFrais>({
        price: 0,
        name: '',
        status: 'Autoriser'
    })

    const handleSubmit = async () => {
        try {
            if(!description.name || !description.price ) {
            notify('veuiller remplire toutes les doneès','error');
            return
        }
            await dispatch(AddFrais(description)).then(() => {
                dispatch(GetAllFrais())
                setOpen(false);
                notify('Ajouter  avec success')
            })
        } catch (error) {
            
        }

    }
    return (
        <React.Fragment>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
                startIcon={<AddIcon />}
                sx={{
                    borderColor: theme.palette.primary.main,
                    marginLeft: '70%'
                }}>
                Ajouter une frais
            </Button>
            <br /><br />
            <Dialog
                open={open}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Ajouter un nouvelle frais"}</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <FormLabel>  Nom </FormLabel>
                        <Input sx={underlineInputStyles} value={description.name} onChange={(e) => setDescription({ ...description, name: e.target.value })} />

                    </FormControl><br/><br/>
                    <FormControl>
                        <FormLabel>  Prix </FormLabel>
                        <Input sx={underlineInputStyles} value={description.price} onChange={(e) => setDescription({ ...description, price:Number(e.target.value)  })} type="number" />

                    </FormControl><br/><br/>

                    <FormControl>
                                <FormLabel> Status</FormLabel>
                                <Box sx={{ display: 'flex' }}>
                                    <Radio {...controlProps('Autoriser')} color="success" /> Autoriser
                                    <Radio {...controlProps('Bloqué')} color="error" /> Bloqué

                                </Box>
                            </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleSubmit}>Confirmer</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
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