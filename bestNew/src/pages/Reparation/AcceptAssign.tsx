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
import theme from '../../Theme/theme';
import type { User } from '../../Redux/Types/authenTypes';

export default function AcceptAssign() {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const userr: User | null | undefined = useSelector((state: RootState) => state.auth.user);
 

  const repairs = useSelector((state: RootState) => state.repair.repairs)
 
interface FilterByUserStepParams {
  userId: number;
  branchId: number;
  step: string;
}
  
React.useEffect(() => {
  if (
    userr &&
    userr.id &&
    !isNaN(userr.id) &&
    userr.branch !== undefined
  ) {
    const branchId =
      typeof userr.branch === 'object'
        ? userr.branch.id
        : userr.branch;

    if (branchId !== undefined) {
      dispatch(getByUserStep({
        branchId,
        userId: Number(userr.id),
        step: 'Affecter'
      }));
    } else {
      console.log("Erreur: branchId est undefined");
    }
  } else {
    console.log("Erreur: userr est null ou userr.id invalide");
  }
}, [dispatch, userr]);


const AccepetAssign = async (row: any) => { 
  const branch = userr?.branch;
  const branchId = typeof branch === 'object' ? branch?.id : branch;

  if (!branchId) return;

  await dispatch(addHistoryRepair({
    date: new Date(),
    step: 'On réparation',
    user: { id: userr?.id ?? 0 },
    repair: row.id
  }));

  if (userr?.id && !isNaN(userr.id)) {
    dispatch(getByUserStep({
      branchId,
      userId: userr.id,
      step: 'Affecter'
    }));
  } else {
    console.log("Erreur: userr.id est invalide après dispatch");
  }
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
      <Typography sx={{
        textAlign: 'left',
        fontWeight: 'bold',
        marginBottom: '3%', 
        color: theme.palette.secondary.main, 
        width: '200px'
      }} >Accepter les affectations</Typography   >

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

        actions={actions}

      />
    </div>
  )
}
