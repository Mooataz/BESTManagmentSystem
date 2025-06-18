import { useSpring, animated } from '@react-spring/web';
import { useSelector } from 'react-redux';
import { Backdrop, Box, Button, DialogActions, FormControl, FormHelperText, FormLabel, Input, MenuItem, Modal, Select, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNotification } from '../../../Componants/NotificationContext';
import { useAppDispatch } from '../../../Redux/hooks';
import type { AppDispatch, RootState } from '../../../Redux/store';
import { AddOneReference, getReferences } from '../../../Redux/Actions/stock/References';
import { CustomAutocomplete } from '../../../Componants/Global/CustomAutocomplete';
import { getModelsAuthorised } from '../../../Redux/Actions/Administration/Models';
import { useDispatch } from 'react-redux';
import { getAllPart } from '../../../Redux/Actions/Administration/ListAllPart';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller,useForm } from 'react-hook-form';
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
    widht:'auto',
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
  modelIds:   number[] ;
  allpart: number;
}

export default function AddReference() {
        const [isLoading, setIsLoading] = React.useState(false);
        const [open, setOpen] = React.useState(false);
        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);
        const { notify } = useNotification();
        const dispatch =  useDispatch<AppDispatch>();
        const userr = useSelector((state: RootState) => state.user);
        const models = useSelector((state: RootState) => state.models.models);
        const allParts = useSelector((state: RootState) => state.allParts.allParts);
 
        const [selectedIdsModel, setSelectedIdsModel] = React.useState<number[] | number  >( );
       
            const {
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
                allpart:  0
            })


          const handleSelectionChangeModel = (ids:   number[]  ) => {
          setSelectedIdsModel(ids);
          setFormData({ ...formData, modelIds: ids })
          };
          const handleSelectionChangePart = (ids: number[]   ) => {
            setFormData({ ...formData, allpart: ids[0] })

          };
         
    
               const handleSubmite = async () => {
                setOpen(false);
                setIsLoading(true);
                try {
                       
 

                    const result = await dispatch(AddOneReference({ materialCode: formData.materialCode, modelIds: formData.modelIds, allpart: formData.allpart   }));
        
                    if (AddOneReference.fulfilled.match(result)) {
                        dispatch(getReferences())
                         .then( () => { notify('Reference ajouté avec succès', 'success');
                                        setOpen(false)})
                         .catch ( (err) => {     
                                                notify(err, "error") })
                        
                    }  
                    
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
                    notify(errorMessage, "error");
        
        
                } finally {
                    setIsLoading(false);
                }
            }    
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
                              <Typography id="spring-modal-description"  >
      
                                    <form onSubmit={ handleSubmit(handleSubmite) }>
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
                                              <FormLabel>Modéles compatible</FormLabel>
                                             
                                                <CustomAutocomplete
                                                {...register('modelIds')}
                                                         data={models}
                                                         displayFields={['brand.name','name']}
                                                         idField="id"
                                                         multiple={true}
                                                         label="Modéls "
                                                         onChange={handleSelectionChangeModel}
                                                       />
                                               {errors.modelIds && (
                                                                 <FormHelperText
                                                                    style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}
                                                                                      >
                                                                     {errors.modelIds.message}
                                                                    </FormHelperText>
                                                                )}
                                          </FormControl>
                                          <FormControl>
                                              <FormLabel>List des piéces</FormLabel>
                                                <CustomAutocomplete
                                                {...register('allpart')}
                                                         data={allParts}
                                                         displayFields={[ 'description']}
                                                         idField="id"
                                                         multiple={false}
                                                         label="Piéces "
                                                         onChange={handleSelectionChangePart}
                                                         
                                                       />
                                               {errors.allpart && (
                                                                 <FormHelperText
                                                                    style={{ color: 'red', fontSize: '0.75rem', marginTop: '4px' }}
                                                                                      >
                                                                     {errors.allpart.message}
                                                                    </FormHelperText>
                                                                )}
                                          </FormControl>
                                         
                                      </Stack>
                                      <DialogActions>
                                          <Button onClick={() => setOpen(false)}>Annuler</Button>
                                          <Button        type='submit'    loading={isLoading}>Enregistrer</Button>
                                      </DialogActions>
                                  </form> 
                              </Typography>
                          </Box>
                      </Fade>
                  </Modal>
    </div>
  )
}
