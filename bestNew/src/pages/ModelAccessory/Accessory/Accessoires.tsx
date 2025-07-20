import React, { useEffect, useState } from 'react'
import { fetchAccessoire } from '../../../api/administration/Administration';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import EditIcon from '@mui/icons-material/Edit';
import { useNotification } from '../../../Componants/NotificationContext';
import DynamicTable from '../../../Componants/Global/TableComponat';
import { Typography } from '@mui/material';
import theme from '../../../Theme/theme';
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { GetAllAccessory } from '../../../Redux/Actions/ModelAndAccessory/AccessoryActions';
 import AjouteAccessory from './AjouteAccessory';
import UpdateAccessory from './UpdateAccessory';
interface Accessoire {
    id: number; name: string;
}
 

export default function Accessoires() {
    const dispatch = useAppDispatch();
    const accessory = useSelector((state: RootState) => state.accessory.accessory)

    useEffect(() => {
        dispatch(GetAllAccessory())
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
    const [open, setOpen] = React.useState(false);

    const actions: TableAction[] = [{
        icon: <EditIcon style={{ color: theme.palette.primary.main }} />,
        onClick: (row: any) => handelOpenEdit(row)
    }]

    return (
        <div>
            <Typography sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%', color: theme.palette.secondary.main }}>Liste des accessoires  </Typography>
            <AjouteAccessory />
            <DynamicTable
                rows={accessory}

                columnLabels={{
                    'id': 'Code',
                    'name': 'Nom'
                }}

                columnsToShow={[
                    'id',
                    'name',
                ]}

                actions={actions} />

            {selectedRow && (
                <UpdateAccessory
                    accessory={selectedRow}
                    open={openEdit}
                    onClose={handleCloseEdit}
                />
            )}
        </div>
    )
}
