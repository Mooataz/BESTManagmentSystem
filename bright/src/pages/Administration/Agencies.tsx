import { getAgencies, updateAgencie } from '../../api/administration/Agencies';
import React, { useEffect } from "react";
import { Box } from "@mui/joy";
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
import { addAgencie } from '../../api/administration/Agencies'; 
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import CardActions from '@mui/joy/CardActions';
import Typography from '@mui/joy/Typography';
import { FcPhone } from "react-icons/fc";
import { MdAlternateEmail } from "react-icons/md";
import { TfiLocationPin } from "react-icons/tfi";
interface Agency {
    id: number;
    name: string;
    phone: number;
    email: string;
    location: string;
}

export function Agencies() {
    const [agencies, setAgencies] = React.useState<Agency[]>([]);
    
    React.useEffect(() => {
        getAgencies()
            .then((data) => setAgencies(data))
     } );

    return (
        <Box sx={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            boxSizing: 'border-box'
        }}>
            {/* Header avec bouton à droite */}
            <Box sx={{
                width: '100%',
                display: 'flex',
                 marginLeft:'75%',
                mb: 2,
                position: 'sticky',
                top: 0,
                backgroundColor: 'background.paper',
                zIndex: 1,
                py: 1
            }}>
                <AddAgence />
            </Box>

            {/* Liste des agences avec défilement */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2, // espace entre les cartes
                maxWidth: '1200px',
                margin: '0 auto',
              }}
            >
              {agencies.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    flex: '1 1 calc(33.333% - 16px)', // 3 éléments par ligne avec gap
                    boxSizing: 'border-box',
                  }}
                >
                  <BioCard item={item} />
                </Box>
              ))}
            </Box>

        </Box>
    );
}





 interface BioCardProps {
    item: {
        id: number;
        name: string;
        phone: number;
        email: string;
        location: string;
    };
    // Supprimez 'agencie' si vous ne l'utilisez pas
}
interface Agencies {
    agencie:{
        id: number; name: string; phone: number; email: string; location: string;
    }
}
 
export   function BioCard({item}: BioCardProps) {
   return (
    <Card sx={{ width: 320, maxWidth: '100%', boxShadow: 'lg' }}>
      <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
          
        <Typography level="title-lg">{item.name}</Typography>
        <Typography level="body-sm" sx={{ maxWidth: '24ch' }}>
        
        <FcPhone /> {item.phone} <br/>
        <MdAlternateEmail /> {item.email} <br/>
        <TfiLocationPin /> {item.location} <br/>

        </Typography>
       
      </CardContent>
      <CardOverflow sx={{ bgcolor: 'background.level1' }}>
        <CardActions buttonFlex="1">
          <UpdateAgence agencie={item}/>
        </CardActions>
      </CardOverflow>
    </Card>
  );
}




 

 
export   function AddAgence() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
   const { notify } = useNotification();
  const [formData, setFormData] = React.useState ({  
      
    name:'',
      email: '', 
      location: '',
      phone: '',
      company:'',
        
  })

  useEffect(() => {
    async function fetchCompany() {
      const company = await getCompany();
      setFormData((prev) => ({
        ...prev,
        company: company.id, // une fois la promesse résolue
      }));
    }

    fetchCompany();
  }, []);
  const handleSubmit = async () => {
      setIsLoading(true);
      setError(null);
          notify("Agence Ajouter avec succès !", "success");

      try {
        await addAgencie(formData);
        setOpen(false);
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
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
      >
        Nouvelle agence
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Ajouter un agence</DialogTitle>
          <DialogContent>Remplissez les informations de l'agence.</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Nom</FormLabel>
                <Input variant="soft" sx={underlineInputStyles} value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
              </FormControl> 

              <FormControl>
                <FormLabel>Telephone</FormLabel>
                <Input variant="soft" type='number' sx={underlineInputStyles} value={formData.phone} onChange={(e)=>setFormData({...formData,phone:e.target.value})} />
              </FormControl> 

              <FormControl>
                <FormLabel>E-mail</FormLabel>
                <Input variant="soft" type='mail' sx={underlineInputStyles} value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})}/>
              </FormControl> 

              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input variant="soft" type='text' sx={underlineInputStyles} value={formData.location} onChange={(e)=>setFormData({...formData,location:e.target.value})}/>
              </FormControl> 

              <Button type="submit" onClick={handleSubmit } loading={isLoading}>Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
import { MdOutlineModeEdit } from "react-icons/md";
import { getCompany } from '../../api/administration/Company';
import { useNotification } from '../Componants/NotificationContext';

export   function UpdateAgence({agencie}:Agencies) {
   const { notify } = useNotification();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    
    const [open, setOpen] = React.useState<boolean>(false);
    const [formData, setFormData] = React.useState({  
        id:agencie.id,
        name:agencie.name,
        email: agencie.email, 
        location: agencie.location,
        phone: agencie.phone,
          
    })
    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          await updateAgencie(formData);
          setOpen(false);
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
          startDecorator={<MdOutlineModeEdit />}
          onClick={() => setOpen(true)}
        >
           
        </Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog>
            <DialogTitle>Modifier l'agence</DialogTitle>
            <DialogContent>Modifier les informations de l'agence.</DialogContent>
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setOpen(false);
              }}
            >
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Nom</FormLabel>
                  <Input variant="soft" sx={underlineInputStyles} value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
                </FormControl> 
  
                <FormControl>
                  <FormLabel>Telephone</FormLabel>
                  <Input variant="soft" type='number' sx={underlineInputStyles} value={formData.phone} onChange={(e)=>setFormData({...formData,phone: Number(e.target.value)})} />
                </FormControl> 
  
                <FormControl>
                  <FormLabel>E-mail</FormLabel>
                  <Input variant="soft" type='mail' sx={underlineInputStyles} value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})}/>
                </FormControl> 
  
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input variant="soft" type='text' sx={underlineInputStyles} value={formData.location} onChange={(e)=>setFormData({...formData,location:e.target.value})}/>
                </FormControl> 
  
                <Button type="submit" onClick={handleSubmit } loading={isLoading}>Envoyé</Button>
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
    width:'500px',
    
};