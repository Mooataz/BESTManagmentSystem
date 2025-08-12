import React, { useEffect, useState } from 'react'
import DynamicTable from '../../../Componants/Global/TableComponat'
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { useAppDispatch } from '../../../Redux/hooks';
import type { TransfertPR } from '../../../Redux/Types/Stock';
import { GetReceiveTransfert } from '../../../Redux/Actions/stock/TransfertAction';

export default function ListAccepter() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const transfert = useSelector((state: RootState) => state.Transfert.Transfert);
  const branchId = user.branch?.id;
  const type = 'Pieces';
  const state = 'Encours';
  const [transferts, setTransferts] = useState<TransfertPR[]>([]);
  useEffect(() => {
          if (branchId) {
              dispatch(GetReceiveTransfert({
                  branchId,
                  type: 'Pieces',
                  state: 'Accepter'
              }));
          }
      }, [branchId]);
  return (
    <div>
      <DynamicTable
        rows={transfert}
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

      />
    </div>
  )
}
