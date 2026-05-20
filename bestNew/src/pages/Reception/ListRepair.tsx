import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useAppDispatch } from '../../Redux/hooks';
import { clearError } from '../../Redux/recptionSlices/repairSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import { getRepairs, getRepairsByBranch } from '../../Redux/Actions/Reception/repairAction';
import type { RepairForm, TableAction } from '../../Redux/Types/repairTypes';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
 import DynamicTable from '../../Componants/Global/TableComponat';
import { useNotification } from '../../Componants/NotificationContext';
import EditRepairModel from './EditRepairModel';
import theme from '../../Theme/theme';
import { CreateRepairPDF } from '../../Redux/Actions/PDFActions';
import { TbListDetails } from "react-icons/tb";
import ShowDetails from './ShowDetails';


export default function ListRepair() {
  const dispatch = useAppDispatch();
  const userr = useSelector((state: RootState) => state.auth.user);
  const repairs = useSelector((state: RootState) => state.repair.repairs)
  if (!userr?.id || !userr.branch) return;
  const branchId = typeof userr.branch === 'object' ? userr.branch.id : userr.branch;
  if (!branchId || isNaN(userr.id)) return;

  React.useEffect(() => {
    if (branchId) {
      dispatch(getRepairsByBranch(branchId))

    }
  
  }, [dispatch, branchId])



  const { notify } = useNotification();
  const [row, setRow] = useState(0);
  const handleClose = () => setOpen(false);
  const [isLoading, setIsLoading] = useState(false);


  const [open, setOpen] = React.useState(false);
  const handelOpenEdit = (id: number) => {
    setRow(id);
    setOpen(true);

  }
   const [openDetails, setOpenDetails] = React.useState(false);
   const handleCloseDetails = () => setOpenDetails(false);
  const handelOpenDetailes = (id: number) => {
    setRow(id);
    setOpenDetails(true);

  }
  const actions: TableAction[] = [{
    icon: <EditIcon style={{ color: theme.palette.primary.main }} />,
    onClick: (row: any) => handelOpenEdit(row.id)
  },
  {
    icon: <PictureAsPdfIcon style={{ color: theme.palette.primary.main  }} />,
    onClick: (row: any) => CreateRepairPDF(row.id)
  },
  {
    icon: <TbListDetails  style={{ color: theme.palette.primary.main  }} />,
    onClick: (row: any) => handelOpenDetailes(row.id)
  }]


const getLastStep = (history: any[] = []) => {
  if (!Array.isArray(history) || history.length === 0) return '-';
  
  const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return sorted[0]?.step ?? '-';
};

  return (
    <div style={{ padding: '20px' }}>
      <Typography sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%' , color:theme.palette.secondary.main  }} >List des réparations</Typography   >
      <DynamicTable
        rows={repairs.map((r) => ({
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

        actions={actions} />


      <EditRepairModel
        open={open}
        onClose={handleClose}
        idRepair={row}
        isLoading={isLoading}
      />
      <ShowDetails
        open={openDetails}
        onClose={handleCloseDetails}
        idRepair={row}
        isLoading={isLoading}
      />
    </div>
  )
}







