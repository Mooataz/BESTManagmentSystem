import { Typography } from '@mui/joy'
import React from 'react'
import DynamicTable from '../../Componants/global/TableComponat'
import { useAppDispatch } from '../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import { getByBranchStep } from '../../Redux/Actions/Reception/SendToAssign';
import { clearError } from '../../Redux/recptionSlices/addRepairSlice';

const SendToAssign = () => {
 const dispatch = useAppDispatch();
   const user = useSelector((state: RootState) => state.user);
  const { currentRepair, repairs, loading, error } = useSelector((state: RootState) => state.repair)
const branch = user.branch?.id
 const data = {
    branch,
    step:'Création'}

    React.useEffect(() => {
        if (branch && repairs.length === 0) {
          dispatch(getByBranchStep({ branch, step: 'Création' }));
        }
        if (error) {
    
          dispatch(clearError());
        }
      }, [branch, dispatch, error, repairs.length]);
  return (
    <div>
            <Typography  >List des Entrée</Typography   >
      <DynamicTable 
                    rows={repairs}
                    /* actions */
                    columnLabels={{
                      'id': 'Code',
                      'customer.name': 'Nom client',
                      'customer.phone': 'Téléphone',
                      'device.serialenumber': 'Imei',
                      'device.model.brand.name': 'Marque',
                      'device.model.name': 'Modéle',
                      'deviceStateReceive': 'État appareille'
                    }}

                    columnsToShow={['id',
                      'customer.name',
                      'customer.phone',
                      'device.serialenumber',
                      'device.model.brand.name',
                      'device.model.name',
                      'deviceStateReceive']} />
    </div>
  )
}

export default SendToAssign
