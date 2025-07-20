import React, { useState } from 'react'
import { useNotification } from '../../../Componants/NotificationContext';
import { useAppDispatch } from '../../../Redux/hooks';
import { getDemandeClient } from '../../../Redux/Actions/Administration/DemandeClient';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import DynamicTable from '../../../Componants/Global/TableComponat';
import { Typography } from '@mui/material';
import theme from '../../../Theme/theme';
import AddDemandeclient from './AddDemandeclient';
import UpdateDemandeClient from './UpdateDemandeClient';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import ModeIcon from '@mui/icons-material/Mode';

export default function ListDemandeClient() {
  const { notify } = useNotification();
  const dispatch = useAppDispatch();
const demandeClient = useSelector((state:RootState) => state.DemandeClient.demandeClient)
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
              dispatch(getDemandeClient())
          }, [dispatch])
  return (
    <div>
      <Typography sx=  {{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%' , color:theme.palette.secondary.main ,width: '200px' }}>
        Liste de demandes client
        </Typography>
        <AddDemandeclient />
       <DynamicTable rows={demandeClient}

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
                              <UpdateDemandeClient
                                demande={selectedRow}
                                open={openEdit}
                                onClose={handleCloseEdit}
                              />
                            )}
    </div>
  )
}
