import React, { useState } from 'react'
import DynamicTable from '../../../Componants/Global/TableComponat'
import { useAppDispatch } from '../../../Redux/hooks';
import { getLevelRepair } from '../../../Redux/Actions/Administration/levelRepairActions';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { Typography } from '@mui/material';
import theme from '../../../Theme/theme';
import AddlevelRepair from './AddlevelRepair';
import UpdateProblem from '../ListProbleme.tsx/UpdateProblem';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import ModeIcon from '@mui/icons-material/Mode';
import UpdatelevelRepair from './UpdatelevelRepair';

export default function ListlevelRepair() {
    const dispatch = useAppDispatch();
    const levelRepair = useSelector((state: RootState) => state.LevelRepair.levelRepair)
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
        dispatch(getLevelRepair())
    }, [dispatch])

    const actions: TableAction[] = [{
        icon: <ModeIcon style={{ color: theme.palette.primary.main }} />,
        onClick: (row: any) => handelOpenEdit(row)
    }]
    return (
        <div>
            <Typography sx={{
                textAlign: 'left',
                fontWeight: 'bold',
                marginBottom: '3%',
                color: theme.palette.secondary.main,
                width: '300px'
            }} > List des niveaux de rèparation</Typography   >
            <AddlevelRepair />
            <DynamicTable
                rows={levelRepair}
                actions={actions}
                columnLabels={{
                    'id': 'Code',
                    'name': 'Nom case',
                    'price': 'Prix',


                }}

                columnsToShow={[
                    'id',
                    'name',
                    'price',


                ]}

            />

            {selectedRow && (
                <UpdatelevelRepair
                    levelRepair={selectedRow}
                    open={openEdit}
                    onClose={handleCloseEdit}
                />)}
        </div>
    )
}
