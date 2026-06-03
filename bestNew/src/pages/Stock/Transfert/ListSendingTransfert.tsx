import React, { useEffect, useState } from 'react'
import DynamicTable from '../../../Componants/Global/TableComponat'
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { GetSendTransfert } from '../../../Redux/Actions/stock/TransfertAction';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import { useNotification } from '../../../Componants/NotificationContext';
import { BiShowAlt } from 'react-icons/bi';
import { PiFilePdf } from 'react-icons/pi';
import theme from '../../../Theme/theme';
import ShowPart from './ShowPart';
import type { getFormStock, TransfertPR } from '../../../Redux/Types/Stock';

export default function ListSendingTransfert() {
    const dispatch = useAppDispatch();
    const transfert = useSelector((state: RootState) => state.Transfert.Transfert);
    const authUser = useSelector((state: RootState) => state.auth.user);
    const branchId = authUser?.branch ? (typeof authUser.branch === 'object' ? authUser.branch.id : authUser.branch) : undefined;

    useEffect(() => {
    
    if (branchId != null && branchId > 0) {
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

    const handleDownloadPdf = (transfertId: number) => {
        const url = `http://localhost:3000/transfert/pdf/${transfertId}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = `transfert_${transfertId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const actions: TableAction[] = [
        {
            icon: <PiFilePdf style={{ color: theme.palette.primary.main }} />,
            onClick: (row: Record<string, any>) => handleDownloadPdf(row.transfertId),
        },
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
