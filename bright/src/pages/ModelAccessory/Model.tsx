import { useNotification } from "../../Componants/NotificationContext";
import { FormLabel, Input, Stack } from '@mui/joy';
import * as React from "react";
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import Add from '@mui/icons-material/Add';
import {   getMarque  } from "../../api/administration/Marque";
import FormControl from '@mui/joy/FormControl';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import { MdOutlineModeEditOutline } from "react-icons/md";
 import { addModel, getModels, updateModel } from "../../api/ModelAccessory/Models";
import { fetchTypeModel } from "../../api/ModelAccessory/TypeModel";
import Autocomplete from '@mui/joy/Autocomplete';
import { getListAllParts } from "../../api/administration/ListAllParts";
import {AllPartsList ,   AllPartsListe } from "../../Componants/AllPartsList";
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

interface Allpart{
    id : number;
    description : string;
}
type AllParts = {
  allParts: Allpart[],
  options: Allpart[];
  onChange: (selected: Allpart[]) => void;
}
interface Model{
    id:number;
    name: string;
    brand: Marque;
    picture: string | File;
    typeModel:TypeModel;
    allpart: number[]
    
}
type PropsBrand= {
  brands: Marque[];
  onSelect: (selectedBrand: Marque | null) => void;
};

type PropsTypeModel= {
  typeModel: TypeModel[];
  onSelect: (selectedBrand: TypeModel | null) => void;
};
export function Model(){
  const [models, setModels] = React.useState<Model[]>([])
  const [brand, setBrand] = React.useState<Marque | undefined>();
const refreshModel = () => {
  getModels().then((data) => setModels(data));
};

  React.useEffect(() => {
    getModels()
      .then((data) => { setModels(data) })

  const fetchData = async () => {
    try {
      // First fetch all models
      const modelsData = await getModels();
      setModels(modelsData);
      
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

   fetchData();
}, []);
    return(
        <div>
            <AjouteModel onSuccess={refreshModel}/> 
 
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2, // espace entre les cartes
             
            margin: '0 auto',
          }}
        >
          {models.map((item) => (
            <Box
              key={item.id}
              sx={{
                flex: '1 1 calc(33.333% - 16px)', // 3 éléments par ligne avec gap
                boxSizing: 'border-box',
              }}
            >
               
              <ContainerResponsive models={item} onUpdate={refreshModel}/>
            </Box>
          ))}
        </Box>
        </div>
    )
}


 function ContainerResponsive    ({ models, onUpdate }: {models:Model; onUpdate: () => void}) {
 
  
 
 
  return (
    <Box sx={{ minHeight: 350 }}>
      <Card
        variant="outlined"
        sx={(theme) => ({
          width: 300,
          gridColumn: 'span 2',
          flexDirection: 'row',
          flexWrap: 'wrap',
          resize: 'horizontal',
          overflow: 'hidden',
          gap: 'clamp(0px, (100% - 360px + 32px) * 999, 16px)',
          transition: 'transform 0.3s, border 0.3s',
          '&:hover': {
            borderColor: theme.vars.palette.primary.outlinedHoverBorder,
            transform: 'translateY(-2px)',
          },
          '& > *': { minWidth: 'clamp(0px, (360px - 100%) * 999,100%)' },
        })}
      >

        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 200 }}
        >
          <Box sx={{ display: 'flex' }}>
            <div>
              <Typography level="title-lg">

                
                {/*//////////////////////////////////////////////////////////*/}
                <Stack spacing={2} sx={{ minWidth:'250px' }}>
                
                    <Card>
                        <Typography level="title-md">
                        {models.brand.name}_{models.name} 
                        
                        </Typography>
                         
                        <Typography level="body-sm">
                        
                        <Typography
                            level="body-sm"
                            textColor="var(--joy-palette-success-plainColor)"
                            sx={{ fontFamily: 'monospace', opacity: '50%' }}
                        >
                            {models.typeModel.description}
                        </Typography>
                        </Typography>
                    </Card>

                    </Stack>
                {/*//////////////////////////////////////////////////////////*/}

              </Typography>
            </div>
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              sx={{ ml: 'auto', alignSelf: 'flex-start' }}
            >

            </IconButton>
          </Box>
          <AspectRatio
            variant="soft"
            sx={{
              '--AspectRatio-paddingBottom':
                'clamp(0px, (100% - 200px) * 999, 200px)',
              pointerEvents: 'none',
            }}
          >
            <img
              alt=""
              src={`http://localhost:3000/upload/models/${models.picture}`}
            />
          </AspectRatio>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>

            <EditModel model={models} onModelUpdate={onUpdate}/>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}


function EditModel({ model, onModelUpdate }: { model: Model; onModelUpdate: () => void }) {

  const [open, setOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { notify } = useNotification();
const [listTypeModel,setListTypeModel] = React.useState<TypeModel[]>([]);
  const [name, setName] = React.useState({ id: model.id,name: model.name});
  const [brand, setBrand] = React.useState({ id: model.id,brand: model.brand});
  const [typeModel, setTypeModel] = React.useState({ id: model.id,typeModel: model.typeModel});
  const [picture, setPicture] = React.useState<{ id: number; picture: string | File }>({
      id: model.id,
      picture: model.picture,
    });
  const [allPartsList, setAllPartsList] = React.useState<Allpart[]>([]);
  const [allpart, setAllpart] = React.useState<{ id: number; allpart: Allpart[] }>({
    id: model.id,
    allpart: [],
  });
const [brands, setBrands] = React.useState<Marque[]>([]);
const [selectedBrand, setSelectedBrand] = React.useState<Marque | null>(model.brand ?? null);

const [selectedTypeModel, setSelectedTypeModel] = React.useState<TypeModel | null>(model.typeModel ?? null);
const [typeModelList, setTypeModelList] = React.useState<TypeModel[]>([]);

React.useEffect(() => {
          getMarque()
    .then((data) => {
      const activeBrands = data.filter((brand: Marque) => brand.status !== 'Bloqué');
      setBrands(activeBrands);
    });
    fetchTypeModel()
        .then( (data) => setListTypeModel(data));
}, []);


 React.useEffect(() => {
  const fetchParts = async () => {
    const parts: Allpart[] = await getListAllParts();  
    setAllPartsList(parts);

    const selectedParts = parts.filter((p: Allpart) => model.allpart.includes(p.id));
    setAllpart({ id: model.id, allpart: selectedParts });
  };

  fetchParts();
}, []);
 const handleSubmit = async (fields: { name?: string; 
                             picture?: File; brand?: number; 
                             typeModel?: number; allpart?: number[] }) => {
  const formData = new FormData();
  formData.append("id", model.id.toString());
      if (fields.name) formData.append("name", fields.name);
      if (fields.brand) formData.append("brand", fields.brand.toString());
      if (fields.typeModel) formData.append("typeModel", fields.typeModel.toString());
// Handle allparts
      if (fields.allpart) {
        formData.append("allpartIds", JSON.stringify(fields.allpart));
      }

 // Handle picture
      if (fields.picture instanceof File) {
        formData.append("picture", fields.picture);
      } else if (fields.picture) {
        formData.append("picture", fields.picture);
      }
         // Debug: log form data
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
    try {
 
 
      await updateModel(model.id, formData);
      setOpen(false);
      onModelUpdate();
      notify("Mise à jour avec succès !", "success");

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "danger");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <React.Fragment>
        <Button
          variant="outlined"
          color="neutral"
          /* startDecorator={} */
          onClick={() => setOpen(true)}
        ><MdOutlineModeEditOutline /></Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog>
            <DialogTitle>Modifications</DialogTitle>
            <DialogContent>Modifier les points nécessaire </DialogContent>
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setOpen(false);
              }}
            >
              <Stack spacing={2}>



                <FormControl>
                  <FormLabel>Nom</FormLabel>
                  <div style={{ display: 'flex' }}>
                    <Input variant="soft" sx={underlineInputStyles} value={name.name} onChange={(e) => setName({ ...name, name: e.target.value })} />
                    <Button size="md" variant={'outlined'} color="neutral" style={{ width: '160px', marginLeft: '14%' }}
                      onClick={() => handleSubmit({   name: name.name })} > Mettre à jour</Button>
                  </div>
                  <FormLabel>Logo</FormLabel>
                  <div style={{ display: 'flex' }}>
                  <Input variant="soft" sx={underlineInputStyles} type='file'
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) setPicture({ ...picture, picture: file });
                      
                      }} />                    
                      <Button size="md" variant={'outlined'} color="neutral" style={{ width: '160px', marginLeft: '14%' }}
                      onClick={() => handleSubmit({  picture: picture.picture as File })} > Mettre à jour</Button>
                  </div>
                  {/* <FormLabel>Marque</FormLabel> */}
                  <div style={{ display: 'flex' }}>
                    <ListBrands brands={brands} onSelect={(brand) => setSelectedBrand(brand)}
                                          />
                       
                       <Button size="md" variant={'outlined'} color="neutral" style={{ width: '160px', marginLeft: '14%' }}
                      onClick={() => handleSubmit({   brand: selectedBrand ?.id,})} > Mettre à jour</Button>
                  </div>
                  {/* <FormLabel>Type Modéle</FormLabel> */}
                  <div style={{ display: 'flex' }}>
                    <ListTypModele
                        typeModel={listTypeModel}
                        selected={selectedTypeModel}
                        onSelect={(newTypeModel) => setSelectedTypeModel(newTypeModel)}
                      />
                      <Button size="md" variant={'outlined'} color="neutral" style={{ width: '160px', marginLeft: '14%' }}
                        onClick={() =>
                          handleSubmit({
                             
                            typeModel: selectedTypeModel ?.id,
                          })
                        }
                      > Mettre à jour</Button>
                  </div>
 
                   <FormLabel>Piéce</FormLabel>
                  <div style={{ display: 'flex' }}>
                    <AllPartsListe   allParts={allpart.allpart}
                                      onChange={(value) => setAllpart({ ...allpart, allpart: value })}
                                      options={allPartsList} />

                      <Button size="md" variant={'outlined'} color="neutral" style={{ width: '160px', marginLeft: '14%' }}
                            onClick={() => handleSubmit({
                             
                            allpart: allpart.allpart.map(part => part.id)  
                          })} > Mettre à jour</Button>
                  </div>

                </FormControl>

              </Stack>
            </form>
          </ModalDialog>
        </Modal>
      </React.Fragment>
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
  width: '500px',

};

function AjouteModel({ onSuccess }: { onSuccess: () => void }){
  const { notify } = useNotification();

  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
const [formData, setFormData] = React.useState<{
  name: string;
  picture: File | null;
  brand: number;
  typeModel: number;
  allpart: number[];
}>({
  name: '',
  picture: null,
  brand: 1,
  typeModel: 1,
  allpart: [],
});
  const [brands, setBrands] = React.useState<Marque[]>([]);
  const [typeModel, setTypeModels] = React.useState<TypeModel[]>([]);
  const [allParts, setAllParts] = React.useState<Allpart[]>([]);
  React.useEffect( () => {
     getMarque()
    .then((data) => {
      const activeBrands = data.filter((brand: Marque) => brand.status !== 'Bloqué');
      setBrands(activeBrands);
    });
    getListAllParts()
      .then( (data) => setAllParts(data));

    fetchTypeModel()
        .then( (data) => setTypeModels(data));
  }, []);

const handleAllPartsChange = (selectedParts: Allpart[]) => {
  const ids = selectedParts.map((part) => part.id);
  setFormData((prev) => ({
    ...prev,
    allpart: ids,
  }));
};
    const handleSubmit = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("brand", formData.brand.toString());
        data.append("typeModel", formData.typeModel.toString());
        if (formData.picture) {
          data.append("picture", formData.picture); // ce nom est crucial
        }
        
        
        data.append("allpartIds", JSON.stringify(formData.allpart));
for (const entry of data.entries()) {
      console.log(entry[0], entry[1]);
    }
        await addModel(data); // OK
        onSuccess();
        setOpen(false);
        notify("Ajouter avec succès !", "success");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
        notify(errorMessage, "danger");
      } finally {
        setIsLoading(false);
      }
    };
     
    return(
        <div>
    <React.Fragment>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '60%', marginLeft: '20%' }}>
        <div style={{ marginLeft: '65%', marginBottom: '1%' }}>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<Add />}
            fullWidth onClick={() => setOpen(true)}
          >
            Ajouter une modéle
          </Button>
        </div>
      </Box>
      <Modal open={open} onClose={() => setOpen(false)} >
        <ModalDialog
          aria-labelledby="nested-modal-title"
          aria-describedby="nested-modal-description"
          sx={(theme) => ({
            [theme.breakpoints.only('xs')]: {
              top: 'unset',
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 0,
              transform: 'none',
              //maxWidth: 'unset',
              width: 900
            },
          })}
        >
          <Typography id="nested-modal-title" level="h2">
            Ajouter un nouvelle modéle
          </Typography>
             <Stack spacing={2}>

              <FormLabel>Nom</FormLabel>
              <Input variant="soft" sx={underlineInputStyles} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

              <FormLabel>Logo</FormLabel>
              <Input variant="soft" sx={underlineInputStyles} type='file'
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({ ...formData, picture: file });
                }} />



                  <ListBrands brands={brands} onSelect={(brand) => {
                                            setFormData((prev) => ({
                                            ...prev,
                                            brand: brand ? brand.id : 0
                                            }));
                                        }} />

                  <ListTypModel typeModel={typeModel} onSelect={(typeModel) => {
                                            setFormData((prev) => ({
                                            ...prev,
                                            typeModel: typeModel ? typeModel.id : 0
                                            }));
                                        }} />
                    <AllPartsList allParts={allParts} onChange={handleAllPartsChange} />

            </Stack>
            
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row-reverse' },
            }}
          >
            <Button variant="solid" color="primary" onClick={handleSubmit} loading={isLoading}> {/*() => setOpen(false)*/}
              Enregistrer
            </Button>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
          </Box>
          {error && <Typography color="danger">{error}</Typography>}
        </ModalDialog>
      </Modal>
    </React.Fragment>
        </div>
    )
}

function ListBrands({ brands, onSelect }: PropsBrand) {
const [value, setValue] = React.useState<Marque | null>(brands[0] ?? null);
const [inputValue, setInputValue] = React.useState<number | null>(brands[0]?.id ?? null);

  return (
   <FormControl id="controllable-states-demo"  >
      <FormLabel>Marques   </FormLabel>
     <Autocomplete
        placeholder="Sélectionnez une agence"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          onSelect(newValue);
          setInputValue(newValue ? newValue.id : null); // <-- Récupère l'ID
        }}
        options={brands}
        getOptionLabel={(option) => option.name}
        sx={{ width: 300 }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
     
    </FormControl>
  );
}

function ListTypModel({typeModel, onSelect}:PropsTypeModel) {
const [value, setValue] = React.useState<TypeModel | null>(typeModel[0] ?? null);
const [inputValue, setInputValue] = React.useState<number | null>(typeModel[0]?.id ?? null);

  return (
   <FormControl id="controllable-states-demo"  >
      <FormLabel>Type model   </FormLabel>
     <Autocomplete
        placeholder="Sélectionnez une agence"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          onSelect(newValue);
          setInputValue(newValue ? newValue.id : null); // <-- Récupère l'ID
        }}
        options={typeModel}
        getOptionLabel={(option) => option.description}
        sx={{ width: 300 }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
     
    </FormControl>
  );
}
 
function ListTypModele({
  typeModel,
  selected,
  onSelect
}: {
  typeModel: TypeModel[];
  selected: TypeModel | null;
  onSelect: (type: TypeModel | null) => void;
}) {
  const [value, setValue] = React.useState<TypeModel | null>(selected);
const [inputValue, setInputValue] = React.useState<number | null>(typeModel[0]?.id ?? null);
  return (
   <FormControl id="controllable-states-demo"  >
      <FormLabel>Type model   </FormLabel>
     <Autocomplete
        placeholder="Sélectionnez une agence"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          onSelect(newValue);
          setInputValue(newValue ? newValue.id : null); // <-- Récupère l'ID
        }}
        options={typeModel}
        getOptionLabel={(option) => option.description}
        sx={{ width: 300 }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
    </FormControl>
  );
}
 