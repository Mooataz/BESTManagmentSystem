import React, { useState } from 'react'
import { useAppDispatch } from '../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
  
import DynamicTable from '../../Componants/Global/TableComponat';
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import type { RepairForm, TableAction } from '../../Redux/Types/repairTypes';
import { useNotification } from '../../Componants/NotificationContext';
import { addHistoryRepair } from '../../Redux/Actions/Reception/History';
import { clearError } from '../../Redux/Coordinate/techAssignSlice';
import { getByBranchStep } from '../../Redux/Actions/Reception/repairAction';
export default function SendToAssign() {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);
  const { currentRepair, repairs, loading, error } = useSelector((state: RootState) => state.repair)


  const { notify } = useNotification();
  const [results, setResults] = useState<RepairForm[]>([]);

  React.useEffect(() => {
    const getToAssign = async () => {
      if (!user?.branch?.id) return;
      const resultAction = await dispatch(getByBranchStep({ branch: user.branch?.id, step: 'Création' }))
      if (getByBranchStep.fulfilled.match(resultAction)) {
        setResults(resultAction.payload);
      } else {
        notify(`Erreur lors du chargement : ${resultAction.payload}`, 'error')
      }
      if (error) {
        dispatch(clearError());
      }
    }

    getToAssign();
  }, [user?.branch?.id, dispatch, error]);

  const AssignRepairs = async (row: any) => {
    if (!user?.branch?.id) return;

    const resultAction = await dispatch(addHistoryRepair({
      date: new Date(),
      step: 'Envoyé à affecter',
      user: { id: user.id || 0 },
      repair: row.id
    }));

    if (addHistoryRepair.fulfilled.match(resultAction)) {
      // Réactualiser la liste après succès
      const refresh = await dispatch( getByBranchStep({ branch: user.branch.id, step: 'Création' }) ) ;
      if (getByBranchStep.fulfilled.match(refresh)) {
        setResults(refresh.payload);
      }
    } else {
      notify(`Erreur lors de l'envoi : ${resultAction.payload}`, 'error');
    }
  };


  const actions: TableAction[] = [
    {
      icon: (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined">
            Envoyé à Affecter
          </Button>
        </Box>
      ),
      onClick: (row) => {
        AssignRepairs(row);
      }
    }
  ];



  return (
    <div>
      <Typography sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%' }} >Envoyé à Affectation</Typography   >
      <DynamicTable
        rows={results}
        actions={actions}
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
          'deviceStateReceive']} />
    </div>
  )
}
