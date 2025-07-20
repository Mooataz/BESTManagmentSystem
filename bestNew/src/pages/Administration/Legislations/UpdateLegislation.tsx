import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Input, Slide, Stack } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import type { TypeUnique } from '../../../Redux/Types/repairTypes';
import { getLegislations, UpdateLegislations } from '../../../Redux/Actions/Administration/Legislation';
interface UpdateLegislationProps {
    legislation: any;
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
export default function UpdateLegislation({ legislation, open, onClose }: UpdateLegislationProps) {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const [isLoading, setIsLoading] = React.useState(false);
    const [description, setDescription] = useState<TypeUnique>({
        id: legislation.id,
        name: legislation.name
    })
    const handleSubmit = async (data: Partial<TypeUnique> & { id: number }) => {
        setIsLoading(true);
        try {
            await dispatch(UpdateLegislations(description))
                .then(() => {
                    dispatch(getLegislations())
                    notify("Mise à jour avec succès !", "success");
                    onClose()
                    setIsLoading(false);
                })
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");
        }

    }

    useEffect(() => {
        if (legislation) {
            setDescription({
                id: legislation.id,
                name: legislation.name
            });
        }
    }, [legislation]);
    return (
        <Box>
            <Dialog
                open={open}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={onClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Modifier legislation"}</DialogTitle>
                <DialogContent>
                    <form
                        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();

                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel> Description</FormLabel>
                                <Box sx={{ display: 'flex' }}>
                                    <Input sx={underlineInputStyles} value={description.name} onChange={(e) => setDescription({ ...description, name: e.target.value })} />
                                    <Button size="medium" variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                        onClick={() => handleSubmit({ id: legislation.id, name: description.name })} > Mettre à jour</Button>

                                </Box>
                            </FormControl>

                        </Stack>

                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Fermer</Button>

                </DialogActions>
            </Dialog>
        </Box>
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
