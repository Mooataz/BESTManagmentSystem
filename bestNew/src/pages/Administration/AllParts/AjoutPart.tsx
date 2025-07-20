import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import type { TransitionProps } from '@mui/material/transitions';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Input, Slide } from '@mui/material';
import type { FormAllParts } from '../../../Redux/Types/administrationTypes';
import { useNotification } from '../../../Componants/NotificationContext';
import { useAppDispatch } from '../../../Redux/hooks';
import { AddOnePart, getAllPart } from '../../../Redux/Actions/Administration/ListAllPart';
import theme from '../../../Theme/theme';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function AjoutPart() {
        const dispatch = useAppDispatch();
            const { notify } = useNotification();
            const [open, setOpen] = React.useState(false);
        
            const handleClickOpen = () => { setOpen(true); };
        
            const handleClose = () => { setOpen(false); };
        
            const [description, setDescription] = useState<FormAllParts>({
                
                description:''
            })

                       const handleSubmit = async () => {
                            try {
                                await dispatch(AddOnePart(description )).then(() => {
                                    dispatch(getAllPart())
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
                Ajouter une pièce
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
                <DialogTitle>{"Ajouter un nouvelle pièce"}</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <FormLabel>  Description </FormLabel>
                        <Input sx={underlineInputStyles} value={description.description} onChange={(e) => setDescription( {...description, description: e.target.value} )} />
                         
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