import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { getusers } from '../../../Redux/Actions/Administration/EmployèesActions';
import DynamicTable from '../../../Componants/Global/TableComponat';
import { Button, Typography } from '@mui/material';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import UpdateEmployèes from './UpdateEmployees';
import ModeIcon from '@mui/icons-material/Mode';
import theme from '../../../Theme/theme';
import AddIcon from '@mui/icons-material/Add';
import AddEmploye from './AddEmploye';

export default function ListEmployees() {
  const dispatch = useAppDispatch();
  const empl = useSelector((state:RootState) => state.Employèes.Employèes)
  
const users = Array.isArray(empl)
  ? empl.filter((row: any) => !row.role?.includes("Administrateur"))
  : [];

  useEffect ( () => {
    dispatch(getusers())
  }, [dispatch])
 
const [selectedEmploye, setSelectedEmploye] = useState(null);
const [openEdit, setOpenEdit] = useState(false);

const handelOpenEdit = (employe: any) => {
  setSelectedEmploye(employe);
  setOpenEdit(true);
};
  
 const handleCloseEdit = () => {
  setOpenEdit(false);
};




    {/* <ModeIcon style={{ color: theme.palette.primary.main }} />  <UpdateEmployèes Employe={row} */}
    
       const actions: TableAction[] = [{
          icon: <ModeIcon style={{ color: theme.palette.primary.main }} /> ,
          onClick: (row: any) =>   handelOpenEdit(row)  
      } ]
      
  return (
     <div style={{ padding: '20px' }}>
      <Typography sx=   {{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%' , color:theme.palette.secondary.main ,width: '200px' }} >List des employèes</Typography   >
<AddEmploye />
      <DynamicTable
        rows={users}

        columnLabels={{
          'id': 'Id',
          'name': 'Nom client',
          'phone': 'Téléphone',
          'createdDate': 'Date d\'inscription',
          'status': 'Status',
          'login': 'Login',
          'role': 'Role',
          'branch.name': 'Agence'
        }}

        columnsToShow={['id',
          'name',
          'phone',
          'createdDate',
          'status',
          'login',
          'role',
          'branch.name']}

          actions = {actions}     

      />

      {selectedEmploye && (
        <UpdateEmployèes
          employe={selectedEmploye}
          open={openEdit}
          onClose={handleCloseEdit}
        />
      )}
    </div>
  )
}
