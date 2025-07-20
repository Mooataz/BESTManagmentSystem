import { Box, Typography } from '@mui/material'
import React from 'react'
import DynamicTable from '../../../Componants/Global/TableComponat'
import type { RootState } from '../../../Redux/store';
import { useSelector } from 'react-redux';
import AddReference from './AddReference';
import theme from '../../../Theme/theme';

export default function References() {
    const userr = useSelector((state: RootState) => state.user);
    const references = useSelector((state: RootState) => state.references.references)
    
  return (
    <Box  style={{ padding: '20px' }} >
      <Typography  sx={{
                textAlign: 'left',
                color: theme.palette.secondary.main,
                width: '200px',
                fontWeight: 'bold',
                marginBottom: '3%'
            }} >List des references</Typography   >
    <AddReference />
    
        <DynamicTable
                rows={references  }
                  /*  actions={actions} */    
                columnLabels={{
                    'id': 'Code',
                    'materialCode': 'Reference',
                    'model': 'Modéle compatible',
                    'allpart.description':'Nom piéce'

                }}

                columnsToShow={['id',
                    'materialCode',
                    'model',
                    'allpart.description'
                ]}

            />    
    </Box>
  )
}
 