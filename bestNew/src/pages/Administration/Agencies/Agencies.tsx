import React from 'react'
import { Box } from '@mui/material';
import { getAgencies } from '../../../Redux/Actions/Administration/AgenciesActions';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { useAppDispatch } from '../../../Redux/hooks';
import { AddAgence } from './AddAgence';
import { SelectActionCard } from './SelectActionCard';

 

export default function Agencies() {
  const dispatch = useAppDispatch();
  const agencies = useSelector((state: RootState) => state.agencies.Agency)

  React.useEffect(() => {
    dispatch(getAgencies())

  }, [dispatch]);
  return (
    <div>  
      <Box sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        boxSizing: 'border-box'
      }}>
        {/* Header avec bouton à droite */}
        <Box sx={{
          width: '100%',
          display: 'flex',
          marginLeft: '75%',
          mb: 2,
          position: 'sticky',
          top: 0,

          zIndex: 1,
          py: 1
        }}>
          <AddAgence />
        </Box>

        {/* Liste des agences avec défilement */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2, // espace entre les cartes
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >


          <SelectActionCard branches={agencies} />


        </Box>
      </Box>
    </div>
  )
}


interface Agencies {
  agencie: {
    id: number; name: string; phone: number; email: string; location: string;
  }
}


