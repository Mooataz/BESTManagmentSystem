import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import AddIcon from '@mui/icons-material/Add';
import theme from '../../../Theme/theme';
import { Box, FormControl, FormLabel, Input, Radio } from '@mui/material';
import { CustomAutocomplete } from '../../../Componants/Global/CustomAutocomplete';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { useAppDispatch } from '../../../Redux/hooks';
import { getAgencies } from '../../../Redux/Actions/Administration/AgenciesActions';
import { CustomCheckboxSelector } from '../../../Componants/Global/CustomCheckboxSelector';
import { useNotification } from '../../../Componants/NotificationContext';
import { AddEmployee, getusers } from '../../../Redux/Actions/Administration/EmployèesActions';

interface Agency {
    id: number;
    name: string;
    phone: number;
    email: string;
    location: string;
}

type Users = {

    name: string;
    phone: number;
    password: string;
    createdDate: Date;
    status: string;
    login: string;
    role: string[];
    branch: number
};
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddEmploye() {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();

    const [open, setOpen] = React.useState(false);
    const [valueRole, setValueRole] = React.useState('Autoriser');
    const roles = [{ id: 1, name: 'Reception' }, { id: 2, name: 'Coordinateur' }, { id: 3, name: 'Technicien' }, { id: 4, name: 'Gestionnaire_de_stocks' }]

    const [formData, setFormData] = React.useState<Users>({

        name: '',
        phone: 0,
        password: '',
        login: '',
        createdDate: new Date(),
        status: '',
        role: [] as string[],
        branch: 0
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
    const branchs = useSelector((state: RootState) => state.agencies.Agency)
    React.useEffect(() => {
        dispatch(getAgencies())
    }, [dispatch])

    const handleSubmit = async () => {
 
        
       
        try {
            await dispatch(AddEmployee(formData));
             setOpen(false)
             dispatch(getusers());
             notify("Ajouter avec succès !", "success");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");        } 
         
    };
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
                    Ajouter un employèe
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
                    <DialogTitle>{"Ajouter un nouvelle employèe"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            <FormControl>
                                        <FormLabel>  Nom </FormLabel>
                                        <Input  sx={underlineInputStyles} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel> Tèlèphone </FormLabel>
                                        <Input   type='number' sx={underlineInputStyles} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: Number(e.target.value) })} />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel> Login </FormLabel>
                                        <Input   type='text' sx={underlineInputStyles} value={formData.login} onChange={(e) => setFormData({ ...formData, login: e.target.value })} />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Mots de passe</FormLabel>
                                        <Input   type='text' sx={underlineInputStyles} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                    </FormControl>
                            <FormControl>
                                <FormLabel> Status</FormLabel>
                                <Box sx={{ display: 'flex' }}>
                                    <Radio {...controlProps('Autoriser')} color="success" /> Autoriser
                                    <Radio {...controlProps('Bloqué')} color="error" /> Bloqué

                                </Box>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Role </FormLabel>
                                <Box sx={{ display: 'flex' }}>

                                    <CustomCheckboxSelector
                                        data={roles}
                                        displayFields={['name']}
                                        returnField="name"
                                        title='Role'
                                        maxSelection={4}
                                        onChange={(values) => setFormData({ ...formData, role: values })}
                                    />


                                </Box>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Agence </FormLabel>
                                <Box sx={{ display: 'flex' }}>
                                    <CustomAutocomplete
                                        data={branchs}
                                        displayFields={['name']}
                                        idField="id"
                                        label=""
                                        multiple={false}
                                        onChange={(val) => setFormData({ ...formData, branch: val })}

                                    />

                                </Box>
                            </FormControl>
                        </DialogContentText>
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