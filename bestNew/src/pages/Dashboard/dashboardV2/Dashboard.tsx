import * as React from 'react';
import type { } from '@mui/x-date-pickers/themeAugmentation';
import type { } from '@mui/x-charts/themeAugmentation';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';
import { Route, Routes } from 'react-router-dom';
import Agencies from '../../Administration/Agencies/Agencies';
import ListRepair from '../../Reception/ListRepair';
import SendToAssign from '../../Reception/SendToAssign';
import { Bin } from '../../Stock/Bin/Bin';
import RecieveReception from '../../Coordinate/RecieveReception';
import Assign from '../../Coordinate/Assign';
import AcceptAssign from '../../Reparation/AcceptAssign';
import ListReparation from '../../Reparation/ListReparation';
import References from '../../Stock/References/References';
import Distributeurs from '../../Administration/Distributeurs/Distributeurs';
import Accessoires from '../../ModelAccessory/Accessory/Accessoires';
import imgAcceuille from '../../../assets/imgAcceuille.jpg'
import Checkout from '../../Reception/AddRepair/Checkout';
import Entreprise from '../../Administration/Entreprise/Entreprise';
import ListEmployèes from '../../Administration/Employees/ListEmployees';
import ListMarques from '../../Administration/Marques/ListMarques';
import RemplissageStock from '../../Stock/RemplissageStock/RemplissageStock';
import EtatStock from '../../Stock/EtatStock';
import RaisonsExpertise from '../../Administration/RaisonExpertise/RaisonsExpertise';
import ListProblems from '../../Administration/ListProbleme.tsx/ListProblems';
import ListDemandeClient from '../../Administration/DemandeClient/ListDemandeClient';
import NotesClient from '../../Administration/NotesClient/NotesClient';
import ListPieces from '../../Administration/AllParts/ListPieces';
import ListLegislations from '../../Administration/Legislations/ListLegislations';
import TransfertPart from '../../Stock/Transfert/TransfertPart';
import ListlevelRepair from '../../Administration/LevelRepair/ListlevelRepair';
import ListFrais from '../../Administration/AutresFrais.tsx/ListFrais';
import TypeModel from '../../ModelAccessory/TypeModel/TypeModel';
import ListModel from '../../ModelAccessory/Model/ListModel';
import ReceiveState from '../../Stock/Transfert/ReceiveState';
import ListPartPrice from '../../Stock/PartAndPrice/ListPartPrice';
import UpdateUserPassword from '../../Administration/Employees/UpdateUserPassword';
import ShowRepair from '../../Reparation/ShowRepair';
import RepairedRepair from '../../Reparation/RepairedRepair';
import ListRepairActions from '../../Administration/RepairActions/ListRepairActions';
import AccepteQC from '../../Coordinate/AccepteQC';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={

            (theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: 'auto',
              backgroundImage: (`url(${imgAcceuille})`),
              minHeight: '100vh',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            })}
        >
          <Stack


            sx={{

              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />

            <Routes>
              <Route path="/" element={<img src={imgAcceuille} />} />

              <Route path="Agencies" element={<Agencies />} />
              <Route path="Entreprise" element={<Entreprise />} />
              <Route path="Employees" element={<ListEmployèes />} />
              <Route path="Updatepassword/:userId" element={<UpdateUserPassword />} />
              <Route path="Marques" element={<ListMarques />} />
              <Route path="RaisonsExpertise" element={<RaisonsExpertise />} />
              <Route path="ListProblemes" element={<ListProblems />} />
              <Route path="distributeurs" element={<Distributeurs />} />
              <Route path="DemandeClient" element={<ListDemandeClient />} />
              <Route path="NoteToCustomers" element={<NotesClient />} />
              <Route path="listePiécesTotal" element={<ListPieces />} />
              <Route path="Legislation" element={<ListLegislations />} />
              <Route path='NiveauRéparation' element={<ListlevelRepair />} />
              <Route path="AutresFrais" element={<ListFrais />} />
              <Route path="RepairActions" element={<ListRepairActions />} />

              <Route path="ListRepair" element={<ListRepair />} />
              <Route path="EnvoyeAffectation" element={<SendToAssign />} />
              <Route path="ReçoiReception" element={<RecieveReception />} />
              <Route path="AccepteQC" element={<AccepteQC />} />


              <Route path='case' element={<Bin />} />
              <Route path='Reférences' element={<References />} />
              <Route path="RemplissageStock" element={<RemplissageStock />} />
              <Route path="EtatStock" element={<EtatStock />} />
              <Route path='TransfertPiéces' element={<TransfertPart />} />
              <Route path='ReçoiPiéces' element={<ReceiveState />} />
              <Route path="AjusterPrixPiéces" element={<ListPartPrice />} />

              <Route path='Affectation' element={<Assign />} />
              <Route path='ReçoiAffectation' element={<AcceptAssign />} />
              <Route path="Reçoiproduit" element={<Checkout />} />
              <Route path='listTotal' element={<ListReparation />} />
              <Route path="ShowRepair/:id" element={<ShowRepair />} />
              <Route path="RepairedRepair/:id" element={<RepairedRepair />} />

              <Route path='TypeModéle' element={<TypeModel />} />
              <Route path="accessoires" element={<Accessoires />} />
              <Route path='Modéles' element={<ListModel />} />

            </Routes>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
