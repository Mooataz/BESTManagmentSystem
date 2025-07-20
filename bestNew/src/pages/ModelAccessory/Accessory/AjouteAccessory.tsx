import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Input, Slide } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React, { useState } from 'react'
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import type { TypeUnique } from '../../../Redux/Types/repairTypes';
import { AddAcesory, GetAllAccessory } from '../../../Redux/Actions/ModelAndAccessory/AccessoryActions';
import theme from '../../../Theme/theme';
import AddIcon from '@mui/icons-material/Add';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function AjouteAccessory() {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => { setOpen(true); };

    const handleClose = () => { setOpen(false); };

    const [description, setDescription] = useState<TypeUnique>({
        name: '',
    })

        const handleSubmit = async () => {
            try {
                if(!description.name   ) {
                notify('veuiller remplire toutes les doneès','error');
                return
            }
                await dispatch(AddAcesory(description)).then(() => {
                    dispatch(GetAllAccessory())
                    setOpen(false);
                    notify('Ajouter  avec success')
                })
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error"); 
            }
    
        }
    return (
        <div>
        <React.Fragment>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
                startIcon={<AddIcon />}
                sx={{
                    borderColor: theme.palette.primary.main,
                    marginLeft: '70%'
                }}>
                Ajouter un accessoire
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
                <DialogTitle>{"Ajouter un nouvelle accessoire"}</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <FormLabel>  Nom </FormLabel>
                        <Input sx={underlineInputStyles} value={description.name} onChange={(e) => setDescription({ ...description, name: e.target.value })} />

                    </FormControl><br/><br/>
                  

                
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleSubmit}>Confirmer</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
        </div>
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