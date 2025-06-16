import * as React from 'react';
    import {  AiOutlineUser, AiOutlineSetting,   } from "react-icons/ai";
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
import { GoLaw } from "react-icons/go";
 import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
 import Accordion, { accordionClasses, type AccordionSlots } from '@mui/material/Accordion';
 import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails, { accordionDetailsClasses } from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

 import type { RootState } from '../../Redux/store';
import { Box, Fade } from '@mui/material';
import theme from '../../Theme/theme';
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
  }
export default function Navigation() {
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
      { label: 'Legislation', page: 'Legislation', icon: <GoLaw />}, 
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
      { label: 'Etatproduit', page: 'ListRepair', icon: <BsEarbuds /> },
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
   const userr = useSelector((state: RootState) => state.auth.user);
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
  const [expanded, setExpanded] = React.useState(false);

  
  const [expandedPanel, setExpandedPanel] = React.useState<string | false>(false);

const handleExpansion = (panelId: string) => (
  event: React.SyntheticEvent,
  isExpanded: boolean
) => {
  setExpandedPanel(isExpanded ? panelId : false);
};

  return (
    <div>
   <List
      sx={{padding:'0px',
    borderRadius: (theme) => theme.shape.borderRadius, // équivalent à un radius standard
    '& .MuiListItem-root': {
      borderRadius: 4, // ou utiliser theme.shape.borderRadius
      
    },
    }}>
      <ListItem sx={{ borderBottom: '1px solid #ccc', width:'100%',padding:'0px' }}>
        <List
            aria-labelledby="nav-list-browse"
            sx={{padding:'0px',
              '& .MuiListItemButton-root': {
                //p: '1px', // padding équivalent
              },
            }}
          >
            {filteredMenuItems.map((item, index) => (
              <Box key={index}>
                {hasChildren(item) ? (
                  <Accordion
                          expanded={expandedPanel === item.label}
                          onChange={handleExpansion(item.label)}
                          slots={{ transition: Fade as AccordionSlots['transition'] }}
                          slotProps={{ transition: { timeout: 400 } }}
                          sx={[
                            expandedPanel === item.label
                              ? {
                                  [`& .${accordionClasses.region}`]: {
                                    height: 'auto',margin:0
                                  },
                                  [`& .${accordionDetailsClasses.root}`]: {
                                    display: 'block',borderRadius: 4, backgroundColor:theme.palette.info.main
                                  },
                                }
                              : {
                                  [`& .${accordionClasses.region}`]: {
                                    height: 0,margin:0
                                  },
                                  [`& .${accordionDetailsClasses.root}`]: {
                                    display: 'none',
                                  },
                                },
                          ]}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id={item.label}
                            sx={{ backgroundColor:theme.palette.info.main}}
                          >
                             
                                <ListItemButton sx={{height:'30px', backgroundColor:theme.palette.info.main}}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText><h5>{t(item.label)} </h5></ListItemText>
                                </ListItemButton>
                             
                          </AccordionSummary>
                          <AccordionDetails>
                  <List sx={{ pl: 2 , width:'100%'}}>
                    {item.children.map((subItem, subIndex) => (
                      <ListItemButton
                      sx={{height:'40px', backgroundColor:theme.palette.info.main}}
                        key={subIndex}
                        onClick={() => handleNavigation(subItem.page)}
                      >
                        <ListItemIcon>{subItem.icon}</ListItemIcon>
                        <ListItemText> <h6>{t(subItem.label)}</h6></ListItemText>
                      </ListItemButton>
                    ))}
                  </List>
                </AccordionDetails>
                  </Accordion>

                ):( <Accordion
                          expanded={expandedPanel === item.label}
                          onChange={handleExpansion(item.label)}
                          slots={{ transition: Fade as AccordionSlots['transition'] }}
                          slotProps={{ transition: { timeout: 400 } }}
                          sx={[
                            expandedPanel === item.label
                              ? {
                                  [`& .${accordionClasses.region}`]: {
                                    height: 'auto',margin:0
                                  },
                                  [`& .${accordionDetailsClasses.root}`]: {
                                    display: 'block',borderRadius: 4, backgroundColor:theme.palette.info.main
                                  },
                                }
                              : {
                                  [`& .${accordionClasses.region}`]: {
                                    height: 0,margin:0
                                  },
                                  [`& .${accordionDetailsClasses.root}`]: {
                                    display: 'none',
                                  },
                                },
                          ]}>
                  <AccordionSummary
                            
                            aria-controls="panel1-content"
                            id={item.label}
                            sx={{ backgroundColor:theme.palette.info.main}}
                          >
                  <ListItemButton onClick={() => handleNavigation(item.page)}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText>{t(item.label)}</ListItemText>

                  </ListItemButton>
                  </AccordionSummary>
                  </Accordion>

                ) }


              </Box>


              ))}


          </List>


      </ListItem>

   </List>
    </div>
  )
}
function hasChildren(item: MenuItem): item is Extract<MenuItem, { children: unknown }> {
  return 'children' in item;
}