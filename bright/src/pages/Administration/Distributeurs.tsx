//Distributeurs
import * as React from 'react';
import Table from '@mui/joy/Table';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import { FormLabel, Input, Stack } from '@mui/joy';
import { addDistributeur, fetchDistributeur, updateDistributeur } from '../../api/administration/Administration';
import Add from '@mui/icons-material/Add';
import { useNotification } from '../../Componants/NotificationContext';

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


    return (
        <div>

            <AjouteDistributeur onUpdate={loadDistributeur}/>

            <div style={{ marginLeft: '85%' }}>Total: {message.length}</div>

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
                                        <UpdateDistributeur distributeur={item} onUpdate={loadDistributeur} />
                                    </Button>

                                </Box></td>
                        </tr>
                    ))}



                </tbody>
            </Table>
        </div>
    );
}

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
                        <Button variant="solid" color="primary" onClick={handleSubmit} loading={isLoading}> {/*() => setOpen(false)*/}
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