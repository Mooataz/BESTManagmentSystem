import { Backdrop, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Input, Modal, Slide } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React, { useEffect, useState } from 'react'
import type { TransfertPR } from '../../../Redux/Types/Stock';
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import type { RootState } from '../../../Redux/store';
import { useSelector } from 'react-redux';
import { GetReceiveTransfert, UpdateOneTransfert } from '../../../Redux/Actions/stock/TransfertAction';
import axios from 'axios';
import { findByBranchType } from '../../../Redux/Actions/stock/Bin';
import { CustomAutocomplete } from '../../../Componants/Global/CustomAutocomplete';
type EditeProps = {
    open: boolean;
    onClose: () => void;
    transfert?: TransfertPR;
    isLoading: boolean;
    onSubmit?: () => void;
};
const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function AcceptePart({
    open,
    onClose,
    transfert,
    onSubmit,
    isLoading
}: EditeProps) {
    const API = axios.create({
        baseURL: 'http://localhost:3000/',
        withCredentials: true,
    });
    const type = 'Pieces';
    const state = 'Encours';
    const [transferts, setTransferts] = useState<TransfertPR[]>([]);
    const loadTransferts = async () => {
        try {
            const response = await API.get(`/transfert/findToBranchId/${branchId}/${type}/${state}`);
            const resReq = response.data.data
            if (resReq === 0) {
                notify('Aucun transferts en attente', 'success');
            } else {
                setTransferts(response.data.data);
            }
            // à adapter selon ton backend
        } catch (error) {
            notify('Aucun transferts en attente', 'success');
        }
    };
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const user = useSelector((state: RootState) => state.user);
    const branchId = user.branch?.id;
    const bins = useSelector((state: RootState) => state.bin.bin)
    const [formtransfert, setFormtransfert] = useState<TransfertPR>(/* {
            delivredBy: '',
            sendingDate: new Date(),
            frombranch: user.branch?.id || 0,
            sendUser: user.id || 0,
            tobranch: 0,
            stockPartIds: [],
            type: 'Pieces',
            state: 'Encours',
            typePart: '',
            remark:''
        
          } */)
            const handleSelectionBin = (ids: number ) => {
        setFormtransfert({ ...formtransfert, bin: ids });

    };
    useEffect(() => {
        const branchId = user.branch?.id;
        const type = formtransfert?.typePart === 'Bon' ? 'Bon' : 'Défectueux';

        if (branchId !== undefined) {
            dispatch(findByBranchType({ id: branchId, type }));
        }
    }, [dispatch, formtransfert, user.branch?.id]);

    useEffect(() => {
        if (transfert) {
            setFormtransfert({
                id: transfert.id,
                receivedDate: new Date(),
                receiveUser: user.id || 0,
                state: 'Accepter',
            });
        }
    }, [transfert]);
    const handleSubmit = async () => {

if(formtransfert?.bin === null || formtransfert?.bin === undefined) {
    notify('Choisir la case', 'error');
    return;
}
        try {
            const result = await dispatch(UpdateOneTransfert(formtransfert));
            if (UpdateOneTransfert.fulfilled.match(result)) {
                notify('Transfert accepter avec succès', 'success');
                loadTransferts()
                dispatch(GetReceiveTransfert({
                    branchId,
                    type: 'Pieces',
                    state: 'Accepter'
                }));
            } else {
                notify(result.payload as string || 'Erreur d\'acceptation transfert', 'error');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");
        }

    }
     
    return (
        <Dialog
            open={open}
            slots={{
                transition: Transition,
            }}
            keepMounted
            onClose={onClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{`Accepter un transfert des pièces sont ètat est: ${formtransfert?.typePart}`}</DialogTitle>
            <DialogContent>
                 
                <CustomAutocomplete
                    data={bins}
                    displayFields={['name']}
                    idField="id"
                    label="case"
                    multiple={false}
                     
                    onChange={handleSelectionBin}
                    
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Accepter</Button>

            </DialogActions>
        </Dialog>
    )
}
