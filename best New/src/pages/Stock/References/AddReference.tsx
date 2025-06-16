import { useSpring, animated } from '@react-spring/web';
import { useSelector } from 'react-redux';
import { Backdrop, Box, Button, DialogActions, FormControl, FormLabel, Input, MenuItem, Modal, Select, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNotification } from '../../../Componants/NotificationContext';
import { useAppDispatch } from '../../../Redux/hooks';
import type { RootState } from '../../../Redux/store';
import { AddOneReference, getReferences } from '../../../Redux/Actions/stock/References';
 
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
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
export default function AddReference() {
        const [isLoading, setIsLoading] = React.useState(false);
        const [open, setOpen] = React.useState(false);
        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);
        const { notify } = useNotification();
        const dispatch = useAppDispatch();
        const userr = useSelector((state: RootState) => state.user);
         const [formData, setFormData] = useState({
                materialCode: '',
                model: [],
                allpart:  0
            })

            const handleSubmit = async () => {
                setIsLoading(true);
                try {
                      
                    const result = await dispatch(AddOneReference({ materialCode: formData.materialCode, model: formData.model, allpart: formData.allpart   }));
        
                    if (getReferences.fulfilled.match(result)) {
                        dispatch(getReferences())
                        notify('Reference ajouté avec succès', 'success');
                        setOpen(false);
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
                      <Fade in={open}>
                          <Box sx={style}>
                              <Typography id="spring-modal-title" variant="h6" component="h2">
                                  Ajouter une case
                              </Typography>
                              <Typography id="spring-modal-description"  >
      
                                  <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                                      event.preventDefault();
                                      setOpen(false);
                                  }}>
                                      <Stack spacing={3}>
                                          <FormControl>
                                              <FormLabel>Nom reference</FormLabel>
                                              <Input id="standard-basic"
      
                                                   value={formData.materialCode}  
                                                    onChange={(e) => setFormData({ ...formData, materialCode: e.target.value })}  />
                                          </FormControl>
      
                                          <FormControl>
                                              <FormLabel>Type</FormLabel>
                                              <Select
                                                  labelId="demo-simple-select-label"
                                                  id="demo-simple-select"
                                                 /*  value={formData.type} */
                                                  label="Case"
                                                 /*  onChange={(e) => setFormData({ ...formData, type: e.target.value })} */
                                              >
                                                  <MenuItem value={'Bon'}>Bon</MenuItem>
                                                  <MenuItem value={'Défectueux'}>Défectueux</MenuItem>
      
                                              </Select>
                                          </FormControl>
                                      </Stack>
                                      <DialogActions>
                                          <Button onClick={() => setOpen(false)}>Annuler</Button>
                                          <Button onClick={handleSubmit} loading={isLoading}>Enregistrer</Button>
                                      </DialogActions>
                                  </form>
                              </Typography>
                          </Box>
                      </Fade>
                  </Modal>
    </div>
  )
}
