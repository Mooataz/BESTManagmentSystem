import React, { useEffect } from 'react'
import DynamicTable from '../../../Componants/Global/TableComponat'
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { GetSendTransfert } from '../../../Redux/Actions/stock/TransfertAction';

export default function ListSendingTransfert() {
    const dispatch = useAppDispatch();
    const transfert = useSelector((state: RootState) => state.Transfert.Transfert);
    const user = useSelector((state: RootState) => state.user)

    useEffect(() => {
        if (user.branch?.id) {
            dispatch(GetSendTransfert({branchId: user.branch?.id, type:'Pièces'}))
        }

    }, [dispatch, user.branch?.id])
    console.log('transfert',transfert)
    return (
        <div>
            <DynamicTable
                rows={transfert}
                columnLabels={{
                    'id': 'Code',
                    'sendingDate': 'Crèe le',
                    'sendUserName': 'Par',
                    'toBranchName': 'à agence',
                    'receivedDate': 'Accepter le',
                    'receiveUserName': 'Accepte par',
                    'state': 'ètat',
                    'typePart':'Type pièce',
                    'remark': 'Remarque',
                    'delivredBy':'Livrer par',
                    'stockPart':'List'
                }}
                columnsToShow={[
                    'id',
                    'sendingDate',
                    'sendUserName',
                    'toBranchName',
                    'receivedDate',
                    'receiveUserName',
                    'state',
                    'typePart',
                    'remark',
                    'delivredBy',
                    'stockPart'
                ]}
            />
        </div>
    )
}
