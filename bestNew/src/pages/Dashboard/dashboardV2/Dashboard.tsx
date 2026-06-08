import * as React from 'react';
import { Suspense } from 'react';
import type { } from '@mui/x-date-pickers/themeAugmentation';
import type { } from '@mui/x-charts/themeAugmentation';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
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
import imgAcceuille from '../../../assets/imgAcceuille.jpg'

const Agencies = React.lazy(() => import('../../Administration/Agencies/Agencies'));
const ListRepair = React.lazy(() => import('../../Reception/ListRepair'));
const SendToAssign = React.lazy(() => import('../../Reception/SendToAssign'));
const Bin = React.lazy(() => import('../../Stock/Bin/Bin').then(m => ({ default: m.Bin })));
const RecieveReception = React.lazy(() => import('../../Coordinate/RecieveReception'));
const Assign = React.lazy(() => import('../../Coordinate/Assign'));
const AcceptAssign = React.lazy(() => import('../../Reparation/AcceptAssign'));
const ListReparation = React.lazy(() => import('../../Reparation/ListReparation'));
const References = React.lazy(() => import('../../Stock/References/References'));
const Distributeurs = React.lazy(() => import('../../Administration/Distributeurs/Distributeurs'));
const Accessoires = React.lazy(() => import('../../ModelAccessory/Accessory/Accessoires'));
const Checkout = React.lazy(() => import('../../Reception/AddRepair/Checkout'));
const Entreprise = React.lazy(() => import('../../Administration/Entreprise/Entreprise'));
const ListEmployèes = React.lazy(() => import('../../Administration/Employees/ListEmployees'));
const ListMarques = React.lazy(() => import('../../Administration/Marques/ListMarques'));
const RemplissageStock = React.lazy(() => import('../../Stock/RemplissageStock/RemplissageStock'));
const EtatStock = React.lazy(() => import('../../Stock/EtatStock'));
const RaisonsExpertise = React.lazy(() => import('../../Administration/RaisonExpertise/RaisonsExpertise'));
const ListProblems = React.lazy(() => import('../../Administration/ListProbleme.tsx/ListProblems'));
const ListDemandeClient = React.lazy(() => import('../../Administration/DemandeClient/ListDemandeClient'));
const NotesClient = React.lazy(() => import('../../Administration/NotesClient/NotesClient'));
const ListPieces = React.lazy(() => import('../../Administration/AllParts/ListPieces'));
const ListLegislations = React.lazy(() => import('../../Administration/Legislations/ListLegislations'));
const TransfertPart = React.lazy(() => import('../../Stock/Transfert/TransfertPart'));
const ListlevelRepair = React.lazy(() => import('../../Administration/LevelRepair/ListlevelRepair'));
const ListFrais = React.lazy(() => import('../../Administration/AutresFrais.tsx/ListFrais'));
const TypeModel = React.lazy(() => import('../../ModelAccessory/TypeModel/TypeModel'));
const ListModel = React.lazy(() => import('../../ModelAccessory/Model/ListModel'));
const ReceiveState = React.lazy(() => import('../../Stock/Transfert/ReceiveState'));
const ListPartPrice = React.lazy(() => import('../../Stock/PartAndPrice/ListPartPrice'));
const UpdateUserPassword = React.lazy(() => import('../../Administration/Employees/UpdateUserPassword'));
const ShowRepair = React.lazy(() => import('../../Reparation/ShowRepair'));
const RepairedRepair = React.lazy(() => import('../../Reparation/RepairedRepair'));
const ListRepairActions = React.lazy(() => import('../../Administration/RepairActions/ListRepairActions'));
const AccepteQC = React.lazy(() => import('../../Coordinate/AccepteQC'));
const Validation = React.lazy(() => import('../../Coordinate/Validation'));
const ReceiveCQ = React.lazy(() => import('../../Reception/ReceiveCQ'));
const Recuperation = React.lazy(() => import('../../Reception/Recuperation'));
const ListOutPut = React.lazy(() => import('../../Reception/ListOutPut'));
const Reaffectation = React.lazy(() => import('../../Coordinate/Reaffectation'));
const ApproveParts = React.lazy(() => import('../../Stock/ApproveParts'));
const Demantelement = React.lazy(() => import('../../Stock/Demantelement'));
const ViewPartsAvailablePrice = React.lazy(() => import('../../Stock/ViewPartsAvailablePrice'));
const ShowProductState = React.lazy(() => import('../../Reception/ShowProductState'));
const MenuTransfert = React.lazy(() => import('../../Coordinate/TransfertProduits/MenuTransfert'));
const Statistique = React.lazy(() => import('../../Administration/Statistiques/Statistique'));
const Invoices = React.lazy(() => import('../../Reception/Invoices'));
const Sales = React.lazy(() => import('../../Reception/Sales'));

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
        <Box
          component="main"
          sx={(theme) => ({
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
          <Stack sx={{ alignItems: 'center', mx: 3, pb: 5, mt: { xs: 8, md: 0 } }}>
            <Header />
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>}>
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
                <Route path="RecevoireQC" element={<ReceiveCQ />} />
                <Route path="EtatRécuperation" element={<ListOutPut />} />
                <Route path="Réaffectation" element={<Reaffectation />} />
                <Route path='case' element={<Bin />} />
                <Route path='Reférences' element={<References />} />
                <Route path="RemplissageStock" element={<RemplissageStock />} />
                <Route path="EtatStock" element={<EtatStock />} />
                <Route path='TransfertPiéces' element={<TransfertPart />} />
                <Route path='ReçoiPiéces' element={<ReceiveState />} />
                <Route path="AjusterPrixPiéces" element={<ListPartPrice />} />
                <Route path="AccordPiéces" element={<ApproveParts />} />
                <Route path='Affectation' element={<Assign />} />
                <Route path='ReçoiAffectation' element={<AcceptAssign />} />
                <Route path="Reçoiproduit" element={<Checkout />} />
                <Route path='listTotal' element={<ListReparation />} />
                <Route path="ShowRepair/:id" element={<ShowRepair />} />
                <Route path="RepairedRepair/:id" element={<RepairedRepair />} />
                <Route path="ValidationCQ" element={<Validation />} />
                <Route path="Récupererproduit" element={<Recuperation />} />
                <Route path='TypeModéle' element={<TypeModel />} />
                <Route path="accessoires" element={<Accessoires />} />
                <Route path='Modéles' element={<ListModel />} />
                <Route path="Démantèlement" element={<Demantelement />} />
                <Route path="ViewParts" element={<ViewPartsAvailablePrice />} />
                <Route path="Consulterappareille" element={<ShowProductState />} />
                <Route path="MenuTransfert" element={<MenuTransfert />} />
                <Route path="Statistique" element={<Statistique />} />
                <Route path="Invoices" element={<Invoices />} />
                <Route path="Sales" element={<Sales />} />
                <Route path="ListOutPut" element={<ListOutPut />} />
              </Routes>
            </Suspense>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
