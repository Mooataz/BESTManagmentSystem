import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Stack from '@mui/joy/Stack';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import Layout from './componantes/Layout';
import Navigation from './componantes/Navigation';
import Header from './componantes/Header';
 import Distributeurs from '../../pages/Administration/Distributeurs';
import Accessoires from '../../pages/Administration/Accessoires';
import ListProblemes from '../../pages/Administration/ListProblemes';
import DemandeClient from '../../pages/Administration/DemandeClient';
import NoteToCustomers from '../../pages/Administration/NotesPourClient';
import RaisonsExpertise from '../../pages/Administration/RaisonsExpertise';
import { Agencies } from '../../pages/Administration/Agencies';
import  Employees  from '../../pages/Administration/Employees';
import { Marques } from '../../pages/Administration/Marques';
import { Entreprise } from '../../pages/Administration/Entreprise';

export default function TeamExample() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedPage, setSelectedPage] = React.useState('home');

  const componentsMap: { [key: string]: React.ReactNode } = {
    Distributeurs: <Distributeurs />,
    Accessoires: <Accessoires />,
    ListProblemes: <ListProblemes />,
    DemandeClient: <DemandeClient />,
    NoteToCustomers: <NoteToCustomers />,
    RaisonsExpertise: <RaisonsExpertise />,
    Agencies: <Agencies />,
    Employees: <Employees />,
    Marques: <Marques/>,
    Entreprise: <Entreprise />
  };

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          {/* Contenu du tiroir latéral si nécessaire */}
        </Layout.SideDrawer>
      )}
      
      {/* Barre d'onglets mobile */}
      <Stack
        id="tab-bar"
        direction="row"
        spacing={1}
        sx={{
          justifyContent: 'space-around',
          display: { xs: 'flex', sm: 'none' },
          zIndex: '999',
          bottom: 0,
          position: 'fixed',
          width: '100dvw',
          py: 2,
          backgroundColor: 'background.body',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button
          variant="plain"
          color="neutral"
          size="sm"
          startDecorator={<FolderRoundedIcon />}
          sx={{ flexDirection: 'column', '--Button-gap': 0 }}
        >
          Bright Electronic Solutions Technology
        </Button>
      </Stack>

      {/* Layout principal */}
      <Layout.Root
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          ...(drawerOpen && {
            minHeight: '100vh',
          }),
        }}
      >
        <Layout.Header>
          <Header />
        </Layout.Header>
        
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Layout.SideNav>
            <Navigation onSelectPage={setSelectedPage} selectedPage={selectedPage} />
          </Layout.SideNav>
          
          {/* Contenu principal */}
          <Layout.Main
            sx={{
              flexGrow: 1,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0, // Important pour éviter les débordements
            }}
          >
            {selectedPage === 'home' ? (
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Contenu de la page d'accueil */}
              </Box>
            ) : (
              <Box
                sx={{
                  flexGrow: 1,
                  width: '1600px',
                  overflow: 'auto', // Ajout du défilement si nécessaire
                }}
              >
                {componentsMap[selectedPage] || null}
              </Box>
            )}
          </Layout.Main>
        </Box>
      </Layout.Root>
    </CssVarsProvider>
  );
}
 