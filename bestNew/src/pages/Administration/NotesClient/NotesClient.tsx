import React, { useState } from 'react'
import type { RootState } from '../../../Redux/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../Redux/hooks';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import theme from '../../../Theme/theme';
import ModeIcon from '@mui/icons-material/Mode';
import { getNotesCustomer } from '../../../Redux/Actions/Administration/NotesCustomer';
import { Typography } from '@mui/material';
import DynamicTable from '../../../Componants/Global/TableComponat';
import UpdateNotesClient from './UpdateNotesClient';
import AddNotesClient from './AddNotesClient';

export default function NotesClient() {
      const dispatch = useAppDispatch();
      const NotesToClient = useSelector((state:RootState) => state.NotesCustomer.notesCustomer)
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
       React.useEffect(() => {
              dispatch(getNotesCustomer())
          }, [dispatch])
  return (
    <div>
      <Typography sx=  {{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%' , color:theme.palette.secondary.main ,width: '200px' }}>
        Liste des notes pour client
        </Typography>
< AddNotesClient/>
              <DynamicTable 
              
              rows={NotesToClient}

                columnLabels={{
                    'id': 'Code',
                    'name': 'Description',
                     

                }}

                columnsToShow={[
                    'id',
                    'name',
                     
                ]}

                 actions={actions}   />

                 {selectedRow && (
                                               <UpdateNotesClient
                                                 note={selectedRow}
                                                 open={openEdit}
                                                 onClose={handleCloseEdit}
                                               />
                                             )}
    </div>
  )
}
