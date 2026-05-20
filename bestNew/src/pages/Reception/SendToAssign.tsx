import React, { useState } from 'react'
import { useAppDispatch } from '../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
  
import DynamicTable from '../../Componants/Global/TableComponat';
import {   Box, Button,   Typography } from '@mui/material';
import type { RepairForm, TableAction } from '../../Redux/Types/repairTypes';
import { useNotification } from '../../Componants/NotificationContext';
import { addHistoryRepair } from '../../Redux/Actions/Reception/History';
import { clearError } from '../../Redux/Coordinate/techAssignSlice';
import { getByBranchStep } from '../../Redux/Actions/Reception/repairAction';
import theme from '../../Theme/theme';
export default function SendToAssign() {
  const dispatch = useAppDispatch();
     const userr = useSelector((state: RootState) => state.auth.user);
 // const user = useSelector((state: RootState) => state.auth.user);
  const { currentRepair, repairs, loading, error } = useSelector((state: RootState) => state.repair)
   const { notify } = useNotification();
  const [results, setResults] = useState<RepairForm[]>([]);
 if (!userr?.id || !userr.branch) return;
   const branchId = typeof userr.branch === 'object' ? userr.branch.id : userr.branch;
  if (!branchId || isNaN(userr.id)) return;
  React.useEffect(() => {
    const getToAssign = async () => {


      if (!branchId) return;
      const resultAction = await dispatch(getByBranchStep({ branch: branchId, step: 'Création' }))
     
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
  }, [branchId, dispatch, error]);
 
  const AssignRepairs = async (row: any) => {
    if (!branchId) return;

    const resultAction = await dispatch(addHistoryRepair({
      date: new Date(),
      step: 'Envoyé à affecter',
      user: { id: userr.id || 0 },
      repair: row.id
    }));

    if (addHistoryRepair.fulfilled.match(resultAction)) {
      // Réactualiser la liste après succès
      const refresh = await dispatch( getByBranchStep({ branch: branchId, step: 'Création' }) ) ;
      if (getByBranchStep.fulfilled.match(refresh)) {
        setResults(refresh.payload);
      }
    } else {
      notify(`Erreur lors de l'envoi : ${resultAction.payload}`, 'error');
    }
  };

const [clickedRowId, setClickedRowId] = React.useState<number | undefined>(undefined);

const actions: TableAction[] = [
  {
    icon: (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button size="small" variant="outlined">
          Envoyé à Affecter
        </Button>
      </Box>
    ),
    onClick: async (row) => {
      setClickedRowId(row.id); // Déclenche le fond coloré
      await new Promise((res) => setTimeout(res, 1000));
      AssignRepairs(row);
      setClickedRowId(undefined); // Reset la couleur après
    }
  }
];

 

  return (
    <div>
      <Typography sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%' , color:theme.palette.secondary.main  }} >Envoyé à Affectation</Typography   >
      <DynamicTable
        clickedRowId={clickedRowId} 
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
