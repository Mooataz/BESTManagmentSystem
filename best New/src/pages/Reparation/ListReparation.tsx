import { Typography } from '@mui/material'
import React from 'react'
import DynamicTable from '../../Componants/Global/TableComponat'
import type { RootState } from '../../Redux/store';
import { useSelector } from 'react-redux';
import { useNotification } from '../../Componants/NotificationContext';
import { useAppDispatch } from '../../Redux/hooks';
import { getByUserStep } from '../../Redux/Actions/Reception/repairAction';

export default function ListReparation() {
      const dispatch = useAppDispatch();
      const { notify } = useNotification();
       const userr = useSelector((state: RootState) => state.user);
      const repairs = useSelector((state: RootState) => state.repair.repairs)
       React.useEffect(() => {
      
      
           if (userr.id) {
            dispatch ( getByUserStep({ userId: userr.id  , step: 'On réparation' }) )
           }
          
        }, [dispatch, userr.id])
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

        /* actions = {actions}  */ 

      />
    </div>
  )
}
