import * as React from 'react';
import Table from '@mui/joy/Table';
import { getusers } from '../../api/user';
import { VscStarEmpty } from "react-icons/vsc";

type User = {
    id: number;
    name: string;
    phone: number;
    password: string;
    createdDate: string;
    status: string;
    login: string;
    role: string[];
    branch?: {
        name: string;
    };
};
const roleColors: Record<string, string> = {
    Administarteur: 'gold',
    Reception: 'pink',
    Coordinateur: 'green',
    Technicien: 'blue',
    Gestionnaire_de_stocks: 'purple',
};

export default function TableHover() {
    const [users, setUsers] = React.useState<User[]>([]);
const [showForm, setShowForm] = React.useState(false);

    React.useEffect(() => {
        async function fetchUsers() {
            try {
                const usersData = await getusers();
                setUsers(usersData); // stocke les utilisateurs
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs', error);
            }
        }

        fetchUsers();
    }, []);
    return (
        <div>
            <h3 style={{ marginRight: '90%' }}>Employées</h3>
                <div style={{ marginLeft: '85%', marginBottom: '1%' }}>
                    <Button
                    variant="outlined"
                    color="neutral"
                    startDecorator={<Add />}
                    onClick={() => setShowForm(true)}
                    >
                    Nouvelle Employée
                    </Button>
                </div>            
                    {showForm ? (
                    <AddUser onCloseForm={() => setShowForm(false)} />
                ) : (             
                <Table hoverRow>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Telephone</th>
                        <th>Date d'inscription</th>
                        <th>Status</th>
                        <th>Login</th>
                        <th>Role</th>
                        <th>Agence</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((row: any, index) => (
                        <tr key={row.id}>
                            <td>{row.name}</td>
                            <td>{row.phone}</td>
                            <td>{row.createdDate}</td>
                            <td>{row.status}</td>
                            <td>{row.login}</td>
                            <td>
                                {Array.isArray(row.role)
                                    ? row.role.map((rl: string, idx: number) => (
                                        <div key={idx}><VscStarEmpty color={roleColors[rl]} />{rl}</div>
                                    ))
                                    : '-'}
                            </td>

                            <td>{row.branch?.name || '-'}</td>
                        </tr>
                    ))}

                </tbody>
            </Table>
            )}
        </div>
    );
}


import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import { addAgencie, getAgencies } from '../../api/Agencies';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Checkbox from '@mui/joy/Checkbox';
import Done from '@mui/icons-material/Done';
import Box from '@mui/joy/Box';
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
   const [agencies, setAgencies] = React.useState<Agency[]>([]);
export function AddUser({ onCloseForm }: { onCloseForm: () => void }) {

    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState<boolean>(false);
    const [valueRole, setValueRole] = React.useState('Valable');
    const [valueAgence, setValueAgence] = React.useState('')
    const [value, setValue] = React.useState<string[]>([]);

    //const [listAgence, setListAgennce] = React.useState([])
    const itemColors: { [key: string]: string } = {

        'Reception': 'pink',
        'Coordinateur': 'green',
        'Technicien': 'blue',
        'Gestionnaire_de_stocks': 'purple',

    };


    const [formData, setFormData] = React.useState({

        name: '',
        phone: '',
        password: '',
        createdDate: '',
        status: '',
        login: '',
        role: '',
        branch: 0
    })

    const [agencies, setAgencies] = React.useState<Agency[]>([]);

    React.useEffect(() => {
        getAgencies()
            .then((data) => setAgencies(data))
    });
    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        onCloseForm()

        try {
            //await addAgencie(formData);
            setOpen(false);
        } catch (err) {
            setError('Échec de la mise à jour. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <React.Fragment>
           {/*  <Button
                variant="outlined"
                color="neutral"
                startDecorator={<Add />}
                onClick={() => setOpen(true)}
            >
                Nouvelle Employée
            </Button> */}
            {/* <Modal open={open} onClose={() => setOpen(false)}> */}
                <ModalDialog>
                    <DialogTitle>Ajouter un Employée</DialogTitle>
                    <DialogContent>Remplissez les informations de l'Employée.</DialogContent>
                    <form
                        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            onCloseForm()
                        }}
                    >
                        <Stack spacing={2}>
                            <div style={{display:'flex'}}>
                                <div>
                                    <FormControl>
                                        <FormLabel>Nom</FormLabel>
                                        <Input variant="soft" sx={underlineInputStyles} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Telephone</FormLabel>
                                        <Input variant="soft" type='number' sx={underlineInputStyles} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Login</FormLabel>
                                        <Input variant="soft" type='text' sx={underlineInputStyles} value={formData.login} onChange={(e) => setFormData({ ...formData, login: e.target.value })} />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Mots de passe</FormLabel>
                                        <Input variant="soft" type='text' sx={underlineInputStyles} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>status</FormLabel>
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
                                            {/* Option Valable */}
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
                                                    borderColor: valueRole === 'Valable' ? 'green' : 'transparent', // ✅ ici !
                                                }}
                                            >
                                                <Radio
                                                    id="Valable"
                                                    value="Valable"
                                                    checkedIcon={<CheckCircleRoundedIcon sx={{ color: 'green' }} />}
                                                />
                                                <FormLabel htmlFor="Valable">Valable</FormLabel>
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
                                                    id="NonValable"
                                                    value="Non Valable"
                                                    checkedIcon={<CheckCircleRoundedIcon sx={{ color: 'red' }} />}
                                                />
                                                <FormLabel htmlFor="NonValable">Non Valable</FormLabel>
                                            </Sheet>
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                                <div style={{marginLeft:'2%'}}>
                                    <FormControl>
                                        <FormLabel>Role</FormLabel>
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
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Agence</FormLabel>
                                        <Box sx={{ width: 300 }}>
                                            <RadioGroup
                                                aria-labelledby="storage-label"
                                                value={valueAgence}
                                                onChange={(event) => setValueAgence(event.target.value)}
                                                size="lg"
                                                sx={{ gap: 1.5 }}
                                            >
                                                {agencies.map((agency) => (
                                                    <Sheet
                                                        key={agency.id}
                                                        sx={{ p: 2, borderRadius: 'md', boxShadow: 'sm' }}
                                                    >
                                                        <Radio
                                                            label={agency.name}
                                                            overlay
                                                            disableIcon
                                                            value={agency.name}
                                                            slotProps={{
                                                                label: ({ checked }) => ({
                                                                    sx: {
                                                                        fontWeight: 'lg',
                                                                        fontSize: 'md',
                                                                        color: checked ? 'text.primary' : 'text.secondary',
                                                                    },
                                                                }),
                                                                action: ({ checked }) => ({
                                                                    sx: (theme) => ({
                                                                        ...(checked && {
                                                                            '--variant-borderWidth': '2px',
                                                                            '&&': {
                                                                                borderColor: theme.vars.palette.primary[500],
                                                                            },
                                                                        }),
                                                                    }),
                                                                }),
                                                            }}
                                                        />
                                                    </Sheet>
                                                ))}
                                            </RadioGroup>
                                        </Box> 

                                          
                                    </FormControl>

                                    <Button type="submit" onClick={handleSubmit} loading={isLoading}>Submit</Button>
                                </div>
                            </div>





                        </Stack>
                    </form>
                </ModalDialog>
            {/* </Modal> */}
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


/* import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

 

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export  function AgencieList() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly Agency[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
    (async () => {
      setLoading(true);
      await sleep(1e3); // For demo purposes.
      setLoading(false);

      setOptions([...agencies]);
    })();
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <Autocomplete
      sx={{ width: 300 }}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Agence"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
} */