import React from 'react'
import { useAppDispatch } from '../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import { getOneRepair } from '../../Redux/Actions/Reception/repairAction';
import { Box, Divider, Stack } from '@mui/material';
import ShowStepper from '../../Componants/Global/ShowStepper';

interface ShowHeadRepairProps {
    idRep: string;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

const Item = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', fontSize: 12 }}>
        <Box sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>{label}&nbsp;:</Box>
        <Box>{children}</Box>
    </Box>
);

const ListSection = ({ items }: { items: { name: string }[] }) => (
    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
        {items.map((item, i) => <Box component="li" key={i}>{item.name}</Box>)}
    </Box>
);

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
    const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('fr-FR') : '-';
    const customer = isObj(oneRepair?.customer) ? oneRepair.customer : null;
    const device = isObj(oneRepair?.device) ? oneRepair.device as Record<string, unknown> : null;

    return (
        <Box>
            Réparation n° {idRep}
            <br /><br />
            {oneRepair ? <ShowStepper rows={oneRepair.historyRepair || []} /> : '_'}
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} flexWrap="wrap" useFlexGap>
                {customer ? (
                    <Box>
                        <Item label="Code client">{customer.id as string}</Item>
                        <Item label="Nom">{customer.name as string}</Item>
                        <Item label="Téléphone">{customer.phone as string}</Item>
                        {isObj(customer.distributer) && (
                            <Item label="Distributeur">{(customer.distributer as Record<string, unknown>).name as string}</Item>
                        )}
                    </Box>
                ) : <Box sx={{ color: '#FF7043', fontSize: 12 }}>Aucun client</Box>}
                {device ? (
                    <Box>
                        <Item label="Code appareil">{device.id as string}</Item>
                        <Item label="Imei">{device.serialenumber as string}</Item>
                        <Item label="Date d'achat">{fmtDate(device.purchaseDate as string)}</Item>
                        <Item label="Modèle">{brand?.name ?? '-'} - {model?.name ?? '-'}</Item>
                    </Box>
                ) : <Box sx={{ color: '#FF7043', fontSize: 12 }}>Aucun appareil</Box>}
                <Box>
                    <Item label="Type de modèle">{model?.typeModel?.description ?? '-'}</Item>
                    <Item label="Etat">{oneRepair?.deviceStateReceive ?? '-'}</Item>
                    <Item label="Accessoire">
                        {oneRepair?.accessory?.length ? <ListSection items={oneRepair.accessory} /> : <Box sx={{ color: '#FF7043' }}>Pas d'accessoires</Box>}
                    </Item>
                </Box>
                <Box>
                    <Item label="Problèmes">
                        {oneRepair?.listFault?.length ? <ListSection items={oneRepair.listFault} /> : '-'}
                    </Item>
                </Box>
                <Box>
                    <Item label="Demande client">
                        {oneRepair?.customerRequest?.length ? <ListSection items={oneRepair.customerRequest} /> : <Box sx={{ color: '#FF7043' }}>Pas de demande</Box>}
                    </Item>
                </Box>
            </Stack>
            <br />
        </Box>
    )
}