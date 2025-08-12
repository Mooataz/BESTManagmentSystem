import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import DynamicTable from '../../../Componants/Global/TableComponat'
import type { RootState } from '../../../Redux/store';
import { useSelector } from 'react-redux';
import AddReference from './AddReference';
import theme from '../../../Theme/theme';
import EditReference from './EditReference';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import { useNotification } from '../../../Componants/NotificationContext';
import EditIcon from '@mui/icons-material/Edit';
import type { References } from '../../../Redux/Types/Stock';

export default function References() {
  const userr = useSelector((state: RootState) => state.user);
  const references = useSelector((state: RootState) => state.references.references)
 
   const { notify } = useNotification();
   const [row, setRow] = useState<References>();
   const handleClose = () => setOpen(false);
   const [isLoading, setIsLoading] = useState(false);
 
 
   const [open, setOpen] = React.useState(false);
   const handelOpenEdit = (ref : References ) => {
     setRow(ref);
     setOpen(true);
 
   }
  const actions: TableAction[] = [{
    icon: <EditIcon style={{ color: theme.palette.primary.main }} />,
    onClick: (row: any) => handelOpenEdit(row)
  },
   ]
  return (
    <Box style={{ padding: '20px' }} >
      <Typography sx={{
        textAlign: 'left',
        color: theme.palette.secondary.main,
        width: '200px',
        fontWeight: 'bold',
        marginBottom: '3%'
      }} >List des references</Typography   >
      <AddReference />
      <br />
      <DynamicTable
        rows={references}
        /*  actions={actions} */
        columnLabels={{
          'id': 'Code',
          'materialCode': 'Reference',
          'model': 'Modéle compatible',
          'allpart.description': 'Nom piéce'

        }}

        columnsToShow={['id',
          'materialCode',
          'model',
          'allpart.description'
        ]}
        actions={actions}
      />

      <EditReference
        open={open}
        onClose={handleClose}
        reference={row}
        isLoading={isLoading}
      />
    </Box>
  )
}
