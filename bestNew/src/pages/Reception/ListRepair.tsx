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


export default function ListRepair() {
  const dispatch = useAppDispatch();
  const userr = useSelector((state: RootState) => state.user);
  const repairs = useSelector((state: RootState) => state.repair.repairs)

  React.useEffect(() => {
    if (userr.branch?.id) {
      dispatch(getRepairsByBranch(userr.branch?.id))

    }
  }, [dispatch, userr.branch?.id])



  const { notify } = useNotification();
  const [row, setRow] = useState(0);
  const handleClose = () => setOpen(false);
  const [isLoading, setIsLoading] = useState(false);


  const [open, setOpen] = React.useState(false);
  const handelOpenEdit = (id: number) => {
    setRow(id);
    setOpen(true);

  }
  const actions: TableAction[] = [{
    icon: <EditIcon style={{ color: theme.palette.primary.main }} />,
    onClick: (row: any) => handelOpenEdit(row.id)
  },
  {
    icon: <PictureAsPdfIcon style={{ color: theme.palette.primary.main  }} />,
    onClick: (row: any) => CreateRepairPDF(row.id)
  }]



  return (
    <div style={{ padding: '20px' }}>
      <Typography sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%' , color:theme.palette.secondary.main  }} >List des réparations</Typography   >
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

        actions={actions} />


      <EditRepairModel
        open={open}
        onClose={handleClose}
        idRepair={row}
        isLoading={isLoading}
      />
    </div>
  )
}







