import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import type { TransfertPR, Bin } from '../../../Redux/Types/Stock';
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import type { RootState } from '../../../Redux/store';
import { useSelector } from 'react-redux';
import { AcceptTransfert, GetReceiveTransfert } from '../../../Redux/Actions/stock/TransfertAction';
import { findByBranchType } from '../../../Redux/Actions/stock/Bin';
import theme from '../../../Theme/theme';
import DynamicTable from '../../../Componants/Global/TableComponat';
import ShowPart from './ShowPart';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import { BiShowAlt } from 'react-icons/bi';

export default function AcceptePart() {

    const type = 'Pièces';
    const state = 'all';

    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const userr = useSelector((state: RootState) => state.auth.user);
    const transfertAccept = useSelector((state: RootState) => state.Transfert.Transfert)

    const branchId = typeof userr?.branch === 'object' ? userr?.branch?.id : userr?.branch;

    const [availableBins, setAvailableBins] = useState<Bin[]>([]);
    const [selectedBin, setSelectedBin] = useState<number | ''>('');

    useEffect(() => {
        if (branchId) {
            dispatch(GetReceiveTransfert({ branchId, type, state }));
            dispatch(findByBranchType({ id: branchId, type: 'Bon' })).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    setAvailableBins(res.payload as Bin[]);
                }
            });
        }
    }, [dispatch, branchId])

    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const [formData, setFormData] = useState<TransfertPR>();
    const handleOpenEdit = (row: any) => {
        setFormData(row);
        setOpen(true);
    };

    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [pendingRow, setPendingRow] = React.useState<any>(null);

    const handleAcceptClick = (row: any) => {
        setPendingRow(row);
        setSelectedBin('');
        setConfirmOpen(true);
    };

    const handleConfirmAccept = async () => {
        if (!pendingRow) return;
        if (!selectedBin) {
            notify('Veuillez sélectionner une case', 'error');
            return;
        }
        const valueupdate = {
            id: pendingRow.id ?? pendingRow.transfertId,
            state: 'Accepter',
            receivedDate: new Date(),
            receiveUser: userr?.id || 0,
            stockPartIds: pendingRow.stockPartIds ?? [],
            bin: selectedBin,
        };
        try {
            await dispatch(AcceptTransfert(valueupdate)).unwrap();
            notify('Transfert accepté', 'success');
            setConfirmOpen(false);
            setPendingRow(null);
            if (branchId) {
                dispatch(GetReceiveTransfert({ branchId, type, state }));
            }
        } catch (error) {
            notify("Erreur lors de l'acceptation", 'error');
        }
    };

    const handleCancelConfirm = () => {
        setConfirmOpen(false);
        setPendingRow(null);
    };

    const actions = (row: Record<string, any>): TableAction[] => {
        const baseActions: TableAction[] = [
            {
                icon: <BiShowAlt style={{ color: theme.palette.primary.main }} />,
                onClick: (r) => handleOpenEdit(r),
            },
        ];
        if (row.state === 'En cours') {
            baseActions.push({
                icon: <Button size="small" sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    '&:hover': {
                        backgroundColor: theme.palette.secondary.main,
                    },
                }}>Accepter</Button>,
                onClick: (r) => handleAcceptClick(r),
            });
        }
        return baseActions;
    };

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
            <ShowPart open={open} onClose={handleClose} data={formData} />

            <Dialog open={confirmOpen} onClose={handleCancelConfirm}>
                <DialogTitle>Confirmer l'acceptation</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>Sélectionnez la case de destination pour les pièces :</Typography>
                    <FormControl fullWidth>
                        <InputLabel>Case</InputLabel>
                        <Select
                            value={selectedBin}
                            label="Case"
                            onChange={(e) => setSelectedBin(e.target.value as number)}
                        >
                            {availableBins.map((bin) => (
                                <MenuItem key={bin.id} value={bin.id}>
                                    {bin.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelConfirm} color="inherit">Annuler</Button>
                    <Button onClick={handleConfirmAccept} sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': {
                            backgroundColor: theme.palette.secondary.main,
                        },
                    }}>Confirmer</Button>
                </DialogActions>
            </Dialog>

        </Box>
    )
}
