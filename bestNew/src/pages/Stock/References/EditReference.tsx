import React, { useEffect, useState } from 'react'
import type { References } from '../../../Redux/Types/Stock';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Input, Slide } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import { getReferences, UpdateOneReference } from '../../../Redux/Actions/stock/References';
import { getAllModel } from '../../../Redux/Actions/ModelAndAccessory/Models';
import { getAllPart } from '../../../Redux/Actions/Administration/ListAllPart';
import { CustomAutocomplete } from '../../../Componants/Global/CustomAutocomplete';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
type EditReferenceProps = {
    open: boolean;
    onClose: () => void;
    reference?: References;
    isLoading: boolean;
    onSubmit?: () => void;
};
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function EditReference({
    open,
    onClose,
    reference,
    onSubmit,
    isLoading
}: EditReferenceProps) {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const models = useSelector((state: RootState) => state.models.models);
    const allpart = useSelector((state: RootState) => state.allParts.allParts);
   
  /*   if (!reference) return null;
    const [description, setDescription] = useState<References>({
        id: reference.id,
        materialCode: reference.materialCode,
        description: reference.description,
        modelIds: reference.modelIds,
        allpart: reference.allpart,
    }) */
       const [description, setDescription] = useState<References | null>(null);

  useEffect(() => {
        dispatch(getAllModel());
        dispatch(getAllPart());
    }, [dispatch]);

  useEffect(() => {
        if (reference) {
            setDescription({
                id: reference.id,
                materialCode: reference.materialCode,
                description: reference.description,
                modelIds: reference.modelIds,
                allpart: reference.allpart,
            });
        }
    }, [reference]);
     if (!reference || !description) return null;
     console.log('allpart',allpart)
    const handleSubmit = async (data: Partial<References> & { id: number }) => {

        try {
            await dispatch(UpdateOneReference(data))
                .then(() => {
                    dispatch(getReferences())
                    notify("Mise à jour avec succès !", "success");
                    onClose()

                })
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");
        }

    }

    const handleSelectionModels = (ids: number[] | number) => {
        setDescription({ ...reference, modelIds: ids });
    };

    const handleSelectionAllpart = (ids: number) => {
        setDescription({ ...reference, allpart: ids });
    };
 
    return (
        <Box>
            <Dialog
                open={open}
                slots={{
                    transition: Transition,
                }}
                keepMounted
                onClose={onClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Modifier un reference"}</DialogTitle>
                <DialogContent>
                    <Box>
                        <Box sx={{ display: 'flex' }}>
                            <CustomAutocomplete
                                data={models}
                                displayFields={['name']}
                                idField="id"
                                multiple={true}
                                label="Modèles compatible"
                                onChange={handleSelectionModels}
                            />

                            <Button
                                size="medium"
                                variant="outlined"
                                color="info"
                                style={{ width: '160px', marginLeft: '14%' }}

                                onClick={() => handleSubmit({ id: reference.id!, modelIds: description.modelIds })}
                            >
                                Mettre à jour
                            </Button>
                        </Box> <br />
                        <Box sx={{ display: 'flex' }}>
                            <CustomAutocomplete
                                data={allpart}
                                displayFields={['description']}
                                idField="id"
                                multiple={false}
                                label="Pièce"
                                onChange={handleSelectionAllpart}
                            />

                            <Button
                                size="medium"
                                variant="outlined"
                                color="info"
                                style={{ width: '160px', marginLeft: '14%' }}

                                onClick={() => handleSubmit({ id: reference.id!, allpart: description.allpart })}
                            >
                                Mettre à jour
                            </Button>
                        </Box> <br />
<DialogContentText>Material code</DialogContentText>
                        <Box sx={{ display: 'flex' }}>

                            <Input sx={underlineInputStyles} value={description.materialCode} onChange={(e) => setDescription({ ...description, materialCode: e.target.value })} />

                            <Button
                                size="medium"
                                variant="outlined"
                                color="info"
                                style={{ width: '160px', marginLeft: '14%' }}

                                onClick={() => handleSubmit({ id: reference.id!, materialCode: description.materialCode })}
                            >
                                Mettre à jour
                            </Button>
                        </Box> <br />
<DialogContentText>Description</DialogContentText>
                        <Box sx={{ display: 'flex' }}>

                            <Input sx={underlineInputStyles} value={description.description} onChange={(e) => setDescription({ ...description, description: e.target.value })} />

                            <Button
                                size="medium"
                                variant="outlined"
                                color="info"
                                style={{ width: '160px', marginLeft: '14%' }}

                                onClick={() => handleSubmit({ id: reference.id!, description: description.description })}
                            >
                                Mettre à jour
                            </Button>
                        </Box> <br />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Fermer</Button>

                </DialogActions>
            </Dialog>
        </Box>
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
