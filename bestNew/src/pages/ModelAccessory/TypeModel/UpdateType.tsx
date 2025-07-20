import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Input, Slide, Stack } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React, { useState } from 'react'
import type { TypeModel } from '../../../Redux/Types/repairTypes';
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import { GetAllTypeModel, UpdateTypeModel } from '../../../Redux/Actions/ModelAndAccessory/TypeModelActions';
interface UpdateProps {
    typeModel: any;
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
export default function UpdateType({ typeModel, open, onClose }: UpdateProps) {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const [isLoading, setIsLoading] = React.useState(false);
    const [description, setDescription] = useState<TypeModel>({
        id: typeModel.id,
        description: typeModel.description,

    })
    React.useEffect(() => {
        if (typeModel) {

            setDescription({ id: typeModel.id, description: typeModel.description })

        }
    }, [typeModel]);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await dispatch(UpdateTypeModel(description))
                .then(() => {
                    dispatch(GetAllTypeModel())
                    notify("Mise à jour avec succès !", "success");
                    onClose()
                    setIsLoading(false);
                })
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");
        }

    }
    return (
        <div>
       <Dialog
                open={open}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={onClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Modifier un accessoire"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel> Nom</FormLabel>
                            <Box sx={{ display: 'flex' }}>
                                <Input sx={underlineInputStyles} value={description.description} onChange={(e) => setDescription({ ...description, description: e.target.value })} />
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