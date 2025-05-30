import * as React from 'react';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import {  AiOutlineUser, AiOutlineSetting,   } from "react-icons/ai";
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import { getCurrentUser } from '../../../api/administration/login';
import { useNavigate } from 'react-router-dom';
import { LuTabletSmartphone } from "react-icons/lu";
import { BsEarbuds } from "react-icons/bs";
import { FaRegFontAwesome, FaUserPlus } from "react-icons/fa6";
import { LiaCodeBranchSolid } from "react-icons/lia";
import { GiRaiseSkeleton } from "react-icons/gi";
import { SiProbot } from "react-icons/si";
import { GoGitPullRequestDraft } from "react-icons/go";
import { TbBrandAndroid } from "react-icons/tb";
import { MdHorizontalDistribute } from "react-icons/md";
import { SlScreenSmartphone } from "react-icons/sl";
import { FcMultipleSmartphones } from "react-icons/fc";
import { LiaDatabaseSolid } from "react-icons/lia";
import { PiListBullets } from "react-icons/pi";
import { SiLevelsdotfyi } from "react-icons/si";
import { GrMoney } from "react-icons/gr";
import { VscCoverage } from "react-icons/vsc";
import { GoNumber } from "react-icons/go";
import CommitIcon from '@mui/icons-material/Commit';
import { SiDatabricks } from "react-icons/si";
import { TbDatabasePlus } from "react-icons/tb";
import { TbTransitionRight } from "react-icons/tb";
import { TbTransitionLeft } from "react-icons/tb";
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import { RiPageSeparator } from "react-icons/ri";
import { FaPersonDotsFromLine } from "react-icons/fa6";
import { GiAutoRepair } from "react-icons/gi";
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import { BiShowAlt } from "react-icons/bi";
import { BiSolidShow } from "react-icons/bi";
import { PiChartLineThin } from "react-icons/pi";
import {Box} from '@mui/joy'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
interface NavigationProps {
  onSelectPage: (page: string) => void;
  selectedPage: string;
}
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
  };
 
 
export default function Navigation(/* { onSelectPage, selectedPage }: NavigationProps */) {
 const navigate = useNavigate();
 const { t } = useTranslation();
  const handleNavigation = (page: string) => {
    navigate(`/dashboard/${page}`);   
  };
const menuItems: MenuItem[] = [
  {
    label: 'Administration',
    icon: <AiOutlineSetting />,
    children: [
      { label: 'Entreprise', page: 'Entreprise', icon: <FaRegFontAwesome />},
      { label: 'Agence', page: 'Agencies', icon: <LiaCodeBranchSolid /> },
      { label: 'Employees', page: 'Employees', icon: <FaUserPlus /> },
      { label: 'Marques', page: 'Marques', icon: <TbBrandAndroid /> },
      { label: 'Distributeurs', page: 'Distributeurs', icon: <MdHorizontalDistribute />      }, //ok_Done
      { label: 'Raisonsexpertise', page: 'RaisonsExpertise', icon: <GiRaiseSkeleton /> }, //ok_Done
      { label: 'ListProblem', page: 'ListProblemes', icon: <SiProbot /> }, //ok_Done
      { label: 'CustomerRequest', page: 'DemandeClient', icon: <GoGitPullRequestDraft /> }, //ok_Done
      { label: 'NoteClient', page: 'NoteToCustomers', icon: <AiOutlineUser /> }, //ok_Done
      { label: 'ListAllPart', page: 'listePiécesTotal', icon: <PiListBullets />      },
      { label: 'LevelRepair', page: 'NiveauRéparation', icon: <SiLevelsdotfyi />      },
      { label: 'OthersCoast', page: 'AutresFrais', icon: <GrMoney />},
    ],
  },
  {
    label:'Statistiques', page:'Statistiques', icon:<PiChartLineThin />
  },

  {
    label: 'ModelsAccessory',
    icon: <LuTabletSmartphone />,
    children: [
      { label: 'Accessoires', page: 'Accessoires', icon: <BsEarbuds /> }, //ok_Done
      { label: 'Modéles', page: 'Modéles', icon: <SlScreenSmartphone />      },
      { label: 'TypeModel', page: 'TypeModéle', icon: <FcMultipleSmartphones />
      },
    ]

  },

  {
    label: 'Gestionstocks',
    icon: <LiaDatabaseSolid />
    ,
    children: [
      { label: 'ApprovePart', page: 'AccordPiéces', icon: <VscCoverage />      },  
      { label: 'Reférences', page: 'Reférences', icon: <GoNumber /> },
      { label: 'case', page: 'case', icon: <CommitIcon /> },
      { label: 'StateStock', page: 'EtatStock', icon: <SiDatabricks /> }, 
      { label: 'RemplireStock', page: 'RemplissageStock', icon: <TbDatabasePlus />      },
      { label: 'Transfertpiéces', page: 'TransfertPiéces', icon: <TbTransitionRight />      },
      { label: 'Reçoipiéces', page: 'ReçoiPiéces', icon: <TbTransitionLeft />      }, 
      { label: 'AjusterPrix', page: 'AjusterPrixPiéces', icon: <PriceCheckIcon /> },
      { label: 'Défalcation', page: 'Défalcation', icon: <RiPageSeparator /> },
    ]
  },

  {
    label: 'Reception',
    icon: <FaPersonDotsFromLine />    ,
    children: [
      { label: 'Reçoiproduit', page: 'ReçoiProduit', icon: <BsEarbuds /> }, 
      { label: 'Etatproduit', page: 'EtatProduit', icon: <BsEarbuds /> },
      { label: 'Envoyeraffectation', page: 'EnvoyeAffectation', icon: <BsEarbuds /> },
      { label: 'ReciveQC', page: 'RecevoireQC', icon: <BsEarbuds /> },
      { label: 'Récupererproduit', page: 'RécupererProduit', icon: <BsEarbuds /> },
      { label: 'Etatrécuperation', page: 'EtatRécuperation', icon: <BsEarbuds /> },
      { label: 'Factures', page: 'Factures', icon: <BsEarbuds /> }, 
      { label: 'Vente', page: 'Vente', icon: <BsEarbuds /> },
    ]
  } ,

  {
    label: 'Réparation',
    icon: <GiAutoRepair />,
    children: [
      { label: 'ReçoitAffectation', page: 'ReçoiAffectation', icon: <BsEarbuds /> }, 
      { label: 'listTotal', page: 'listTotal', icon: <BsEarbuds /> },
       { label: 'SentQc', page: 'EnvoyéVersCQ', icon: <BsEarbuds /> },    
    ]
  } ,

  {
    label: 'Coordination',
    icon: <HubOutlinedIcon />,
    children: [
      { label: 'Reçoireception', page: 'ReçoiReception', icon: <BsEarbuds /> }, 
      { label: 'Affectation', page: 'Affectation', icon: <BsEarbuds /> },
      { label: 'Réaffectation', page: 'Réaffectation', icon: <BsEarbuds /> },
      { label: 'Envoyérécuperer', page: 'EnvoyéRécuperer', icon: <BsEarbuds /> },
      { label: 'Transfertproduit', page: 'TransfertProduit', icon: <BsEarbuds /> },
      
    ]
  } ,

  {
    label:'Consulterpiéces', page:' ConsulterPiéces', icon:<BiShowAlt />
  },
 
  {
    label:'Consulterappareille', page:'ConsulterAppareille', icon:<BiSolidShow />
  },

];
  const [filteredMenuItems, setFilteredMenuItems] = React.useState<MenuItem[]>([]);
   const userr = useSelector((state: RootState) => state.user);
   React.useEffect(() => {
    const fetchUser = async () => {
      try {
        //const currentUser = await getCurrentUser();
        // Appliquer le filtrage
        let tempFiltered: MenuItem[] = [];

       
 

// ...
        if (userr.role.includes('Reception')) { 
          tempFiltered = [  menuItems[2], menuItems[4]];
        }

        if (userr.role.includes('Technicien')) { tempFiltered =  [...tempFiltered, menuItems[5] ] }  

        if (userr.role.includes('Gestionnaire_de_stocks')) { tempFiltered = [...tempFiltered, menuItems[3] ]; } 

        if (userr.role.includes('Coordinateur')) { tempFiltered = [...tempFiltered, menuItems[6]] } 

        tempFiltered = [...tempFiltered,  menuItems[7],menuItems[8]];
        if (userr.role.includes('Administrateur')) { tempFiltered = menuItems; }  

        setFilteredMenuItems(tempFiltered);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur', error);
        navigate('/');
      }
    };

    fetchUser();
  }, []);
  return (
    <List
      size="sm"
      sx={{ '--ListItem-radius': 'var(--joy-radius-sm)', '--List-gap': '4px' }}
    >
      <ListItem nested>
 
        <List
          aria-labelledby="nav-list-browse"
          sx={{ '& .JoyListItemButton-root': { p: '8px' } }}
        >



         {filteredMenuItems.map((item, index) => (
          <Box key={index}>
            {hasChildren(item) ? (
              <Accordion>
                <AccordionSummary>
                  <ListItemButton>
                    <ListItemDecorator>{item.icon}</ListItemDecorator>
                    <ListItemContent>{t(item.label)}</ListItemContent>
                  </ListItemButton>
                </AccordionSummary>
                <AccordionDetails>
                  <List sx={{ pl: 2 }}>
                    {item.children.map((subItem, subIndex) => (
                      <ListItemButton
                        key={subIndex}
                        onClick={() => handleNavigation(subItem.page)}
                      >
                        <ListItemDecorator>{subItem.icon}</ListItemDecorator>
                        <ListItemContent>{t(subItem.label)}</ListItemContent>
                      </ListItemButton>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ) : (
              <ListItemButton onClick={() => handleNavigation(item.page)}>
                <ListItemDecorator>{item.icon}</ListItemDecorator>
                <ListItemContent>{t(item.label)}</ListItemContent>
              </ListItemButton>
            )}
          </Box>
))}
 
        </List>
      </ListItem>
    </List>
  );
}

function hasChildren(item: MenuItem): item is Extract<MenuItem, { children: unknown }> {
  return 'children' in item;
}

