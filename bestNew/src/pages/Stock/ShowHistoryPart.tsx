import React from 'react'
import { useAppDispatch } from '../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import { getOneRepair } from '../../Redux/Actions/Reception/repairAction';
import { Backdrop, Box, Button, DialogActions, Fade, Modal, Step, StepLabel, Stepper, Typography } from '@mui/material';
import ShowStepper from '../../Componants/Global/ShowStepper';
import theme from '../../Theme/theme';
import { getOnePart } from '../../Redux/Actions/stock/EtatStockActions';
type EditRepairModelProps = {
    open: boolean;              // ✅ type primitif
    onClose: () => void;        // ✅ c'est une fonction
    idPart: number;
    isLoading?: boolean;         // ✅ type primitif
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

export default function ShowHistoryPart({
    open,
    onClose,
    idPart,
    onSubmit,
    isLoading
}: EditRepairModelProps) {
    const dispatch = useAppDispatch();
    const onePart = useSelector((state: RootState) => state.stockParts.getOnePart);
    React.useEffect(() => {
        if (open) {
            if (idPart) {
                dispatch(getOnePart(idPart));

            }
        }

    }, [dispatch, idPart]);
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
                    <Box sx={style}>

                       {(onePart?.historyStockPart?.length ?? 0) > 0 ? (
 <ShowStepper rows={onePart?.historyStockPart ?? []} />
) : (
  <Typography>Aucun historique disponible.</Typography>
)}

                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}
