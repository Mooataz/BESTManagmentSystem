import React, { useEffect } from 'react'
import { useAppDispatch } from '../../../Redux/hooks'
import { getAllMarques, getMarques } from '../../../Redux/Actions/Administration/MarquesActions';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import DynamicTable from '../../../Componants/Global/TableComponat';
import { Box, Typography } from '@mui/material';
import CardMarque from './CardMarque';
import AddMarque from './AddMarque';
import theme from '../../../Theme/theme';

export default function ListMarques() {
    const dispatch= useAppDispatch();
const marques = useSelector((state:RootState) => state.Marques.Marque);

    useEffect( () => { 
        dispatch(getAllMarques())
    },[dispatch])
   
  return (
    <div style={{ padding: '20px' }}>
            <Typography sx=  {{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%' , color:theme.palette.secondary.main ,width: '200px' }} >List des marques</Typography   >

        <AddMarque />
<Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 3fr)',
        gap: 2,
      }}
    >

      {
  Array.isArray(marques)
    ? marques.map((item) => <CardMarque key={item.id} {...item} />)
    : <Typography>Aucune marque trouvée.</Typography>
}
        
  </Box>
    </div>
  )
}
