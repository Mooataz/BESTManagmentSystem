import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import { MdOutlineModeEditOutline } from "react-icons/md";
import { AgencieList } from './Employees';
import { getAgencies } from '../../../api/administration/Agencies';
import RadioGroup from '@mui/joy/RadioGroup';
import Radio, { radioClasses } from '@mui/joy/Radio';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Done from '@mui/icons-material/Done';
import Checkbox from '@mui/joy/Checkbox';
import Sheet from '@mui/joy/Sheet';
import { updateEmployee } from '../../../api/administration/user';
import { useNotification } from '../../../Componants/NotificationContext';


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


export default function Edit({ Employe, onUserUpdated }: { Employe: User; onUserUpdated: () => void }) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [agencies, setAgencies] = React.useState<Agency[]>([]);
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

   
const { notify } = useNotification();
const [name, setName] = React.useState({ id: Employe.id, name: Employe.name, })
const [phone, setPhone] = React.useState({id: Employe.id, phone: Employe.phone, })
const [password, setPassword] = React.useState({ id: Employe.id, password: '' });
const [status,setStatus] = React.useState({ id: Employe.id,status: Employe.status,})
const [login,setLogin] = React.useState({ id: Employe.id,login: Employe.login,})
const [role,setRole] = React.useState({ id: Employe.id,role: Employe.role,})
const [branch,setBranch] = React.useState({ id: Employe.id,branch: Employe.branch})

    React.useEffect(() => {
        getAgencies()
            .then((data) => setAgencies(data));
    }, []);

const handleSubmit = async (data: Partial<User> & { id: number }) => {
  setIsLoading(true);
  setError(null);

  try {
    await updateEmployee(data);
    setOpen(false);
    onUserUpdated();
    notify("Mise à jour avec succès !", "success");

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "danger");
  } finally {
    setIsLoading(false);
  }
};

    return (
        <React.Fragment>
            <Button
                variant="outlined"
                color="neutral"
                /* startDecorator={} */
                onClick={() => setOpen(true)}
            ><MdOutlineModeEditOutline /></Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>Modifications</DialogTitle>
                    <DialogContent>Modifier les points nécessaire </DialogContent>
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
                                            <Input variant="soft" sx={underlineInputStyles} value={name.name} onChange={(e) => setName({ ...name,  name: e.target.value })} />
                                            <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                                            onClick={() => handleSubmit({ id: Employe.id, name: name.name })} > Mettre à jour</Button>
                                        </div>
                                        
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Telephone</FormLabel>
                                        <div style={{display:'flex'}}>
                                        <Input variant="soft" type='number' sx={underlineInputStyles} value={phone.phone} onChange={(e) => setPhone({ ...phone, phone: Number(e.target.value) })} />
                                        <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                                        onClick={() => handleSubmit({ id: Employe.id, phone: phone.phone })}> Mettre à jour</Button>
                                        </div>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Login</FormLabel>
                                        <div style={{display:'flex'}}>
                                        <Input variant="soft" type='text' sx={underlineInputStyles} value={login.login} onChange={(e) => setLogin({ ...login, login: e.target.value })} />
                                        <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                                        onClick={() => handleSubmit({ id: Employe.id, login: login.login })}> Mettre à jour</Button>
                                        </div>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Mots de passe</FormLabel>
                                        <div style={{display:'flex'}}>
                                        <Input variant="soft" type='text' sx={underlineInputStyles} value={password.password}  onChange={(e) => setPassword({ ...password, password: e.target.value })} />
                                        <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                                        onClick={() => handleSubmit({ id: Employe.id, password: password.password })}> Mettre à jour</Button>
                                        </div>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>status</FormLabel>
                                        <div style={{display:'flex'}}>
                                        <RadioGroup
                                            value={valueRole}
                                            onChange={(e) => setValueRole(e.target.value)}
                                            aria-label="platform"
                                            overlay
                                            name="platform"
                                            sx={{
                                                flexDirection: 'row',
                                                gap: 2,
                                                [`& .${radioClasses.radio}`]: {
                                                    display: 'contents',
                                                    '& > svg': {
                                                        zIndex: 2,
                                                        position: 'absolute',
                                                        top: '-8px',
                                                        right: '-8px',
                                                        bgcolor: 'background.surface',
                                                        borderRadius: '50%',
                                                    },
                                                },
                                            }}
                                        >
                                            
                                            <Sheet
                                                variant="soft"
                                                sx={{
                                                    borderRadius: 'md',
                                                    boxShadow: 'sm',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    p: 2,
                                                    minWidth: 120,
                                                    border: '2px solid',
                                                    borderColor: valueRole === 'Autoriser' ? 'green' : 'transparent', // ✅ ici !
                                                }}
                                            >
                                                <Radio
                                                    id="Autoriser"
                                                    value="Autoriser"
                                                    checkedIcon={<CheckCircleRoundedIcon sx={{ color: 'green' }} />}
                                                />
                                                <FormLabel htmlFor="Autoriser">Autoriser</FormLabel>
                                            </Sheet>

                                            {/* Option Non Valable */}
                                            <Sheet
                                                variant="soft"
                                                sx={{
                                                    borderRadius: 'md',
                                                    boxShadow: 'sm',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    p: 2,
                                                    minWidth: 120,
                                                    border: '2px solid',
                                                    borderColor: valueRole === 'Bloqué' ? 'red' : 'transparent', // ✅ ici aussi
                                                }}
                                            >
                                                <Radio
                                                    id="Bloqué"
                                                    value="Bloqué"
                                                    checkedIcon={<CheckCircleRoundedIcon sx={{ color: 'red' }} />}
                                                />
                                                <FormLabel htmlFor="Bloqué">Bloqué</FormLabel>
                                            </Sheet>
                                        </RadioGroup>
                                        <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'46%'}}
                                        onClick={() => handleSubmit({ id: Employe.id, status: valueRole })}
                                            > Mettre à jour</Button>
                                        </div>
                                    </FormControl>
                                 

                                
                                    <FormControl>
                                        <FormLabel>Role</FormLabel>
                                        <div style={{display:'flex'}}>
                                        <Sheet variant="outlined" sx={{ width: 600, p: 2, borderRadius: 'sm' }}>

                                            <div role="group" aria-labelledby="rank">
                                                <List
                                                    orientation="horizontal"
                                                    wrap
                                                    sx={{
                                                        '--List-gap': '8px',
                                                        '--ListItem-radius': '20px',
                                                        '--ListItem-minHeight': '32px',
                                                        '--ListItem-gap': '4px',
                                                    }}
                                                >
                                                    {Object.keys(itemColors).map((item) => {
                                                        const isChecked = value.includes(item);
                                                        const color = itemColors[item];

                                                        return (
                                                            <ListItem key={item}>
                                                                {isChecked && (
                                                                    <Done
                                                                        sx={{ ml: -0.5, zIndex: 2, pointerEvents: 'none', color }}
                                                                    />
                                                                )}
                                                                <Checkbox
                                                                    size="sm"
                                                                    disableIcon
                                                                    overlay
                                                                    label={item}
                                                                    checked={isChecked}
                                                                    variant={isChecked ? 'soft' : 'outlined'}
                                                                    onChange={(event) => {
                                                                        if (event.target.checked) {
                                                                            setValue((val) => [...val, item]);
                                                                        } else {
                                                                            setValue((val) => val.filter((text) => text !== item));
                                                                        }
                                                                    }}
                                                                    slotProps={{
                                                                        action: {
                                                                            sx: {
                                                                                border: `1.5px solid ${color}`,
                                                                                ...(isChecked && {
                                                                                    backgroundColor: `${color}22`, // couleur de fond légère
                                                                                }),
                                                                            },
                                                                        },
                                                                    }}
                                                                />
                                                            </ListItem>
                                                        );
                                                    })}
                                                </List>
                                            </div>
                                        </Sheet>
                                        <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'5px'}}
                                        onClick={() => handleSubmit({ id: Employe.id, role: value })}> Mettre à jour</Button>
                                        </div>
                                    </FormControl>

                                    <FormControl>
                                        <div style={{display:'flex'}}>
                                        <AgencieList
                                            agencies={agencies}
                                            onSelect={(agency) => {
                                                setBranch((prev) => ({
                                                    ...prev,
                                                    branch: agency ?? prev.branch, // remet l'objet complet ici
                                                }));
                                            }}
                                        />
                                        <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'40%'}}
                                        onClick={() => handleSubmit({ id: Employe.id, branch: branch.branch })}> Mettre à jour</Button>
                                        </div>
                                    </FormControl>
 
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
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