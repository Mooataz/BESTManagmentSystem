import React, { useEffect } from 'react'
import type { TransitionProps } from '@mui/material/transitions';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material';
import theme from '../../../Theme/theme';
import { BiShowAlt } from 'react-icons/bi';
import type { Device, Marque, Model, TypeModel } from '../../../Redux/Types/repairTypes';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { useAppDispatch } from '../../../Redux/hooks';
import { getAllPart } from '../../../Redux/Actions/Administration/ListAllPart';
 
interface UpdateProps {
    itemModel: Model;

}
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function ShowPart({ itemModel }: UpdateProps) {
    const [open, setOpen] = React.useState(false);
    const dispatch = useAppDispatch();

    const handleClickOpen = () => { setOpen(true); };

    const handleClose = () => { setOpen(false); };
    const allParts = useSelector((state:RootState) => state.allParts.allParts);

    useEffect(() => {
        dispatch(getAllPart())
    }, [dispatch])

    return (
        <div>



            <React.Fragment>
                <Button
                    variant="outlined"
                    onClick={handleClickOpen}
                    startIcon={<BiShowAlt />}
                     >
                    Voir pièces
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
                    <DialogTitle>{`Voir les pièce de modèle ${itemModel.name}`}</DialogTitle>
                    <DialogContent>
                        <ul>
                            {itemModel.allpart?.map((item, ind) => {
                                if (typeof item === 'number') {
                                    const part = allParts.find(p => p.id === item);
                                    return <li key={ind}>{part?.description ?? `ID: ${item}`}</li>;
                                } else {
                                    return <li key={ind}>{item.description}</li>;
                                }
                            })}

                        </ul>



                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Fermer</Button>

                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </div>
    )
}
