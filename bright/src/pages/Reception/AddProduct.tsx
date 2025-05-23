import { Card,Typography ,Button, ListItemContent, Option,  TextField, Input } from "@mui/joy";
import { Box } from "@mui/material";
import React from "react";
import Autocomplete from '@mui/joy/Autocomplete';
import { getCustomer, getDevices, getOneCustomer, getOneDevice } from "../../api/Reception/CreateRepair";
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

  export function AddProduct () {
  const [step, setStep] = React.useState(0);

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [device, setDevice] = React.useState<Device | null > (null);
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <Typography level="title-md"> <AddCustomer onChange={setCustomer}/> </Typography>;
      case 1:
        return <Typography level="title-md"> <AddDevice onChange={setDevice}/> </Typography>;
      case 2:
        return <Typography level="title-md"> <AddRepair /> </Typography>;
      default:
        return <Typography>Étape inconnue</Typography>;
    }
  };
    return(
        <div>
             <Box sx={{display:'flex', justifyContent:'space-around'}}>
                <Card sx={{width:'40%', height:'750px'}}>
                     <Typography level="title-md">Client sélectionné</Typography>
                        {customer ? (
                            <>
                            <Typography>Nom : {customer.name}</Typography>
                            <Typography>Téléphone : {customer.phone}</Typography>
                            {customer.distributer && (
                                <>
                                <Typography>Distributeur : {customer.distributer.name}</Typography>
                                <Typography>Email : {customer.distributer.email}</Typography>
                                </>
                            )}
                            </>
                        ) : (
                            <Typography>Aucun client sélectionné</Typography>
                        )}

                         <Typography level="title-md">Appareille</Typography>
                         {
                          device ? (
                            <div>
                               <Typography> Imei: {device.serialenumber} </Typography>
                               <Typography> Modéle: {device.model.name} </Typography>
                               <Typography> Date d'achat:  </Typography>
                            </div>

                          ) : (
                                <Typography>Aucun Appareille sélectionné</Typography>
                          )
                         }
                </Card>

                <Card sx={{width:'55%'}}>
                    <Box>{renderStepContent()}</Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button disabled={step === 0} onClick={back}>Précédent</Button>
                        <Button onClick={next}>{step === 2 ? 'Terminer' : 'Suivant'}</Button>
                    </Box>
                </Card>
             </Box>
                



             
        </div>
    )
}
 
interface Customer {
  id?: number;
  name: string;
  phone: number;
   distributer?: Distributor | null;
}
interface Distributor {
    id: number; name: string; phone: number; email: string; location: string; taxRegisterNumber: string;
}
 
function AddCustomer({ onChange }: { onChange: (c: Customer) => void }) {
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

interface Device {
id?: number;
serialenumber? : string;
purchaseDate? : Date ;
warrentyProof? : string | File; // facture d'achat
customer? : Customer[];
model : Model;
}

interface Model{
    id:number;
    name: string;
    brand: Marque;
    picture: string | File;
    typeModel:TypeModel;
    allpart: number[]
    
}
interface Marque {

  id: number;
  name: string;
  logo: string;
  status: string;

}
interface TypeModel {
    id: number;
    description: string;
}
function AddDevice ({ onChange }: { onChange: (c: Device) => void }) {
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [models, setModels] = React.useState<Model[]>([])

  const [valueDevice, setValueDevice] = React.useState<Device | null>({serialenumber:'',purchaseDate: new Date(),warrentyProof:'',
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
   const  handelSubmit = () => {
    console.log('data Front: ' ,valueDevice )
     getOneDevice(valueDevice)
        .then( (data) =>onChange(data) )

    }
    return(
        <div>
                  <Typography>Information de l'appareille</Typography> <br></br> <br/>
                  <FormLabel>Rechercher un appareille</FormLabel>
                <Autocomplete
                  disableCloseOnSelect
                    
                  id="customer-autocomplete"
                  placeholder="Choisir des clients"
                  options={devices}
                  getOptionLabel={(option) => `${option.serialenumber} `}
                  onChange={(_, value) => {
                    
                    setValueDevice(value)
                  }}
                  value={valueDevice}
                /> <br/>

                <form>
                  <Typography sx={{marginBottom:'5%', marginTop:'5%'}}>Ajouter un Appareille</Typography>
                      <FormControl  sx={{marginBottom:'5%'}}>
                        <FormLabel>Imei</FormLabel>
                            <Input
                            variant="soft"
                             
                            sx={underlineInputStyles}
                            value={valueDevice?.serialenumber || ""}
                            onChange={(e) =>
                                setValueDevice({
                                ...valueDevice!,
                                serialenumber: e.target.value,
                                })
                            }
                            />        
                          </FormControl>
                          <FormControl sx={{marginTop:'5%'}}>
                            <FormLabel>Date d'achat</FormLabel>
                           {/*  <InputDate onChange={handlePurchaseDateChange} /> */}

                           <input type="date" 
                            onChange={(e) =>
                                setValueDevice({
                                ...valueDevice!,
                                purchaseDate: new Date(e.target.value),
                                })
                            } />
                          </FormControl>

                          <FormControl sx={{marginTop:'5%'}}>
                            <FormLabel>Facture d'achat</FormLabel>
                                              <Input variant="soft" sx={underlineInputStyles} type='file'
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] ;
                                                    if (file) setValueDevice( (prev) => ( {
                                                      ...prev!,
                                                       warrentyProof: file,
                                                    }));
                                                  
                                                  }} />  
                          </FormControl>

                          <FormControl sx={{marginTop:'5%'}}>
                            <FormLabel>Modéle</FormLabel>
                            <div style={{display:'flex' ,justifyContent:'space-around'}}>
                                <Autocomplete
                               
                                sx={{width:'45%'}}
                              id="model-autocomplete"
                              placeholder="Choisir des modéle"
                              options={models}
                              getOptionLabel={(option) => `${option.name} `}
                              value={valueDevice?.model}
                              onChange={(_, value) => {
                                
                                setValueDevice((prev) => prev? { ...prev, model: value!} : null)
                              }}
                              
                            /> 

                                <SelectModelLogo onSelectModel={handleModelSelected} />
  
                            </div>

                          </FormControl>
                          <Button variant="outlined" onClick={  handelSubmit}>Enregistrer</Button> 
                </form>
        </div>
    )
}

function AddRepair() {

    return(
        <div>
            AddRepair
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