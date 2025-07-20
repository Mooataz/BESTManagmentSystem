import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../Redux/hooks';
import theme from '../../../Theme/theme';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { getListFault } from '../../../Redux/Actions/Administration/ListFaultActions';
import DynamicTable from '../../../Componants/Global/TableComponat';
import AddProblem from './AddProblem';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import ModeIcon from '@mui/icons-material/Mode';
import UpdateProblem from './UpdateProblem';

export default function ListProblems() {
    const dispatch = useAppDispatch();
    const listFault = useSelector((state:RootState) => state.listfault.listFault);

    useEffect(() => {
        dispatch(getListFault())
    }, [dispatch])

    const [selectedRow, setSelectedRow] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
const handelOpenEdit = (row: any) => {
  setSelectedRow(row);
  setOpenEdit(true);
};
  
 const handleCloseEdit = () => {
  setOpenEdit(false);
};
     const actions: TableAction[] = [{
              icon: <ModeIcon style={{ color: theme.palette.primary.main }} /> ,
              onClick: (row: any) =>   handelOpenEdit(row)  
          } ]
  return (
    <div>
      <Typography sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%' , color:theme.palette.secondary.main ,width: '200px' }} >List des problèmes</Typography   >
   <AddProblem/>
   < DynamicTable
        rows={listFault}

        columnLabels={{
          'id': 'Code',
          'name': 'Description',
          
        }}

        columnsToShow={['id',
          'name',
           ]}

           actions = {actions}    

      />
       {selectedRow && (
    <UpdateProblem 
    problem={selectedRow}
                open={openEdit}
                onClose={handleCloseEdit}
    /> )}
    </div>
  )
}
