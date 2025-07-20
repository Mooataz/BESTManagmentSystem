import React, { useEffect, useState } from 'react'
import theme from '../../../Theme/theme'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormLabel, Input, Slide, Stack } from '@mui/material'
import type { TransitionProps } from '@mui/material/transitions';
import { useNotification } from '../../../Componants/NotificationContext';
import { useAppDispatch } from '../../../Redux/hooks';
import EditIcon from '@mui/icons-material/Edit';
import { getAllModel, UpdateModel, UpdatePictureModel } from '../../../Redux/Actions/ModelAndAccessory/Models';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { getAllMarques, getMarques } from '../../../Redux/Actions/Administration/MarquesActions';
import { getAllPart } from '../../../Redux/Actions/Administration/ListAllPart';
import { GetAllTypeModel } from '../../../Redux/Actions/ModelAndAccessory/TypeModelActions';
import { CustomAutocomplete } from '../../../Componants/Global/CustomAutocomplete';
import type { Marque, Model, TypeModel } from '../../../Redux/Types/repairTypes';
interface modelprops {
    model: Model;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function UpdateModele({ model }: modelprops) {
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
        id: model.id || 0,
        name: model.name,
        brand: model.brand,
        allpart: [],
        typeModel: model.typeModel,
        picture: ''
    })


    useEffect(() => {
        if (model) {
            setDescription({
                ...description, id: model.id,
                name: model.name,
                brand: model.brand,
                allpart: [],
                typeModel: model.typeModel,
                picture: ''
            })
        }
    }, [model]);

    useEffect(() => {
        dispatch(getMarques());
        dispatch(getAllPart());
        dispatch(GetAllTypeModel());
    }, [dispatch])
    const handleSubmit = async (data: Partial<Model> & { id: number }) => {
        setIsLoading(true)
        try {
            const payload = {
                ...data,
                allpartIds: Array.isArray(description.allpart)
                    ? description.allpart.map((part: any) => typeof part === 'object' ? part.id : part)
                    : [],
            };

            await dispatch(UpdateModel(payload)).then(() => {
                dispatch(getAllModel());
                setOpen(false);
                setIsLoading(false)
                notify('Modèle mis à jour avec succès');
            });
        } catch (error) {
            console.error(error);
        }
    };
    const handlePicture = async (data: { id: number; picture?: File | string }) => {
        setIsLoading(true)
        try {
            const formData = new FormData();
            formData.append('id', data.id.toString());

            if (data.picture instanceof File) {
                formData.append('picture', data.picture);
            } else if (typeof data.picture === 'string') {
                formData.append('picture', data.picture);
            }

            await dispatch(UpdatePictureModel(formData)).then(() => {
                dispatch(getAllModel());
                setOpen(false);
                setIsLoading(false)
                notify('Image mise à jour avec succès');
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l’image', error);
        }
    }
    const handleSelectionBrand = (ids: number[] | number) => {
        setDescription({ ...description, brand: ids });

    };
    const handleSelectionType = (ids: number[] | number) => {
        setDescription({ ...description, typeModel: ids });

    };
    const handleSelectionAllPart = (ids: number[]) => {
        setDescription({ ...description, allpart: ids });

    };
    return (
        <div>
            <React.Fragment>

                <EditIcon style={{ color: theme.palette.primary.main }} onClick={handleClickOpen} />

                <Dialog
                    open={open}
                    slots={{
                        transition: Transition,
                    }}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Modifier un modèle"}</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel> Nom</FormLabel>
                                <Box sx={{ display: 'flex' }}>
                                    <Input sx={underlineInputStyles} value={description.name} onChange={(e) => setDescription({ ...description, name: e.target.value })} />
                                    <Button size="medium" variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                        onClick={() => handleSubmit({ id: description.id!, name: description.name })} > Mettre à jour</Button>

                                </Box>
                            </FormControl> <br />
                            <Box sx={{ display: 'flex' }}>
                                <CustomAutocomplete
                                    data={brands}
                                    displayFields={['name']}
                                    idField="id"
                                    multiple={false}
                                    label="Marques"
                                    onChange={handleSelectionBrand}
                                />
                                <Button size="medium" variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                    onClick={() => handleSubmit({ id: description.id!, brand: description.brand })} > Mettre à jour</Button>
                            </Box> <br />
                            <Box sx={{ display: 'flex' }}>
                                <CustomAutocomplete
                                    data={typeModel}
                                    displayFields={['description']}
                                    idField="id"
                                    multiple={false}
                                    label="Type modèle"
                                    onChange={handleSelectionType}
                                />
                                <Button size="medium" variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                    onClick={() => handleSubmit({ id: description.id!, typeModel: description.typeModel })} > Mettre à jour</Button>
                            </Box> <br />
                            <Box sx={{ display: 'flex' }}>
                                <CustomAutocomplete
                                    data={allParts}
                                    displayFields={['description']}
                                    idField="id"
                                    multiple={true}
                                    label="List des pièces"
                                    onChange={handleSelectionAllPart}
                                />
                                <Button size="medium" variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                    onClick={() => handleSubmit({ id: description.id!, allpart: description.allpart })} > Mettre à jour</Button>
                            </Box> <br />
                            <FormControl>
                                <FormLabel> Image</FormLabel>
                                <Box sx={{ display: 'flex' }}>
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

                                    <Button size="medium" variant={'outlined'} color="info" style={{ width: '160px', marginLeft: '14%' }} loading={isLoading}
                                        onClick={() => handlePicture({ id: description.id!, picture: description.picture })} > Mettre à jour</Button>

                                </Box>
                            </FormControl>



                        </Stack>



                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Fermer</Button>

                    </DialogActions>
                </Dialog>
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
    width: '400px',

};