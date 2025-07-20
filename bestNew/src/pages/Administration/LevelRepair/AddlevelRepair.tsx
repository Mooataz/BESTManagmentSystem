import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Input, Slide } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import theme from '../../../Theme/theme';
import AddIcon from '@mui/icons-material/Add';
import type { LevelRepairForm } from '../../../Redux/Types/administrationTypes';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { getMarques } from '../../../Redux/Actions/Administration/MarquesActions';
 import { AddLevelRepair, getLevelRepair } from '../../../Redux/Actions/Administration/levelRepairActions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function AddlevelRepair() {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const marques = useSelector((state: RootState) => state.Marques.Marque);

    useEffect(() => {
        dispatch(getMarques())
    }, [dispatch])

    const [open, setOpen] = React.useState(false);
    const [formLevel, setFormLevel] = useState<LevelRepairForm>({
        name: '',
        price: 0,
        brand: 0,
    })
    const handleClickOpen = () => { setOpen(true); };

    const handleClose = () => { setOpen(false); };
    const handleSubmit = async () => {
        if(!formLevel.name || !formLevel.price ) {
            notify('veuiller remplire toutes les doneès','error');
            return
        }
        try {
            await dispatch(AddLevelRepair(formLevel)).then(() => {
                dispatch(getLevelRepair());
                setOpen(false);
                notify('Le niveau ajouter avec success');
            })
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");
        }
    }

    const handleSelectionBrand = async (ids: number) => {
    setFormLevel({ ...formLevel, brand: ids });
  };
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
                Ajouter un niveau
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
                <DialogTitle>{"Ajouter un nouvelle Niveau"}</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <FormLabel>  Nom de niveau </FormLabel>
                        <Input sx={underlineInputStyles} value={formLevel.name} onChange={(e) => setFormLevel({ ...formLevel, name: e.target.value })} />
                    </FormControl>  <br /><br />
                    <FormControl>
                        <FormLabel>  Prix </FormLabel>
                        <Input sx={underlineInputStyles} value={formLevel.price} onChange={(e) => setFormLevel({ ...formLevel, price: Number(e.target.value) })} type='number' />
                    </FormControl> <br /><br />
                   {/*  <CustomAutocomplete
                                data={marques}
                                displayFields={[ 'name']}
                                idField="id"
                                label="Client"
                                multiple={false}
                                onChange={handleSelectionBrand}
                              /> */}
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