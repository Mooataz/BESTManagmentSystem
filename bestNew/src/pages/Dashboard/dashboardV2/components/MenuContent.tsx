import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Collapse, createTheme, Divider, Tooltip, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../Redux/store';
import { MdExpandLess, MdExpandMore, MdMiscellaneousServices, MdOutlinePhonelinkSetup, MdOutlineSignalCellularAlt1Bar } from 'react-icons/md';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { LiaCodeBranchSolid } from 'react-icons/lia';
import { FcAndroidOs, FcApproval, FcConferenceCall, FcCurrencyExchange, FcDataConfiguration, FcHeadset, FcLineChart, FcList, FcMindMap, FcMultipleDevices, FcMultipleSmartphones, FcReadingEbook, FcSalesPerformance, FcSearch, FcTouchscreenSmartphone, FcTreeStructure, FcVoicePresentation } from 'react-icons/fc';
import { IoWaterOutline } from 'react-icons/io5';
import { BiError, BiTrendingUp } from 'react-icons/bi';
import { RiPageSeparator, RiUserVoiceLine } from 'react-icons/ri';
import { GoLaw, GoNumber } from 'react-icons/go';
import { SiDatabricks } from 'react-icons/si';
import { TbDatabasePlus, TbTransitionLeft, TbTransitionRight } from 'react-icons/tb';
import { BsEarbuds } from 'react-icons/bs';
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
  const { t } = useTranslation();
  const handleNavigation = (page: string) => {
    navigate(`/dashboard/${page}`);
  };
  //const theme = useTheme();
  
  const [filteredMenuItems, setFilteredMenuItems] = React.useState<MenuItem[]>([]);
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});
  const userr = useSelector((state: RootState) => state.auth.user);
  
  const menuItems: MenuItem[] = [
    {
      label: 'Administration',
      icon: <MdMiscellaneousServices style={{ color: theme.palette.secondary.main }} />,
      children: [
        { label: 'Entreprise', page: 'Entreprise', icon: <HiOutlineOfficeBuilding style={{ color: theme.palette.primary.main }} /> },
        { label: 'Agence', page: 'Agencies', icon: <LiaCodeBranchSolid style={{ color: theme.palette.secondary.main }} /> },
        { label: 'Employees', page: 'Employees', icon: <FcConferenceCall /> },
        { label: 'Marques', page: 'Marques', icon: <FcAndroidOs /> },
        { label: 'Distributeurs', page: 'Distributeurs', icon: <FcTreeStructure /> }, //ok_Done
        { label: 'Raisonsexpertise', page: 'RaisonsExpertise', icon: <IoWaterOutline style={{ color: '#81D4FA' }} /> }, //ok_Done
        { label: 'ListProblem', page: 'ListProblemes', icon: <BiError style={{ color: 'red' }} /> }, //ok_Done
        { label: 'CustomerRequest', page: 'DemandeClient', icon: <FcReadingEbook /> }, //ok_Done
        { label: 'NoteClient', page: 'NoteToCustomers', icon: <RiUserVoiceLine style={{ color: theme.palette.secondary.main }} /> }, //ok_Done
        { label: 'ListAllPart', page: 'listePiécesTotal', icon: <FcList /> },
        { label: 'LevelRepair', page: 'NiveauRéparation', icon: <BiTrendingUp style={{ color: 'gold' }} /> }, 
        { label: 'Action de diagnostique', page: 'RepairActions', icon: <BiTrendingUp style={{ color: 'gold' }} /> },
        { label: 'OthersCoast', page: 'AutresFrais', icon: <FcCurrencyExchange /> },
        { label: 'Legislation', page: 'Legislation', icon: <GoLaw style={{ color: theme.palette.secondary.main }} /> },
      ],
    },
    {
      label: 'Statistiques', page: 'Statistiques', icon: <FcLineChart/>
    },

    {
      label: 'ModelsAccessory',
      icon: <FcMultipleDevices />,
      children: [
        { label: 'Accessoires', page: 'Accessoires', icon: <FcHeadset /> }, //ok_Done
        { label: 'Modéles', page: 'Modéles', icon: <FcTouchscreenSmartphone /> },
        {
          label: 'TypeModel', page: 'TypeModéle', icon: <FcMultipleSmartphones />
        },
      ]

    },

    {
      label: 'Gestionstocks',
      icon: <FcDataConfiguration style={{ color: theme.palette.secondary.main }} />
      ,
      children: [
        { label: 'ApprovePart', page: 'AccordPiéces', icon: <FcApproval /> },
        { label: 'Reférences', page: 'Reférences', icon: <GoNumber /> },
        { label: 'case', page: 'case', icon: <CommitIcon /> },
        { label: 'StateStock', page: 'EtatStock', icon: <SiDatabricks /> },
        { label: 'RemplireStock', page: 'RemplissageStock', icon: <TbDatabasePlus /> },
        { label: 'Transfertpiéces', page: 'TransfertPiéces', icon: <TbTransitionRight /> },
        { label: 'Reçoipiéces', page: 'ReçoiPiéces', icon: <TbTransitionLeft /> },
        { label: 'AjusterPrix', page: 'AjusterPrixPiéces', icon: <FcCurrencyExchange /> },
        { label: 'Défalcation', page: 'Défalcation', icon: <RiPageSeparator /> },
      ]
    },

    {
      label: 'Reception',
      icon: <FcVoicePresentation />,
      children: [
        { label: 'Reçoiproduit', page: 'ReçoiProduit', icon: <BsEarbuds /> },
        { label: 'Etatproduit', page: 'ListRepair', icon: <BsEarbuds /> },
        { label: 'Envoyeraffectation', page: 'EnvoyeAffectation', icon: <BsEarbuds /> },
        { label: 'ReciveQC', page: 'RecevoireQC', icon: <BsEarbuds /> },
        { label: 'Récupererproduit', page: 'RécupererProduit', icon: <BsEarbuds /> },
        { label: 'Etatrécuperation', page: 'EtatRécuperation', icon: <BsEarbuds /> },
        { label: 'Factures', page: 'Factures', icon: <FcSalesPerformance /> },
        { label: 'Vente', page: 'Vente', icon: <FcSalesPerformance /> },
      ]
    },

    {
      label: 'Réparation',
      icon: <MdOutlinePhonelinkSetup style={{ color: theme.palette.primary.main }} />,
      children: [
        { label: 'ReçoitAffectation', page: 'ReçoiAffectation', icon: <BsEarbuds /> },
        { label: 'listTotal', page: 'listTotal', icon: <BsEarbuds /> },
       // { label: 'SentQc', page: 'EnvoyéVersCQ', icon: <BsEarbuds /> },
      ]
    },

    {
      label: 'Coordination',
      icon: <FcMindMap />,
      children: [
        { label: 'Reçoireception', page: 'ReçoiReception', icon: <BsEarbuds /> },
        { label: 'Affectation', page: 'Affectation', icon: <BsEarbuds /> },
        { label: 'Réaffectation', page: 'Réaffectation', icon: <BsEarbuds /> },
        { label: 'Accepter CQ', page: 'AccepteQC', icon: <BsEarbuds /> }, 
        { label: 'Validation CQ', page: 'ValidationCQ', icon: <BsEarbuds /> },
        { label: 'Transfertproduit', page: 'TransfertProduit', icon: <BsEarbuds /> },
        

      ]
    },

    {
      label: 'Consulterpiéces', page: ' ConsulterPiéces', icon: <FcSearch />
    },

    {
      label: 'Consulterappareille', page: 'ConsulterAppareille', icon: <FcSearch />
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
          tempFiltered = [menuItems[2], menuItems[4]];
        }

        if (userr?.role.includes('Technicien')) { tempFiltered = [...tempFiltered, menuItems[5]] }

        if (userr?.role.includes('Gestionnaire_de_stocks')) { tempFiltered = [...tempFiltered, menuItems[3]]; }

        if (userr?.role.includes('Coordinateur')) { tempFiltered = [...tempFiltered, menuItems[6]] }

        tempFiltered = [...tempFiltered, menuItems[7], menuItems[8]];
        if (userr?.role.includes('Administrateur')) { tempFiltered = menuItems; }

        setFilteredMenuItems(tempFiltered);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur', error);
        navigate('/');
      }
    };

    fetchUser();
  }, []);


  const renderMenuItem = (item: MenuItem, index: number = 0) => {
    const hasChildren = 'children' in item && Array.isArray(item.children);
    if (hasChildren) {
      return (
        <Box>

          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
           
            <ListItemButton 
              onClick={() => handleToggle(item.label)}
              sx={{ pl: 2 + index * 2 }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.label)} />
              <ListItemIcon> {openMenus[item.label] ? <MdExpandLess /> : <MdExpandMore />} </ListItemIcon>

            </ListItemButton>
          </ListItem>
          <Collapse in={openMenus[item.label]} timeout="auto" unmountOnExit>

            <List component="div" disablePadding>
              {item.children!.map((subItem) => renderMenuItem(subItem, index + 1))}
            </List>
             <Divider />
          </Collapse>
           <br/>
        </Box>
      )
    }
    if ('page' in item) {
      return (
        <>
        
        
        <ListItem disablePadding key={item.label}>
          
          <Tooltip title={t(item.label)} placement="right"  >
            <Box>
            <ListItemButton onClick={() => handleNavigation(item.page)} sx={{ pl: 2 + index * 2 }}>
             <ListItemIcon /> 
              <ListItemIcon>{/* {item.icon} */}<MdOutlineSignalCellularAlt1Bar key={index}  style = {{ color: theme.palette.secondary.main }}/></ListItemIcon>
               
                    <Typography variant="body2" fontSize={12}>
                      {t(item.label)} 
                    </Typography>
                 
               
            </ListItemButton><br/></Box>
          </Tooltip>
   
        </ListItem>
         
        </>
      );
    }
  }
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {filteredMenuItems.map((item) => renderMenuItem(item))}
   
      </List>

    </Stack>
  );
}
