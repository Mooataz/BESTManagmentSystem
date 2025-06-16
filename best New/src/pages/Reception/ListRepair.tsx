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
import { CreateRepairPDF } from '../../api/PDF/Repair';
import DynamicTable from '../../Componants/Global/TableComponat';
import { BsFillKanbanFill } from 'react-icons/bs';
import { AiOutlineOneToOne } from 'react-icons/ai';
import { TbAward, TbDeviceMobileCharging } from 'react-icons/tb';
import { useNotification } from '../../Componants/NotificationContext';
 
export default function ListRepair() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const userr = useSelector((state: RootState) => state.user);
    const    repairs   = useSelector((state: RootState) => state.repair.repairs)
 
 
  React.useEffect(() => {
    if (userr.branch?.id) {
      dispatch(getRepairsByBranch(userr.branch?.id))
      .then((result )=> {console.log(' result: ', result.payload );   })
    }
  }, [dispatch, userr.branch?.id])
  
    
  

    const [open, setOpen] = React.useState(false);
    const handelOpenEdit = (id: number) => {
        setOpen(true);

    }
    const actions: TableAction[] = [{
        icon: <EditIcon style={{ color: '#1A9BC3' }} />,
        onClick: (row: any) => handelOpenEdit(row.id)
    },
    {
        icon: <PictureAsPdfIcon style={{ color: '#1A9BC3' }} />,
        onClick: (row: any) => CreateRepairPDF(row.id)
    }]

 
 
    return (
        <div style={{ padding: '20px' }}> 
        <Typography sx={{textAlign:'left' , fontWeight:'bold' , marginBottom:'3%'}} >List des réparations</Typography   > 
        <DynamicTable 
                    rows={repairs}
                    
                     columnLabels={{
                      'id': 'Reparation',
                      'customer.name': 'Nom client',
                      'customer.phone': 'Téléphone',
                      'device.id':'Appareille n°',
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
                      
                    actions = {actions}/> 
        </div>
    )
}






 
