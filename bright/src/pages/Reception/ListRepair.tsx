import React from 'react';
import DynamicTable from '../../Componants/global/TableComponat';
  import {   Typography } from '@mui/material';
import { useAppDispatch } from '../../Redux/hooks';
import { clearError } from '../../Redux/recptionSlices/ReceiveSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import { getRepairs } from '../../Redux/Actions/Reception/receptionAction';
import type { RepairForm, TableAction } from '../../Redux/Types/repairTypes';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { CreateRepairPDF } from '../../api/PDF/Repair';

const ListRepair = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
   const user = useSelector((state: RootState) => state.user);
  const { currentRepair, repairs, loading, error } = useSelector((state: RootState) => state.repair)

   
  const repairList: RepairForm[] = Array.isArray(repairs)
    ? repairs.flat() // 👈 aplatir ici
    : (Object.values(repairs).flat() as RepairForm[]);

  const repairRows = repairList.filter(
    (repair) => repair.actuellyBranch === user.branch?.id
  );

  const uniqueRepairList = Array.from(
    new Map(repairRows.map((r) => [r.id, r])).values()
  );
 

 

  React.useEffect(() => {
    if (repairs.length === 0) {
      dispatch(getRepairs());
    }
    if (error) {

      dispatch(clearError());
    }
  }, [dispatch, error, repairs.length]);
  
 const [open, setOpen] = React.useState(false);
const  handelOpenEdit = (id: number) => {
    setOpen(true);

    }
const actions: TableAction[] = [{
  icon:<EditIcon style={{color:'#1A9BC3'}}  /> , 
  onClick:(row: any) => handelOpenEdit(row.id)
},
{
  icon: <PictureAsPdfIcon  style={{color:'#1A9BC3'}} />,
  onClick:(row: any) => CreateRepairPDF(row.id)
}]


  return (

    <div style={{ padding: '20px' }}>
      <Typography  >List des réparations</Typography   >
        <DynamicTable 
                    rows={uniqueRepairList}
                    
                    columnLabels={{
                      'id': 'Code',
                      'customer.name': 'Nom client',
                      'customer.phone': 'Téléphone',
                      'device.serialenumber': 'Imei',
                      'device.model.brand.name': 'Marque',
                      'device.model.name': 'Modéle',
                      'deviceStateReceive': 'État appareille'
                    }}

                    columnsToShow={[
                      'id',
                      'customer.name',
                      'customer.phone',
                      'device.serialenumber',
                      'device.model.brand.name',
                      'device.model.name',
                      'deviceStateReceive']}
                      
                    actions = {actions}/>  

                           
   
    </div>

  );
};

export default ListRepair;
