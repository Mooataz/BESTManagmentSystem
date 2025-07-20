import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Input, Slide, Stack } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React, { useState } from 'react'
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import type { LevelRepairForm } from '../../../Redux/Types/administrationTypes';
import { getLevelRepair, UpdateOnelevelRepair } from '../../../Redux/Actions/Administration/levelRepairActions';
 const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface UpdateLevelRepairProps {
    levelRepair: any;
    open: boolean;
    onClose: () => void;
}
export default function UpdatelevelRepair({ levelRepair, open, onClose }: UpdateLevelRepairProps) {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const [isLoading, setIsLoading] = React.useState(false);
    const [description, setDescription] = useState<LevelRepairForm>({
        id: levelRepair.id,
        name: levelRepair.name,
        price: levelRepair.price,
    })
    React.useEffect(() => {
        if (levelRepair) {
            setDescription({
                id: levelRepair.id,
                name: levelRepair.name,
                price: levelRepair.price
            })
        }
    }, [levelRepair]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Envoie les données exactement comme attendu par le backend
            const updateData = {
                id: description.id,
                name: description.name,
                price: description.price
            };

               await dispatch(UpdateOnelevelRepair (updateData)).unwrap();
              await dispatch(getLevelRepair());  

            notify("Mise à jour avec succès !", "success");
            onClose();
        } catch (err) {
            notify(err instanceof Error ? err.message : "Erreur inconnue", "error");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Dialog
            open={open}
            slots={{
                transition: Transition,
            }}
            keepMounted
            onClose={onClose}
            aria-describedby="alert-dialog-slide-description">
            <DialogTitle>{"Modifier un niveau de rèparation"}</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <FormControl>
                        <FormLabel> Nom</FormLabel>
                        <Box sx={{ display: 'flex' }}>
                            <Input sx={underlineInputStyles} value={description.name} onChange={(e) => setDescription({ ...description, name: e.target.value })} />
                            <Button size="medium" variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                onClick={() => handleSubmit()} > Mettre à jour</Button>

                        </Box>
                    </FormControl>

                    <FormControl>
                        <FormLabel> Prix</FormLabel>
                        <Box sx={{ display: 'flex' }}>
                            <Input sx={underlineInputStyles} value={description.price} onChange={(e) => setDescription({ ...description, price:Number(e.target.value)  })} type='number'/>
                            <Button size="medium" variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                onClick={() => handleSubmit()} > Mettre à jour</Button>

                        </Box>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} >Fermer</Button>
            </DialogActions>
        </Dialog>


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
    width: '400px',

};