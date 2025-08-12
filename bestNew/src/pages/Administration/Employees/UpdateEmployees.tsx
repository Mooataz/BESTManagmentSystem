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
import { useNotification } from '../../../Componants/NotificationContext';
 import { useAppDispatch } from '../../../Redux/hooks';
import { getAgencies } from '../../../Redux/Actions/Administration/AgenciesActions';

 import { MdOutlineModeEditOutline } from "react-icons/md";
 import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
  import Done from '@mui/icons-material/Done';
 
import { Box, FormControl, FormLabel, Input, Radio, radioClasses, RadioGroup, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { CustomAutocomplete } from '../../../Componants/Global/CustomAutocomplete';
 import { getusers, updateEmployee } from '../../../Redux/Actions/Administration/EmployèesActions';
import { CustomCheckboxSelector } from '../../../Componants/Global/CustomCheckboxSelector';
 const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface UpdateEmployèesProps {
  employe: any;
  open: boolean;
  onClose: () => void;
}
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
    createdDate: Date;
    status: string;
    login: string;
    role: string[];
    branch: number
};

export default function UpdateEmployees({ employe, open, onClose }: UpdateEmployèesProps) {
    const dispatch = useAppDispatch();
     const [agencies, setAgencies] = React.useState<Agency []>([]);
    const [valueRole, setValueRole] = React.useState('Autoriser');
    const [value, setValue] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const itemColors: { [key: string]: string } = {

        'Reception': 'pink',
        'Coordinateur': 'green',
        'Technicien': 'blue',
        'Gestionnaire_de_stocks': 'purple',

    };
React.useEffect(() => {
  if (employe) {
     
    setName({id: employe.id, name: employe.name,})
    setPhone({id: employe.id, phone: employe.phone,})
    setPassword({ id: employe.id,password: '' })
    setLogin({id: employe.id,login: employe.login})
    setRole({id: employe.id,role: employe.role})
    setValueRole(  employe.status )
  }
}, [employe]);
   
const { notify } = useNotification();
const [name, setName] = React.useState({ id: employe.id, name: employe.name, })
const [phone, setPhone] = React.useState({id: employe.id, phone: employe.phone, })
const [password, setPassword] = React.useState({ id: employe.id,password: ''  });
const [status,setStatus] = React.useState({ id: employe.id,status: employe.status,})
const [login,setLogin] = React.useState({ id: employe.id,login: employe.login,})
const [role,setRole] = React.useState({ id: employe.id,role: employe.role,})
const [branch,setBranch] = React.useState({ id: employe.id,branch: employe.branch})   
const roles = [{id: 1, name:'Reception'},{id: 2, name:'Coordinateur'},{id: 3, name:'Technicien'},{id: 4, name:'Gestionnaire_de_stocks'} ]

const branchs = useSelector( (state:RootState) => state.agencies.Agency)
 
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueRole(event.target.value);
  };

  const controlProps = (item: string) => ({
    checked: valueRole === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });
  const handleSelectionAgencie = (ids : number) => {

    setBranch((prev) => ({
    ...prev!,
    model: ids,
  }));
    };
  React.useEffect( () => {
    dispatch(getAgencies())
  }, [dispatch])
const handleSubmit = async (data: Partial<User> & { id: number }) => {
  setIsLoading(true);
  setError(null);

  try {
    
    await dispatch(updateEmployee(data)) 
    .then( ( ) => {
      dispatch(getusers())
      notify("Mise à jour avec succès !", "success");
      open=false
    })
  
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div> 
         
            
       
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Modifier l\'employèe"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
             <form
                        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                             
                        }}
                    >
                         <Stack spacing={2}>
                            <FormControl>
                                <FormLabel> Nom</FormLabel>
                                <Box sx={{display:'flex'}}>
                                    <Input  sx={underlineInputStyles} value={name.name} onChange={(e) => setName({ ...name,  name: e.target.value })} />
                                    <Button size="medium" variant={'outlined'} color="info" style={{width:'160px',marginLeft:'14%'}}
                                       loading={isLoading}  onClick={() => handleSubmit({ id: employe.id, name: name.name })} > Mettre à jour</Button>
                                        
                                </Box>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Tèlèphone </FormLabel>
                                <Box sx={{display:'flex'}}>
                                    <Input type='number' sx={underlineInputStyles} value={phone.phone} onChange={(e) => setPhone({ ...phone, phone: Number(e.target.value) })} />
                                    <Button size="medium" variant={'outlined'} color="info" style={{width:'160px',marginLeft:'14%'}}
                                       loading={isLoading}  onClick={() => handleSubmit({ id: employe.id, phone: phone.phone })}> Mettre à jour</Button>
                                       
                                </Box>
                            </FormControl>

                            <FormControl>
                                <FormLabel> Login</FormLabel>
                                <Box sx={{display:'flex'}}>
                                    <Input type='text' sx={underlineInputStyles} value={login.login} onChange={(e) => setLogin({ ...login, login: e.target.value })} />
                                    <Button size="medium" variant={'outlined'} color="info" style={{width:'160px',marginLeft:'14%'}}
                                       loading={isLoading}  onClick={() => handleSubmit({ id: employe.id, login: login.login })}> Mettre à jour</Button>
                                        
                                </Box>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Mots de passe </FormLabel>
                                <Box sx={{display:'flex'}}>
                                    <Input  type='text' sx={underlineInputStyles} value={password.password}  onChange={(e) => setPassword({ ...password, password: e.target.value })} />
                                    <Button size="medium" variant={'outlined'} color="info" style={{width:'160px',marginLeft:'14%'}}
                                       loading={isLoading}  onClick={() => handleSubmit({ id: employe.id, password: password.password })}> Mettre à jour</Button>
                                        
                                </Box>
                            </FormControl>

                            <FormControl>
                                <FormLabel> Status</FormLabel>
                                <Box sx={{display:'flex'}}>
                                    <Radio {...controlProps('Autoriser')} color="success" /> Autoriser 
                                    <Radio {...controlProps('Bloqué')} color="error" /> Bloqué
                                    <Button size="medium" variant={'outlined'} color="info" style={{width:'160px',marginLeft:'44%'}}
                                        onClick={() => handleSubmit({ id: employe.id, status: valueRole })}
                                            loading={isLoading} > Mettre à jour</Button>

                                </Box>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Role </FormLabel>
                                <Box sx={{display:'flex'}}>

                                  <CustomCheckboxSelector
                                    data={roles}
                                    displayFields={['name']}
                                    returnField="name"
                                      title='Role'
                                   maxSelection={4}
                                    onChange={(values) => setRole({ ...role, role: values  })}
                                  />
                                    
                                    <Button size="medium" variant={'outlined'} color="info" style={{width:'160px',marginLeft:'5px'}}
                                        onClick={() => handleSubmit({ id: employe.id, role: role.role })}  loading={isLoading}> Mettre à jour</Button>

                                </Box>
                            </FormControl>

                     {/*        <FormControl>
                                <FormLabel>Agence </FormLabel>
                                <Box sx={{display:'flex'}}>
                                     <CustomAutocomplete
                                                 data={branchs}
                                                 displayFields={[ 'name']}
                                                 idField="id"
                                                 label=""
                                                 multiple={false}
                                     
                                                   onChange={handleSelectionAgencie}  
                                     
                                               />

                                </Box>
                            </FormControl> */}

                

                         </Stack>
                    </form>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}  loading={isLoading}>Fermer</Button>
           
        </DialogActions>
      </Dialog>
    
      
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
