import React from 'react'
import { useAppDispatch } from '../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import { getOneRepair } from '../../Redux/Actions/Reception/repairAction';
import { Box, Divider, Table, TableCell, TableRow } from '@mui/material';
import ShowStepper from '../../Componants/Global/ShowStepper';
import { TbBackground } from 'react-icons/tb';
interface ShowHeadRepairProps {
    idRep: string;
}

export default function ShowHeadRepair({ idRep }: ShowHeadRepairProps) {
    const dispatch = useAppDispatch();
    const oneRepair = useSelector((state: RootState) => state.repair.oneRepair);
    React.useEffect(() => {
        if (idRep) {
            dispatch(getOneRepair(Number(idRep)));
        }
    }, [dispatch, idRep]);

    const model = (oneRepair?.device as any)?.model;
const brand = model?.brand;
    return (
        <Box>
            Rèparation n° {idRep}
            <br /> <br />

            {oneRepair ? <ShowStepper rows={oneRepair.historyRepair || []} /> : '_'}
            <Divider ></Divider>< br />< br />
            <Box sx={{ display: 'flex' }}>
                <Box key='Customer'>
                    {typeof oneRepair?.customer === 'object' && oneRepair.customer !== null
                        ? (
                            <Table >
                                <TableRow  >
                                    <TableCell sx={linesTable}>Code client</TableCell>
                                    <TableCell sx={linesTable2}>{oneRepair.customer.id}</TableCell>
                                </TableRow>

                                <TableRow   >
                                    <TableCell sx={linesTable}>Nom</TableCell>
                                    <TableCell sx={linesTable2}>  {oneRepair.customer.name} </TableCell>
                                </TableRow>

                                <TableRow  >
                                    <TableCell sx={linesTable}>Tèlèphone</TableCell>
                                    <TableCell sx={linesTable2}>  {oneRepair.customer.phone} </TableCell>
                                </TableRow>
                                {typeof oneRepair?.customer.distributer === 'object' && oneRepair.customer.distributer !== null
                                    ? (
                                        <TableRow >
                                            <TableCell sx={linesTable}>Distributeur</TableCell>
                                            <TableCell sx={linesTable2}>  {oneRepair.customer.distributer.name} </TableCell>
                                        </TableRow>
                                    ) : '-'}
                            </Table>
                        )
                        : '-'}

                </Box>
                <Divider orientation="vertical" flexItem />
                <Box key='Device'>
                    {typeof oneRepair?.device === 'object' && oneRepair.device !== null
                        ? (
                            <Table sx={{ marginLeft: '20px' }}>
                                <TableRow>
                                    <TableCell sx={linesTable}>Code appareille</TableCell>
                                    <TableCell sx={linesTable2}>  {(oneRepair.device as any).id} </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={linesTable}>Imei</TableCell>
                                    <TableCell sx={linesTable2}>{(oneRepair.device as any).serialenumber}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={linesTable}>Date d'achat</TableCell>
                                    <TableCell sx={linesTable2} >
                                        {new Date((oneRepair.device as any).purchaseDate).toISOString().split('T')[0]}

                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={linesTable}>Modèle</TableCell>

                                    <TableCell sx={linesTable2}>

                                        {brand?.name ?? '-'} - {model?.name ?? '-'}
                                    </TableCell>

                                </TableRow>
                            </Table>

                        ) : '-'}
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box key='State Accessory'>
                    <Table>
                        <TableRow>
                            <TableCell sx={linesTable}>Type de modèle</TableCell>
                            <TableCell sx={linesTable2}>
                                {model?.typeModel.description ?? '-'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={linesTable}>Etat</TableCell>
                            <TableCell sx={linesTable2}>{oneRepair?.deviceStateReceive} </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={linesTable}>Accessoire</TableCell>
                            <TableCell sx={linesTable2}>
                                {
                                    oneRepair?.accessory && oneRepair?.accessory.length > 0 ? (
                                        oneRepair?.accessory.map((item, index) => (
                                            <li key={index}>{item.name}</li>
                                        ))
                                    ) : (
                                        <Box sx={{ color: '#FF7043' }}>Pas d'accessories</Box>
                                    )
                                }
                            </TableCell>
                        </TableRow>
                    </Table>

                </Box>
                <Divider orientation="vertical" flexItem />
                <Box key='Problems'>
                    <Table>
                        <TableRow>
                            <TableCell sx={linesTable}>Problèmes</TableCell>
                            <TableCell sx={linesTable2} >
                                {
                                    oneRepair?.listFault && oneRepair?.listFault.length > 0 ? (
                                        oneRepair?.listFault.map((item, index) => (
                                            <li key={index}>{item.name}</li>
                                        ))
                                    ) : (
                                        <Box sx={{ color: '#FF7043' }}>_</Box>
                                    )
                                }
                            </TableCell>
                        </TableRow>
                    </Table>

                </Box>
                <Divider orientation="vertical" flexItem />
                <Box key='Request'>
                    <Table>
                        <TableRow>
                            <TableCell sx={linesTable}>Demande client</TableCell>
                            <TableCell sx={linesTable2}>
                               {
  Array.isArray(oneRepair?.customerRequest) && oneRepair.customerRequest.length > 0 ? (
    oneRepair.customerRequest.map((item, index) => (
      <li key={index}>{item.name}</li>
    ))
  ) : (
    <Box sx={{ color: '#FF7043' }}>Pas de demande</Box>
  )
}

                            </TableCell>
                        </TableRow>
                    </Table>

                </Box>

            </Box>
            <br />
        </Box>
    )
}

const linesTable = {
    lineHeight: '0.9',
    padding: '4px 8px',
    fontSize: '12px',
    background: '#EEEEEE'
}
const linesTable2 = {
    lineHeight: '0.9',
    padding: '4px 8px',
    fontSize: '12px',

}