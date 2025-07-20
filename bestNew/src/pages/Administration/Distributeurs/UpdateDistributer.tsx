import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormLabel, Input, Slide, Stack } from '@mui/material';
import React from 'react'
import { MdOutlineModeEdit } from 'react-icons/md';
import { useAppDispatch } from '../../../Redux/hooks';
import type { TransitionProps } from '@mui/material/transitions';
import { useNotification } from '../../../Componants/NotificationContext';
import { AddOneDistributer, getDistributers, UpdateOneDistributer } from '../../../Redux/Actions/Administration/Distributer';
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface Distributor {
    distributer: {
        id: number;
        name: string;
        phone: number;
        taxRegisterNumber: string;
        email: string;
        location: string;
    }
}
interface UpdateEmployèesProps {
  distributer: any;
  opens: boolean;
  onClose: () => void;
}
export type UpdateDistributerPayload = Partial<Omit<Distributor["distributer"], "id">> & { id: number };

export default function UpdateDistributer({ distributer, opens, onClose }: UpdateEmployèesProps) {
    const dispatch = useAppDispatch();
    const [open, setOpen] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const handleClickOpen = async () => { setOpen(true); };
 const { notify } = useNotification();
    const [name, setName] = React.useState({ id: distributer.id, name: distributer.name });
    const [phone, setPhone] = React.useState({ id: distributer.id, phone: distributer.phone });
    const [taxRegisterNumber, setTaxRegisterNumber] = React.useState({ id: distributer.id, taxRegisterNumber: distributer.taxRegisterNumber });
    const [email, setEmail] = React.useState({ id: distributer.id, email: distributer.email });
    const [location, setLocation] = React.useState({ id: distributer.id, location: distributer.location });
React.useEffect(() => {
  if (distributer) {
     
    setName({ id: distributer.id, name: distributer.name })
    setPhone({ id: distributer.id, phone: distributer.phone })
    setTaxRegisterNumber({ id: distributer.id, taxRegisterNumber: distributer.taxRegisterNumber })
    setEmail({ id: distributer.id, email: distributer.email })
    setLocation({ id: distributer.id, location: distributer.location })
    
  }
}, [distributer]);
    const handleClose = async () => { onClose( ); };
    const handleSubmit = async (data: { id: number; name?: string; phone?:number ; taxRegisterNumber?:string; email?:string; location?:string  }) => {
        setIsLoading(true);
        setError(null);
 
        try {
            await dispatch(UpdateOneDistributer(data)).then(() => {
                dispatch(getDistributers());
                onClose()
                setIsLoading(false)
                notify("Mise à jour avec succès !", "success");
            })
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");
        }
    }
    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                <MdOutlineModeEdit />
            </Button>
            <Dialog
                open={opens}
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
                                <FormLabel>Tèlèphone</FormLabel>
                                <Box sx={{ display: 'flex' }}>
                                    <Input sx={underlineInputStyles} value={phone.phone} onChange={(e) => setPhone({ ...phone, phone:Number( e.target.value) })} type='number' />
                                    <Button variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                        onClick={() => handleSubmit({ id: phone.id, phone: phone.phone })} > Mettre à jour</Button>
                                </Box>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Matricul fiscale</FormLabel>
                                <Box sx={{ display: 'flex' }}>
                                    <Input sx={underlineInputStyles} value={taxRegisterNumber.taxRegisterNumber} onChange={(e) => setTaxRegisterNumber({ ...taxRegisterNumber, taxRegisterNumber: e.target.value })} />
                                    <Button variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                        onClick={() => handleSubmit({ id: taxRegisterNumber.id, taxRegisterNumber: taxRegisterNumber.taxRegisterNumber })} > Mettre à jour</Button>
                                </Box>
                            </FormControl>

                            <FormControl>
                                <FormLabel>E-mail</FormLabel>
                                <Box sx={{ display: 'flex' }}>
                                    <Input sx={underlineInputStyles} value={email.email} onChange={(e) => setEmail({ ...email, email: e.target.value })} />
                                    <Button variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                        onClick={() => handleSubmit({ id: email.id, email: email.email })} > Mettre à jour</Button>
                                </Box>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Adresse</FormLabel>
                                <Box sx={{ display: 'flex' }}>
                                    <Input sx={underlineInputStyles} value={location.location} onChange={(e) => setLocation({ ...location, location: e.target.value })} />
                                    <Button variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                        onClick={() => handleSubmit({ id: location.id, location: location.location })} > Mettre à jour</Button>
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