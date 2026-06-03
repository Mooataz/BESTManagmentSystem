import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, Chip, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import theme from '../../Theme/theme';

interface HistoryTracability {
  id: number;
  user?: { id: number; name?: string; branch?: { id: number; name?: string } };
}

interface HistoryRepair {
  id: number;
  date: string;
  step: string;
  tracability?: HistoryTracability[];
}

interface TypeItem {
  id: number;
  name?: string;
  description?: string;
}

interface PartsPriceRow {
  id: number;
  price?: number;
  allPart?: { id: number; description?: string };
  levelRepair?: { id: number; name?: string; price?: number };
}

interface ApproveStockRow {
  id: number;
  state?: string;
  idPartRepair?: number;
}

interface RepairDetail {
  id: number;
  warrenty?: boolean;
  approveRepair?: boolean;
  newserialnumber?: string;
  actuellybranch: number;
  files?: string[];
  partsNeed?: number[];
  remark?: string;
  deviceStateReceive: string;
  accessory?: TypeItem[];
  listFault?: TypeItem[];
  customerRequest?: TypeItem[];
  notesCustomer?: TypeItem[];
  expertiseReason?: TypeItem[];
  repairAction?: TypeItem[];
  historyRepair?: HistoryRepair[];
  approveStock?: ApproveStockRow[];
  device?: {
    id: number;
    serialenumber?: string;
    model?: { id: number; name?: string; brand?: { name?: string }; typeModel?: { description?: string }; allpart?: TypeItem[] };
  };
  customer?: {
    id: number;
    name?: string;
    phone?: number;
    type?: string;
    distributer?: { id: number; name?: string };
  };
  user?: { id: number; name?: string };
}

interface DevisPartRow {
  id: number;
  description: string;
  price: number;
  levelPrice: number;
}

interface DevisInfo {
  parts: PartsPriceRow[];
  tva: number;
  timbreFiscale: number;
}

interface ShowRepairProps {
  repairId?: string | number;
}

export default function ShowRepair({ repairId: propRepairId }: ShowRepairProps = {}) {
  const { repairId: paramRepairId } = useParams<{ repairId: string }>();
  const repairId = propRepairId ?? paramRepairId;
  const [repair, setRepair] = useState<RepairDetail | null>(null);
  const [devisInfo, setDevisInfo] = useState<DevisInfo | null>(null);

  useEffect(() => {
    if (!repairId) return;
    fetch(`http://localhost:3000/repair/${repairId}`, { credentials: 'include' })
      .then(r => r.json())
      .then(res => setRepair(res.data ?? null))
      .catch(() => setRepair(null));
  }, [repairId]);

  const modelId = repair?.device?.model?.id;
  const partIds = repair?.partsNeed ?? [];
  const actionName = useMemo(() => {
    return repair?.repairAction?.[0]?.name ?? '';
  }, [repair]);

  const isDevis = actionName === 'Devis';
  const isReparation = actionName === 'Réparation';

  useEffect(() => {
    if (!isDevis || !modelId || partIds.length === 0) { setDevisInfo(null); return; }
    fetch('http://localhost:3000/parts-price/devis-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ modelId, partIds }),
    })
      .then(r => r.json())
      .then(res => setDevisInfo(res.data ?? null))
      .catch(() => setDevisInfo(null));
  }, [isDevis, modelId, partIds]);

  const allParts = repair?.device?.model?.allpart ?? [];

  const devisParts: DevisPartRow[] = useMemo(() => {
    const partIds = repair?.partsNeed ?? [];
    const priceMap = new Map<number, { price: number; levelPrice: number }>();
    if (devisInfo?.parts) {
      for (const p of devisInfo.parts) {
        priceMap.set(Number(p.id), {
          price: p.price ?? 0,
          levelPrice: p.levelRepair?.price ?? 0,
        });
      }
    }
    return partIds.map(pid => {
      const part = allParts.find(a => Number(a.id) === Number(pid));
      const pp = priceMap.get(Number(pid));
      return {
        id: Number(pid),
        description: part?.description ?? `Pièce #${pid}`,
        price: pp?.price ?? 0,
        levelPrice: pp?.levelPrice ?? 0,
      };
    });
  }, [repair, devisInfo, allParts]);

  const highestLevelRepairPrice = useMemo(() => {
    return Math.max(...devisParts.map(p => p.levelPrice), 0);
  }, [devisParts]);

  const sumPartsPrice = useMemo(() => {
    return devisParts.reduce((s, p) => s + p.price, 0);
  }, [devisParts]);

  const totalDevis = useMemo(() => {
    const subtotal = sumPartsPrice + highestLevelRepairPrice;
    const tva = devisInfo?.tva ?? 0;
    const timbre = devisInfo?.timbreFiscale ?? 0;
    return subtotal * (1 + tva / 100) + timbre;
  }, [sumPartsPrice, highestLevelRepairPrice, devisInfo]);

  const confirmedParts = useMemo(() => {
    if (!isReparation || !repair?.approveStock) return [];
    return repair.approveStock
      .filter(a => a.state === 'Confirmer')
      .map(a => a.idPartRepair);
  }, [isReparation, repair]);

  if (!repair) {
    return <Box sx={{ p: 3 }}><Typography>Chargement…</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 3 }}>
        Détail de la réparation #{repair.id}
      </Typography>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>
            Informations générales
          </Typography>
          <Grid container spacing={2}>
            <Grid size={4}>
              <Typography><strong>Garantie :</strong> {repair.warrenty ? 'Sous garantie' : 'Hors garantie'}</Typography>
              <Typography><strong>Approuvé :</strong> {repair.approveRepair ? 'Oui' : 'Non'}</Typography>
              <Typography><strong>Nouveau NS :</strong> {repair.newserialnumber ?? '—'}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography><strong>Branche actuelle :</strong> {repair.actuellybranch}</Typography>
              <Typography><strong>État reçu :</strong> {repair.deviceStateReceive}</Typography>
              <Typography><strong>Remarque :</strong> {repair.remark ?? '—'}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography><strong>Fichiers :</strong> {Array.isArray(repair.files) && repair.files.length > 0 ? repair.files.length : 'Aucun'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>
            Appareil
          </Typography>
          <Grid container spacing={2}>
            <Grid size={4}><Typography><strong>NS :</strong> {repair.device?.serialenumber ?? '—'}</Typography></Grid>
            <Grid size={4}><Typography><strong>Marque :</strong> {repair.device?.model?.brand?.name ?? '—'}</Typography></Grid>
            <Grid size={4}><Typography><strong>Modèle :</strong> {repair.device?.model?.name ?? '—'}</Typography></Grid>
            <Grid size={4}><Typography><strong>Type :</strong> {repair.device?.model?.typeModel?.description ?? '—'}</Typography></Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>
            Client
          </Typography>
          <Grid container spacing={2}>
            <Grid size={4}><Typography><strong>Nom :</strong> {repair.customer?.name ?? '—'}</Typography></Grid>
            <Grid size={4}><Typography><strong>Tél :</strong> {repair.customer?.phone ?? '—'}</Typography></Grid>
            <Grid size={4}><Typography><strong>Distributeur :</strong> {repair.customer?.distributer?.name ?? '—'}</Typography></Grid>
            <Grid size={4}><Typography><strong>Technicien :</strong> {repair.user?.name ?? '—'}</Typography></Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>
            Accessoires
          </Typography>
          {repair.accessory && repair.accessory.length > 0
            ? repair.accessory.map(a => <Chip key={a.id} label={a.name} size="small" sx={{ mr: 0.5, mb: 0.5 }} />)
            : <Typography sx={{ color: 'gray', fontStyle: 'italic' }}>Aucun</Typography>}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>
            Pannes constatées
          </Typography>
          {repair.listFault && repair.listFault.length > 0
            ? repair.listFault.map(f => <Chip key={f.id} label={f.name} size="small" color="error" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />)
            : <Typography sx={{ color: 'gray', fontStyle: 'italic' }}>Aucune</Typography>}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>
            Demandes client
          </Typography>
          {repair.customerRequest && repair.customerRequest.length > 0
            ? repair.customerRequest.map(cr => <Chip key={cr.id} label={cr.name} size="small" sx={{ mr: 0.5, mb: 0.5 }} />)
            : <Typography sx={{ color: 'gray', fontStyle: 'italic' }}>Aucune</Typography>}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>
            Notes client
          </Typography>
          {repair.notesCustomer && repair.notesCustomer.length > 0
            ? repair.notesCustomer.map(n => <Chip key={n.id} label={n.name} size="small" sx={{ mr: 0.5, mb: 0.5 }} />)
            : <Typography sx={{ color: 'gray', fontStyle: 'italic' }}>Aucune</Typography>}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>
            Raisons d'expertise
          </Typography>
          {repair.expertiseReason && repair.expertiseReason.length > 0
            ? repair.expertiseReason.map(e => <Chip key={e.id} label={e.name ?? e.description} size="small" color="warning" sx={{ mr: 0.5, mb: 0.5 }} />)
            : <Typography sx={{ color: 'gray', fontStyle: 'italic' }}>Aucune</Typography>}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>
            Action réparation
          </Typography>
          {repair.repairAction && repair.repairAction.length > 0
            ? repair.repairAction.map(a => <Chip key={a.id} label={a.name} size="small" color="primary" sx={{ mr: 0.5, mb: 0.5 }} />)
            : <Typography sx={{ color: 'gray', fontStyle: 'italic' }}>Aucune</Typography>}
        </CardContent>
      </Card>

      {isDevis && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>
              Devis — Pièces proposées
            </Typography>
            {devisParts.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Pièce</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Prix (DT)</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Main-d'œuvre (DT)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devisParts.map((p, i) => (
                    <TableRow key={p.id} sx={i % 2 === 1 ? { bgcolor: '#f0f4ff' } : {}}>
                      <TableCell>{p.description}</TableCell>
                      <TableCell align="right">{p.price.toFixed(3)}</TableCell>
                      <TableCell align="right">{p.levelPrice.toFixed(3)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography sx={{ color: 'gray', fontStyle: 'italic' }}>Aucune pièce sélectionnée</Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-end' }}>
              <Typography variant="body2"><strong>Total pièces :</strong> {sumPartsPrice.toFixed(3)} DT</Typography>
              <Typography variant="body2"><strong>Main-d'œuvre (niv. max) :</strong> {highestLevelRepairPrice.toFixed(3)} DT</Typography>
              <Typography variant="body2"><strong>TVA ({devisInfo?.tva ?? 0}%) :</strong> {((sumPartsPrice + highestLevelRepairPrice) * ((devisInfo?.tva ?? 0) / 100)).toFixed(3)} DT</Typography>
              <Typography variant="body2"><strong>Timbre fiscal :</strong> {(devisInfo?.timbreFiscale ?? 0).toFixed(3)} DT</Typography>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                Total TTC : {totalDevis.toFixed(3)} DT
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {isReparation && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>
              Pièces changées (ApproveStock)
            </Typography>
            {confirmedParts.length > 0 ? (
              <Box>
                {confirmedParts.map((partId, idx) => {
                  const part = (repair.device?.model?.allpart ?? []).find(p => Number(p.id) === Number(partId));
                  return <Chip key={`${partId}-${idx}`} label={part?.description ?? `Pièce #${partId}`} size="small" color="success" sx={{ mr: 0.5, mb: 0.5 }} />;
                })}
              </Box>
            ) : (
              <Typography sx={{ color: 'gray', fontStyle: 'italic' }}>Aucune pièce changée</Typography>
            )}
          </CardContent>
        </Card>
      )}

      {Array.isArray(repair.files) && repair.files.length > 0 && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>
              Images
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {repair.files.map((f, i) => (
                <Box
                  key={i}
                  sx={{
                    width: '48%', aspectRatio: '1.8', overflow: 'hidden', borderRadius: 1,
                    bgcolor: '#eef2f7', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <img
                    src={`http://localhost:3000/upload/repairs/${f}`}
                    alt=""
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>
            Historique des étapes
          </Typography>
          {repair.historyRepair && repair.historyRepair.length > 0 ? (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[...repair.historyRepair]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(h => (
                  <Chip
                    key={h.id}
                    label={`${new Date(h.date).toLocaleString()} — ${h.step}${h.tracability?.[0]?.user?.name ? ` (${h.tracability[0].user.name})` : ''}${h.tracability?.[0]?.user?.branch?.name ? ` [${h.tracability[0].user.branch.name}]` : ''}`}
                    size="small"
                    variant="filled"
                    color="info"
                    sx={{ fontWeight: 500 }}
                  />
                ))}
            </Box>
          ) : (
            <Typography sx={{ color: 'gray', fontStyle: 'italic' }}>Aucun historique</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}