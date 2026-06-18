import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Collapse, Divider, Tooltip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../Redux/store';
import { MdExpandLess, MdExpandMore, MdLocalLibrary, MdMiscellaneousServices, MdOutlinePhonelinkSetup } from 'react-icons/md';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { LiaCodeBranchSolid } from 'react-icons/lia';
import { FcAndroidOs, FcApproval, FcConferenceCall, FcCurrencyExchange, FcDataConfiguration, FcHeadset, FcLineChart, FcList, FcMindMap, FcMultipleDevices, FcMultipleSmartphones, FcReadingEbook, FcSalesPerformance, FcSearch, FcTouchscreenSmartphone, FcTreeStructure, FcVoicePresentation } from 'react-icons/fc';
import { IoWaterOutline } from 'react-icons/io5';
import { BiError, BiTrendingUp } from 'react-icons/bi';
import { RiPageSeparator, RiUserVoiceLine } from 'react-icons/ri';
import { GoLaw, GoNumber } from 'react-icons/go';
import { SiDatabricks } from 'react-icons/si';
import { TbDatabasePlus, TbTransitionLeft, TbTransitionRight, TbClipboardCheck, TbTruckDelivery, TbTruckReturn, TbDeviceAnalytics, TbBuildingWarehouse, TbTools, TbArrowsLeftRight, TbAffiliate } from 'react-icons/tb';
import { BsEarbuds, BsBoxSeam, BsClipboardData, BsClipboardCheck, BsPhone, BsPeople, BsReceipt, BsShop, BsTools } from 'react-icons/bs';
import { VscGitPullRequestGoToChanges } from 'react-icons/vsc';
import { GrValidate } from 'react-icons/gr';
import { GiConverseShoe } from 'react-icons/gi';
import CommitIcon from '@mui/icons-material/Commit';
import theme from '../../../../Theme/theme'

type MenuItem =
  | {
    label: string;
    icon: React.ReactNode;
    page: string;
    content?: React.ReactNode;
  }
  | {
    label: string;
    icon: React.ReactNode;
    children: {
      label: string;
      icon: React.ReactNode;
      page: string;
    }[];
  }

export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const handleNavigation = (page: string) => {
    navigate(`/dashboard/${page}`);
  };

  const [filteredMenuItems, setFilteredMenuItems] = React.useState<MenuItem[]>([]);
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});
  const userr = useSelector((state: RootState) => state.auth.user);

  const isActive = (page: string) => location.pathname === `/dashboard/${page}`;

  const isChildActive = (children: { page: string }[]) =>
    children.some(c => isActive(c.page));
{/*
    MenuItem Menu Dashboard
  
  */}
const menuItems: MenuItem[] = [

  {
    label: 'Administration',
    icon: <MdMiscellaneousServices style={{ color: theme.palette.secondary.main }} />,
    children: [
      { label: 'Entreprise', page: 'Entreprise', icon: <HiOutlineOfficeBuilding style={{ color: theme.palette.primary.main }} /> },
      { label: 'Agence', page: 'Agencies', icon: <LiaCodeBranchSolid style={{ color: theme.palette.secondary.main }} /> },
      { label: 'Employees', page: 'Employees', icon: <FcConferenceCall /> },
      { label: 'Marques', page: 'Marques', icon: <FcAndroidOs /> },
      { label: 'Distributeurs', page: 'Distributeurs', icon: <FcTreeStructure /> },
      { label: 'Legislation', page: 'Legislation', icon: <GoLaw style={{ color: theme.palette.secondary.main }} /> },
      { label: 'Statistiques', page: 'Statistique', icon: <FcLineChart /> },


    ],
  },

  {
    label: 'Référentiel technique',
    icon: <MdLocalLibrary style={{ color: theme.palette.secondary.main }} />,
    children: [
      { label: 'LevelRepair', page: 'NiveauRéparation', icon: <BiTrendingUp style={{ color: 'gold' }} /> },
      { label: 'Action de diagnostique', page: 'RepairActions', icon: <BiTrendingUp style={{ color: 'gold' }} /> },
      { label: 'OthersCoast', page: 'AutresFrais', icon: <FcCurrencyExchange /> },
      { label: 'Raisonsexpertise', page: 'RaisonsExpertise', icon: <IoWaterOutline style={{ color: '#81D4FA' }} /> },
      { label: 'ListProblem', page: 'ListProblemes', icon: <BiError style={{ color: 'red' }} /> },
      { label: 'CustomerRequest', page: 'DemandeClient', icon: <FcReadingEbook /> },
      { label: 'NoteClient', page: 'NoteToCustomers', icon: <RiUserVoiceLine style={{ color: theme.palette.secondary.main }} /> },
      { label: 'ListAllPart', page: 'listePiécesTotal', icon: <FcList /> },
    ]
  },

  {
    label: 'ModelsAccessory',
    icon: <FcMultipleDevices />,
    children: [
      { label: 'Accessoires', page: 'Accessoires', icon: <FcHeadset /> },
      { label: 'Modéles', page: 'Modéles', icon: <FcTouchscreenSmartphone /> },
      { label: 'TypeModel', page: 'TypeModéle', icon: <FcMultipleSmartphones /> },
    ]
  },

  {
    label: 'Attribution',
    icon: <FcMindMap />,
    children: [
      { label: 'Reçoireception', page: 'ReçoiReception', icon: <BsBoxSeam /> },
      { label: 'Affectation', page: 'Affectation', icon: <TbClipboardCheck /> },
      { label: 'Réaffectation', page: 'Réaffectation', icon: <TbArrowsLeftRight /> },
    ]
  },

  {
    label: 'Controle Qualité',
    icon: <FcApproval />,
    children: [
      { label: 'Accepter CQ', page: 'AccepteQC', icon: <GrValidate /> },
      { label: 'Validation CQ', page: 'ValidationCQ', icon: <FcApproval /> },
      { label: 'Transfertproduit', page: 'MenuTransfert', icon: <TbTruckDelivery /> },
    ]
  },

  {
    label: 'Gestionstocks',
    icon: <FcDataConfiguration style={{ color: theme.palette.secondary.main }} />,
    children: [
      { label: 'ApprovePart', page: 'AccordPiéces', icon: <FcApproval /> },
      { label: 'Reférences', page: 'Reférences', icon: <GoNumber /> },
      { label: 'case', page: 'case', icon: <CommitIcon /> },
      { label: 'StateStock', page: 'EtatStock', icon: <SiDatabricks /> },
      { label: 'RemplireStock', page: 'RemplissageStock', icon: <TbDatabasePlus /> },
      { label: 'Transfertpiéces', page: 'TransfertPiéces', icon: <TbArrowsLeftRight /> },
      //{ label: 'Reçoipiéces', page: 'ReçoiPiéces', icon: <TbTruckDelivery /> },
      { label: 'AjusterPrix', page: 'AjusterPrixPiéces', icon: <FcCurrencyExchange /> },
      { label: 'Démantèlement', page: 'Démantèlement', icon: <RiPageSeparator /> },
    ]
  },

  {
    label: 'Réparation',
    icon: <MdOutlinePhonelinkSetup style={{ color: theme.palette.primary.main }} />,
    children: [
      { label: 'ReçoitAffectation', page: 'ReçoiAffectation', icon: <TbAffiliate /> },
      { label: 'listTotal', page: 'listTotal', icon: <BsTools /> },
    ]
  },

  {
    label: 'Accueil',
    icon: <FcVoicePresentation />,
    children: [
      { label: 'Reçoiproduit', page: 'ReçoiProduit', icon: <TbTruckReturn /> },
      { label: 'Etatproduit', page: 'ListRepair', icon: <TbClipboardCheck /> },
      { label: 'Envoyeraffectation', page: 'EnvoyeAffectation', icon: <VscGitPullRequestGoToChanges /> },

    ]
  },


  {
    label: 'Récupération',
    icon: <FcDataConfiguration />,
    children: [
      { label: 'ReciveQC', page: 'RecevoireQC', icon: <GrValidate /> },
      { label: 'Récupererproduit', page: 'RécupererProduit', icon: <BsPhone /> },
      { label: 'Etatrécuperation', page: 'ListOutPut', icon: <BsClipboardData /> },
      { label: 'Factures', page: 'Invoices', icon: <FcSalesPerformance /> },
    ]
  },
  { label: 'Vente', page: 'Sales', icon: <BsShop /> },
  {
    label: 'Consultation',
    icon: <FcSearch />,
    children: [
      { label: 'Pièces: Disponibilité / Prix ', page: 'ViewParts', icon: <FcSearch /> },
      { label: 'Consulterappareille', page: 'ConsulterAppareille', icon: <FcSearch /> },
    ]
  },
];

  const handleToggle = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        let tempFiltered: MenuItem[] = [];

        if (userr?.role.includes('Reception')) {
          tempFiltered = [menuItems[2], menuItems[7], menuItems[8], menuItems[9]];
        }

        if (userr?.role.includes('Technicien')) { tempFiltered = [...tempFiltered, menuItems[6]] }

        if (userr?.role.includes('Gestionnaire_de_stocks')) { tempFiltered = [...tempFiltered, menuItems[5], menuItems[9]]; }

        if (userr?.role.includes('Coordinateur')) { tempFiltered = [...tempFiltered, menuItems[3], menuItems[4]]; }

        tempFiltered = [...tempFiltered, menuItems[10]];
        if (userr?.role.includes('Administrateur')) { tempFiltered = menuItems; }

        setFilteredMenuItems(tempFiltered);

        const opened: Record<string, boolean> = {};
        tempFiltered.forEach(item => {
          if ('children' in item && isChildActive(item.children)) {
            opened[item.label] = true;
          }
        });
        if (Object.keys(opened).length) {
          setOpenMenus(prev => ({ ...prev, ...opened }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur', error);
        navigate('/');
      }
    };

    fetchUser();
  }, []);

  React.useEffect(() => {
    const opened: Record<string, boolean> = {};
    filteredMenuItems.forEach(item => {
      if ('children' in item && isChildActive(item.children)) {
        opened[item.label] = true;
      }
    });
    if (Object.keys(opened).length) {
      setOpenMenus(prev => ({ ...prev, ...opened }));
    }
  }, [location.pathname]);

  const renderMenuItem = (item: MenuItem, index: number = 0) => {
    const hasChildren = 'children' in item && Array.isArray(item.children);
    const active = !hasChildren && 'page' in item && isActive(item.page);
    const childActive = hasChildren && isChildActive(item.children);

    if (hasChildren) {
      return (
        <Box key={'group-' + item.label} sx={{ mb: 0.5 }}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => handleToggle(item.label)}
              sx={{
                pl: 2 + index * 2,
                pr: 1,
                py: 0.8,
                borderRadius: 1.5,
                mx: 0.5,
                bgcolor: childActive ? 'action.selected' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={t(item.label)}
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: childActive ? 600 : 500,
                  color: 'text.primary',
                }}
              />
              <ListItemIcon sx={{ minWidth: 24 }}>
                {openMenus[item.label] ? <MdExpandLess /> : <MdExpandMore />}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <Collapse in={openMenus[item.label]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ py: 0 }}>
              {item.children!.map((subItem) => renderMenuItem(subItem, index + 1))}
            </List>
            <Divider sx={{ mx: 2, my: 0.5 }} />
          </Collapse>
        </Box>
      )
    }
    if ('page' in item) {
      const isLeafActive = isActive(item.page);
      return (
        <ListItem disablePadding key={'leaf-' + item.page} sx={{ display: 'block' }}>
          <Tooltip title={t(item.label)} placement="right" arrow>
            <ListItemButton
              onClick={() => handleNavigation(item.page)}
              selected={isLeafActive}
              sx={{
                pl: 2 + index * 2,
                pr: 1.5,
                py: 0.6,
                borderRadius: 1.5,
                mx: 0.5,
                my: 0.3,
                borderLeft: isLeafActive ? 3 : 0,
                borderColor: theme.palette.primary.main,
                bgcolor: isLeafActive ? 'action.selected' : 'transparent',
                '&:hover': {
                  bgcolor: 'action.hover',
                  pl: 2 + index * 2 + 0.5,
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
              <Typography
                variant="body2"
                fontSize={12}
                fontWeight={isLeafActive ? 600 : 400}
                color={isLeafActive ? 'primary.main' : 'text.secondary'}
              >
                {t(item.label)}
              </Typography>
            </ListItemButton>
          </Tooltip>
        </ListItem>
      );
    }
  }

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense sx={{ py: 0 }}>
        {filteredMenuItems.map((item) => renderMenuItem(item))}
      </List>
    </Stack>
  );
}