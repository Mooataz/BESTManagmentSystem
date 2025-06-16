import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Favorite from '@mui/icons-material/Favorite';
import { getCompany, updateCompany } from '../../api/administration/Company';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import ButtonGroup from '@mui/joy/ButtonGroup';
import CardActions from '@mui/joy/CardActions';
import { getusers, updateEmployee } from '../../api/administration/user';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import { MdOutlineModeEditOutline } from "react-icons/md";
import { useNotification } from '../../Componants/NotificationContext';
 
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
    branch:  Agency
};
interface Company {
  id: number;
  name: string;
  headquarterslocation: string;
  taxRegisterNumber: string;
  rib: number;
  logo: string;
  bank: string;
  quantityAlertStock: number;
}

export function Entreprise() {
const [company, setCompany] = React.useState<Company | null>(null);
const { notify } = useNotification();

  const fetchCompany = async () => {
    try {
      const usersData = await getCompany();
      setCompany(usersData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "danger");

    }
  };
    const [users, setUsers] = React.useState<User[]>([]);

    const fetchUsers = async () => {
        try {
            const usersData = await getusers();
            setUsers(usersData);
        } catch (error) {
            notify('Erreur lors de la récupération Administrateur', "danger");
        }
    };

    React.useEffect(() => {
        fetchCompany();
        fetchUsers();
    }, []);
   return (
    <div>
      <Card variant="outlined" sx={{ width: '50%', marginLeft: '25%' }}>
        <CardOverflow>
          <AspectRatio ratio="2">
            <img
              src={company?.logo ? `http://localhost:3000/upload/company/${company.logo}` : "https://via.placeholder.com/150"}
               loading="lazy"
              alt="Logo de l'entreprise"
            />
            
          </AspectRatio>
          <IconButton
            aria-label="Like minimal photography"
            size="md"
            variant="solid"
            color="neutral"
            sx={{
              position: 'absolute',
              zIndex: 2,
              borderRadius: '50%',
              right: '1rem',
              bottom: 0,
              transform: 'translateY(50%)',
            }}
          >
            <Favorite />
          </IconButton>
        </CardOverflow>
        <CardContent>
          <Typography level="title-md">
            <Link href="#multiple-actions" overlay underline="none">
              Nom: {company?.name} <br />

            </Link>
          </Typography>
          <Typography level="body-sm">
            <Link href="#multiple-actions">
              Adresse: {company?.headquarterslocation}<br />
              MF: {company?.taxRegisterNumber}
            </Link>
          </Typography>
        </CardContent>
        <CardOverflow variant="soft">
          <Divider inset="context" />
          <CardContent orientation="horizontal">
            <Typography level="body-xs">Banque: {company?.bank}</Typography>
            <Divider orientation="vertical" />
            <Typography level="body-xs">RIB: {company?.rib}</Typography>
            <Divider orientation="vertical" />
            <Typography level="body-xs">Alert stock: {company?.quantityAlertStock}</Typography>
            {company && (
              <UpdatesCompany Company={company} onCompanyUpdated={fetchCompany} />
              )}
          </CardContent>

        </CardOverflow>
      </Card> <br/>
       {users
      .filter((row: User) => row.role?.includes("Administrateur"))
      .map((row: User, index) => (
      <div><BioCard   row={row} onUserUpdated={fetchUsers} /> <br/></div>))} 

       
    </div>
  )
}




export function UpdatesCompany({ Company, onCompanyUpdated }: { Company: Company; onCompanyUpdated: () => void }) {
  const [open, setOpen] = React.useState(false);
  const { notify } = useNotification();

  const [name, setName] = React.useState({ id: Company.id, name: Company.name, })
  const [headquarterslocation, setHeadquarterslocation] = React.useState({ id: Company.id, headquarterslocation: Company.headquarterslocation, })
  const [taxRegisterNumber, setTaxRegisterNumber] = React.useState({ id: Company.id, taxRegisterNumber: Company.taxRegisterNumber, })
  const [rib, setRib] = React.useState({ id: Company.id, rib: Company.rib, })
  const [bank, setBank] = React.useState({ id: Company.id, bank: Company.bank, })
  const [quantityAlertStock, setQuantityAlertStock] = React.useState({ id: Company.id, quantityAlertStock: Company.quantityAlertStock, })



  // logo: string;

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (data: Partial<Company> & { id: number }) => {
     
    setIsLoading(true);
    setError(null);

    try {
      await updateCompany(data);
       
      setOpen(false);
      onCompanyUpdated();
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
      <Button variant="outlined" color="neutral" onClick={() => setOpen(true)}
        style={{ marginLeft: '40%' }}
        startDecorator={<AutoFixHighIcon />}>
        Modifier
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="nested-modal-title"
          aria-describedby="nested-modal-description"
          sx={(theme) => ({
            [theme.breakpoints.only('xs')]: {
              top: 'unset',
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 0,
              transform: 'none',
              maxWidth: 'unset',
            },
          })}
        >
          <Typography id="nested-modal-title" level="h2">
            Modifier
          </Typography>
          <Typography id="nested-modal-description" textColor="text.tertiary">

          </Typography>

          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Nom</FormLabel>
                <div style={{ display: 'flex' }}>
                  <Input variant="soft" sx={underlineInputStyles} value={name.name} onChange={(e) => setName({ ...name, name: e.target.value })} />
                  <Button size="md" variant={'outlined'} color="neutral" style={{ width: '160px', marginLeft: '14%' }}
                    onClick={() => handleSubmit({ id: Company.id, name: name.name })} > Mettre à jour</Button>
                </div>
              </FormControl>
            <FormControl>
              <FormLabel>Adresse</FormLabel>
                <div style={{display:'flex'}}>
                  <Input variant="soft" sx={underlineInputStyles} value={headquarterslocation.headquarterslocation} onChange={(e) => setHeadquarterslocation({ ...headquarterslocation,  headquarterslocation: e.target.value })} />
                   <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                      onClick={() => handleSubmit({ id: Company.id, headquarterslocation: headquarterslocation.headquarterslocation })} > Mettre à jour</Button>
                 </div>
                                        
            </FormControl>
            <FormControl>
              <FormLabel>MF</FormLabel>
                <div style={{display:'flex'}}>
                  <Input variant="soft" sx={underlineInputStyles} value={taxRegisterNumber.taxRegisterNumber} onChange={(e) => setTaxRegisterNumber({ ...taxRegisterNumber,  taxRegisterNumber: e.target.value })} />
                   <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                      onClick={() => handleSubmit({ id: Company.id, taxRegisterNumber: taxRegisterNumber.taxRegisterNumber })} > Mettre à jour</Button>
                 </div>
                                        
            </FormControl>
            <FormControl>
              <FormLabel>RIB</FormLabel>
                <div style={{display:'flex'}}>
                  <Input variant="soft" sx={underlineInputStyles}  type='number' value={rib.rib} onChange={(e) => setRib({ ...rib,  rib: Number(e.target.value) })} />
                   <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                      onClick={() => handleSubmit({ id: Company.id, rib: rib.rib })} > Mettre à jour</Button>
                 </div>
                                        
            </FormControl>
            <FormControl>
              <FormLabel>Banque</FormLabel>
                <div style={{display:'flex'}}>
                  <Input variant="soft" sx={underlineInputStyles} value={bank.bank} onChange={(e) => setBank({ ...bank,  bank: e.target.value })} />
                   <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                      onClick={() => handleSubmit({ id: Company.id, bank: bank.bank })} > Mettre à jour</Button>
                 </div>
                                        
            </FormControl>
                        <FormControl>
              <FormLabel>Alert stock</FormLabel>
                <div style={{display:'flex'}}>
                  <Input variant="soft" sx={underlineInputStyles}  type='number' value={quantityAlertStock.quantityAlertStock} onChange={(e) => setQuantityAlertStock({ ...quantityAlertStock,  quantityAlertStock: Number(e.target.value) })} />
                   <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                      onClick={() => handleSubmit({ id: Company.id, quantityAlertStock: quantityAlertStock.quantityAlertStock })} > Mettre à jour</Button>
                 </div>
                                        
            </FormControl>
            </Stack>
          </form>


          <Box
            sx={{
              mt: 1,
              display: 'flex',
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row-reverse' },
            }}
          >
            
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </Box>
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



export default function BioCard({ row, onUserUpdated }: { row: User; onUserUpdated: () => void }) {
  return (
    <Card sx={{ width: '30%', maxWidth: '100%', boxShadow: 'lg', marginLeft:'35%' }}>
      <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Avatar src="/static/images/avatar/1.jpg" sx={{ '--Avatar-size': '4rem' }} />
        <Chip
          size="sm"
          variant="soft"
          color="primary"
          sx={{
            mt: -1,
            mb: 1,
            border: '3px solid',
            borderColor: 'background.surface',
          }}
        >
          {row.role}
        </Chip>
        <Typography level="title-lg">{row.name}</Typography>
        <Typography level="body-sm" sx={{ maxWidth: '24ch' }}>
             Téléphone: {row.phone} <br/>
             login: {row.login}

        </Typography>
      
      </CardContent>

      <CardOverflow sx={{ bgcolor: 'background.level1' }}>
        <CardActions buttonFlex="1">
          <ButtonGroup variant="outlined" sx={{ bgcolor: 'background.surface' }}>
            
            <EditAdmin row={row} onUserUpdated={onUserUpdated} />
          </ButtonGroup>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}
export  function EditAdmin({ row, onUserUpdated }: { row: User; onUserUpdated: () => void }) {
    const [open, setOpen] = React.useState<boolean>(false);
    const { notify } = useNotification();

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

   

const [name, setName] = React.useState({ id: row.id, name: row.name, })
const [phone, setPhone] = React.useState({id: row.id, phone: row.phone, })
const [password, setPassword] = React.useState({ id: row.id, password: '' });
 const [login,setLogin] = React.useState({ id: row.id,login: row.login,})
 

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
                                            onClick={() => handleSubmit({ id: row.id, name: name.name })} > Mettre à jour</Button>
                                        </div>
                                        
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Telephone</FormLabel>
                                        <div style={{display:'flex'}}>
                                        <Input variant="soft" type='number' sx={underlineInputStyles} value={phone.phone} onChange={(e) => setPhone({ ...phone, phone: Number(e.target.value) })} />
                                        <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                                        onClick={() => handleSubmit({ id: row.id, phone: phone.phone })}> Mettre à jour</Button>
                                        </div>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Login</FormLabel>
                                        <div style={{display:'flex'}}>
                                        <Input variant="soft" type='text' sx={underlineInputStyles} value={login.login} onChange={(e) => setLogin({ ...login, login: e.target.value })} />
                                        <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                                        onClick={() => handleSubmit({ id: row.id, login: login.login })}> Mettre à jour</Button>
                                        </div>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Mots de passe</FormLabel>
                                        <div style={{display:'flex'}}>
                                        <Input variant="soft" type='text' sx={underlineInputStyles} value={password.password}  onChange={(e) => setPassword({ ...password, password: e.target.value })} />
                                        <Button size="md" variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                                        onClick={() => handleSubmit({ id: row.id, password: password.password })}> Mettre à jour</Button>
                                        </div>
                                    </FormControl>

                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}