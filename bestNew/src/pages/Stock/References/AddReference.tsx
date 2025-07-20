import { useSpring, animated } from '@react-spring/web';
import { useSelector } from 'react-redux';
import { Backdrop, Box, Button, DialogActions, FormControl, FormHelperText, FormLabel, Input, MenuItem, Modal, Select, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNotification } from '../../../Componants/NotificationContext';
import { useAppDispatch } from '../../../Redux/hooks';
import type { AppDispatch, RootState } from '../../../Redux/store';
import { AddOneReference, getReferences } from '../../../Redux/Actions/stock/References';
import { CustomAutocomplete } from '../../../Componants/Global/CustomAutocomplete';
import { getModelsAuthorised } from '../../../Redux/Actions/ModelAndAccessory/Models';
import { useDispatch } from 'react-redux';
import { getAllPart } from '../../../Redux/Actions/Administration/ListAllPart';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
const validationSchema = Yup.object().shape({
    materialCode: Yup.string().required('Reference requis'),
    allpart: Yup.number().required('Une piéce doit étre selectionnée'),
    modelIds: Yup.array()
        .of(Yup.number().required('id requis')) // 👈 Chaque élément est requis
        .min(1, 'Au moins un modéle est requis')
        .required('Les modèles sont requis') // 👈 Le tableau lui-même est requis
});



interface FadeProps {
    children: React.ReactElement<any>;
    in?: boolean;
    onClick?: any;
    onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
    onExited?: (node: HTMLElement, isAppearing: boolean) => void;
    ownerState?: any;
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(props, ref) {
    const {
        children,
        in: open,
        onClick,
        onEnter,
        onExited,
        ownerState,
        ...other
    } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter(null as any, true);
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited(null as any, true);
            }
        },
    });

    return (

        <animated.div ref={ref} style={style} {...other}>
            {React.cloneElement(children, { onClick })}
        </animated.div>
    );
});

const style = {
    widht: 'auto',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
interface FormData {
    materialCode: string;
    modelIds: number[];
    allpart: number;
}

export default function AddReference() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { notify } = useNotification();
    const dispatch = useDispatch<AppDispatch>();
    const userr = useSelector((state: RootState) => state.user);
    const models = useSelector((state: RootState) => state.models.models);
    const allParts = useSelector((state: RootState) => state.allParts.allParts);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>({
        resolver: yupResolver(validationSchema)
    });


    const [formData, setFormData] = useState<FormData>({
        materialCode: '',
        modelIds: [],
        allpart: 0
    })

  
                     
    const onSubmit = async (formData: FormData) => {
        setOpen(false);
        setIsLoading(true);
        try {

            const result = await dispatch(AddOneReference({ materialCode: formData.materialCode, modelIds: formData.modelIds, allpart: formData.allpart }));
           
            if (!AddOneReference.fulfilled.match(result)) {
                notify("Erreur lors du rechargement des références", "error");
                 return; 
            }
            reset();
            const refreshResult = await dispatch(getReferences());

            if (!getReferences.fulfilled.match(refreshResult)) {
            notify("Erreur lors du rechargement des références", "error");
            return;
            }
             dispatch(getReferences())

            notify("Référence ajoutée avec succès", "success");
            setOpen(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");


        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div>
            <Button variant="outlined" onClick={handleOpen}>Ajouter Reference</Button>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        TransitionComponent: Fade,
                    },
                }}
            >
                <Fade in={open}  >
                    <Box sx={style}>
                        <Typography id="spring-modal-title" variant="h6" component="h2">
                            Ajouter une Reference
                        </Typography>
                        <Box id="spring-modal-description"  >

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={3}>
                                    <FormControl>
                                        <FormLabel>Nom reference</FormLabel>
                                        <Input id="standard-basic"
                                            {...register('materialCode')}

                                            value={formData.materialCode}
                                            onChange={(e) => setFormData({ ...formData, materialCode: e.target.value })}
                                        />
                                        {errors.materialCode && (
                                            <FormHelperText
                                                style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}
                                            >
                                                {errors.materialCode.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>

                                    <FormControl>
                                        <Controller
                                            control={control}
                                            name="allpart"
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <>
                                                    <CustomAutocomplete
                                                        data={allParts}
                                                        displayFields={['description']}
                                                        idField="id"
                                                        label="Piéce"
                                                        multiple={false}
                                                        value={value}
                                                        onChange={onChange}
                                                        error={error?.message}
                                                    />
                                                </>

                                            )}
                                        />

                                    </FormControl>

                                    <FormControl>
                                        <Controller
                                            control={control}
                                            name="modelIds"
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <>
                                                    <CustomAutocomplete
                                                        data={models}
                                                        displayFields={['brand.name', 'name']}
                                                        idField="id"
                                                        label="Modèles compatibles"
                                                        multiple={true}
                                                        value={value}
                                                        onChange={onChange}
                                                        error={error?.message}
                                                    />
                                                </>
                                            )}
                                        />
                                    </FormControl>


                                </Stack>
                                <DialogActions>
                                    <Button onClick={() => setOpen(false)}>Annuler</Button>
                                    <Button type='submit' loading={isLoading}>Enregistrer</Button>
                                </DialogActions>
                            </form>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}
 