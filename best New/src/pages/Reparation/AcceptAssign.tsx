import React from 'react'
import DynamicTable from '../../Componants/Global/TableComponat'
import { Box, Button, Typography } from '@mui/material'
import type { TableAction } from '../../Redux/Types/repairTypes';
import { useAppDispatch } from '../../Redux/hooks';
import { useNotification } from '../../Componants/NotificationContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import { getByBranchStep, getByUserStep } from '../../Redux/Actions/Reception/repairAction';
import { addHistoryRepair } from '../../Redux/Actions/Reception/History';

export default function AcceptAssign() {
      const dispatch = useAppDispatch();
  const { notify } = useNotification();
   const userr = useSelector((state: RootState) => state.user);
  const repairs = useSelector((state: RootState) => state.repair.repairs)
   interface FilterByUserStepParams { //getByUserStep
  userId: number;
  step: string;
}
  React.useEffect(() => {


     if (userr.id) {
      dispatch ( getByUserStep({ userId: userr.id  , step: 'Affecter' }) )
     }
    
  }, [dispatch, userr.id])

    const AccepetAssign = async (row: any) => {
        if (!userr?.branch?.id) return;
    
        dispatch( addHistoryRepair({
          date: new Date(),
          step: 'On réparation',
          user: { id: userr.id || 0 },
          repair: row.id
        }) ) 
        .then( () => dispatch ( getByUserStep({ userId: userr.id || 0, step: 'Affecter' }) ));
    
      
      };


      const actions: TableAction[] = [
    {
      icon: (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined">
            Accepter
          </Button>
        </Box>
      ),
      onClick: (row) => {
        AccepetAssign(row);
      }
    }
  ];
  return (
   <div style={{ padding: '20px' }}>
      <Typography sx={{ textAlign: 'left', 
                        fontWeight: 'bold', 
                        marginBottom: '3%' }} >Accepter les affectations</Typography   >

      <DynamicTable
        rows={repairs}

        columnLabels={{
          'id': 'Reparation',
          'customer.name': 'Nom client',
          'customer.phone': 'Téléphone',
          'device.id': 'Appareille n°',
          'device.serialenumber': 'Imei',
          'device.model.brand.name': 'Marque',
          'device.model.name': 'Modéle',
          'deviceStateReceive': 'État appareille'
        }}

        columnsToShow={['id',
          'customer.name',
          'customer.phone',
          'device.id',
          'device.serialenumber',
          'device.model.brand.name',
          'device.model.name',
          'deviceStateReceive']}

        actions = {actions}  

      />
    </div> 
)
}
