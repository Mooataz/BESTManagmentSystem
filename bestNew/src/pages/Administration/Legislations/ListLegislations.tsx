import React, { useState } from 'react'
import { useNotification } from '../../../Componants/NotificationContext';
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { getLegislations } from '../../../Redux/Actions/Administration/Legislation';
import { Typography } from '@mui/material';
import DynamicTable from '../../../Componants/Global/TableComponat';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import theme from '../../../Theme/theme';
import ModeIcon from '@mui/icons-material/Mode';
import UpdateLegislation from './UpdateLegislation';
import AddLegislation from './AddLegislation';

export default function ListLegislations() {
    const { notify } = useNotification();
    const dispatch = useAppDispatch();
    const legislations = useSelector((state: RootState) => state.legislation.legislation);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

    const handelOpenEdit = (row: any) => {
        setSelectedRow(row);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    React.useEffect(() => {
        dispatch(getLegislations())
    }, [dispatch])

    const actions: TableAction[] = [{
        icon: <ModeIcon style={{ color: theme.palette.primary.main }} />,
        onClick: (row: any) => handelOpenEdit(row)
    }]
    return (
        <div>
            <Typography sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%', color: theme.palette.secondary.main, width: '200px' }}>
                Liste des legislations
            </Typography>
            <AddLegislation />
            <DynamicTable rows={legislations}

                columnLabels={{
                    'id': 'Code',
                    'name': 'Description',


                }}

                columnsToShow={[
                    'id',
                    'name',

                ]}

                actions={actions} />

            {selectedRow && (
                <UpdateLegislation
                    legislation={selectedRow}
                    open={openEdit}
                    onClose={handleCloseEdit}
                />
            )}
        </div>
    )
}
