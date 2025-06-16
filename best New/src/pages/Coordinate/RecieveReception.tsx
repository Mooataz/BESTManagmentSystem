import React, { useState } from 'react'
import DynamicTable from '../../Componants/Global/TableComponat'
import { Box, Button, Typography } from '@mui/material'
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import { useAppDispatch } from '../../Redux/hooks';
 import type { RepairForm, TableAction } from '../../Redux/Types/repairTypes';
 import { useNotification } from '../../Componants/NotificationContext';
import { addHistoryRepair } from '../../Redux/Actions/Reception/History';
import { getByBranchStep } from '../../Redux/Actions/Reception/repairAction';

export default function RecieveReception() {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
   const userr = useSelector((state: RootState) => state.user);
  const repairs = useSelector((state: RootState) => state.repair.repairs)
   
  React.useEffect(() => {


     if (userr.branch?.id) {
      dispatch ( getByBranchStep({ branch: userr.branch.id, step: 'Envoyé à affecter' }) )
     }
    
  }, [dispatch, userr.branch?.id])
 

    const AccepetAssign = async (row: any) => {
      if (!userr?.branch?.id) return;
  
      dispatch( addHistoryRepair({
        date: new Date(),
        step: 'On affectation',
        user: { id: userr.id || 0 },
        repair: row.id
      }) ) 
      .then( () => dispatch ( getByBranchStep({ branch: userr?.branch?.id || 0, step: 'Envoyé à affecter' }) ));
  
    
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
      <Typography sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%' }} >Reçoit les produit</Typography   >

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
