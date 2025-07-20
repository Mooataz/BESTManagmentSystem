import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import type { Marque } from '../../../Redux/Types/repairTypes';
import { Box, FormControl, FormLabel, Input, Radio, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import theme from '../../../Theme/theme';
import { useNotification } from '../../../Componants/NotificationContext';
import { AddOneMarque, getAllMarques } from '../../../Redux/Actions/Administration/MarquesActions';
import { useAppDispatch } from '../../../Redux/hooks';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddMarque() {
    const [open, setOpen] = React.useState(false);
    const { notify } = useNotification();
    const dispatch = useAppDispatch();
    const [formData, setFormData] = React.useState({

        name: '',
        status: '',
        logo: null as File | null,

    })

    const [valueStatus, setValueStatus] = React.useState('');

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newStatus = event.target.value;
        setValueStatus(newStatus);
        setFormData({ ...formData, status: newStatus });
    };

    const controlProps = (item: string) => ({
        checked: valueStatus === item,
        onChange: handleStatusChange,
        value: item,
        name: 'status-radio',
        inputProps: { 'aria-label': item },
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
         if (!formData.logo) {
        notify("Le logo est requis.", "error");
        return;
    }

     const form = new FormData();
    form.append("name", formData.name);
    form.append("status", formData.status);
    form.append("logo", formData.logo); // File object
        try {
             
            await dispatch(AddOneMarque(form)).then(() => {
                setOpen(false);
                notify("Ajouter avec succès !", "success");
                dispatch(getAllMarques())
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
                    Ajouter un marque
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
                    <DialogTitle>{"Ajouter un marque"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            <FormControl>
                                <FormLabel>  Nom de marque</FormLabel>
                                <Input sx={underlineInputStyles} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </FormControl>
                            <br /> <br />
                            <FormControl>
                                <FormLabel> Status</FormLabel>
                                <Box sx={{ display: 'flex' }}>
                                    <Radio {...controlProps('Autoriser')} color="success" /> Autoriser
                                    <Radio {...controlProps('Bloqué')} color="error" /> Bloqué

                                </Box>
                            </FormControl>
                            <br /> <br />
                            <FormControl>
                                <FormLabel>  Logo</FormLabel>
                                <Input
                                    type="file"
                                    sx={underlineInputStyles}
                                    onChange={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        const file = target.files?.[0] || null;
                                        setFormData({ ...formData, logo: file });
                                    }}
                                />

                            </FormControl>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Annuler</Button>
                        <Button onClick={handleSubmit} loading={isLoading}>Sauvegarder</Button>
                    </DialogActions>
                    {error && <Typography color="danger">{error}</Typography>}
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