import React, { useState } from 'react'
import type { TypeUnique } from '../../../Redux/Types/repairTypes';
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import type { TransitionProps } from '@mui/material/transitions';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Input, Slide, Stack } from '@mui/material';
import { AddRepairAction, getRepairAction } from '../../../Redux/Actions/Administration/ActionRepairActions';
interface UpdateProps {
    action: any;
    open: boolean;
    onClose: () => void;
}
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function UpdateRepairActions({ action, open, onClose }: UpdateProps) {

    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const [isLoading, setIsLoading] = React.useState(false);
    const [description, setDescription] = useState<TypeUnique>({
        id: action.id,
        name: action.name,
    })

    React.useEffect(() => {
        if (action) {
            setDescription({ id: action.id, name: action.name })
        }
    }, [action]);

        const handleSubmit = async () => {
            const result = await dispatch(AddRepairAction(description));
            if (AddRepairAction.fulfilled.match(result)) {
                dispatch(getRepairAction( ))
                notify('Action modifier avec succès', 'success');
                onClose( );
            } else {
                notify(result.payload as string || 'Erreur lors de l’ajout', 'error');
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
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Modifier un action après diagnostique"}</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <FormControl>
                        <FormLabel> Action</FormLabel>
                        <Box sx={{ display: 'flex' }}>
                            <Input sx={underlineInputStyles} value={description.name} onChange={(e) => setDescription({ ...description, name: e.target.value })} />
                            <Button size="medium" variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                onClick={() => handleSubmit()} > Mettre à jour</Button>

                        </Box>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fermer</Button>

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
    width: '500px',

};