import { Backdrop, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Input, Modal, Slide, Typography } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import React, { useEffect, useState } from 'react'
import type { TransfertPR } from '../../../Redux/Types/Stock';
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import type { RootState } from '../../../Redux/store';
import { useSelector } from 'react-redux';
import { GetReceiveTransfert, UpdateOneTransfert } from '../../../Redux/Actions/stock/TransfertAction';
import { findByBranchType } from '../../../Redux/Actions/stock/Bin';
import { CustomAutocomplete } from '../../../Componants/Global/CustomAutocomplete';
import theme from '../../../Theme/theme';
import DynamicTable from '../../../Componants/Global/TableComponat';
import ShowPart from './ShowPart';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import { BiShowAlt } from 'react-icons/bi';
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
export default function AcceptePart() {

    const type = 'Pièces';
    const state = 'En cours';
    const [transferts, setTransferts] = useState<TransfertPR[]>([]);


    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const userr = useSelector((state: RootState) => state.auth.user);
    const transfertAccept = useSelector((state: RootState) => state.Transfert.Transfert)
    const bins = useSelector((state: RootState) => state.bin.bin);

    const branchId = typeof userr?.branch === 'object' ? userr?.branch?.id : userr?.branch;
    React.useEffect(() => {
        if (branchId) {
            dispatch(GetReceiveTransfert({ branchId, type, state }))
        }
    }, [dispatch, branchId])

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

const [open, setOpen] = React.useState(false);
const handleClose = () => setOpen(false);
const [formData, setFormData] = useState<TransfertPR>();
    const handleOpenEdit = (row: any) => {
        setFormData(row);
        setOpen(true);
    };
    const actions: TableAction[] = [
        {
            icon: <BiShowAlt style={{ color: theme.palette.primary.main }} />,
            onClick: (row: Record<string, any>) => handleOpenEdit(row),
        },
    ];


    if (!userr?.id || !branchId) return null;
    return (
        <Box>

            <Typography sx={{
                textAlign: 'left',
                color: theme.palette.secondary.main,
                width: '200px',
                fontWeight: 'bold',
                marginBottom: '3%'
            }}> Accepter des pièces transférées.</Typography>

            <DynamicTable
                rows={transfertAccept}

                columnLabels={{
                    transfertId: 'Code',
                    sendingDate: 'Crèe le',
                    sendUserName: 'Par',
                    toBranchName: 'à agence',
                    receivedDate: 'Accepter le',
                    receiveUserName: 'Accepte par',
                    state: 'ètat',
                    type: 'Type pièce',
                    remark: 'Remarque',
                    delivredBy: 'Livrer par',
                }}
                columnsToShow={[
                    'transfertId',
                    'sendingDate',
                    'sendUserName',
                    'toBranchName',
                    'receivedDate',
                    'receiveUserName',
                    'state',
                    'type',
                    'remark',
                    'delivredBy',
                ]}
            actions={actions} 

            />
            {/*
            <ShowPart open={open} onClose={handleClose} data={formData} />
            */}

        </Box>
    )
}
