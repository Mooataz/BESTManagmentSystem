import React, { useEffect } from 'react'
import { addAgencie, getAgencies, updateAgencie } from '../../api/administration/Agencies';
import { Box, Divider, FormControl, FormControlLabel, FormLabel, Input, InputLabel, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { MdOutlineModeEdit } from "react-icons/md";
import { getCompany } from '../../api/administration/Company';
  import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import Add from '@mui/icons-material/Add';
import { useNotification } from '../../Componants/NotificationContext';

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
 
export default function Agencies() {
        const [agencies, setAgencies] = React.useState<Agency[]>([]);
    
    React.useEffect(() => {
        getAgencies()
            .then((data) => setAgencies(data))
     } );
  return (
    <div>
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
               
                
                  <SelectActionCard branches={agencies} />
                 
               
            </Box>
        </Box>
    </div> 
  )
}
type Props = {
  branches: Agency[];
};
function SelectActionCard({branches}:Props ) {
  const [selectedCard, setSelectedCard] = React.useState(0);
  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 2,
      }}
    >
      {branches.map((card, index) => (
        <Card sx={{margin:'30px'}}>
          <CardActionArea
            onClick={() => setSelectedCard(index)}
            data-active={selectedCard === index ? '' : undefined}
            sx={{
               width:'100%', // 3 éléments par ligne avec gap
                    boxSizing: 'border-box',
              
            }}
          >
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h5" component="div">
                {card.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.location}
              </Typography>
              <Typography> {card.phone} </Typography>
              <Typography> {card.email} </Typography>
               <Divider />
          <UpdateAgence agencie={card}/>
            </CardContent>
            
          </CardActionArea>
         
        </Card>
      ))}
    </Box>
  );
}
 interface Agencies {
    agencie:{
        id: number; name: string; phone: number; email: string; location: string;
    }
}
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
 
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
       <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        <MdOutlineModeEdit />
      </Button>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Modifier l'agence"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Modifier les informations de l'agence.  </DialogContentText>
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setOpen(false);
              }}
            > <Stack spacing={3}>
            <FormControl>
                <FormLabel>Nom</FormLabel>
                <Input   sx={underlineInputStyles} value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})}/>  
            </FormControl> 

            <FormControl>
                  <FormLabel>Telephone</FormLabel>
                  <Input   type='number' sx={underlineInputStyles} value={formData.phone} onChange={(e)=>setFormData({...formData,phone: Number(e.target.value)})} />
                </FormControl> 
  
                <FormControl>
                  <FormLabel>E-mail</FormLabel>
                  <Input   type='mail' sx={underlineInputStyles} value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})}/>
                </FormControl> 
  
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input   type='text' sx={underlineInputStyles} value={formData.location} onChange={(e)=>setFormData({...formData,location:e.target.value})}/>
                </FormControl> 
                </Stack>
 
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit } loading={isLoading}>Enregistrer</Button>
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
    width:'500px',
    
};  

 
export   function AddAgence() {
    const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
   const { notify } = useNotification();
  const [formData, setFormData] = React.useState ({  
      
    name:'',
      email: '', 
      location: '',
      phone: 0,
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
    <div>
             <React.Fragment>
        

      <Button   variant="outlined"  
                onClick={() => setOpen(true)}>
                <MdOutlineModeEdit />{'  Nouvelle agence'}
      </Button>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
         onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Modifier l'agence"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Modifier les informations de l'agence.  </DialogContentText>
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setOpen(false);
              }}
            > <Stack spacing={3}>
            <FormControl>
                <FormLabel>Nom</FormLabel>
                <Input   sx={underlineInputStyles} value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})}/>  
            </FormControl> 

            <FormControl>
                  <FormLabel>Telephone</FormLabel>
                  <Input   type='number' sx={underlineInputStyles} value={formData.phone} onChange={(e)=>setFormData({...formData,phone: Number(e.target.value)})} />
                </FormControl> 
  
                <FormControl>
                  <FormLabel>E-mail</FormLabel>
                  <Input   type='mail' sx={underlineInputStyles} value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})}/>
                </FormControl> 
  
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input   type='text' sx={underlineInputStyles} value={formData.location} onChange={(e)=>setFormData({...formData,location:e.target.value})}/>
                </FormControl> 
                </Stack>
 
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSubmit } loading={isLoading}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
    </div>
  )
}

 