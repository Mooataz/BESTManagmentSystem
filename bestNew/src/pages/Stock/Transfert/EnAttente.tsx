import { API } from '../../../services/api';
import React, { useEffect, useState } from 'react'
import { GetReceiveTransfert, UpdateOneTransfert } from '../../../Redux/Actions/stock/TransfertAction';
import type { RootState } from '../../../Redux/store';
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import DynamicTable from '../../../Componants/Global/TableComponat';
import ShowPart from './ShowPart';
import { useNotification } from '../../../Componants/NotificationContext';
import type { TransfertPR } from '../../../Redux/Types/Stock';
import theme from '../../../Theme/theme';
import { BiShowAlt } from 'react-icons/bi';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import { Button } from '@mui/material';
import AcceptePart from './AcceptePart';
import { AddhistoryOnePart } from '../../../Redux/Actions/stock/EtatStockActions';

export default function EnAttente() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useAppDispatch();
    const transfert = useSelector((state: RootState) => state.Transfert.Transfert);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const { notify } = useNotification();
    //const branchId = user?.branch?.id?;
 const getBranchId = (branch: number | { id: number } | undefined): number | undefined =>
    typeof branch === 'number' ? branch : branch?.id;

  const branchId = getBranchId(user?.branch);
        const type = 'Pièces';
    const state = 'En cours';
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
    useEffect(() => {
        if (branchId) {
            loadTransferts();
        }
    }, [branchId]);
    // :grand_cercle_vert: Chargement des données à chaque changement de branch
    useEffect(() => {
        if (branchId) {
            dispatch(GetReceiveTransfert({
                branchId,
                type: 'Pièces',
                state: 'En cours'
            }));
        }
    }, [branchId]);
    // :grand_cercle_vert: Ouverture du dialogue pour voir les détails
    const handleOpenEdit = (row: any) => {
        setFormData(row);
        setOpen(true);
    };
    // :grand_cercle_vert: Acceptation du transfert
    const handleAccepte = async (row: any) => {
        const valueupdate = {
            id: row.id ?? row.transfertId,
            state: 'Accepter',
            receivedDate: new Date(),
            receiveUser: user?.id || 0
        };
        try {
            await dispatch(UpdateOneTransfert(valueupdate)).unwrap();
            notify('Transfert accepté', 'success');

            loadTransferts()
            const partIds = row.stockPartIds ?? [];
            const toBranch = row.tobranch ?? row.toBranchName ?? '';
            if (partIds.length > 0) {
                await Promise.all(
                    partIds.map((idPart: number) =>
                        dispatch(
                            AddhistoryOnePart({
                                id: idPart,
                                userId: user?.id || 0,
                                step: `Transfert accepter agence ${toBranch}`,
                            })
                        )
                    )
                );
            }
        } catch (error) {
            notify('Erreur lors de l’acceptation', 'error');
        }
    };
    const [isLoading, setIsLoading] = useState(false);
    
    const handleClose = () => setOpen(false);
    const [formtransfert, setFormtransfert] = useState<TransfertPR>({})

    // :balai: Sécuriser les données : on affiche uniquement les transferts "Encours"
    //const transfertEncours = transfert.filter(t => t.state === 'Encours');
    const actions = [
        {
            icon: <BiShowAlt style={{ color: theme.palette.primary.main }} />,
            onClick: (row: Record<string, any>) => handleOpenEdit(row),
        },
        {
            icon: <Button>Accepter</Button>,
            onClick: (row: Record<string, any>) => handleAccepte(row),
        },
    ];
    return (
        <div>
            <DynamicTable
                rows={transferts}
                columnLabels={{
                    transfertId: 'Code',
                    sendingDate: 'Créé le',
                    sendUserName: 'Par',
                    toBranchName: 'À agence',
                    remark: 'Remarque',
                    delivredBy: 'Livré par',
                }}
                columnsToShow={[
                    'transfertId',
                    'sendingDate',
                    'sendUserName',
                    'toBranchName',
                    'remark',
                    'delivredBy',
                ]}
                actions={actions}
            />
            <AcceptePart
                open={open}
                onClose={handleClose}
                transfert={formtransfert}
                isLoading={isLoading}
            />
            <ShowPart open={open} onClose={handleClose} data={formData} />
        </div>
    );
}
