import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import DynamicTable from '../../Componants/Global/TableComponat'
import type { RootState } from '../../Redux/store';
import { useSelector } from 'react-redux';
import { useNotification } from '../../Componants/NotificationContext';
import { useAppDispatch } from '../../Redux/hooks';
import { getByUserStep } from '../../Redux/Actions/Reception/repairAction';
import theme from '../../Theme/theme';
import type { TableAction } from '../../Redux/Types/repairTypes';
import { BiShowAlt } from "react-icons/bi";
import { GrHostMaintenance } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
 export default function ListReparation() {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const userr = useSelector((state: RootState) => state.auth.user);
  const repairs = useSelector((state: RootState) => state.repair.repairs)
 const navigate = useNavigate();
  React.useEffect(() => {
  if (!userr?.id || !userr.branch) return;

  const branchId = typeof userr.branch === 'object' ? userr.branch.id : userr.branch;
  if (!branchId || isNaN(userr.id)) return;

  dispatch(getByUserStep({
    branchId,
    userId: userr.id,
    step: 'On réparation'
  }));
}, [dispatch, userr?.id]);

const getLastStep = (history: any[] = []) => {
  if (!Array.isArray(history) || history.length === 0) return '-';
  
  const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return sorted[0]?.step ?? '-';
};
    
const handleNavigationShowRepair = async (id: number ) => {
    if (id) {
      navigate(`/dashboard/ShowRepair/${id}`);
    }
  };
const handleNavigationRepairedRepair = async (id: number  ) => {
    if (id) {
      navigate(`/dashboard/RepairedRepair/${id}`);
    }
  };
  return (
    <div style={{ padding: '20px' }}>
      <Typography sx={{
        textAlign: 'left',
        fontWeight: 'bold',
        marginBottom: '3%',
        color: theme.palette.secondary.main
      }} >List des rèparations en cours</Typography   >
  

  
<DynamicTable
  rows= 
    {repairs.map((r) => ({
    ...r,
    lastStep: getLastStep(r.historyRepair)
  }))}  
  columnLabels={{
    id: 'Réparation',
    'customer.name': 'Nom client',
    'customer.phone': 'Téléphone',
    'device.id': 'Appareille n°',
    'device.serialenumber': 'Imei',
    'device.model.brand.name': 'Marque',
    'device.model.name': 'Modèle',
    'deviceStateReceive': 'État appareille',
    lastStep: 'Dernier état',
  }}
  columnsToShow={[
    'id',
    'customer.name',
    'customer.phone',
    'device.id',
    'device.serialenumber',
    'device.model.brand.name',
    'device.model.name',
    'deviceStateReceive',
    'lastStep'
  ]}

      actions={(row) => {
  const lastStep = getLastStep(row.historyRepair);
  if (lastStep === 'On réparation') {
    return [{
      icon: <GrHostMaintenance />,
      onClick: () => {
        console.log('handleNavigation RepairedRepair', row.id)
        handleNavigationRepairedRepair(row.id);
      }
    }];
  } else {
    return [{
      icon: <BiShowAlt />,
      onClick: () => {
        console.log('handleNavigation ShowRepair', row.id)
        handleNavigationShowRepair(row.id);
        
      }
    }];
  }
}}

/>  

    </div>
  )
}
