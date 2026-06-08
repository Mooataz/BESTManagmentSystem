import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import { GetOneOutPut } from '../../Redux/Actions/Reception/OutputRepairsActions';
import DynamicTable from '../../Componants/Global/TableComponat';
import type { RepairForm } from '../../Redux/Types/repairTypes';
import { Backdrop, Box, Button, DialogActions, DialogContent, Fade, Modal } from '@mui/material';
type EditRepairModelProps = {
    open: boolean;              // ✅ type primitif
    onClose: () => void;        // ✅ c'est une fonction
    idOut: number;
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
export default function ShowDetailsReturn({
    open,
    onClose,
    idOut,
    onSubmit,
    isLoading
}: EditRepairModelProps) {
    const dispatch = useAppDispatch();
    const ListOutShow = useSelector((state: RootState) => state.OutputList.Oneout)

    useEffect(() => {
    if (idOut) {
        dispatch(GetOneOutPut(idOut));
    }
}, [dispatch, idOut]);

// Option 1 : aplatir les champs côté front
useEffect(() => {
  if (ListOutShow && ListOutShow.repair) {
    const mappedRepairs = ListOutShow.repair.map(r => ({
  ...r,
  'customer.name': typeof r.customer === 'object' && r.customer ? r.customer.name : '-',
  'customer.phone': typeof r.customer === 'object' && r.customer ? r.customer.phone : '-',
  'device.id': typeof r.device === 'object' && r.device ? r.device.id : '-',
  'device.serialenumber': typeof r.device === 'object' && r.device ? r.device.serialenumber : '-',
  
}));
setResults(mappedRepairs);

  }
}, [ListOutShow]);



    const [results, setResults] = useState<RepairForm[]>([]);

  
 
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
                        <DialogContent>
                            <DynamicTable
                                rows={results}

                                columnLabels={{
                                    'id': 'Reparation',
                                    'customer.name': 'Nom client',
                                    'customer.phone': 'Téléphone',
                                    'device.id': 'Appareille n°',
                                    'device.serialenumber': 'Imei',
                                    'device.model.brand.name': 'Marque',
                                    'device.model.name': 'Modéle',
                                    'deviceStateReceive': 'État appareille',
                                     
                                }}

                                columnsToShow={['id',
                                    'customer.name',
                                    'customer.phone',
                                    'device.id',
                                    'device.serialenumber',
                                    'device.model.brand.name',
                                    'device.model.name',
                                    'deviceStateReceive',
                                     
                                ]}

                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => onClose()}>Fermer</Button>
                        </DialogActions>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}


 