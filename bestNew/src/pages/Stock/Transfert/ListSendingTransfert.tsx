import React, { useEffect, useState } from 'react'
import DynamicTable from '../../../Componants/Global/TableComponat'
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { GetSendTransfert } from '../../../Redux/Actions/stock/TransfertAction';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import { useNotification } from '../../../Componants/NotificationContext';
import { BiShowAlt } from 'react-icons/bi';
import theme from '../../../Theme/theme';
import ShowPart from './ShowPart';
import type { getFormStock, TransfertPR } from '../../../Redux/Types/Stock';

export default function ListSendingTransfert() {
    const dispatch = useAppDispatch();
    const transfert = useSelector((state: RootState) => state.Transfert.Transfert);
    const user = useSelector((state: RootState) => state.user);
    const branchId = user.branch?.id;

    useEffect(() => {
    
    if (branchId) {
        dispatch(GetSendTransfert({ branchId, type: 'Pieces' }));
    }
}, [dispatch, branchId]);

    const [open, setOpen] = React.useState(false);
    const { notify } = useNotification();
    const [formData, setFormData] = useState<TransfertPR>();

    const handleOpenEdit = (row: any) => {
        setFormData(row);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const actions: TableAction[] = [
        {
            icon: <BiShowAlt style={{ color: theme.palette.primary.main }} />,
            onClick: (row: Record<string, any>) => handleOpenEdit(row),
        },
    ];
 
    return (
        <div>
            <DynamicTable
                rows={transfert}
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
        </div>
    );
}
