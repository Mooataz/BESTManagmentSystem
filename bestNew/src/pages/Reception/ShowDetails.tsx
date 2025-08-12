import React from 'react'
import { useAppDispatch } from '../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import { getOneRepair } from '../../Redux/Actions/Reception/repairAction';
import { Backdrop, Box, Button, DialogActions, Fade, Modal, Step, StepLabel, Stepper, Typography } from '@mui/material';
import ShowStepper from '../../Componants/Global/ShowStepper';
import theme from '../../Theme/theme';
import { BiFullscreen } from 'react-icons/bi';
type EditRepairModelProps = {
    open: boolean;              // ✅ type primitif
    onClose: () => void;        // ✅ c'est une fonction
    idRepair: number;
    isLoading: boolean;         // ✅ type primitif
    onSubmit?: () => void;      // optionnel si tu veux le gérer plus tard
};
const style = {
  position: 'relative' as const,
  margin: '5% auto',
  width: '90%',
  maxWidth: '1000px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // centre horizontalement
};


 
export default function ShowDetails({
    open,
    onClose,
    idRepair,
    onSubmit,
    isLoading
}: EditRepairModelProps) {
    const dispatch = useAppDispatch();
    const oneRepair = useSelector((state: RootState) => state.repair.oneRepair);

    React.useEffect(() => {
        if (open) {
            if (idRepair) {
                dispatch(getOneRepair(idRepair));

            }
        }

    }, [dispatch, idRepair]);
 
    return (
        <div>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                open={open}
                onClose={onClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { TransitionComponent: Fade } }}
            >
                <Fade in={open} >
                    <Box sx={style }>
                        {isLoading ? (
                            <Typography>Chargement...</Typography>
                        ) : oneRepair?.historyRepair ? (
                            <ShowStepper rows={oneRepair.historyRepair} />
                        ) : (
                            <Typography>Aucune donnée disponible</Typography>
                        )}

                        <Typography sx={{ color: theme.palette.primary.main }}>List des accessoires</Typography>
                        {oneRepair?.accessory && oneRepair.accessory.length > 0 ? (
                            oneRepair.accessory.map((item) => (
                                <li key={item.id}>{item.name}</li>
                            ))
                        ) : (
                            <Typography sx={{   color: 'gray' }}>vide</Typography>
                        )}
                        <br />


                        <Typography sx={{ color: theme.palette.primary.main }}>List des problèmes dèclarer</Typography>
                        {oneRepair?.listFault?.map((item) => {

                            return <li key={item.id}>{item.name}</li>;
                        })} <br />

                        <Typography sx={{ color: theme.palette.primary.main }}>Remarque</Typography>
                        {oneRepair?.remark?.trim() ? (
                            <Typography>{oneRepair.remark}</Typography>
                        ) : (
                            <Typography sx={{    color: 'gray' }}>vide</Typography>
                        )}

                        <Typography sx={{ color: theme.palette.primary.main }}>List des demandes client</Typography>
                        {oneRepair?.customerRequest && oneRepair.customerRequest.length > 0 ? (
                            oneRepair.customerRequest.map((item) => (
                                <li key={item.id}>{item.name}</li>
                            ))
                        ) : (
                            <Typography sx={{ color: 'gray' }}>vide</Typography>
                        )}
                        <br />

                        <DialogActions>
                            <Button onClick={() => onClose()}>Fermer</Button>
                        </DialogActions>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}
