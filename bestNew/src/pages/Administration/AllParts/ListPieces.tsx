import React, { useEffect, useState } from 'react'
import { getAllPart } from '../../../Redux/Actions/Administration/ListAllPart'
import { useNotification } from '../../../Componants/NotificationContext';
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import theme from '../../../Theme/theme';
import ModeIcon from '@mui/icons-material/Mode';
import { Typography } from '@mui/material';
import DynamicTable from '../../../Componants/Global/TableComponat';
import UpdatePart from './UpdatePart';
import AjoutPart from './AjoutPart';

export default function ListPieces() {
    const { notify } = useNotification();
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getAllPart())
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
    const allpart = useSelector((state: RootState) => state.allParts.allParts)

    const actions: TableAction[] = [{
        icon: <ModeIcon style={{ color: theme.palette.primary.main }} />,
        onClick: (row: any) => handelOpenEdit(row)
    }]
    return (
        <div>
            <Typography sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%', color: theme.palette.secondary.main, width: '200px' }}>
                Liste de toutes les pièces
            </Typography>
<AjoutPart />
            <DynamicTable rows={allpart}

                columnLabels={{
                    'id': 'Code',
                    'description': 'Description',
                }}

                columnsToShow={[
                    'id',
                    'description',
                ]}

                actions={actions} />

            {selectedRow && (
                <UpdatePart
                    part={selectedRow}
                    open={openEdit}
                    onClose={handleCloseEdit}
                />
            )}
        </div>
    )
}
