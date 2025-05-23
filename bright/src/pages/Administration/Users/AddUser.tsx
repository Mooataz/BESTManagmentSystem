import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import {   getAgencies } from '../../../api/administration/Agencies';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { addEmployee } from '../../../api/administration/user';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/joy/Modal';
import { AgencieList } from './Employees';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Done from '@mui/icons-material/Done';
import Checkbox from '@mui/joy/Checkbox';
import { useNotification } from '../../Componants/NotificationContext';
import { useTranslation } from 'react-i18next';
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
    createdDate: string;
    status: string;
    login: string;
    role: string[];
    branch?: number
};
 
export function AddUser({ onUserAdded }: { onUserAdded: () => void } ) {
    const [agencies, setAgencies] = React.useState<Agency[]>([]); 
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState<boolean>(false);
    const [valueRole, setValueRole] = React.useState('Autoriser');
     const [value, setValue] = React.useState<string[]>([]);
const { t } = useTranslation();
const {notify} = useNotification();
    //const [listAgence, setListAgennce] = React.useState([])
    const itemColors: { [key: string]: string } = {

        'Reception': 'pink',
        'Coordinateur': 'green',
        'Technicien': 'blue',
        'Gestionnaire_de_stocks': 'purple',

    };


    const [formData, setFormData] = React.useState<Users>({

        name: '',
        phone: 0,
        password: '',
        createdDate: '',
        status: '',
        login: '',
        role: [] as string[],
        branch: 0
    })
 const navigate = useNavigate();

         React.useEffect(() => {
            getAgencies()
                .then((data) => setAgencies(data));
        }, []);

  
    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        
       const updatedFormData = {
            ...formData,
            createdDate:Date(),
            status: valueRole,
            role: value, // un tableau de rôles
            };
        try {
            await addEmployee(updatedFormData);
             setOpen(false)
             onUserAdded();
             notify("Ajouter avec succès !", "success");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "danger");        } 
        finally {
            setIsLoading(false);
        }
    };
    return (

                 
               
 <React.Fragment>
      <Button
        variant="outlined"
        color="neutral"
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
      >
         {t('nvUser')}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>{t('addUser')}</DialogTitle>
          <DialogContent>{t('NoteAdd')}</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <Stack spacing={2}>

               <div style={{display:'flex'}}>
                                <div>
                                    <FormControl>
                                        <FormLabel>{t('Nom')}</FormLabel>
                                        <Input variant="soft" sx={underlineInputStyles} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>{t('Tel')}</FormLabel>
                                        <Input variant="soft" type='number' sx={underlineInputStyles} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: Number(e.target.value) })} />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>{t('Login')}</FormLabel>
                                        <Input variant="soft" type='text' sx={underlineInputStyles} value={formData.login} onChange={(e) => setFormData({ ...formData, login: e.target.value })} />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>{t('password')}</FormLabel>
                                        <Input variant="soft" type='text' sx={underlineInputStyles} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>{t('status')}</FormLabel>
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
                                                <FormLabel htmlFor="Autoriser">{t('Autoriser')} </FormLabel>
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
                                                    borderColor: valueRole === 'Non Valable' ? 'red' : 'transparent', // ✅ ici aussi
                                                }}
                                            >
                                                <Radio
                                                    id="Bloqué"
                                                    value="Bloqué"
                                                    checkedIcon={<CheckCircleRoundedIcon sx={{ color: 'red' }} />}
                                                />
                                                <FormLabel htmlFor="Bloqué">{t('Bloqué')}</FormLabel>
                                            </Sheet>
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                                <div style={{marginLeft:'2%'}}>
                                    <FormControl>
                                        <FormLabel>{t('Role')}</FormLabel>
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
                                                                    label={t(item)}
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
                                    </FormControl>

                                    <FormControl>
                                         
                                        <AgencieList agencies={agencies} onSelect={(agency) => {
                                            setFormData((prev) => ({
                                            ...prev,
                                            branch: agency ? agency.id : 0
                                            }));
                                        }} />
                                          
                                    </FormControl>
                                </div>
                            </div>

              <Button type="submit" onClick={handleSubmit} loading={isLoading}>Submit</Button>
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