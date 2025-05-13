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
import { getCurrentUser } from '../../../api/login';
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

export const menuItems: MenuItem[] = [
  {
    label: 'Administration',
    icon: <AiOutlineSetting />,
    children: [
      { label: 'Entreprise', page: 'Entreprise', icon: <FaRegFontAwesome />},
      { label: 'Agencies', page: 'Agencies', icon: <LiaCodeBranchSolid /> },
      { label: 'Employees', page: 'Employees', icon: <FaUserPlus /> },
      { label: 'Marques', page: 'Marques', icon: <TbBrandAndroid /> },
      { label: 'Distributeurs', page: 'Distributeurs', icon: <MdHorizontalDistribute />      }, //ok_Done
      { label: 'Raisons d\'expertise', page: 'RaisonsExpertise', icon: <GiRaiseSkeleton /> }, //ok_Done
      { label: 'List problèmes', page: 'ListProblemes', icon: <SiProbot /> }, //ok_Done
      { label: 'Demande client', page: 'DemandeClient', icon: <GoGitPullRequestDraft /> }, //ok_Done
      { label: 'Notes pour client', page: 'NoteToCustomers', icon: <AiOutlineUser /> }, //ok_Done
      { label: 'liste des piéces total', page: 'listePiécesTotal', icon: <PiListBullets />      },
      { label: 'Niveau de réparation', page: 'NiveauRéparation', icon: <SiLevelsdotfyi />      },
      { label: 'Autres Frais', page: 'AutresFrais', icon: <GrMoney />},
    ],
  },
  {
    label:'Statistiques', page:'Statistiques', icon:<PiChartLineThin />
  },

  {
    label: 'Modéles et Accessoire',
    icon: <LuTabletSmartphone />,
    children: [
      { label: 'Accessoires', page: 'Accessoires', icon: <BsEarbuds /> }, //ok_Done
      { label: 'Modéles', page: 'Modéles', icon: <SlScreenSmartphone />      },
      { label: 'Type Modéle', page: 'TypeModéle', icon: <FcMultipleSmartphones />
      },
    ]

  },

  {
    label: 'Gestion des stocks',
    icon: <LiaDatabaseSolid />
    ,
    children: [
      { label: 'Accord piéces', page: 'AccordPiéces', icon: <VscCoverage />      },  
      { label: 'Reférences', page: 'Reférences', icon: <GoNumber /> },
      { label: 'case', page: 'case', icon: <CommitIcon /> },
      { label: 'Etat du stock', page: 'EtatStock', icon: <SiDatabricks /> }, 
      { label: 'Remplissage de stock', page: 'RemplissageStock', icon: <TbDatabasePlus />      },
      { label: 'Transfert piéces', page: 'TransfertPiéces', icon: <TbTransitionRight />      },
      { label: 'Reçoi piéces', page: 'ReçoiPiéces', icon: <TbTransitionLeft />      }, 
      { label: 'Ajuster Prix des piéces', page: 'AjusterPrixPiéces', icon: <PriceCheckIcon /> },
      { label: 'Défalcation', page: 'Défalcation', icon: <RiPageSeparator /> },
    ]
  },

  {
    label: 'Reception',
    icon: <FaPersonDotsFromLine />    ,
    children: [
      { label: 'Reçoi produit', page: 'ReçoiProduit', icon: <BsEarbuds /> }, 
      { label: 'Etat des produit', page: 'EtatProduit', icon: <BsEarbuds /> },
      { label: 'Envoyer vers affectation', page: 'EnvoyeAffectation', icon: <BsEarbuds /> },
      { label: 'Recevoire depuis controle qualité', page: 'RecevoireQC', icon: <BsEarbuds /> },
      { label: 'Récuperer produit', page: 'RécupererProduit', icon: <BsEarbuds /> },
      { label: 'Etat de récuperation', page: 'EtatRécuperation', icon: <BsEarbuds /> },
      { label: 'Factures', page: 'Factures', icon: <BsEarbuds /> }, 
      { label: 'Vente', page: 'Vente', icon: <BsEarbuds /> },
    ]
  } ,

  {
    label: 'Réparation',
    icon: <GiAutoRepair />,
    children: [
      { label: 'Reçoi depuis Affectation', page: 'ReçoiAffectation', icon: <BsEarbuds /> }, 
      { label: 'list Total', page: 'listTotal', icon: <BsEarbuds /> },
       { label: 'Envoyé vers CQ', page: 'EnvoyéVersCQ', icon: <BsEarbuds /> },    
    ]
  } ,

  {
    label: 'Coordination',
    icon: <HubOutlinedIcon />,
    children: [
      { label: 'Reçoi depuis reception', page: 'ReçoiReception', icon: <BsEarbuds /> }, 
      { label: 'Affectation', page: 'Affectation', icon: <BsEarbuds /> },
      { label: 'Réaffectation', page: 'Réaffectation', icon: <BsEarbuds /> },
      { label: 'Envoyé pour récuperer', page: 'EnvoyéRécuperer', icon: <BsEarbuds /> },
      { label: 'Transfert produit', page: 'TransfertProduit', icon: <BsEarbuds /> },
      
    ]
  } ,

  {
    label:' Consulter piéces', page:' ConsulterPiéces', icon:<BiShowAlt />
  },
 
  {
    label:'Consulter appareille', page:'ConsulterAppareille', icon:<BiSolidShow />
  },

];
export default function Navigation({ onSelectPage, selectedPage }: NavigationProps) {


  const [filteredMenuItems, setFilteredMenuItems] = React.useState<MenuItem[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        // Appliquer le filtrage
        let tempFiltered: MenuItem[] = [];

        if (currentUser.role.includes('Admin')) { tempFiltered = menuItems; }  

        if (currentUser.role.includes('Receptionniste')) { tempFiltered = [...tempFiltered, menuItems[1]];  }  

        if (currentUser.role.includes('Technicien')) { tempFiltered =  menuItems  }  

        if (currentUser.role.includes('StocKeeper')) { tempFiltered = [...tempFiltered, menuItems[0], menuItems[1]]; } 

        if (currentUser.role.includes('Coordinateur')) { tempFiltered = [...tempFiltered, menuItems[1]] } 

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
        <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800' }}>

        </ListSubheader>
        <List
          aria-labelledby="nav-list-browse"
          sx={{ '& .JoyListItemButton-root': { p: '8px' } }}
        >



          {filteredMenuItems.map((item, index) => (
            <React.Fragment key={index}>
              {hasChildren(item) ? (
                <Accordion>
                  <AccordionSummary>
                    <ListItemButton>
                      <ListItemDecorator>{item.icon}</ListItemDecorator>
                      <ListItemContent>{item.label}</ListItemContent>
                    </ListItemButton>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List sx={{ pl: 2 }}>
                      {item.children.map((subItem, subIndex) => (
                        <ListItem key={subIndex}>
                          <ListItemButton
                            selected={selectedPage === subItem.page}
                            onClick={() => onSelectPage(subItem.page)}
                          >
                            <ListItemDecorator>{subItem.icon}</ListItemDecorator>
                            <ListItemContent>{subItem.label}</ListItemContent>
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ) : (
                <ListItem>
                  <ListItemButton selected={selectedPage === item.page} onClick={() => onSelectPage(item.page)}>
                    <ListItemDecorator>{item.icon}</ListItemDecorator>
                    <ListItemContent>{item.label}</ListItemContent>
                  </ListItemButton>
                </ListItem>
              )}
            </React.Fragment>
          ))}







        </List>
      </ListItem>
    </List>
  );
}

function hasChildren(item: MenuItem): item is Extract<MenuItem, { children: unknown }> {
  return 'children' in item;
}

