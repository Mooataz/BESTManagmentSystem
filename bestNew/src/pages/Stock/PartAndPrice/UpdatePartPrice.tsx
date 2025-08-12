import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormLabel, Input, Slide, Stack } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React, { useEffect, useState } from 'react'
import type { PartPriceForm } from '../../../Redux/Types/Stock';
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import { getAllPartPrice, UpdateOnePartPrice } from '../../../Redux/Actions/stock/PartPriceActions';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { CustomAutocomplete } from '../../../Componants/Global/CustomAutocomplete';
import { getLevelRepair } from '../../../Redux/Actions/Administration/levelRepairActions';
interface UpdateProps {
    partPrice: PartPriceForm;
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
export default function UpdatePartPrice({ partPrice, open, onClose }: UpdateProps) {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const LevelRepair = useSelector((state: RootState) => state.LevelRepair.levelRepair);
    const [isLoading, setIsLoading] = React.useState(false);
    const [description, setDescription] = useState<PartPriceForm>({
        id: partPrice.id,
        price: partPrice.price,
        model: partPrice.model,
        allPart: partPrice.allPart,
        levelRepair: partPrice.levelRepair,

    })

    React.useEffect(() => {
        if (partPrice) {

            setDescription({
                id: partPrice.id,
                price: partPrice.price,
                model: partPrice.model,
                allPart: partPrice.allPart,
                levelRepair: partPrice.levelRepair,

            })

        }
    }, [partPrice]);
    useEffect(() => {

        dispatch(getLevelRepair())
    }, [dispatch])
    const handleSubmit = async (data: Partial<PartPriceForm> & { id: number }) => {
        setIsLoading(true)
        try {


            await dispatch(UpdateOnePartPrice(data)).then(() => {
                dispatch(getAllPartPrice());
                onClose();
                setIsLoading(false)
                notify('Mise à jour avec succès');
            });
        } catch (error) {
            console.error(error);
        }
    };
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

            <DialogContent>
                <DialogTitle>{"Modification"}</DialogTitle>
                <DialogContentText>{'Modifier un prix ou un niveau de réparation'}</DialogContentText>
                <Stack spacing={2}>
                    <br />

                    <FormLabel>  Prix </FormLabel>
                    <Box sx={{ display: 'flex' }}>
                        
                            
                            <Input sx={underlineInputStyles}
                                value={description.price}
                                type='number'
                                onChange={(e) => setDescription({ ...description, price: Number(e.target.value) })} />
                        
                        <Button size="medium" variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                            onClick={() => handleSubmit({ id: description.id!, price: description.price })} > Mettre à jour</Button>
                    </Box>
                    <br />
                    <Box sx={{ display: 'flex' }}>
                        <CustomAutocomplete
                            data={LevelRepair}
                            displayFields={['name', 'price']}
                            idField="id"
                            label="Niveau rèparation"
                            multiple={false}
                            onChange={(val) => setDescription({ ...description, levelRepair: val })}

                        />
                        <Button size="medium" variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                            onClick={() => handleSubmit({ id: description.id!, levelRepair: description.levelRepair })} > Mettre à jour</Button>
                    </Box>
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
    width: '400px',

};