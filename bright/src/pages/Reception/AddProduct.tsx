import { Card,Typography ,Button, ListItemContent, Option,  TextField, Input } from "@mui/joy";
import { Box } from "@mui/material";
import React from "react";
import Autocomplete from '@mui/joy/Autocomplete';
import {     getAccessory, getCustomer, getCustomerRequest, getDevices, getListFault, getOneCustomer, getOneDevice  } from "../../api/Reception/CreateRepair";
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { useTranslation } from 'react-i18next';
import { fetchDistributeur } from "../../api/administration/Administration";
import { getModels } from "../../api/ModelAccessory/Models";
import { InputDate } from "../Componants/InputDate";
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/joy/Modal';
import CardCover from '@mui/joy/CardCover';
import AspectRatio from '@mui/joy/AspectRatio';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { getMarque } from "../../api/administration/Marque";
import { useNotification } from "../Componants/NotificationContext";
import BurstModeIcon from '@mui/icons-material/BurstMode';
import Checkbox from '@mui/joy/Checkbox';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
 import Sheet from '@mui/joy/Sheet';
import Done from '@mui/icons-material/Done';
import Select from '@mui/joy/Select';
 import Textarea from '@mui/joy/Textarea';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../Redux/store';
import { PiEmptyThin } from "react-icons/pi";
import {    CreateRepairPDF } from "../../api/PDF/Repair";
import { store } from "../../Redux/store";
import { addRepair } from "../../Redux/Actions/receptionAction";
import { clearError } from "../../Redux/recptionSlices/addRepairSlice";
import type { Customer, Device, Distributor, Marque, Model, RepairForm, RepairFormInput, TypeForm, TypeUnique } from "../../Redux/Types/repairTypes";
import {CreateRepairDto} from '../../../../backend-nestjs/src/repair/dto/create-repair.dto'
  export function AddProduct () {
  const [step, setStep] = React.useState(0);

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [device, setDevice] = React.useState<Device | null > (null);
  const [repair, setRepair] = React.useState<TypeForm | null > (null);
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return   <AddCustomer onChange={setCustomer}/>  ;
      case 1:
        return   <AddDevice onChange={setDevice}/>  ;
      case 2:
              if (!customer || !device) {
                return <Typography level="body-sm" color="danger">Veuillez remplir les étapes précédentes.</Typography>;
              }

              return (
                 
                  <AddRepair onChange={setRepair} customerr={customer} devicee={device} />
                
              );
      default:
        return <Typography>Étape inconnue</Typography>;
    }
  };
    return(
        <div>
             <Box sx={{display:'flex', justifyContent:'space-around'}}>
                <Card sx={{width:'40%', height:'750px',bgcolor: '#FAFAFA'}}>
                     <Typography level="title-md">Client sélectionné</Typography>
                        {customer ? (
                            <>
                              <table style={{ border: '2px solid #E0E0E0'  }}>                              
                                <tr>
                                 <td  style={{ border: '2px solid #E0E0E0', width:'200px',backgroundColor: '#EEEEEE'  }}>Nom</td>  <td style={{ border: '2px solid #E0E0E0', width:'400px'   }}>{customer.name}</td>
                                </tr>
                              <tr>
                                <td style={{ border: '2px solid #E0E0E0' ,backgroundColor: '#EEEEEE' }}>Téléphone</td> <td style={{ border: '2px solid #E0E0E0'  }}>{customer.phone}</td>
                              </tr>
                              {customer.distributer && (
                                <tr>
                                  <td style={{ border: '2px solid #E0E0E0' ,backgroundColor: '#EEEEEE' }}>Distributeur</td> <td style={{ border: '2px solid #E0E0E0'  }}>{customer.distributer.name}</td>

                                </tr>

                                 )}

                            </table>
                             
                           
                            
                            </>
                        ) : (
                            <Typography><PiEmptyThin /></Typography>
                        )}

                         <Typography level="title-md">Appareille</Typography>
                         {
                          device ? (
                            <table style={{ border: '2px solid #E0E0E0'  }}>
                              <tr>
                                <td  style={{ border: '2px solid #E0E0E0', width:'200px',backgroundColor: '#EEEEEE'  }}>Imei</td>  <td style={{ border: '2px solid #E0E0E0' , width:'400px' }}>{device.serialenumber}</td>

                              </tr>
                              <tr>
                                <td  style={{ border: '2px solid #E0E0E0', width:'200px' ,backgroundColor: '#EEEEEE' }}>Modéle</td>  <td style={{ border: '2px solid #E0E0E0'  }}>{device.model?.name || ''}</td>

                              </tr>
                              <tr>
                                <td  style={{ border: '2px solid #E0E0E0', width:'200px',backgroundColor: '#EEEEEE'  }}>Date d'achat</td>  <td style={{ border: '2px solid #E0E0E0'  }}>{device.purchaseDate ? new Date(device.purchaseDate).toISOString().split('T')[0] : 'Non précisée'}</td>

                              </tr>
 
                            </table>

                          ) : (
                                <Typography><PiEmptyThin /></Typography>
                          )
                         }


                          <Typography level="title-md">Détaille </Typography>
                         {
                          repair ? (
                            
                            <div>
                              <table style={{ border: '2px solid E0E0E0'  }}>
                                 <tr>
                                  <td  style={{ border: '2px solid E0E0E0', width:'200px'  } }>Id</td>
                                  <td>{repair.id}</td>
                                 </tr>
                                <tr>
                                  <td  style={{ border: '2px solid E0E0E0', width:'200px',backgroundColor: '#EEEEEE'  } }>Accessoire</td> 
                                  <td style={{ border: '2px solid E0E0E0' , width:'400px' }}>
                                    {repair.accessory.map((item, idx) => (
                                      <div key={idx}>
                                        <Typography level="body-sm">• {item.name}</Typography>
                                      </div>
                                    ))}

                                  </td>
                                </tr>
                                <tr>
                                  <td  style={{ border: '2px solid E0E0E0', width:'200px' ,backgroundColor: '#EEEEEE' } }>Liste des probléme</td>
                                  <td style={{ border: '2px solid E0E0E0'  }}>
                                    {repair.listFault.map((item, idx) => (
                                            <div key={idx}>
                                              <Typography level="body-sm">• {item.name}</Typography>
                                            </div>
                                          ))}

                                  </td>
                                </tr>
                                <tr>
                                  <td  style={{ border: '2px solid E0E0E0', width:'200px' ,backgroundColor: '#EEEEEE' } }>Demandes client</td>
                                  <td style={{ border: '2px solid E0E0E0'  }}>
                                    {repair.customerRequest.map((item, idx) => (
                                    <div key={idx}>
                                      <Typography level="body-sm">• {item.name}</Typography>
                                    </div>
                                  ))}

                                  </td>
                                </tr>
                                <tr>
                                  <td  style={{ border: '2px solid E0E0E0', width:'200px',backgroundColor: '#EEEEEE' } }>Etat de l'appareille</td>
                                  <td style={{ border: '2px solid E0E0E0'  }}>{repair.deviceStateReceive}</td>
                                </tr>
                                <tr>
                                  <td  style={{ border: '2px solid E0E0E0', width:'200px',backgroundColor: '#EEEEEE'  } }>Remarque</td>
                                  <td style={{ border: '2px solid E0E0E0'  }}>{repair.remark}</td>
                                </tr>
                              </table>
 
                            </div> 

                          ) : (
                                <Typography><PiEmptyThin /></Typography>
                          )
                         }
                </Card>

                <Card sx={{width:'55%', height: '750px', display: 'flex', flexDirection: 'column'}}>
                    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>{renderStepContent()}</Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto', p: 2 }}>
                        <Button disabled={step === 0} onClick={back}>Précédent</Button>
                        <Button onClick={next}>{step === 2 ? 'Terminer' : 'Suivant'}</Button>
                    </Box>
                </Card>
             </Box>
                



             
        </div>
    )
}
 
 
 
function AddCustomer({ onChange }: {onChange: (c: Customer) => void }) {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [valuecustomers, setValueCustomers] = React.useState<Customer | null>({name:'',phone:0,distributer: null});

    const [distributor, setDistributor] = React.useState<Distributor[]>([]);
     
const { t } = useTranslation();

   const  handelSubmit = () => {
     getOneCustomer(valuecustomers)
        .then( (data) =>onChange(data) )

    }  
  React.useEffect(() => {
    getCustomer().then((data) => setCustomers(data));
    fetchDistributeur().then( (data) => setDistributor(data));

  }, []); // ← important : ajouter les crochets pour éviter une boucle infinie

  return (
    <div>
        <Typography>Information client</Typography> <br></br> <br/>
        <FormLabel>Rechercher un client</FormLabel>
      <Autocomplete
         
        
        id="customer-autocomplete"
        placeholder="Choisir des clients"
        options={customers}
        getOptionLabel={(option) => `${option.phone} - ${option.name}`}
      
        onChange={(_, value) => {
           
          setValueCustomers(value)
        }}
         value={valuecustomers}
      /> <br/>
     <form>
         <Typography sx={{marginBottom:'5%', marginTop:'5%'}}>Ajouter un client</Typography>
      <FormControl  sx={{marginBottom:'5%'}}>
            <FormLabel>{t('Nom')}</FormLabel>
                <Input
                variant="soft"
                sx={underlineInputStyles}
                value={valuecustomers?.name || ""}
                onChange={(e) =>
                    setValueCustomers({
                    ...valuecustomers!,
                    name: e.target.value,
                    })
                }
                />        
        </FormControl>

        <FormControl sx={{marginBottom:'5%'}}>
            <FormLabel>{t('Tel')}</FormLabel>
            <Input
                    variant="soft"
                    type="number"
                    sx={underlineInputStyles}
                    value={valuecustomers?.phone ?? ''}
                    onChange={(e) => {
                        if (valuecustomers) {
                            setValueCustomers({
                            ...valuecustomers,
                            phone: Number(e.target.value),
                            });
                        }
                        }}
                    />
        </FormControl>
        <FormControl>
            <FormLabel>{t('Distributeurs')}</FormLabel>
            <Autocomplete
                     
                    
                    id="Distributeurs-autocomplete"
                    placeholder="Choisir des Distributeurs"
                    options={distributor}
                    getOptionLabel={(option) => `${option.phone} - ${option.name}`}
                
                      onChange={(_, value) => {
                            setValueCustomers((prev) => ({
                            ...prev!,
                            distributer: value,
                            }));
                        }}
                    value={valuecustomers?.distributer}
                />

        </FormControl><br/> <br/>
        <Button variant="outlined" onClick={  handelSubmit}>Enregistrer</Button> 
     </form>

    </div>
  );
}

 
function AddDevice ({ onChange }: { onChange: (c: Device) => void }) {
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [models, setModels] = React.useState<Model[]>([])
  const { notify } = useNotification();
  const [valueDevice, setValueDevice] = React.useState<Device | null>({serialenumber:'',purchaseDate: new Date(),  
                                                                        model:{id:0,name:'',
                                                                                brand:{ id: 0,
                                                                                        name: '',
                                                                                        logo: '',
                                                                                        status: ''}, 
                                                                                picture:'',
                                                                                typeModel:{ id: 0,
                                                                                            description: ''},
                                                                                allpart:[]
                                                                              } });
 const handlePurchaseDateChange = (newDate: Date) => {
  setValueDevice((prev) => ({
    ...prev!,
    purchaseDate: newDate,
  }));
};
    React.useEffect(() => {
    getDevices().then((data) => setDevices(data));
    getModels().then( (data) => setModels(data));

  }, []);
const handleModelSelected = (model: Model) => {
  if (valueDevice) {
    setValueDevice({
      ...valueDevice,
      model: model
    });
  }
};
 const handelSubmit = () => {
   if ( !valueDevice?.model || !valueDevice?.serialenumber || !valueDevice?.purchaseDate) {
    notify("Remplire Toutes les champs.","danger");
    return;
  }

    const body = {
    serialenumber: valueDevice.serialenumber,
    purchaseDate: valueDevice.purchaseDate?.toISOString(),
    model: valueDevice.model?.id,
  };

  getOneDevice(body)
    .then((data) => onChange(data))
    .catch((err) => console.error("Erreur API:", err));
};

    return(
        <div>
 

                <form>
                  <Typography sx={{marginBottom:'5%', marginTop:'5%'}}>Ajouter un Appareille</Typography>
                      <FormControl  sx={{marginBottom:'5%'}}>
                        <FormLabel>Imei</FormLabel>
                            <Input
                                required
                                variant="soft"
                                sx={underlineInputStyles}
                                value={valueDevice?.serialenumber ?? ""}
                                onChange={(e) => {
                                  const input = e.target.value;
                                  const alphanumeric = input.replace(/[^a-zA-Z0-9]/g, '').slice(0, 15); // filtre et limite à 15 caractères
                                  setValueDevice({
                                    ...valueDevice!,
                                    serialenumber: alphanumeric,
                                  });
                                }}
                              />
       
                          </FormControl>
                          <FormControl sx={{marginTop:'5%'}}>
                            <FormLabel>Date d'achat</FormLabel>
                             <InputDate onChange={handlePurchaseDateChange} />  
  
                          </FormControl>

 

                          <FormControl sx={{marginTop:'5%'}}>
                            <FormLabel>Modéle</FormLabel>
                            <div style={{display:'flex' ,justifyContent:'space-around'}}>
                                <Autocomplete
                               required
                                sx={{width:'45%'}}
                              id="model-autocomplete"
                              placeholder="Choisir des modéle"
                              options={models}
                              getOptionLabel={(option) => `${option.name} `}
                              value={valueDevice?.model}
                            onChange={(_, value) => {
                              setValueDevice(prev => {
                                if (!prev) return prev; // ou même throw
                                return { ...prev, model: value! };
                              });
                            }}
                              
                            /> 

                                <SelectModelLogo onSelectModel={handleModelSelected} />
  
                            </div>

                          </FormControl><br/> <br/>
                          <Button variant="outlined" onClick={  handelSubmit}>Enregistrer</Button> 
                </form>
        </div>
    )
}

 
 
  
function AddRepair({devicee,customerr, onChange }: {devicee:Device, customerr:Customer, onChange: (c: TypeForm) => void }) {
const { notify } = useNotification();
const [accessory,setAccessory] = React.useState<TypeUnique[]>([]);
const [listFault,setListFault] = React.useState<TypeUnique[]>([]);
const [customerRequest,setCustomerRequest] = React.useState<TypeUnique[]>([]);
const user = useSelector((state: RootState) => state.user);
const dispatch = useDispatch<AppDispatch>();
const { currentRepair, repairs, loading, error } = useSelector((state: RootState) => state.repair);   

 const [formData, setFormData] = React.useState<TypeForm> ({
  accessory: [],
  listFault: [],           // obligatoire, donc initialisé à un tableau vide
  customerRequest: [],
  deviceStateReceive: '',   // obligatoire, donc initialisé à une chaîne vide
  remark: '',
  actuellyBranch:user.branch?.name || '',
  device: {
    id: undefined,
    serialenumber: '',
    purchaseDate: undefined,
    model: {
      id: undefined,
      name: '',
      brand:{
        id: undefined,
        name:'',
        logo: '',
        status: ''
      },
      typeModel: {
         id: undefined,
         description:''
      },
      picture: '',
      allpart:[]
    }, // ou un modèle vide si disponible
  },
  customer: {
    id: undefined,
    name: '',
    phone: 0,
    distributer: null,
  }
});  
 
    React.useEffect(() => {
    getAccessory().then((data) => setAccessory(data));
    getListFault().then( (data) => setListFault(data));
    getCustomerRequest().then( (data) => setCustomerRequest(data));

  }, []);

   const handelSubmit = async () => {
 if (!formData || !devicee?.id || !customerr?.id) {
    notify("Appareil et client sont requis", "danger");
    return;
  }

  if (!formData.listFault.length) {
    notify("Veuillez sélectionner au moins un défaut.", "danger");
    return;
  }
   const accessoryIds: number[] = formData.accessory
  .map(a => a.id)
  .filter((id): id is number => id !== undefined);

const listFaultIds: number[] = formData.listFault
  .map(f => f.id)
  .filter((id): id is number => id !== undefined);

const customerRequestIds: number[] = formData.customerRequest
  .map(r => r.id)
  .filter((id): id is number => id !== undefined);
   
 
const body  = {
  accessoryIds: accessoryIds?.length ? accessoryIds : [],
  listFaultIds: listFaultIds?.length ? listFaultIds : [],
  customerRequestIds: customerRequestIds?.length ? customerRequestIds : [],
  deviceStateReceive: formData.deviceStateReceive ?? '',
  remark: formData.remark ?? ' ',
  actuellyBranch: user.branch?.name ?? ' ',
  device: devicee?.id ?? null,
  customer: customerr?.id ?? null,
  userId: user.id || 0
};

 
if (!body.listFaultIds.length) {
  return notify("Veuillez sélectionner au moins un défaut.", "danger");
}    
 

   try {
 
   const resultAction = await dispatch(addRepair(body));
 
    if (addRepair.fulfilled.match(resultAction)) {
      const createdRepair = resultAction.payload;
 
      
      if (createdRepair.id !== undefined) {
          const typeFormData: TypeForm = {
            ...formData,
            device: devicee,
            customer: customerr
          }; 

           onChange(typeFormData);
          CreateRepairPDF(createdRepair.id); 
          notify("Réparation créée avec succès!", "success");
       }
      else {
          notify("ID de réparation manquant dans la réponse.", "danger");
        }


          }  
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "danger");
        }
     
};
  // Gestion des erreurs globales
  React.useEffect(() => {
    if (error) {
      notify(error, "danger");
      dispatch(clearError());
    }
  }, [error, notify, dispatch]);
    return(
        <div>
            <Typography>Information Nécessaire</Typography>
 
            <form>
                        <ExampleChoiceChipCheckbox
            accessory={accessory}
            onChange={(selectedAccessories) =>
              setFormData((prev) => ({
                ...prev,
                accessory: selectedAccessories,
              }))
            }
          /> <br/> 
          <FormLabel>List des problèmes</FormLabel>
          <Autocomplete
            multiple
            disableCloseOnSelect
            sx={{ width: '45%' }}
            id="model-autocomplete"
            placeholder="Choisir des pannes"
            options={listFault}
            getOptionLabel={(option) => `${option.name}`}
            value={formData.listFault}
            onChange={(_, value) => {
              setFormData((prev) => ({ ...prev, listFault: value }));
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          /><br/>  
          <FormLabel>Demandes du client</FormLabel>
                    <Autocomplete
            multiple
            disableCloseOnSelect
            sx={{ width: '45%' }}
            id="model-autocompletes"
            placeholder="Demande"
            options={customerRequest}
            getOptionLabel={(option) => `${option.name}`}
            value={formData.customerRequest}
            onChange={(_, value) => {
              setFormData((prev) => ({ ...prev, customerRequest: value }));
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          /> <br />
          <FormLabel>État de l'appareil</FormLabel>
          <Select
                placeholder="Sélectionner un état"
                sx={{ width: 240 }}
                value={formData.deviceStateReceive}
                onChange={(e, value) => {
                  if (value) {
                    setFormData((prev) => ({ ...prev, deviceStateReceive: value }));
                  }
                }}
                slotProps={{
                  listbox: {
                    placement: 'bottom-start',
                  },
                }}
              >
                <Option value="Bon condition">Bon condition</Option>
                <Option value="Rayé">Rayé</Option>
                <Option value="Cassé">Cassé</Option>
                <Option value="Trace d'intervention">Trace d'intervention</Option>
          </Select><br />
              <FormLabel>Remarque</FormLabel>
              <Textarea
                minRows={2}
                placeholder="…"
                variant="soft"
                value={formData.remark}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    remark: e.target.value,
                  }));
                }}
                sx={{
                  borderBottom: '2px solid',
                  borderColor: 'neutral.outlinedBorder',
                  borderRadius: 0,
                  '&:hover': {
                    borderColor: 'neutral.outlinedHoverBorder',
                  },
                  '&::before': {
                    border: '1px solid var(--Textarea-focusedHighlight)',
                    transform: 'scaleX(0)',
                    left: 0,
                    right: 0,
                    bottom: '-2px',
                    top: 'unset',
                    transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                    borderRadius: 0,
                  },
                  '&:focus-within::before': {
                    transform: 'scaleX(1)',
                  },
                }}
              />
<Button variant="outlined"  onClick={handelSubmit}   >Enregistrer</Button> 
            </form>


        </div>
    )
}

const underlineInputStyles = {
    '--Input-radius': '0px',
    borderBottom: '2px solid',
    borderColor: 'neutral.outlinedBorder',
    '&:hover': {
        borderColor: 'neutral.outlinedHoverBorder',
    },
    '&::before': {
        border: '1px solid var(--Input-focusedHighlight)',
        transform: 'scaleX(0)',
        left: 0,
        right: 0,
        bottom: '-2px',
        top: 'unset',
        transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
        borderRadius: 0,
    },
    '&:focus-within::before': {
        transform: 'scaleX(1)',
    },
     

};

type SelectModelLogoProps = {
  onSelectModel: (model: Model) => void;
};
export function SelectModelLogo( { onSelectModel }: SelectModelLogoProps ) {
     const [open, setOpen] = React.useState<boolean>(false);
 
const { t } = useTranslation();
const {notify} = useNotification();
const navigate = useNavigate();
const [models, setModels] = React.useState<Model[]>([]);
const [allModels, setAllModels] = React.useState<Model[]>([]);
const [marques, setMarques] = React.useState<Marque[]>([])

const [valueMarque, setValueMarque] = React.useState<Marque | null>()

const [currentIndex, setCurrentIndex] = React.useState<number>(0);

 React.useEffect(() => {
     getModels().then( (data) => {setModels(data); setAllModels(data); });
     getMarque().then( (data) => setMarques(data.filter((brand: Marque) => brand.status !== 'Bloqué')) )

  }, []);

  React.useEffect(() => {
  if (valueMarque) {
    setModels(allModels.filter((m) => m.brand.id === valueMarque.id));
    setCurrentIndex(0); // réinitialiser à la première image
  } else {
    setModels(allModels); // aucune marque sélectionnée, afficher tout
  }
}, [valueMarque, allModels]);
    const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % models.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? models.length - 1 : prevIndex - 1
    );
  };

  const selectedModel = models[currentIndex];
    return (

                 
               
 <React.Fragment>
      <Button
        sx={{width:'45%'}}
        variant="outlined"
        color="neutral"
        startDecorator={<BurstModeIcon/>}
        onClick={() => setOpen(true)}
      >
         Modéle par image
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle> </DialogTitle>
          <DialogContent>Selectionner un modéle par leur image</DialogContent>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setOpen(false);
                if (selectedModel) {
                      onSelectModel(selectedModel);
                      notify(`Modèle sélectionné: ${selectedModel.name}`);
                    }
            }}
          >
            <Stack spacing={2}>
              <Card>


    <Card variant="plain" sx={{ width: 600, bgcolor: 'initial', p: 0 }}>
      <Box sx={{ position: 'relative' }}>
        <AspectRatio ratio="4/3">
          <figure>
            {selectedModel && (
                          <img
                            style={{
                              width:'500px',
                              height:'500px',
                              objectFit: 'cover', // ou 'contain' selon préférence
                              borderRadius: '8px'
                            }}
                            src={`http://localhost:3000/upload/models/${selectedModel.picture}`}
                            loading="lazy"
                            alt={selectedModel.name ?? 'Modèle'}
                          />
                        )}
          </figure>
        </AspectRatio>
        <CardCover
          className="gradient-cover"
          sx={{
            '&:hover, &:focus-within': {
              opacity: 1,
            },
            opacity: 0,
            transition: '0.1s ease-in',
            background:
              'linear-gradient(180deg, transparent 62%, rgba(0,0,0,0.00345888) 63.94%, rgba(0,0,0,0.014204) 65.89%, rgba(0,0,0,0.0326639) 67.83%, rgba(0,0,0,0.0589645) 69.78%, rgba(0,0,0,0.0927099) 71.72%, rgba(0,0,0,0.132754) 73.67%, rgba(0,0,0,0.177076) 75.61%, rgba(0,0,0,0.222924) 77.56%, rgba(0,0,0,0.267246) 79.5%, rgba(0,0,0,0.30729) 81.44%, rgba(0,0,0,0.341035) 83.39%, rgba(0,0,0,0.367336) 85.33%, rgba(0,0,0,0.385796) 87.28%, rgba(0,0,0,0.396541) 89.22%, rgba(0,0,0,0.4) 91.17%)',
          }}
        > </CardCover>
      </Box>
  
        <Typography sx={{ fontSize: 'sm', fontWeight: 'md' }}>
          {selectedModel?.brand.name} _ {selectedModel?.name ?? 'Modèle inconnu'}
        </Typography>
                                     <Autocomplete
                               
                                sx={{width:'45%'}}
                              id="model-autocomplete"
                              placeholder="Choisir des modéle"
                              options={marques}
                              getOptionLabel={(option) => `${option.name} `}
                              value={valueMarque}
                               onChange={(event, newValue) => {
                                setValueMarque(newValue);
                              }}
                              
                            /> 
  
    </Card>
                      
                <div style={{display:'flex' , justifyContent:'space-around'}}>
                  <Button variant="outlined" color="neutral"
                      onClick={handlePrev} >
                        <KeyboardDoubleArrowLeftIcon />
                      </Button>
                      <Button variant="outlined" color="neutral"
                       onClick={handleNext} >
                        <KeyboardDoubleArrowRightIcon />
                      </Button>
                </div>
              </Card>

              <Button type="submit"  >Select</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment> 
    );
}


export default function ExampleChoiceChipCheckbox({
  accessory,
  onChange,
}: {
  accessory: TypeUnique[];
  onChange: (selected: TypeUnique[]) => void;
}) {
  const [value, setValue] = React.useState<TypeUnique[]>([]);

  const toggleSelection = (item: TypeUnique) => {
    setValue((prev) => {
      const exists = prev.find((v) => v.id === item.id);
      
return exists
        ? prev.filter((v) => v.id !== item.id)
        : [...prev, item];

      
      const updated = exists
        ? prev.filter((v) => v.id !== item.id)
        : [...prev, item];
    onChange(updated)
      return updated;
    });

    
  };

  return (
    <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'sm' }}>
      <Typography level="body-sm" sx={{ fontWeight: 'lg', mb: 1.5 }}>
        Accessoire
      </Typography>
      <List orientation="horizontal" wrap>
        {accessory.map((item) => {
          const isSelected = value.some((v) => v.id === item.id);
          return (
            <ListItem key={item.id}>
              {isSelected && (
                <Done
                  color="primary"
                  sx={{ ml: -0.5, zIndex: 2, pointerEvents: 'none' }}
                />
              )}
              <Checkbox
                size="sm"
                disableIcon
                overlay
                label={item.name}
                checked={isSelected}
                variant={isSelected ? 'soft' : 'outlined'}
                onChange={() => toggleSelection(item)}
                slotProps={{
                  action: ({ checked }) => ({
                    sx: checked
                      ? {
                          border: '1px solid',
                          borderColor: 'primary.500',
                        }
                      : {},
                  }),
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Sheet>
  );
}
