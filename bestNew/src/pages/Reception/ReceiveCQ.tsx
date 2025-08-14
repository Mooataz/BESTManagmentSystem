 import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import theme from '../../Theme/theme'
import DynamicTable from '../../Componants/Global/TableComponat'
import { useAppDispatch } from '../../Redux/hooks';
import { useNotification } from '../../Componants/NotificationContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import { useNavigate } from 'react-router-dom';
import type { RepairForm, TableAction } from '../../Redux/Types/repairTypes';
import { getByBranchStep } from '../../Redux/Actions/Reception/repairAction';
import { addHistoryRepair } from '../../Redux/Actions/Reception/History';

export default function ReceiveCQ() {
      const dispatch = useAppDispatch();
      const { notify } = useNotification();
      const userr = useSelector((state: RootState) => state.auth.user);
      const repairs = useSelector((state: RootState) => state.repair.repairs)
      const navigate = useNavigate();
      const [results, setResults] = useState<RepairForm[]>([]);

     const getLastStep = (history: any[] = []) => {
    if (!Array.isArray(history) || history.length === 0) return '-';

    const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted[0]?.step ?? '-';
  };
   
  if (!userr?.id || !userr?.branch) return;

  const branchId = typeof userr.branch === 'object' ? userr.branch.id : userr.branch;
  if (!branchId || isNaN(userr.id)) return;

  React.useEffect(() => {
    // Vérifier si userr ou branchId est absent
    if (!userr?.id || !userr?.branch) return;
  
    const branchId = typeof userr.branch === 'object' ? userr.branch.id : userr.branch;
    if (!branchId || isNaN(userr.id)) return;
  
    dispatch(getByBranchStep({
      branch: branchId,
      step: 'à rècuperer'
    }))
      .then((resultAction) => {
        if (getByBranchStep.fulfilled.match(resultAction)) {
          setResults(resultAction.payload);
        } else {
          notify(
            `Erreur lors du chargement : ${resultAction.payload}`,
            'error'
          );
        }
      });
  
  }, [dispatch, userr, notify]);
 const handelAccepte = async (row: any) => {
    if (!userr?.id) return;
    const resultAction = await dispatch(addHistoryRepair({
      date: new Date(),
      step: 'Prêt à récupérer',
      user: { id: userr.id || 0 },
      repair: row?.id || 0
    }));
    if (addHistoryRepair.fulfilled.match(resultAction)) {
          const result = await dispatch(getByBranchStep({
            branch: branchId,
            step: 'à rècuperer'
          }))
          if (getByBranchStep.fulfilled.match(result)) {
            notify('Accepter', 'success')
          }

    }
  }
    const actions: TableAction[] = [{
    icon: <Button style={{ color: 'green' }} >Accepter </Button>,
    onClick: (row: any) => handelAccepte(row)
  },

  ]

   
  return (
   <Box>
      <Typography
        sx={{
          textAlign: 'left',
          fontWeight: 'bold',
          marginBottom: '3%',
          color: theme.palette.secondary.main
        }} >Accepter produit controler</Typography   >

        <DynamicTable
        rows={results.map((r) => ({
          ...r,
          lastStep: getLastStep(r.historyRepair)
        }))}

        columnLabels={{
          'id': 'Reparation',
          'customer.name': 'Nom client',
          'customer.phone': 'Téléphone',
          'device.id': 'Appareille n°',
          'device.serialenumber': 'Imei',
          'device.model.brand.name': 'Marque',
          'device.model.name': 'Modéle',
          'deviceStateReceive': 'État appareille',
          lastStep: 'Dernier état',
        }}

        columnsToShow={['id',
          'customer.name',
          'customer.phone',
          'device.id',
          'device.serialenumber',
          'device.model.brand.name',
          'device.model.name',
          'deviceStateReceive',
          'lastStep'
        ]}

          actions={actions}  
      />
    </Box>
  )
}
 
 
