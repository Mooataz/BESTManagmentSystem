import React from 'react'
import theme from '../../Theme/theme'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import imgAcceuille from '../../assets/imgAcceuille.jpg'
 import Navigation from './Navigation'
import Header from './Header'
import { Routes, Route, useNavigate } from 'react-router-dom';
import Distributeurs from '../Administration/Distributeurs'
import Accessoires from '../ModelAccessory/Accessoires'
import ListRepair from '../Reception/ListRepair'
import Agencies from '../Administration/Agencies'
import SendToAssign from '../Reception/SendToAssign'
import {Bin} from '../Stock/Bin/Bin'
import RecieveReception from '../Coordinate/RecieveReception'
import Assign from '../Coordinate/Assign'
import BestV2 from '../../assets/BestV2.png'
import AcceptAssign from '../Reparation/AcceptAssign'
import ListReparation from '../Reparation/ListReparation'
import References from '../Stock/References/References'

  
//-------------------------------------------------------------------
function Dashboard() {
  return (
    <div>
       
       <ThemeProvider theme={theme}>
  <CssBaseline />
      <Box  sx={{width:'100%', height:'70px',
            backgroundColor:theme.palette.info.main, 
            padding:'5' , 
            color:theme.palette.primary.main, 
            borderBottom:  `1px #9E9E9E`, }}>
        <Header />
      </Box>
       <Box   sx={{display:'flex', borderRadius:'5%'}}>
        <Box  sx={{width:'15%', 
              height:'90vh' ,
              backgroundColor:theme.palette.info.main, 
              padding:'20px ', 
              borderRight:  `1px  d #9E9E9E`}}>
          <Navigation />
        </Box>

 
              <Box 
                  sx={{
                    width: '100%', // Passe à 100% pour qu'il occupe toute la largeur
                    height: '100vh', // Donne une hauteur de 100% de la fenêtre
                    borderLeft: '1px solid #EEEEEE',
                    borderTop: '1px solid #EEEEEE',
                    padding: '20px',
                    backgroundImage: `url(${imgAcceuille})`,
                    backgroundSize: 'cover', // Remplit toute la zone sans déformation
                    backgroundPosition: 'center', // Centre l'image
                    backgroundRepeat: 'no-repeat' // Évite la répétition de l'image
                  }}
                >
          <Routes>
                <Route path="/" element={<img src={imgAcceuille} />} />
                 <Route path="Agencies" element={<Agencies />} />
                <Route path="ListRepair" element={<ListRepair />} />
                <Route path="EnvoyeAffectation" element={<SendToAssign />} /> 
                <Route path='case' element={<Bin />} />
                <Route path="ReçoiReception" element={ <RecieveReception />} />
                <Route path='Affectation' element={<Assign />} />
                <Route path='ReçoiAffectation' element={<AcceptAssign />} />
                <Route path='listTotal' element={<ListReparation/> } />
                <Route path='Reférences' element={ <References />} />

                <Route path="distributeurs" element={<Distributeurs />} />
                <Route path="accessoires" element={<Accessoires />} />
                {/*<Route path="Entreprise" element={<Entreprise />} />
                <Route path="Agencies" element={<Agencies />} />
                <Route path="Employees" element={<Employees />} />
                <Route path="Marques" element={<Marques />} />
                <Route path="RaisonsExpertise" element={<RaisonsExpertise />} />
                <Route path="ListProblemes" element={<ListProblemes />} />
                <Route path="DemandeClient" element={<DemandeClient />} />
                <Route path="NoteToCustomers" element={<NoteToCustomers />} />
                <Route path="Updatepassword/:userId" element={<Updatepassword />} />
                <Route path="listePiécesTotal" element={<ListAllParts />} />
                <Route path='NiveauRéparation' element={<LevelRepair />} />
                <Route path="AutresFrais" element={<OthersCoast />} />
                <Route path='TypeModéle' element={<TypeModel />} />
                <Route path='Modéles' element={<Model />} />
                <Route path="Reçoiproduit" element={<AddProduct />} />
                
                <Route path="Legislation" element={<Legislation />}/>
                 */}
              </Routes>
        </Box>

       </Box>
       </ThemeProvider>

       
    </div>
  )
}

export default Dashboard
