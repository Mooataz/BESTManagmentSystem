import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import ModeIcon from '@mui/icons-material/Mode';
import theme from '../../../Theme/theme';
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import { getusers, updateEmployee } from '../../../Redux/Actions/Administration/EmployèesActions';
import { FormControl, FormLabel, Input, Stack } from '@mui/material';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
interface Agency {
    id: number;
    name: string;
    phone: number;
    email: string;
    location: string;
}
type User = {
    id: number;
    name: string;
    phone: number;
    password: string;
    createdDate: string;
    status: string;
    login: string;
    role: string[];
    branch: Agency
};
export default function UpdateAdmin({ row }: { row: User }) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState({ id: row.id, name: row.name, })
    const [phone, setPhone] = React.useState({ id: row.id, phone: row.phone, })
    const [password, setPassword] = React.useState({ id: row.id, password: '' });
    const [login, setLogin] = React.useState({ id: row.id, login: row.login, })
    const dispatch = useAppDispatch();
const { notify } = useNotification();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (data: Partial<User> & { id: number }) => {
        

        try {
             dispatch(updateEmployee(data)) ;
            setOpen(false);
            dispatch( getusers())
            notify("Mise à jour avec succès !", "success");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");
        }  
    };

    return (
        <div>
            <React.Fragment>
                <ModeIcon onClick={handleClickOpen} sx={{ color: theme.palette.secondary.main }} />

                <Dialog
                    open={open}
                    slots={{
                        transition: Transition,
                    }}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Modifications"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                             <form
                        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            setOpen(false);
                        }}
                    >
                        <Stack spacing={2}>

                             
                                 
                                    <FormControl>
                                        <FormLabel>Nom</FormLabel>
                                        <div style={{display:'flex'}}>
                                            <Input   sx={underlineInputStyles} value={name.name} onChange={(e) => setName({ ...name,  name: e.target.value })} />
                                            <Button   variant={'outlined'}   style={{width:'160px',marginLeft:'14%'}}
                                            onClick={() => handleSubmit({ id: row.id, name: name.name })} > Mettre à jour</Button>
                                        </div>
                                        
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Telephone</FormLabel>
                                        <div style={{display:'flex'}}>
                                        <Input   type='number' sx={underlineInputStyles} value={phone.phone} onChange={(e) => setPhone({ ...phone, phone: Number(e.target.value) })} />
                                        <Button   variant={'outlined'}   style={{width:'160px',marginLeft:'14%'}}
                                        onClick={() => handleSubmit({ id: row.id, phone: phone.phone })}> Mettre à jour</Button>
                                        </div>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Login</FormLabel>
                                        <div style={{display:'flex'}}>
                                        <Input   type='text' sx={underlineInputStyles} value={login.login} onChange={(e) => setLogin({ ...login, login: e.target.value })} />
                                        <Button   variant={'outlined'}   style={{width:'160px',marginLeft:'14%'}}
                                        onClick={() => handleSubmit({ id: row.id, login: login.login })}> Mettre à jour</Button>
                                        </div>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Mots de passe</FormLabel>
                                        <div style={{display:'flex'}}>
                                        <Input   type='text' sx={underlineInputStyles} value={password.password}  onChange={(e) => setPassword({ ...password, password: e.target.value })} />
                                        <Button   variant={'outlined'}   style={{width:'160px',marginLeft:'14%'}}
                                        onClick={() => handleSubmit({ id: row.id, password: password.password })}> Mettre à jour</Button>
                                        </div>
                                    </FormControl>

                        </Stack>
                    </form>


                          </DialogContentText>
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