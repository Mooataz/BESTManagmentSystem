import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Input, Slide, Stack } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React, { useEffect, useState } from 'react'
import type { RootState } from '../../../Redux/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import type { Model } from '../../../Redux/Types/repairTypes';
import { getMarques } from '../../../Redux/Actions/Administration/MarquesActions';
import { getAllPart } from '../../../Redux/Actions/Administration/ListAllPart';
import { GetAllTypeModel } from '../../../Redux/Actions/ModelAndAccessory/TypeModelActions';
import AddIcon from '@mui/icons-material/Add';
import theme from '../../../Theme/theme';
import { CustomAutocomplete } from '../../../Componants/Global/CustomAutocomplete';
import { AddModel, getAllModel } from '../../../Redux/Actions/ModelAndAccessory/Models';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function AjouteModel() {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const brands = useSelector((state: RootState) => state.Marques.Marque);
    const allParts = useSelector((state: RootState) => state.allParts.allParts);
    const typeModel = useSelector((state: RootState) => state.TypeModel.typeModel);

    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const handleClickOpen = () => { setOpen(true); };

    const handleClose = () => { setOpen(false); };
    const [description, setDescription] = useState<Model>({

        name: '',
        brand: 0,
        allpart: [],
        typeModel: 0,
        picture: ''
    })
    useEffect(() => {
        dispatch(getMarques());
        dispatch(getAllPart());
        dispatch(GetAllTypeModel());
    }, [dispatch])

    const handleSelectionBrand = (ids: number[] | number) => {
        setDescription({ ...description, brand: ids });

    };
    const handleSelectionType = (ids: number[] | number) => {
        setDescription({ ...description, typeModel: ids });

    };
    const handleSelectionAllPart = (ids: number[]) => {
        setDescription({ ...description, allpart: ids });

    };
   const handleSubmit = async () => {
  setIsLoading(true);

  const { name, brand, typeModel, allpart, picture } = description;

  if (!name || !allpart?.length || !brand || !picture || !typeModel) {
    notify('Veuillez remplir toutes les données', 'error');
    setIsLoading(false);
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('brand', brand.toString());
  formData.append('typeModel', typeModel.toString());

  // 👇 Ajouter les pièces
  allpart.forEach((id) => {
    formData.append('allpartIds', id.toString());
  });

  // 👇 Ajouter l'image
  if (picture instanceof File) {
    formData.append('picture', picture);
  }

  try {
    await dispatch(AddModel(formData)).then(() => {
      dispatch(getAllModel());
      setIsLoading(false);
      setOpen(false);
      notify('Ajouté avec succès', 'success');
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
    notify(errorMessage, "error");
    setIsLoading(false);
  }
};

    return (
        <React.Fragment>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
                startIcon={<AddIcon />}
                sx={{
                    borderColor: theme.palette.primary.main,
                    marginLeft: '70%'
                }}>
                Ajouter un modèle
            </Button>
            <br /><br />
            <Dialog
                open={open}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Ajouter un nouvelle modèle"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <FormControl>
                            <FormLabel>  Nom </FormLabel>
                            <Input sx={underlineInputStyles} value={description.name} onChange={(e) => setDescription({ ...description, name: e.target.value })} />

                        </FormControl><br />
                        <CustomAutocomplete
                            data={brands}
                            displayFields={['name']}
                            idField="id"
                            multiple={false}
                            label="Marques"
                            onChange={handleSelectionBrand}
                        />
                        <CustomAutocomplete
                            data={typeModel}
                            displayFields={['description']}
                            idField="id"
                            multiple={false}
                            label="Type modèle"
                            onChange={handleSelectionType}
                        />
                        <CustomAutocomplete
                            data={allParts}
                            displayFields={['description']}
                            idField="id"
                            multiple={true}
                            label="List des pièces"
                            onChange={handleSelectionAllPart}
                        />
                        <FormControl>
                            <FormLabel> Image</FormLabel>
                            <Input
                                type="file"
                                sx={underlineInputStyles}
                                onChange={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    setDescription({
                                        ...description,
                                        picture: target.files?.[0] || ''
                                    });
                                }}
                            />
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleSubmit}>Confirmer</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
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
    width: '400px',

};