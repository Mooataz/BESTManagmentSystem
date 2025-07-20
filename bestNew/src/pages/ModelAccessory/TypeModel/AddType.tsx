import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import type { TransitionProps } from '@mui/material/transitions';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Input, Slide } from '@mui/material';
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import type { TypeModel } from '../../../Redux/Types/repairTypes';
import { AjoutTypeModel, GetAllTypeModel } from '../../../Redux/Actions/ModelAndAccessory/TypeModelActions';
import theme from '../../../Theme/theme';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function AddType() {
    const dispatch = useAppDispatch();
        const { notify } = useNotification();
        const [open, setOpen] = React.useState(false);
    
        const handleClickOpen = () => { setOpen(true); };
    
        const handleClose = () => { setOpen(false); };
    
        const [description, setDescription] = useState<TypeModel>({
            description: '',
        })
            const handleSubmit = async () => {
                try {
                    if(!description.description   ) {
                    notify('veuiller remplire toutes les doneès','error');
                    return
                }
                    await dispatch(AjoutTypeModel(description)).then(() => {
                        dispatch(GetAllTypeModel())
                        setOpen(false);
                        notify('Ajouter  avec success')
                    })
                } catch (error) {
                    
                }
        
            }
  return (
    <div>
              <React.Fragment>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
                startIcon={<AddIcon />}
                sx={{
                    borderColor: theme.palette.primary.main,
                    marginLeft: '70%'
                }}>
                Ajouter un type
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
                <DialogTitle>{"Ajouter un type"}</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <FormLabel>  Nom </FormLabel>
                        <Input sx={underlineInputStyles} value={description.description} onChange={(e) => setDescription({ ...description, description: e.target.value })} />

                    </FormControl><br/><br/>
                  

                
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleSubmit}>Confirmer</Button>
                </DialogActions>
            </Dialog>
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