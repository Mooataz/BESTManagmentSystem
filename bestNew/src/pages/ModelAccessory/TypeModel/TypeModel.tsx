import { Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import theme from '../../../Theme/theme'
import DynamicTable from '../../../Componants/Global/TableComponat'
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { useNotification } from '../../../Componants/NotificationContext';
import { GetAllTypeModel } from '../../../Redux/Actions/ModelAndAccessory/TypeModelActions';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import EditIcon from '@mui/icons-material/Edit';
import UpdateType from './UpdateType';
import AddType from './AddType';

export default function TypeModel() {
    const dispatch = useAppDispatch();
    const typeModel = useSelector((state: RootState) => state.TypeModel.typeModel)

    useEffect(() => {
        dispatch(GetAllTypeModel())
    }, [dispatch])
    const { notify } = useNotification();
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
            <Typography sx={{
                textAlign: 'left',
                fontWeight: 'bold',
                marginBottom: '3%',
                color: theme.palette.secondary.main
            }}>Liste des type modèle  </Typography>
            <AddType />
            <DynamicTable
                rows={typeModel}

                columnLabels={{
                    'id': 'Code',
                    'description': 'Nom'
                }}

                columnsToShow={[
                    'id',
                    'description',
                ]}

                actions={actions} />

            {selectedRow && (
                <UpdateType
                    typeModel={selectedRow}
                    open={openEdit}
                    onClose={handleCloseEdit}
                />
            )}
        </div>
    )
}
