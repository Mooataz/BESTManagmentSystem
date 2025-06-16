import { Typography } from '@mui/material'
import React from 'react'
import DynamicTable from '../../../Componants/Global/TableComponat'
import type { RootState } from '../../../Redux/store';
import { useSelector } from 'react-redux';
import AddReference from './AddReference';

export default function References() {
    const userr = useSelector((state: RootState) => state.user);
    const references = useSelector((state: RootState) => state.references.references)
    
  return (
    <div  style={{ padding: '20px' }} >
      <Typography  sx={{textAlign:'left' , fontWeight:'bold', marginBottom:'3%'}} >List des references</Typography   >
    <AddReference />
    
    <DynamicTable
                rows={references}
                /* actions={actions} */
                columnLabels={{
                    'id': 'Code',
                    'materialCode': 'Reference',
                    'model': 'Modéle compatible',
                    'allpart':'Nom piéce'

                }}

                columnsToShow={['id',
                    'materialCode',
                    'model',
                    'allpart'
                ]}

            />
    </div>
  )
}
 