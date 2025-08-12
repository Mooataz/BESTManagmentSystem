import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormLabel, Input, Slide } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React, { useEffect } from 'react'
import { useNotification } from '../../../Componants/NotificationContext';
import { useAppDispatch } from '../../../Redux/hooks';
import type { PartPriceForm } from '../../../Redux/Types/Stock';
import AddIcon from '@mui/icons-material/Add';
import theme from '../../../Theme/theme';
import { CustomAutocomplete } from '../../../Componants/Global/CustomAutocomplete';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { getModelsAuthorised } from '../../../Redux/Actions/ModelAndAccessory/Models';
import { getAllPart } from '../../../Redux/Actions/Administration/ListAllPart';
import { getLevelRepair } from '../../../Redux/Actions/Administration/levelRepairActions';
import { AddOnePartPrice, getAllPartPrice } from '../../../Redux/Actions/stock/PartPriceActions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function AddPartPrice() {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const [open, setOpen] = React.useState(false);
    const models = useSelector((state: RootState) => state.models.models);
    const allParts = useSelector((state: RootState) => state.allParts.allParts);
    const LevelRepair = useSelector((state: RootState) => state.LevelRepair.levelRepair);

    useEffect(() => {
        dispatch(getModelsAuthorised());
        dispatch(getAllPart());
        dispatch(getLevelRepair())
    }, [dispatch])
    const [formData, setFormData] = React.useState<PartPriceForm>({
        price: 0,
        model: 0,
        allPart: 0,
        levelRepair: 0,
    })


    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    const handleSubmit = async () => {



        try {
            await dispatch(AddOnePartPrice(formData));
            setOpen(false)
            dispatch(getAllPartPrice());
            notify("Ajouter avec succès !", "success");
           /*  setFormData({
                price: 0,
                model: 0,
                allPart: 0,
                levelRepair: 0,
            }) */

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");
        }

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
                Ajouter un prix
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
                <DialogTitle>{"Ajouter un nouvelle Prix"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-prix">
                        <FormControl>
                            <FormLabel>  Prix </FormLabel>
                            <Input sx={underlineInputStyles}
                                value={formData.price}
                                type='number'
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                        </FormControl> <br />


                        <CustomAutocomplete
                            data={models}
                            displayFields={['name']}
                            idField="id"
                            label="Modèle"
                            multiple={false}
                            onChange={(val) => setFormData({ ...formData, model: val })}

                        /> <br />
                        <CustomAutocomplete
                            data={allParts}
                            displayFields={['description']}
                            idField="id"
                            label="Pièce"
                            multiple={false}
                            onChange={(val) => setFormData({ ...formData, allPart: val })}

                        /> <br />
                        <CustomAutocomplete
                            data={LevelRepair}
                            displayFields={['name', 'price']}
                            idField="id"
                            label="Niveau rèparation"
                            multiple={false}
                            onChange={(val) => setFormData({ ...formData, levelRepair: val })}

                        />



                    </DialogContentText>
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
    width: '400px',

};