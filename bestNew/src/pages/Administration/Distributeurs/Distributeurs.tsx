import React, { useState } from 'react'
import { fetchDistributeur, updateDistributeur } from '../../../api/administration/Administration';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, FormLabel, Input, Modal, Stack, Typography } from '@mui/material';
import { useNotification } from '../../../Componants/NotificationContext';
import DynamicTable from '../../../Componants/Global/TableComponat';
import UpdateDistributer from './UpdateDistributer';
import theme from '../../../Theme/theme';
import type { RootState } from '../../../Redux/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../Redux/hooks';
import { getDistributers } from '../../../Redux/Actions/Administration/Distributer';
import AddDistibuteur from './AddDistibuteur';

interface Distributor {
    id: number; name: string; phone: number; email: string; location: string; taxRegisterNumber: string;
}
export default function Distributeurs() {
    const { notify } = useNotification();
    const distributer = useSelector((state: RootState) => state.distributer.distributer)
    const [message, setMessage] = React.useState<Distributor[]>([]);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(getDistributers())
    }, [dispatch])

    

   
    const [open, setOpen] = React.useState(false);
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
        <div> <br/> <br/>
            <caption style=  {{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%' , color:theme.palette.secondary.main ,width: '200px' }}>Liste des distributeur  </caption>
            <AddDistibuteur /> <br/> <br/>
            <DynamicTable rows={distributer}

                columnLabels={{
                    'id': 'Code',
                    'name': 'Nom',
                    'phone': 'Téléphone',
                    'taxRegisterNumber': 'MF',
                    'email': 'E-mail',
                    'location': 'Adresse',

                }}

                columnsToShow={[
                    'id',
                    'name',
                    'phone',
                    'taxRegisterNumber',
                    'email',
                    'location',
                ]}

                actions={actions} />
            {selectedRow && (
                <UpdateDistributer
                    distributer={selectedRow}
                    opens={openEdit}
                    onClose={handleCloseEdit}
                />
            )}

        </div>
    )
}
 