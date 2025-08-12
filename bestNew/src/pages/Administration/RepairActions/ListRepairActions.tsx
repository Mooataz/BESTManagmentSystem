import React, { useEffect, useState } from 'react'
import AddAction from './AddAction'
import { Typography } from '@mui/material'
import theme from '../../../Theme/theme'
import DynamicTable from '../../../Componants/Global/TableComponat'
import { useAppDispatch } from '../../../Redux/hooks'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../Redux/store'
import { getRepairAction } from '../../../Redux/Actions/Administration/ActionRepairActions'
import type { TableAction } from '../../../Redux/Types/repairTypes'
import EditIcon from '@mui/icons-material/Edit';
import UpdateRepairActions from './UpdateRepairActions'

export default function ListRepairActions() {
    const dispatch = useAppDispatch();
    const repairActions = useSelector((state: RootState) => state.RepairAction.repairAction);

    useEffect(() => {
        dispatch(getRepairAction())
    }, [dispatch])

    const [selectedRow, setSelectedRow] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const handelOpenEdit = (row: any) => {
        setSelectedRow(row);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setOpenEdit(false);
    };
      const actions: TableAction[] = [{
        icon: <EditIcon style={{ color: theme.palette.primary.main }} />,
        onClick: (row: any) => handelOpenEdit(row)
    }]
    return (
        <div>
            <Typography sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%', color: theme.palette.secondary.main, width: '200px' }}>
                List des actions après diagnostique
            </Typography>
            <AddAction />

            <DynamicTable
                rows={repairActions}

                columnLabels={{
                    'id': 'Code',
                    'name': 'Description',

                }}

                columnsToShow={['id',
                    'name',
                ]}

                actions={actions}

            />

            {selectedRow && (
                <UpdateRepairActions
                    action={selectedRow}
                    open={openEdit}
                    onClose={handleCloseEdit}
                />
            )}
        </div>
    )
}
