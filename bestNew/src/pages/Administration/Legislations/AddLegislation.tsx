import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Input, Slide } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React, { useState } from 'react'
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import type { TypeUnique } from '../../../Redux/Types/repairTypes';
import { addLegislation, getLegislations } from '../../../Redux/Actions/Administration/Legislation';
import theme from '../../../Theme/theme';
import AddIcon from '@mui/icons-material/Add';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function AddLegislation() {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => { setOpen(true); };

    const handleClose = () => { setOpen(false); };

    const [description, setDescription] = useState<TypeUnique>({

        name: ''
    })

    const handleSubmit = async () => {
        try {
            await dispatch(addLegislation(description)).then(() => {
                dispatch(getLegislations())
                setOpen(false);
                notify('Ajouter avec success');

            })
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");
        }
    }
    return (
            <React.Fragment>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
                startIcon={<AddIcon />}
                sx={{
                    borderColor: theme.palette.primary.main,
                    marginLeft: '70%'
                }}>
                Ajouter un legislation
            </Button>
            <br /><br />
            <Dialog
                open={open}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Ajouter un legislation"}</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <FormLabel>  Description </FormLabel>
                        <Input sx={underlineInputStyles} value={description.name} onChange={(e) => setDescription( {...description, name: e.target.value} )} />
                         
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleSubmit}>Confirmer</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
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