import { Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import DynamicTable from '../../Componants/Global/TableComponat'
import theme from '../../Theme/theme'
import type { RootState } from '../../Redux/store';
import { useAppDispatch } from '../../Redux/hooks';
import { useNotification } from '../../Componants/NotificationContext';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getByBranchStep, getByUserStep } from '../../Redux/Actions/Reception/repairAction';
import type { RepairForm, TableAction } from '../../Redux/Types/repairTypes';
import { addHistoryRepair } from '../../Redux/Actions/Reception/History';

export default function AccepteQC() {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const userr = useSelector((state: RootState) => state.auth.user);
  const repairs = useSelector((state: RootState) => state.repair.repairs)
  const navigate = useNavigate();
  const [results, setResults] = useState<RepairForm[]>([]);

  /* React.useEffect(() => {
    if (!userr?.id || !userr?.branch) return;
  
    const branchId = typeof userr.branch === 'object' ? userr.branch.id : userr.branch;
    if (!branchId || isNaN(userr.id)) return;
  console.log(`branchId: ${branchId} / userr.id: ${userr.id}`)
  const resultAction =  dispatch(getByUserStep({
      branchId,
      userId: userr.id,
      step: 'Envoyé à CQ'
    }));
    if (getByUserStep.fulfilled.match(resultAction)) {
                    notify(`${resultAction.payload}`,'success');
                  }
  }, [dispatch,   userr]); */
  if (!userr?.id || !userr?.branch) return;

  const branchId = typeof userr.branch === 'object' ? userr.branch.id : userr.branch;
  if (!branchId || isNaN(userr.id)) return;
  React.useEffect(() => {
    // Si userr ou userr.branch est absent → on sort
    if (!branchId) return;

    dispatch(getByBranchStep({
      branch: branchId,
      step: 'Envoyé à CQ'
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

  }, [dispatch, branchId]);


  const getLastStep = (history: any[] = []) => {
    if (!Array.isArray(history) || history.length === 0) return '-';

    const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted[0]?.step ?? '-';
  };
/*  */
const handelAccepte = async (row: any) => {
    if (!userr?.id) return;
    const resultAction = await dispatch(addHistoryRepair({
      date: new Date(),
      step: 'CQ',
      user: { id: userr.id || 0 },
      repair: row?.id || 0
    }));
    if (addHistoryRepair.fulfilled.match(resultAction)) {
      dispatch(getByBranchStep({
        branch: branchId,
        step: 'Envoyé à CQ'
      }))
      notify('Retourner', 'success')
    }
  } 
  const actions: TableAction[] = [{
    icon: <Button style={{ color: 'green' }} >Accepter </Button>,
    onClick: (row: any) => handelAccepte(row)
  },
   
  ]
  return (
    <div>
      <Typography
        sx={{
          textAlign: 'left',
          fontWeight: 'bold',
          marginBottom: '3%',
          color: theme.palette.secondary.main
        }} >Accepter pour controler</Typography   >
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
    </div>
  )
}
