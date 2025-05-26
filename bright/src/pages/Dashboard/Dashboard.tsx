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
import Accessoires from '../ModelAccessory/Accessoires';
import ListProblemes from '../../pages/Administration/ListProblemes';
import DemandeClient from '../../pages/Administration/DemandeClient';
import NoteToCustomers from '../../pages/Administration/NotesPourClient';
import RaisonsExpertise from '../../pages/Administration/RaisonsExpertise';
import { Agencies } from '../../pages/Administration/Agencies';
import  Employees  from '../Administration/Users/Employees';
import { Marques } from '../../pages/Administration/Marques';
import { Entreprise } from '../../pages/Administration/Entreprise';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Updatepassword from '../Componants/Updatepassword';
import { ListAllParts } from '../Administration/ListAllParts';
import { LevelRepair } from '../Administration/LevelRepair';
import { OthersCoast } from '../Administration/OthersCoast';
import { TypeModel } from '../ModelAccessory/TypeModel';
import { Model } from '../ModelAccessory/Model';
 import imgAcceuille from '../../assets/imgAcceuille.jpg'
 import Card from '@mui/joy/Card';
import { AddProduct } from '../Reception/AddProduct';
import { getCurrentUser } from '../../api/administration/login';
 import { useDispatch, useSelector } from 'react-redux';
 import type{ RootState } from '../../Redux/store';
 import {setUser} from '../../Redux/userSlice'
 export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const dispatch = useDispatch();
     React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        dispatch(setUser(user));
      } catch (error) {
        console.error("Erreur récupération utilisateur", error);
      }
    };

    fetchUser();
  }, [dispatch]);
  
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
       
      
       
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
          Bright Electronic Solutions Technology.
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
        
        <Box sx={{ display: 'flex' }}>
          <Layout.SideNav>
            <Box    >
                <Navigation  />
            </Box>
           
          </Layout.SideNav>
          
          {/* Contenu principal */}
          <Layout.Main
            sx={{
              flexGrow: 1,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 1510, // Important pour éviter les débordements
            }}
          >
           <Card component="main"  sx={{ flexGrow: 1, p: 2 ,width:'1555px', height:'800px'}}>
   
            
            <Routes>
              <Route path="/" element={<img src={imgAcceuille}/>}/>
              <Route path="distributeurs" element={<Distributeurs />} />
              <Route path="accessoires" element={<Accessoires />} />
              <Route path="Entreprise" element={ <Entreprise />} />
              <Route path="Agencies" element={ <Agencies  />} />
              <Route path="Employees" element={ <Employees  />} />
              <Route path="Marques" element={ <Marques  />} />
              <Route path="RaisonsExpertise" element={ <RaisonsExpertise  />} />
              <Route path="ListProblemes" element={ <ListProblemes  />} />
              <Route path="DemandeClient" element={ <DemandeClient  />} />
              <Route path="NoteToCustomers" element={ <NoteToCustomers  />} />
              <Route path="Updatepassword/:userId" element={ <Updatepassword />} />
              <Route path="listePiécesTotal" element={ <ListAllParts />} />
              <Route path='NiveauRéparation' element={ <LevelRepair />} />
              <Route path="AutresFrais" element={<OthersCoast />} />
              <Route path='TypeModéle' element={<TypeModel />} />
              <Route path='Modéles' element={<Model />} />
              <Route path="Reçoiproduit" element={<AddProduct />}/>
            </Routes>
                
              



          </Card>

          </Layout.Main>
        </Box>
      </Layout.Root>
    </CssVarsProvider>
  );
}
 