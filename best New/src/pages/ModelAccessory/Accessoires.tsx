import React from 'react'
import { fetchAccessoire } from '../../api/administration/Administration';
  import type { TableAction } from '../../Redux/Types/repairTypes';
import EditIcon from '@mui/icons-material/Edit';
import { useNotification } from '../../Componants/NotificationContext';
import DynamicTable from '../../Componants/Global/TableComponat';
interface Accessoire {
    id: number; name: string;
}
interface ResponsiveModalProps {
    accessoire: Accessoire;
    onUpdateSuccess?: () => void;
  }
  
export default function Accessoires() {
        const [message, setMessage] = React.useState<Accessoire[]>([]);
    React.useEffect(() => {
        fetchAccessoire()
            .then((data) => { setMessage(data) })
    })
  const { notify } = useNotification();

   const [open, setOpen] = React.useState(false);
  const  handelOpenEdit = (id: number) => {
    setOpen(true);

    }
const actions: TableAction[] = [{
  icon:<EditIcon style={{color:'#1A9BC3'}}  /> , 
  onClick:(row: any) => handelOpenEdit(row.id)
} ]
  return (
    <div>                    <caption style={{ width: '200px' }}>Liste des accessoires  </caption>

      <DynamicTable 
                    rows={message}
                    
                    columnLabels={{
                      'id': 'Code',
                      'name': 'Nom' 
                    }}

                    columnsToShow={[
                      'id',
                      'name',
                      ]}
                      
                    actions = {actions}/>
    </div>
  )
}
{/* <AjouteAccessoire />
    <UpdateAccessoire accessoire={item} />

    function AjouteAccessoire( ) {
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
      await addAccessoire(formData);
      setOpen(false);
          notify("Accessoire Ajouter avec succès !", "success");

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
                            fullWidth onClick={() => setOpen(true)}
                        >
                           Ajouter un nouvelle accessoire
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
                        Ajouter un accessoire
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
                        <Button variant="solid" color="primary" onClick={handleSubmit } loading={isLoading}> {/*() => setOpen(false) 
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
function UpdateAccessoire({ accessoire }: ResponsiveModalProps) {
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
                id:accessoire.id,
                name:accessoire.name,
        });
        setOpen(true);
    };
const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await updateAccessoire(formData);
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
            <Button variant="outlined" color="neutral" onClick={() => {setOpen(true); handleOpen()}}>
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
                        <Button variant="solid" color="primary" onClick={handleSubmit } loading={isLoading}> {/*() => setOpen(false) 
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
    
};*/}