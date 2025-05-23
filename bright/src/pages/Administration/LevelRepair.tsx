import { FormLabel, Input, Stack } from '@mui/joy';
import * as React from "react";
import Table from '@mui/joy/Table';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Add from '@mui/icons-material/Add';
import { useNotification } from '../Componants/NotificationContext';
import { addLevelRepair, getLevelRepair, updatePrice } from '../../api/administration/LevelRepair';
import FormControl from '@mui/joy/FormControl';
interface Price {
    id?: number;
    name: string;
    price: number;
}
interface ResponsiveModalProps {
    price: Price;

}
export function LevelRepair() {
    const [message, setMessage] = React.useState<Price[]>([]);
    React.useEffect(() => {
        getLevelRepair()
            .then((data) => { setMessage(data) })
    })
    return (
        <div>
            <AjouteLevel />
            <div style={{ marginLeft: '85%' }}>Total: {message.length}</div>

            <Table aria-label="basic table">
                <thead>
                    <caption style={{ width: '200px' }}>Niveau des réparation </caption>
                    <tr>
                        <th style={{ width: '15%' }}>Niveau</th>
                        <th style={{ width: '15%' }}>Prix</th>
                            <th></th>

                    </tr>
                </thead>
                <tbody>

                    {message.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button size="sm" variant="plain" color="neutral">
                                        <UpdateLevelRepair price={item} />
                                    </Button>

                                </Box></td>
                        </tr>
                    ))}

                </tbody>
            </Table>
        </div>
    )
}

export function AjouteLevel() {
    const { notify } = useNotification();

    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({
        name: '',
        price: 0,
    })
    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await addLevelRepair(formData);
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
        <div>
            <React.Fragment>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '60%', marginLeft: '20%' }}>
                    <div style={{ marginLeft: '65%', marginBottom: '1%' }}>
                        <Button
                            variant="outlined"
                            color="neutral"
                            startDecorator={<Add />}
                            fullWidth onClick={() => setOpen(true)}
                        >
                            Ajouter un niveau
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
                            Ajouter un niveau de réparation
                        </Typography>
                        <Typography id="nested-modal-description" textColor="text.tertiary">
                            <Stack spacing={2}>

                                <FormLabel>Nom</FormLabel>
                                <Input variant="soft" sx={underlineInputStyles} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                <FormLabel>Prix</FormLabel>
                                <Input variant="soft" sx={underlineInputStyles} type='number' value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />


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
        </div>
    )
}

export function UpdateLevelRepair({ price }: ResponsiveModalProps) {
    const { notify } = useNotification();
    
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState<Price>({
        id: 0,
        name:  '',
        price: 0,
    });
      const handleOpen = () => {
        setFormData({
             id: price.id,
            name: price.name,
            price: price.price,
        });
        
    };
    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await updatePrice(formData);
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
        <div>
            <React.Fragment>
                <Button variant="outlined" color="neutral" onClick={() => {setOpen(true); handleOpen() }}>
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
                            Edition d'un Piéce
                        </Typography>
                        <Typography id="nested-modal-description" textColor="text.tertiary">
                            <Stack spacing={2}>
 
    <FormControl>
      <FormLabel>Nom</FormLabel>
      <Input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <FormLabel sx={{ mt: 2 }}>Prix</FormLabel>
      <Input
        type="number"
        value={formData.price}
        onChange={(e) =>
          setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
        }
      />

       
    </FormControl>

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
    width: '500px',

};