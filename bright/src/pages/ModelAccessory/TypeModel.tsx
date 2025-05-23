import * as React from 'react';
import Table from '@mui/joy/Table';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import { FormLabel, Input, Stack } from '@mui/joy';
import Add from '@mui/icons-material/Add';
import { useNotification } from "../Componants/NotificationContext";
import { addTypeModel, fetchTypeModel, updateTypeModel } from '../../api/ModelAccessory/TypeModel';

interface Type {
    id: number;
    description: string;
}

export function TypeModel() {
    const { notify } = useNotification();
    const [message, setMessage] = React.useState<Type[]>([]);
    const loadTypeModel = async () => {
        try {
            const data = await fetchTypeModel();
            setMessage(data);
        } catch (error) {
            notify('Erreur', 'danger')
        }
    }

    React.useEffect(() => {
        loadTypeModel();

    }, []);
    return (
        <div>
            <AjouteTypeModel onUpdate={loadTypeModel}/>

            <div style={{ marginLeft: '85%' }}>Total: {message.length}</div>

            <Table aria-label="basic table">

                <thead>
                    <caption style={{ width: '200px' }}>Liste des Type modéle  </caption>
                    <tr>
                        <th style={{ width: '15%' }}>Nom</th>
                        
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {message.map((item, index) => (
                        <tr key={index}>
                            <td>{item.description}</td>
                             
                            <td>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button size="sm" variant="plain" color="neutral">
                                        <UpdatesTypeModel typeModel={item} onUpdate={loadTypeModel} />
                                    </Button>

                                </Box></td>
                        </tr>
                    ))}



                </tbody>
            </Table>
        </div>
    )
}

function AjouteTypeModel({ onUpdate }: { onUpdate: () => void } ) {
    const [open, setOpen] = React.useState(false);
    const { notify } = useNotification();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({

        description: '',
         
    })
    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await addTypeModel(formData);
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
                        onClick={() => {setOpen(true);setFormData( {...formData, description:''})}}
                    >
                        Ajouter un nouvelle Type
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
                        Ajouter un Type
                    </Typography>
                    <Typography id="nested-modal-description" textColor="text.tertiary">
                        <Stack spacing={2}>

                            <FormLabel>Nom</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                          
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
                        <Button variant="solid" color="primary" onClick={handleSubmit} loading={isLoading}> {/*() => setOpen(false)*/}
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
function UpdatesTypeModel({ typeModel,onUpdate }: {typeModel:Type; onUpdate: () => void}) {
  const { notify } = useNotification();

    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
const [formData, setFormData] = React.useState({
    id:0,
    description:'',
    
})
       const handleOpen = () => {
        setFormData({
            id:typeModel.id,
            description:typeModel.description,
        });
        
    };
const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await updateTypeModel(formData);
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
                        Edition un type modéle
                    </Typography>
                    <Typography id="nested-modal-description" textColor="text.tertiary">
                        <Stack spacing={2}>

                            <FormLabel>Panne</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.description} onChange={(e)=>setFormData({...formData,description:e.target.value})}/>
                            
                            
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
    width: '500px',

};