import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Input, Slide } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React from 'react'
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import AddIcon from '@mui/icons-material/Add';
import theme from '../../../Theme/theme';
import { AddOneDistributer, getDistributers } from '../../../Redux/Actions/Administration/Distributer';
import type { Distributor } from '../../../Redux/Types/repairTypes';
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function AddDistibuteur() {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const handleClickOpen = () => { setOpen(true); };

    const handleClose = () => { setOpen(false); };

    const [formData, setFormData] = React.useState<Distributor>({

        name: '',
        phone: 1,
        email: '',
        location: '',
        taxRegisterNumber: ''
    })
    const handleSubmit = async (data: any) => {

        if (!formData.name || !formData.email || !formData.phone || !formData.location || !formData.taxRegisterNumber) {
            notify("Tous les champs sont requis.", "warning");
            setIsLoading(false);
            return;
        }

       

            dispatch(AddOneDistributer(formData))
                .unwrap()
                .then((res) => {
                    notify('Distributeur ajouté avec succès:', 'success');
                })
                .catch((err) => {
                    notify('Erreur lors de l\'ajout:','error');
                });
        
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
                Ajouter un distributeur
            </Button>
            <Dialog
                open={open}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Ajouter un nouvelle distributeur"}</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <FormLabel>  Nom </FormLabel>
                        <Input sx={underlineInputStyles} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>  Tèlèphone </FormLabel>
                        <Input sx={underlineInputStyles} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: Number(e.target.value) })} type='number' />
                    </FormControl>
                    <FormControl>
                        <FormLabel>  E-mail </FormLabel>
                        <Input sx={underlineInputStyles} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>  Adresse </FormLabel>
                        <Input sx={underlineInputStyles} value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>  Matricule fiscale </FormLabel>
                        <Input sx={underlineInputStyles} value={formData.taxRegisterNumber} onChange={(e) => setFormData({ ...formData, taxRegisterNumber: e.target.value })} />
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