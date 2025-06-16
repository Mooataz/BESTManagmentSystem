//ListProblemes
import { FormLabel, Input, Stack } from '@mui/joy';
import * as React from "react";
import Table from '@mui/joy/Table';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import { addListProbleme, deleteProblem, fetchListProbleme, updateListProbleme } from '../../api/administration/Administration';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DeleteForever from '@mui/icons-material/DeleteForever';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import Tooltip from '@mui/joy/Tooltip';
import AdjustIcon from '@mui/icons-material/Adjust';
import Add from '@mui/icons-material/Add';
import { useNotification } from '../../Componants/NotificationContext';

interface ListProbleme {
    id: number; name: string;
}
interface ResponsiveModalProps {
    listProbleme: ListProbleme;
    onUpdateSuccess?: () => void;
  }
  
  export default function ListProblemes() {
    const [message, setMessage] = React.useState<ListProbleme[]>([]);
    React.useEffect(() => {
        fetchListProbleme()
            .then((data) => { setMessage(data) })
    })

    return (
        <div>
            <AjouteListProbleme />
            <div style={{marginLeft:'85%'}}>Total: {message.length}</div>

            <Table aria-label="basic table">
                <thead>
                    <caption style={{ width: '200px' }}>Liste des problémes  </caption>
                    <tr>
                        <th style={{ width: '15%' }}>Panne</th>
                        
                         
                    </tr>
                </thead>
                <tbody>

                    {message.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            
                            <td>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button size="sm" variant="plain" color="neutral">
                                        <UpdateListProbleme listProbleme ={item} />
                                    </Button>
                                    <Button size="sm" variant="plain" color="neutral">
                                        <DeleteProblem listProbleme ={item} />
                                    </Button>
                                </Box></td>
                        </tr>
                    ))}

                </tbody>
            </Table>
        </div>
    )
} 
function DeleteProblem ({ listProbleme }:ResponsiveModalProps) {
    const { notify } = useNotification();

    const [open, setOpen] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({
        id:listProbleme.id,
        name:listProbleme.name,
    })

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          await deleteProblem(formData.id);
          setOpen(false);
              notify(" succès !", "success");

        } catch (err) {
           
          const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "danger");
        } finally {
          setIsLoading(false);
        }
      };
    return(
        <div>
    <Tooltip
      placement="right"
      variant="outlined"
      arrow
      title={
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 320,
            justifyContent: 'left',
            p: 1,
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, width: '100%', mt: 1 }}>
            <AdjustIcon color="error" />
            <div>
              <Typography sx={{ fontWeight: 'lg', fontSize: 'sm' }}>
                Noter bien :
              </Typography>

              <Typography textColor="text.secondary" sx={{ fontSize: 'sm', mb: 1 }}>
                Si element qui va supprimer déja relationner avec un autre donc ne sera pas effacer
              </Typography>
               
              
            </div>
          </Box>
        </Box>
      }
    >  
      <Button
        variant="outlined"
        color="danger"
        endDecorator={<DeleteForever />}
        onClick={() => setOpen(true)}
      >
        Supprime
      </Button>

      </Tooltip>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
          Vous êtes sûr ? Vous voulez supprimer ?
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger"  onClick={handleSubmit } loading={isLoading}>
              Supprime
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
              Annuler
            </Button>
          </DialogActions>
          {error && <Typography color="danger">{error}</Typography>}

        </ModalDialog>
      </Modal>
         </div>
    )
}
function AjouteListProbleme( ) {
    const { notify } = useNotification();

    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
const [formData, setFormData] = React.useState({  
    name:'',
})
const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await addListProbleme(formData);
      setOpen(false);
          notify("Ajoute avec succès !", "success");

    } catch (err) {
       
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "danger");
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width:'60%', marginLeft:'20%'}}>
              <div style={{ marginLeft: '65%', marginBottom: '1%' }}>
                    <Button
                    variant="outlined"
                    color="neutral"
                    startDecorator={<Add />}
                     fullWidth  onClick={() => setOpen(true)}
                    >
                    Ajouter un nouvelle panne
                    </Button>
                </div>
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
                        Ajouter un probléme
                    </Typography>
                    <Typography id="nested-modal-description" textColor="text.tertiary">
                        <Stack spacing={2}>

                            <FormLabel>Nom</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
                            
                            
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
function UpdateListProbleme({ listProbleme }: ResponsiveModalProps) {
  const { notify } = useNotification();

    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
const [formData, setFormData] = React.useState({
    id:0,
    name:'',
    
})
       const handleOpen = () => {
        setFormData({
            id:listProbleme.id,
            name:listProbleme.name,
        });
        
    };
const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await updateListProbleme(formData);
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
            <Button variant="outlined" color="neutral" onClick={() => {setOpen(true);handleOpen()}}>
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
                        Edition d'un panne
                    </Typography>
                    <Typography id="nested-modal-description" textColor="text.tertiary">
                        <Stack spacing={2}>

                            <FormLabel>Panne</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
                            
                            
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