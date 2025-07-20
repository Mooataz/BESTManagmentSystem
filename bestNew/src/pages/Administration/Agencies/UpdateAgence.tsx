import React from "react";
import { useNotification } from "../../../Componants/NotificationContext";
import { getAgencies, updateAgencie } from "../../../Redux/Actions/Administration/AgenciesActions";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormLabel, Input, Slide, Stack } from "@mui/material";
import { MdOutlineModeEdit } from "react-icons/md";
import type { TransitionProps } from "@mui/material/transitions";
import { useAppDispatch } from "../../../Redux/hooks";

 const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

 interface Agencies {
    agencie:{
        id: number; name: string; phone: number; email: string; location: string;
    }
}

export   function UpdateAgence({agencie}:Agencies) {
    const { notify } = useNotification ();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const dispatch = useAppDispatch();
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
          await dispatch(updateAgencie(formData)) ;
          dispatch(getAgencies())
          setOpen(false);
              notify("Mise à jour avec succès !", "success");

        } catch (err) {
               const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");
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