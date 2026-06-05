import { API } from '../../services/api';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Paper, Checkbox, ListItemText, OutlinedInput
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';


interface ApproveStockItem {
  id: number;
  idPartRepair?: number;
  partName?: string;
  partPrice?: number;
  state?: string;
  stockPart?: any;
}

interface RepairItem {
  id: number;
  warrenty?: boolean;
  device?: { id: number; serialenumber?: string; model?: { id: number; name?: string; brand?: { id: number; name?: string } } };
  customer?: { id: number; name?: string; phone?: string };
  partsNeed?: string;
  repairAction?: { id: number; name?: string }[];
  user?: { id: number; name?: string };
  approveStock?: ApproveStockItem[];
}

interface PartDetail {
  partId: number;
  partName: string;
  price: number;
  levelRepairName?: string;
  levelRepairPrice?: number;
}

interface RepairDetails {
  repair: RepairItem;
  parts: PartDetail[];
  partsTotal: number;
  levelRepairPrice: number;
  tva: number;
  timbreFiscale: number;
}

interface OtherCostItem {
  id: number;
  name?: string;
  price?: number;
  status?: string;
}

interface InvoiceDetails {
  parts: { partId: number; partName: string; price: number }[];
  levelRepairPrice: number;
  partsTotal: number;
  otherCosts: { id: number; name: string; price: number }[];
  otherCostsTotal: number;
  totalHT: number;
  tva: number;
  tvaAmount: number;
  timbreFiscale: number;
  totalTTC: number;
}

interface InvoiceItem {
  id: number;
  date: string;
  state: string;
  totalPrice?: number;
  tva?: number;
  timbreFiscale?: number;
  partsTotal?: number;
  levelRepairPrice?: number;
  otherCostsTotal?: number;
  repair?: RepairItem;
  otherCost?: OtherCostItem[];
  user?: { id: number; name?: string };
  details?: InvoiceDetails;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: { style: { maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, width: 250 } },
};

export default function Invoices() {
  const { t } = useTranslation();
  const userr = useSelector((state: RootState) => state.auth.user);
  const branchId = typeof userr?.branch === 'object' ? (userr.branch as any).id : userr?.branch;

  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const [openView, setOpenView] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<InvoiceItem | null>(null);

  const [eligibleRepairs, setEligibleRepairs] = useState<RepairItem[]>([]);
  const [authorizedCosts, setAuthorizedCosts] = useState<OtherCostItem[]>([]);
  const [selectedRepairId, setSelectedRepairId] = useState<number | null>(null);
  const [repairDetails, setRepairDetails] = useState<RepairDetails | null>(null);
  const [selectedCosts, setSelectedCosts] = useState<number[]>([]);
  const [tva, setTva] = useState(0);
  const [timbre, setTimbre] = useState(0);

  const [openEdit, setOpenEdit] = useState(false);
  const [editInvoice, setEditInvoice] = useState<InvoiceItem | null>(null);
  const [editCosts, setEditCosts] = useState<number[]>([]);
  const [editState, setEditState] = useState('');

  const [openValidate, setOpenValidate] = useState(false);
  const [validateInvoiceId, setValidateInvoiceId] = useState<number | null>(null);
  const [validateComment, setValidateComment] = useState('');

  const [filterState, setFilterState] = useState('');

  const fetchInvoices = useCallback(async () => {
    if (!branchId) return;
    setLoading(true);
    try {
      const res = await API.get(`invoice/findByBranchId/${branchId}`);
      setInvoices(res.data.data ?? []);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => { fetchInvoices() }, [fetchInvoices]);

  const totalHT = (repairDetails?.partsTotal ?? 0) + (repairDetails?.levelRepairPrice ?? 0) +
    authorizedCosts.filter(c => selectedCosts.includes(c.id)).reduce((s, c) => s + (c.price ?? 0), 0);
  const tvaRate = tva / 100;
  const tvaAmount = totalHT * tvaRate;
  const totalTTC = totalHT + tvaAmount + timbre;

  const handleOpenView = async (invId: number) => {
    try {
      const res = await API.get(`invoice/${invId}`);
      setViewInvoice(res.data.data ?? null);
      setOpenView(true);
    } catch { }
  };

  const handleOpenCreate = async () => {
    setOpenCreate(true);
    try {
      const [repRes, costsRes] = await Promise.all([
        API.get(`invoice/eligible-repairs/${branchId}`),
        API.get('invoice/authorized-costs'),
      ]);
      setEligibleRepairs(repRes.data.data ?? []);
      setAuthorizedCosts(costsRes.data.data ?? []);
    } catch { }
  };

  const handleRepairSelect = async (repairId: number) => {
    setSelectedRepairId(repairId);
    setSelectedCosts([]);
    try {
      const res = await API.get(`invoice/repair-details/${repairId}`);
      const data = res.data.data;
      setRepairDetails(data ?? null);
      if (data) {
        setTva(data.tva ?? 0);
        setTimbre(data.timbreFiscale ?? 0);
      }
    } catch {
      setRepairDetails(null);
    }
  };

  const handleCreate = async () => {
    if (!selectedRepairId || !userr?.id) return;
    try {
      await API.post('invoice', {
        paymentMethod: 'Espèces',
        repair: selectedRepairId,
        user: userr.id,
        date: new Date().toISOString(),
        state: 'Payé',
        totalPrice: totalTTC,
        tva,
        timbreFiscale: timbre,
        partsTotal: repairDetails?.partsTotal ?? 0,
        levelRepairPrice: repairDetails?.levelRepairPrice ?? 0,
        otherCostsTotal: authorizedCosts.filter(c => selectedCosts.includes(c.id)).reduce((s, c) => s + (c.price ?? 0), 0),
        otherCost: selectedCosts,
      });
      setOpenCreate(false);
      setSelectedRepairId(null);
      setRepairDetails(null);
      setSelectedCosts([]);
      fetchInvoices();
    } catch { }
  };

  const handleOpenEdit = async (inv: InvoiceItem) => {
    setEditInvoice(inv);
    setEditState(inv.state ?? '');
    const costIds = (inv.otherCost ?? []).map(c => c.id);
    setEditCosts(costIds);
    setOpenEdit(true);
    try {
      const costsRes = await API.get('invoice/authorized-costs');
      setAuthorizedCosts(costsRes.data.data ?? []);
    } catch { }
  };

  const handleUpdate = async () => {
    if (!editInvoice) return;
    try {
      await API.patch(`invoice/${editInvoice.id}`, {
        state: editState,
        otherCost: editCosts,
      });
      setOpenEdit(false);
      setEditInvoice(null);
      fetchInvoices();
    } catch { }
  };

  const handleValidate = async (invId: number) => {
    setValidateInvoiceId(invId);
    setValidateComment('');
    setOpenValidate(true);
  };

  const handleConfirmValidate = async () => {
    if (!validateInvoiceId) return;
    try {
      await API.patch(`invoice/validate/${validateInvoiceId}`, { adminId: userr?.id });
      setOpenValidate(false);
      setValidateInvoiceId(null);
      fetchInvoices();
    } catch { }
  };

  return (
    <Box sx={{ p: 3 , width: '100%' }}>
                <Typography variant="h4" fontWeight={600}>Factures</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'right', mb: 3, width: '100%', marginLeft: '70%' }}>
        <Button variant="outlined" onClick={handleOpenCreate} 
            sx={{
                borderColor: 'primary.dark',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  color: 'primary.light',
                },
            }}
        >Nouvelle facture</Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filtrer par état</InputLabel>
          <Select value={filterState} label="Filtrer par état" onChange={e => setFilterState(e.target.value)}>
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="Payé">Payé</MenuItem>
            <MenuItem value="En attente">En attente</MenuItem>
            <MenuItem value="Validé">Validé</MenuItem>
            <MenuItem value="Annulé">Annulé</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : invoices.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 6 }}>Aucune facture</Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>N° Facture</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>N° Réparation</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Appareil</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>État</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Total TTC</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">PDF</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.filter(inv => !filterState || inv.state === filterState).map(inv => (
                <TableRow key={inv.id} hover>
                  <TableCell>{inv.id}</TableCell>
                  <TableCell>{inv.repair?.id ?? '-'}</TableCell>
                  <TableCell>{new Date(inv.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{inv.repair?.customer?.name || '-'}</TableCell>
                  <TableCell>
                    {inv.repair?.device?.model?.brand?.name} {inv.repair?.device?.model?.name}
                  </TableCell>
                  <TableCell><Chip label={inv.state} size="small" color={inv.state === 'Payé' || inv.state === 'Validé' ? 'success' : 'warning'} /></TableCell>
                  <TableCell align="right">{inv.totalPrice?.toFixed(3) ?? '-'}</TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="outlined" onClick={() => window.open(`http://localhost:3000/invoice/pdf/${inv.id}`)}>
                      PDF
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="text" onClick={() => handleOpenView(inv.id)}>
                      Voir
                    </Button>
                    <Button size="small" variant="text" color="warning" onClick={() => handleOpenEdit(inv)}>
                      Modifier
                    </Button>
                    {userr?.role?.includes('Administrateur') && inv.state !== 'Validé' && (
                      <Button size="small" variant="contained" color="success" onClick={() => handleValidate(inv.id)}>
                        Valider
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="md" fullWidth>
        <DialogTitle>Détails de la facture N°{viewInvoice?.id}</DialogTitle>
        <DialogContent>
          {viewInvoice && (() => {
            const d = viewInvoice.details;
            const parts = d?.parts ?? [];
            const otherCosts = d?.otherCosts ?? [];
            const levelRepairPrice = d?.levelRepairPrice ?? 0;
            const tva = d?.tva ?? 0;
            const tvaAmount = d?.tvaAmount ?? 0;
            const timbreFiscale = d?.timbreFiscale ?? 0;
            const totalHT = d?.totalHT ?? 0;
            const totalTTC = d?.totalTTC ?? 0;
            return (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Client</Typography>
                <Typography>{viewInvoice.repair?.customer?.name ?? '-'}</Typography>
                <Typography variant="body2" color="text.secondary">Tél: {viewInvoice.repair?.customer?.phone ?? '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Appareil</Typography>
                <Typography>
                  {viewInvoice.repair?.device?.model?.brand?.name} {viewInvoice.repair?.device?.model?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">N/S: {viewInvoice.repair?.device?.serialenumber ?? '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">N° Réparation</Typography>
                <Typography>{viewInvoice.repair?.id ?? '-'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                <Typography>{new Date(viewInvoice.date).toLocaleDateString('fr-FR')}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">État</Typography>
                <Chip label={viewInvoice.state} size="small" color={viewInvoice.state === 'Payé' ? 'success' : 'warning'} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Détail des prix</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Désignation</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Montant</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {parts.map((p: any) => (
                        <TableRow key={p.partId}>
                          <TableCell>{p.partName}</TableCell>
                          <TableCell align="right">{p.price.toFixed(3)}</TableCell>
                        </TableRow>
                      ))}
                      {levelRepairPrice > 0 && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Main d'œuvre</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>{levelRepairPrice.toFixed(3)}</TableCell>
                        </TableRow>
                      )}
                      {otherCosts.map((oc: any) => (
                        <TableRow key={oc.id}>
                          <TableCell>{oc.name}</TableCell>
                          <TableCell align="right">{(oc.price ?? 0).toFixed(3)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography>Sous-total HT</Typography>
                    <Typography>{totalHT.toFixed(3)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography>TVA {tva}%</Typography>
                    <Typography>{tvaAmount.toFixed(3)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography>Timbre fiscale</Typography>
                    <Typography>{timbreFiscale.toFixed(3)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" fontWeight={700}>Total TTC</Typography>
                    <Typography variant="h6" fontWeight={700} color="primary">{totalTTC.toFixed(3)}</Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openValidate} onClose={() => setOpenValidate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Valider la facture N°{validateInvoiceId}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            Êtes-vous sûr de vouloir valider cette facture ? Cette action est irréversible.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            label="Commentaire (optionnel)"
            value={validateComment}
            onChange={e => setValidateComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenValidate(false)}>Annuler</Button>
          <Button variant="contained" color="success" onClick={handleConfirmValidate}>
            Confirmer la validation
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier la facture N°{editInvoice?.id}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel>État</InputLabel>
                <Select value={editState} label="État" onChange={e => setEditState(e.target.value)}>
                  <MenuItem value="Payé">Payé</MenuItem>
                  <MenuItem value="En attente">En attente</MenuItem>
                  <MenuItem value="Annulé">Annulé</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {authorizedCosts.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Autres frais</InputLabel>
                  <Select
                    multiple
                    value={editCosts}
                    onChange={e => setEditCosts(e.target.value as number[])}
                    input={<OutlinedInput label="Autres frais" />}
                    renderValue={selected => selected.map(id => authorizedCosts.find(c => c.id === id)?.name).join(', ')}
                    MenuProps={MenuProps}
                  >
                    {authorizedCosts.map(c => (
                      <MenuItem key={c.id} value={c.id}>
                        <Checkbox checked={editCosts.includes(c.id)} />
                        <ListItemText primary={`${c.name} (${c.price?.toFixed(3) ?? 0})`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleUpdate}>Enregistrer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouvelle facture</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Réparation</InputLabel>
                <Select
                  value={selectedRepairId ?? ''}
                  label="Réparation"
                  onChange={e => handleRepairSelect(Number(e.target.value))}
                >
                  {eligibleRepairs.map(r => (
                    <MenuItem key={r.id} value={r.id}>
                      #{r.id} — {r.customer?.name ?? '-'} — {r.device?.model?.brand?.name} {r.device?.model?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {repairDetails && (
              <>
                {repairDetails.parts.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" gutterBottom>Pièces détachées</Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Pièce</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">Prix</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {repairDetails.parts.map(p => (
                            <TableRow key={p.partId}>
                              <TableCell>{p.partName}</TableCell>
                              <TableCell align="right">{p.price.toFixed(3)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Main d'œuvre</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {repairDetails.levelRepairPrice.toFixed(3)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}

                {authorizedCosts.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Autres frais</InputLabel>
                      <Select
                        multiple
                        value={selectedCosts}
                        onChange={e => setSelectedCosts(e.target.value as number[])}
                        input={<OutlinedInput label="Autres frais" />}
                        renderValue={selected => selected.map(id => authorizedCosts.find(c => c.id === id)?.name).join(', ')}
                        MenuProps={MenuProps}
                      >
                        {authorizedCosts.map(c => (
                          <MenuItem key={c.id} value={c.id}>
                            <Checkbox checked={selectedCosts.includes(c.id)} />
                            <ListItemText primary={`${c.name} (${c.price?.toFixed(3) ?? 0})`} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <Card variant="outlined" sx={{ bgcolor: 'grey.50', p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>Récapitulatif</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography>Pièces</Typography>
                      <Typography>{(repairDetails.partsTotal ?? 0).toFixed(3)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography>Main d'œuvre</Typography>
                      <Typography>{(repairDetails.levelRepairPrice ?? 0).toFixed(3)}</Typography>
                    </Box>
                    {selectedCosts.length > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography>Autres frais</Typography>
                        <Typography>
                          {authorizedCosts.filter(c => selectedCosts.includes(c.id))
                            .reduce((s, c) => s + (c.price ?? 0), 0).toFixed(3)}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography>Sous-total HT</Typography>
                      <Typography>{totalHT.toFixed(3)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography>TVA ({tva.toFixed(0)}%)</Typography>
                      <Typography>{tvaAmount.toFixed(3)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography>Timbre fiscale</Typography>
                      <Typography>{timbre.toFixed(3)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                      <Typography variant="h6" fontWeight={700}>Total TTC</Typography>
                      <Typography variant="h6" fontWeight={700} color="primary">{totalTTC.toFixed(3)}</Typography>
                    </Box>
                  </Card>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Annuler</Button>
          <Button variant="contained" disabled={!selectedRepairId} onClick={handleCreate}>
            Créer la facture
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
