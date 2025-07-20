import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormLabel, Input, Radio, Slide, Stack } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React from 'react'
import { useNotification } from '../../../Componants/NotificationContext';
import { useAppDispatch } from '../../../Redux/hooks';
import { MdOutlineModeEdit } from 'react-icons/md';
import { getAllMarques, UpdateOneMarque } from '../../../Redux/Actions/Administration/MarquesActions';
interface Marque {
    marque: {
        id: number;
        name: string;
        logo: File | null;
        status: string;
    }
}

interface Marques {

    id: number;
    name: string;
    logo: string;
    status: string;

}
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function UpdateMarque({ marque }: Marque) {
    const { notify } = useNotification();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const dispatch = useAppDispatch();
    const [open, setOpen] = React.useState<boolean>(false);

    const handleClickOpen = async () => { setOpen(true); };

    const handleClose = async () => { setOpen(false); };

    const [valueStatus, setValueStatus] = React.useState('');
    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newStatus = event.target.value;
        setValueStatus(newStatus);
        setStatus({ ...status, status: newStatus });
    };
    const controlProps = (item: string) => ({
        checked: valueStatus === item,
        onChange: handleStatusChange,
        value: item,
        name: 'status-radio',
        inputProps: { 'aria-label': item },
    });

    const [name, setName] = React.useState({ id: marque.id, name: marque.name });
    const [logo, setLogo] = React.useState({ id: marque.id, logo: marque.logo });
    const [status, setStatus] = React.useState({ id: marque.id, status: marque.status });


   const handleSubmit = async (data: { id: number; name?: string; status?: string; logo?: File | null }) => {
        setIsLoading(true);
        setError(null);

        const formDataToSend = new FormData();

        if (data.name) formDataToSend.append("name", data.name);
        if (data.status) formDataToSend.append("status", data.status);
        if (data.logo && typeof data.logo !== 'string') {
            formDataToSend.append("logo", data.logo);
        }

        try {
            await dispatch(UpdateOneMarque({ id: data.id, formData: formDataToSend })).then(() => {
                dispatch(getAllMarques());
                setOpen(false);
                notify("Mise à jour avec succès !", "success");
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <React.Fragment>
                <Button variant="outlined" onClick={handleClickOpen}>
                    <MdOutlineModeEdit />
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
                    <DialogTitle>Modifications </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Mise à jour les points nécessaire
                        </DialogContentText>
                        <form
                            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                                event.preventDefault();
                                setOpen(false);
                            }}
                        >
                            <Stack spacing={3}>
                                <FormControl>
                                    <FormLabel>Nom</FormLabel>
                                    <Box sx={{ display: 'flex' }}>
                                        <Input sx={underlineInputStyles} value={name.name} onChange={(e) => setName({ ...name, name: e.target.value })} />
                                        <Button variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                            onClick={() => handleSubmit({ id: name.id, name: name.name })} > Mettre à jour</Button>
                                    </Box>
                                </FormControl>
                                <FormControl>
                                    <FormLabel> Status</FormLabel>
                                    <Box sx={{ display: 'flex' }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Radio {...controlProps('Autoriser')} color="success" /> Autoriser
                                            <Radio {...controlProps('Bloqué')} color="error" /> Bloqué

                                        </Box>
                                        <Button variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '44%' }} loading={isLoading}
                                            onClick={() => handleSubmit({ id: status.id, status: status.status })} > Mettre à jour</Button>

                                    </Box>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Logo</FormLabel>
                                    <Box sx={{ display: 'flex' }}>
                                        <Input
                                            type="file"
                                            sx={underlineInputStyles}
                                            onChange={(e) => {
                                                const target = e.target as HTMLInputElement;
                                                const file = target.files?.[0] || null;
                                                setLogo({ ...logo, logo: file });
                                            }}
                                        />
                                        <Button variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                            onClick={() => handleSubmit({ id: logo.id, logo: logo.logo })} > Mettre à jour</Button>

                                    </Box>
                                </FormControl>
                            </Stack>

                        </form>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>Fermer</Button>
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