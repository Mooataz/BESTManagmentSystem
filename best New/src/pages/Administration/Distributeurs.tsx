import React from 'react'
 import { fetchDistributeur, updateDistributeur } from '../../api/administration/Administration';
 import type { TableAction } from '../../Redux/Types/repairTypes';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, FormLabel, Input, Modal, Stack, Typography } from '@mui/material';
import { useNotification } from '../../Componants/NotificationContext';
import DynamicTable from '../../Componants/Global/TableComponat';

interface Distributor {
    id: number; name: string; phone: number; email: string; location: string; taxRegisterNumber: string;
}
 export default function Distributeurs() {
    const { notify } = useNotification();

    const [message, setMessage] = React.useState<Distributor[]>([]);
    const loadDistributeur = async () => {
        try {
            const data = await fetchDistributeur();
            setMessage(data);
        } catch (err) {
                 const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "danger");
        }
    }

    React.useEffect(() => {
        loadDistributeur();
            
    }, []);
     const [open, setOpen] = React.useState(false);
const  handelOpenEdit = (id: number) => {
    setOpen(true);

    }
    const actions: TableAction[] = [{
  icon:<EditIcon style={{color:'#1A9BC3'}}  /> , 
  onClick:(row: any) => handelOpenEdit(row.id)
}/* ,
{
  icon: <PictureAsPdfIcon  style={{color:'#1A9BC3'}} />,
  onClick:(row: any) => CreateRepairPDF(row.id)
} */]
  return (
    <div>
     <caption style={{ width: '200px' }}>Liste des distributeur  </caption>

      <DynamicTable rows={message}
                    
                    columnLabels={{
                      'id': 'Code',
                      'name': 'Nom',
                      'phone': 'Téléphone',
                      'taxRegisterNumber': 'MF',
                      'email': 'E-mail',
                      'location': 'Adresse',
                       
                    }}

                    columnsToShow={[
                      'id',
                      'name',
                      'phone',
                      'taxRegisterNumber',
                      'email',
                      'location',
                       ]}
                      
                    actions = {actions}/>
    </div>
  )
}
{/*<UpdateDistributeur distributeur={row} onUpdate={loadDistributeur} />
    
    function AjouteDistributeur({ onUpdate }: { onUpdate: () => void } ) {
    const [open, setOpen] = React.useState(false);
    const { notify } = useNotification();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({

        name: '',
        phone: 0,
        email: '',
        location: '',
        taxRegisterNumber: ''
    })
    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await addDistributeur(formData);
            setOpen(false);
            onUpdate()
                notify("Ajouter avec succès !", "success");

        } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "danger");

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '60%', marginLeft: '20%' }}>
                <div style={{ marginLeft: '65%', marginBottom: '1%' }}>
                    <Button
                        variant="outlined"
                        color="neutral"
                        startDecorator={<Add />}
                        fullWidth
                        onClick={() => setOpen(true)}
                    >
                        Ajouter un nouvelle Distributeur
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
                        Ajouter un distributeur
                    </Typography>
                    <Typography id="nested-modal-description" textColor="text.tertiary">
                        <Stack spacing={2}>

                            <FormLabel>Nom</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

                            <FormLabel>Téléphone</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} type='number' value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: Number(e.target.value) })} />

                            <FormLabel>Matricule fiscale</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.taxRegisterNumber} onChange={(e) => setFormData({ ...formData, taxRegisterNumber: e.target.value })} />

                            <FormLabel>mail</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

                            <FormLabel>Adresse</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
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
                        <Button variant="solid" color="primary" onClick={handleSubmit} loading={isLoading}> {/*() => setOpen(false) 
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
function UpdateDistributeur({ distributeur, onUpdate }: {distributeur:Distributor; onUpdate: () => void}) {
    const [open, setOpen] = React.useState(false);
    const { notify } = useNotification();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
      const [formData, setFormData] = React.useState({
        id: 0,
        name: '',
        phone: 0,
        email: '',
        location: '',
        taxRegisterNumber: ''
    });

        const handleOpen = () => {
        setFormData({
            id: distributeur.id,
            name: distributeur.name,
            phone: distributeur.phone,
            email: distributeur.email,
            location: distributeur.location,
            taxRegisterNumber: distributeur.taxRegisterNumber
        });
        
    };
    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await updateDistributeur(formData);
            setOpen(false);
            onUpdate()
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
            <Button variant="outlined" color="info" onClick={() => {setOpen(true); handleOpen()}}>
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
                    <Typography id="nested-modal-title"  >
                        Edition d'un distributeur
                    </Typography>
                    <Typography id="nested-modal-description"  >
                        <Stack spacing={2}>

                            <FormLabel>Nom</FormLabel>
                            <Input   sx={underlineInputStyles} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            
                            <FormLabel>Téléphone</FormLabel>
                            <Input   sx={underlineInputStyles} type='number' value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: Number(e.target.value) })} />

                            <FormLabel>Matricule fiscale</FormLabel>
                            <Input   sx={underlineInputStyles} value={formData.taxRegisterNumber} onChange={(e) => setFormData({ ...formData, taxRegisterNumber: e.target.value })} />

                            <FormLabel>mail</FormLabel>
                            <Input   sx={underlineInputStyles} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

                            <FormLabel>Adresse</FormLabel>
                            <Input   sx={underlineInputStyles} value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
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
                        <Button   color="primary" onClick={handleSubmit} loading={isLoading}> {/*() => setOpen(false) 
                            Continue
                        </Button>
                        <Button
                            variant="outlined"
                            color="info"
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
    width: '500px',

};*/}