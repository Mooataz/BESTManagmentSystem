//Distributeurs
import * as React from 'react';
import Table from '@mui/joy/Table';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import { FormLabel, Input, Stack } from '@mui/joy';
import { addDistributeur, fetchDistributeur, updateDistributeur } from '../../api/Administration';

interface Distributor{
    id : number; name: string; phone : number; email: string; location: string; taxRegisterNumber: string;
}
interface ResponsiveModalProps {
    distributeur: Distributor;
    onUpdateSuccess?: () => void;
  }
export default function Distributeurs() {

    const [message, setMessage] = React.useState<Distributor[]>([]);
React.useEffect(() => {
    fetchDistributeur()
    .then((data) => { setMessage(data) })
})


    return (
        <div>
                
                <AjouteDistributeur />
                
                <div style={{marginLeft:'85%'}}>Total: {message.length}</div>

            <Table aria-label="basic table">
                
            <thead>
                <caption style={{ width: '200px' }}>Liste des distributeurs  </caption>
                <tr>
                    <th style={{ width: '15%' }}>Nom</th>
                    <th style={{ width: '10%' }}>Téléphone</th>
                    <th style={{ width: '10%' }}>Matricule fiscale</th>
                    <th style={{ width: '15%' }}>E-mail</th>
                    <th style={{ width: '25%' }}>Adresse</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                
                {message.map((item, index) => (
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.phone}</td>
                        <td>{item.taxRegisterNumber}</td>
                        <td>{item.email}</td>
                        <td>{item.location}</td>
                        <td>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button size="sm" variant="plain" color="neutral">
                                <UpdateDistributeur distributeur={item}/>
                            </Button>

                        </Box></td>
                </tr>
                ))}
                    


            </tbody>
        </Table>
        </div>
    );
}

function AjouteDistributeur( ) {
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
const [formData, setFormData] = React.useState({
    
    name:'',
    phone:0,
    email:'',
    location:'',
    taxRegisterNumber:''
})
const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await addDistributeur(formData);
      setOpen(false);
    } catch (err) {
      setError('Échec de la mise à jour. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width:'60%', marginLeft:'20%'}}>
            <Button variant="outlined" fullWidth  onClick={() => setOpen(true)}>Ajouter un nouvelle Distributeur</Button>
            </Box>
            <Modal open={open} onClose={() => setOpen(false)} >
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
                            //maxWidth: 'unset',
                            width: 900 
                        },
                    })}
                >
                    <Typography id="nested-modal-title" level="h2">
                        Ajouter un distributeur
                    </Typography>
                    <Typography id="nested-modal-description" textColor="text.tertiary">
                        <Stack spacing={2}>

                            <FormLabel>Nom</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
                            
                            <FormLabel>Téléphone</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} type='number' value={formData.phone} onChange={(e)=>setFormData({...formData,phone: Number(e.target.value)})}  />

                            <FormLabel>Matricule fiscale</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.taxRegisterNumber} onChange={(e)=>setFormData({...formData,taxRegisterNumber: e.target.value})} />

                            <FormLabel>mail</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.email} onChange={(e)=>setFormData({...formData,email: e.target.value})}/>

                            <FormLabel>Adresse</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.location}  onChange={(e)=>setFormData({...formData,location: e.target.value})}/>
                        </Stack>
                    </Typography>
                    <Box
                        sx={{
                            mt: 1,
                            display: 'flex',
                            gap: 1,
                            flexDirection: { xs: 'column', sm: 'row-reverse' },
                        }}
                    >
                        <Button variant="solid" color="primary" onClick={handleSubmit } loading={isLoading}> {/*() => setOpen(false)*/}
                            Enregistrer
                        </Button>
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={() => setOpen(false)}
                        >
                            Annuler
                        </Button>
                    </Box>
                    {error && <Typography color="danger">{error}</Typography>}
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}

function UpdateDistributeur({ distributeur }: ResponsiveModalProps) {
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
const [formData, setFormData] = React.useState({
    id:distributeur.id,
    name:distributeur.name,
    phone:distributeur.phone,
    email:distributeur.email,
    location:distributeur.location,
    taxRegisterNumber:distributeur.taxRegisterNumber
})
const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await updateDistributeur(formData);
      setOpen(false);
    } catch (err) {
      setError('Échec de la mise à jour. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <React.Fragment>
            <Button variant="outlined" color="neutral" onClick={() => setOpen(true)}>
                Editer
            </Button>
            <Modal open={open} onClose={() => setOpen(false)} >
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
                            //maxWidth: 'unset',
                            width: 900 
                        },
                    })}
                >
                    <Typography id="nested-modal-title" level="h2">
                        Edition d'un distributeur
                    </Typography>
                    <Typography id="nested-modal-description" textColor="text.tertiary">
                        <Stack spacing={2}>

                            <FormLabel>Nom</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
                            {formData.name}
                            <FormLabel>Téléphone</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} type='number' value={formData.phone} onChange={(e)=>setFormData({...formData,phone: Number(e.target.value)})}  />

                            <FormLabel>Matricule fiscale</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.taxRegisterNumber} onChange={(e)=>setFormData({...formData,taxRegisterNumber: e.target.value})} />

                            <FormLabel>mail</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.email} onChange={(e)=>setFormData({...formData,email: e.target.value})}/>

                            <FormLabel>Adresse</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.location}  onChange={(e)=>setFormData({...formData,location: e.target.value})}/>
                        </Stack>
                    </Typography>
                    <Box
                        sx={{
                            mt: 1,
                            display: 'flex',
                            gap: 1,
                            flexDirection: { xs: 'column', sm: 'row-reverse' },
                        }}
                    >
                        <Button variant="solid" color="primary" onClick={handleSubmit } loading={isLoading}> {/*() => setOpen(false)*/}
                            Continue
                        </Button>
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={() => setOpen(false)}
                        >
                            Annuler
                        </Button>
                    </Box>
                    {error && <Typography color="danger">{error}</Typography>}
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
    width:'500px',
    
};