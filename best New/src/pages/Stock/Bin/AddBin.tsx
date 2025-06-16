

import { useSpring, animated } from '@react-spring/web';
import { useSelector } from 'react-redux';
 
 
 
 
import { Backdrop, Box, Button, DialogActions, FormControl, FormLabel, Input, MenuItem, Modal, Select, Stack, Typography } from '@mui/material';
import { addBin, getBin } from '../../../Redux/Actions/stock/Bin';
import React, { useState } from 'react';
import { useNotification } from '../../../Componants/NotificationContext';
import { useAppDispatch } from '../../../Redux/hooks';
import type { RootState } from '../../../Redux/store';

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

export function AddBin() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { notify } = useNotification();
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const userr = useSelector((state: RootState) => state.user);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        branch: userr.branch?.id || 0
    })
    const handleSubmit = async () => {
        setIsLoading(true);
        try {
                 if (userr.branch?.id  ) {
            const result = await dispatch(addBin({ name: formData.name, type: formData.type, branch: userr.branch?.id   }));

            if (addBin.fulfilled.match(result)) {
                dispatch(getBin(userr.branch?.id  ))
                notify('Bin ajouté avec succès', 'success');
                setOpen(false);
            } else {
                notify(result.payload as string || 'Erreur lors de l’ajout', 'error');
            }

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
            <Button variant="outlined" onClick={handleOpen}>AJOUTER CASE</Button>
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
                                        <FormLabel>Nom</FormLabel>
                                        <Input id="standard-basic"

                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Type</FormLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={formData.type}
                                            label="Case"
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
    );
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