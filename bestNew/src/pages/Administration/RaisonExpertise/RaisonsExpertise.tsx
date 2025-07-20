import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../Redux/hooks';
import { Box, Typography } from '@mui/material';
import theme from '../../../Theme/theme';
import DynamicTable from '../../../Componants/Global/TableComponat';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { getAllExpertiseRaisons } from '../../../Redux/Actions/Administration/RaisonsExpertiseActions';
import AddRaisonExpertise from './AddRaisonExpertise';
import { UpdateExpertiseRaison } from './UpdateExpertiseRaison';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import ModeIcon from '@mui/icons-material/Mode';

export default function RaisonsExpertise() {
    const dispatch = useAppDispatch();
    const raisonsExpertise = useSelector((state:RootState) => state.expertiseReasons.ExpertiseRaisons)
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
    useEffect(() => {
        dispatch(getAllExpertiseRaisons())
    }, [dispatch])
  return (
    <Box>
        <Typography sx=   {{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%' , color:theme.palette.secondary.main ,width: '200px' }}>
            List toutes les raisons d'expertise
        </Typography>
        <AddRaisonExpertise />
       <DynamicTable
        rows={raisonsExpertise}

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
              <UpdateExpertiseRaison
                raison={selectedRow}
                open={openEdit}
                onClose={handleCloseEdit}
              />
            )}
    </Box>
  )
}
