import { API, API_BASE_URL } from '../../services/api';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Button, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Paper, Checkbox, ListItemText, OutlinedInput
} from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';


interface AllPartItem {
  id: number;
  description?: string;
}

interface SaleItem {
  allPartId: number;
  allPartName: string;
  quantity: number;
  unitPrice?: number;
}

interface ApproveStockItem {
  id: number;
  type?: string;
  state?: string;
  idPartRepair?: number;
}

interface CustomerInfo {
  id: number;
  name?: string;
  phone?: number;
}

interface SaleItemRow {
  id: number;
  date: string;
  state: string;
  totalPrice?: number;
  user?: { id: number; name?: string };
  allPart?: AllPartItem[];
  approveStock?: ApproveStockItem[];
  details?: { items: SaleItem[] };
  validatedBy?: { id: number; name?: string };
  validatedAt?: string;
  confirmedBy?: { id: number; name?: string };
  confirmedAt?: string;
  customer?: CustomerInfo;
}

const MenuProps = {
  PaperProps: { style: { maxHeight: 48 * 4.5 + 8, width: 250 } },
};

export default function Sales() {
  const userr = useSelector((state: RootState) => state.auth.user);
  const branchId = typeof userr?.branch === 'object' ? (userr.branch as any).id : userr?.branch;

  const [sales, setSales] = useState<SaleItemRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterState, setFilterState] = useState('');

  const [openCreate, setOpenCreate] = useState(false);
  const [accessories, setAccessories] = useState<AllPartItem[]>([]);
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [openEdit, setOpenEdit] = useState(false);
  const [editSale, setEditSale] = useState<SaleItemRow | null>(null);
  const [editAccessoryIds, setEditAccessoryIds] = useState<number[]>([]);
  const [editQuantities, setEditQuantities] = useState<{ [key: number]: number }>({});
  const [editState, setEditState] = useState('');
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');

  const [openValidate, setOpenValidate] = useState(false);
  const [validateSaleId, setValidateSaleId] = useState<number | null>(null);
  const [validateError, setValidateError] = useState('');

  const [stockDialogSaleId, setStockDialogSaleId] = useState<number | null>(null);
  const [openStockDialog, setOpenStockDialog] = useState(false);
  const [stockParts, setStockParts] = useState<any[]>([]);
  const [selectedStockPartIds, setSelectedStockPartIds] = useState<number[]>([]);
  const [defectBins, setDefectBins] = useState<any[]>([]);
  const [selectedDefectBinId, setSelectedDefectBinId] = useState<number>('');
  const [confirmingStock, setConfirmingStock] = useState(false);
  const [stockConfirmed, setStockConfirmed] = useState(false);
  const [saleRequestedItems, setSaleRequestedItems] = useState<{ allPartId: number; allPartName: string; quantity: number }[]>([]);

  const [company, setCompany] = useState<any>({});

  useEffect(() => {
    API.get('company').then(r => setCompany(r.data.data?.[0] ?? {})).catch(() => {});
  }, []);

  const tva = company?.tva ?? 0;
  const timbreFiscale = company?.timbreFiscale ?? 0;

  const calcTTC = (sale: SaleItemRow) => {
    const items: SaleItem[] = (sale.details as any)?.items ?? [];
    const totalHT = items.reduce((s, it) => s + (it.unitPrice ?? 0) * (it.quantity ?? 1), 0);
    return totalHT * (1 + tva / 100) + timbreFiscale;
  };

  const fetchSales = useCallback(async () => {
    if (!branchId) return;
    setLoading(true);
    try {
      const res = await API.get(`sales/findByBranch/${branchId}`);
      setSales(res.data.data ?? []);
    } catch {
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => { fetchSales() }, [fetchSales]);

  const fetchAccessories = async () => {
    try {
      const res = await API.get('sales/accessories');
      setAccessories(res.data.data ?? []);
    } catch { }
  };

  const handleOpenCreate = async () => {
    setOpenCreate(true);
    setSelectedAccessoryIds([]);
    setQuantities({});
    setCustomerName('');
    setCustomerPhone('');
    await fetchAccessories();
  };

  const handleCreate = async () => {
    if (!userr?.id || !selectedAccessoryIds.length) return;
    const qtyList = selectedAccessoryIds.map(id => quantities[id] || 1);
    try {
      await API.post('sales', {
        state: 'En attente',
        user: userr.id,
        date: new Date().toISOString(),
        allPartIds: selectedAccessoryIds,
        quantities: qtyList,
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
      });
      setOpenCreate(false);
      fetchSales();
    } catch { }
  };

  const handleOpenEdit = async (sale: SaleItemRow) => {
    setEditSale(sale);
    setEditState(sale.state ?? '');
    const ids = (sale.allPart ?? []).map(ap => ap.id);
    setEditAccessoryIds(ids);
    const qtyMap: { [key: number]: number } = {};
    const items = (sale.details as any)?.items ?? [];
    items.forEach((item: any) => { qtyMap[item.allPartId] = item.quantity ?? 1; });
    ids.forEach(id => { if (!qtyMap[id]) qtyMap[id] = 1; });
    setEditQuantities(qtyMap);
    setEditCustomerName(sale.customer?.name ?? '');
    setEditCustomerPhone(sale.customer?.phone?.toString() ?? '');
    setOpenEdit(true);
    await fetchAccessories();
  };

  const handleUpdate = async () => {
    if (!editSale) return;
    const qtyList = editAccessoryIds.map(id => editQuantities[id] || 1);
    try {
      await API.patch(`sales/${editSale.id}`, {
        state: editState,
        allPartIds: editAccessoryIds,
        quantities: qtyList,
        customerName: editCustomerName || undefined,
        customerPhone: editCustomerPhone || undefined,
      });
      setOpenEdit(false);
      setEditSale(null);
      fetchSales();
    } catch { }
  };

  const handleValidate = (saleId: number) => {
    setValidateSaleId(saleId);
    setValidateError('');
    setOpenValidate(true);
  };

  const handleConfirmValidate = async () => {
    if (!validateSaleId) return;
    try {
      await API.patch(`sales/validate/${validateSaleId}`, { adminId: userr?.id });
      setOpenValidate(false);
      setValidateSaleId(null);
      fetchSales();
    } catch (err: any) {
      setValidateError(err.response?.data?.message || 'Erreur lors de la validation');
    }
  };

  const handleOpenStockDialog = async (saleId: number, items: { allPartId: number; allPartName: string; quantity: number }[]) => {
    setStockDialogSaleId(saleId);
    setSelectedStockPartIds([]);
    setSelectedDefectBinId(0);
    setStockConfirmed(false);
    setSaleRequestedItems(items);
    try {
      const [stockRes, binsRes] = await Promise.all([
        API.get(`sales/stock-parts/${saleId}/${branchId}`),
        API.get(`bin/find/${branchId}/Défectueux`),
      ]);
      setStockParts(stockRes.data.data ?? []);
      setDefectBins(binsRes.data.data ?? []);
    } catch {
      setStockParts([]);
      setDefectBins([]);
    }
    setOpenStockDialog(true);
  };

  const handleConfirmStockMovement = async () => {
    if (!stockDialogSaleId || !selectedDefectBinId || !selectedStockPartIds.length || !userr?.id) return;
    setConfirmingStock(true);
    try {
      await API.patch('sales/stock-parts/batch-change-bin', {
        stockPartIds: selectedStockPartIds,
        binId: selectedDefectBinId,
        userId: userr.id,
        saleId: stockDialogSaleId,
      });
      setStockConfirmed(true);
      fetchSales();
    } catch { }
    setConfirmingStock(false);
  };

  const toggleStockPart = (id: number) => {
    setSelectedStockPartIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filteredSales = sales.filter(s => !filterState || s.state === filterState);

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Typography variant="h4" fontWeight={600}>Ventes</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'right', mb: 3, width: '100%', marginLeft: '70%' }}>
        <Button variant="outlined" onClick={handleOpenCreate}
          sx={{
            borderColor: 'primary.dark', color: 'primary.main',
            '&:hover': { borderColor: 'primary.dark', color: 'primary.light' },
          }}>
          Nouvelle vente
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filtrer par état</InputLabel>
          <Select value={filterState} label="Filtrer par état" onChange={e => setFilterState(e.target.value)}>
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="En attente">En attente</MenuItem>
            <MenuItem value="Confirmé">Confirmé</MenuItem>
            <MenuItem value="Validé">Validé</MenuItem>
            <MenuItem value="Annulé">Annulé</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
      ) : filteredSales.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ py: 6 }}>Aucune vente</Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>N° Vente</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Créée par</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Accessoires</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total HT</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total TTC</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>État</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Validée par</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSales.map(s => {
                const items = (s.details as any)?.items ?? [];
                const totalQty = items.reduce((sum: number, it: any) => sum + (it.quantity ?? 1), 0);
                const confirmedQty = items.reduce((sum: number, it: any) => {
                  const ap = (s.approveStock ?? []).find(a => a.idPartRepair === it.allPartId);
                  return sum + (ap?.state === 'Confirmé' ? (it.quantity ?? 1) : 0);
                }, 0);
                const totalHT = items.reduce((sum: number, it: any) => sum + (it.unitPrice ?? 0) * (it.quantity ?? 1), 0);
                const totalTTC = totalHT * (1 + tva / 100) + timbreFiscale;
                return (
                <TableRow key={s.id} hover>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{new Date(s.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{s.user?.name ?? '-'}</TableCell>
                  <TableCell>
                    {s.customer ? (
                      <Typography variant="body2">
                        {s.customer.name}{s.customer.phone ? ` (${s.customer.phone})` : ''}
                      </Typography>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const items = (s.details as any)?.items ?? s.allPart?.map(ap => ({ allPartName: ap.description, quantity: 1 })) ?? [];
                      return items.map((item: any, i: number) => (
                        <Typography key={i} variant="body2">
                          {item.quantity}x {item.allPartName}{item.unitPrice != null ? ` (${item.unitPrice.toFixed(3)} DT)` : ''}
                        </Typography>
                      ));
                    })()}
                  </TableCell>
                  <TableCell>
                    {totalQty > 0 ? (
                      <Chip
                        label={`${confirmedQty}/${totalQty}`}
                        size="small"
                        color={confirmedQty === totalQty ? 'success' : 'warning'}
                        onClick={userr?.role?.some(r => r === 'Administrateur' || r === 'Gestionnaire_de_stocks') && !s.confirmedAt ? () => handleOpenStockDialog(s.id, (s.details as any)?.items ?? []) : undefined}
                      />
                    ) : (
                      <Chip label="-" size="small" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell align="right">{totalHT.toFixed(3)}</TableCell>
                  <TableCell align="right"><strong>{totalTTC.toFixed(3)}</strong></TableCell>
                  <TableCell>
                    <Chip label={s.state} size="small" color={s.state === 'Validé' ? 'success' : s.state === 'Confirmé' ? 'info' : 'warning'} />
                  </TableCell>
                  <TableCell>{s.validatedBy?.name ?? '-'}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                      {s.state !== 'Confirmé' && s.state !== 'Validé' && (
                        <Button size="small" variant="text" onClick={() => handleOpenEdit(s)}>Modifier</Button>
                      )}
                      {userr?.role?.includes('Administrateur') && s.state === 'Confirmé' && (
                        <Button size="small" variant="contained" color="success" onClick={() => handleValidate(s.id)}>
                          Valider
                        </Button>
                      )}
                      {(s.state === 'Confirmé' || s.state === 'Validé') && (
                        <Button size="small" variant="outlined" onClick={() => window.open(`${API_BASE_URL}/sales/pdf/${s.id}`, '_blank')}>
                          PDF
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openValidate} onClose={() => setOpenValidate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Valider la vente N°{validateSaleId}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Êtes-vous sûr de vouloir valider cette vente ?
          </Typography>
          {validateError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>{validateError}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenValidate(false)}>Annuler</Button>
          <Button variant="contained" color="success" onClick={handleConfirmValidate}>Confirmer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openStockDialog} onClose={() => setOpenStockDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Confirmation stock — Vente N°{stockDialogSaleId}</DialogTitle>
        <DialogContent>
          {stockConfirmed ? (
            <Typography color="success.main" sx={{ py: 2 }}>
              Mouvement de stock confirmé avec succès ({selectedStockPartIds.length} pièce(s) transférée(s) vers le bin défectueux).
            </Typography>
          ) : stockParts.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 2 }}>Aucune pièce en stock disponible</Typography>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Sélectionnez les pièces en stock à transférer vers le bin défectueux :
              </Typography>

              {(() => {
                const selectedByAllPart: Record<number, number> = {};
                selectedStockPartIds.forEach(id => {
                  const sp = stockParts.find(p => p.id === id);
                  if (sp?.allPart?.id) selectedByAllPart[sp.allPart.id] = (selectedByAllPart[sp.allPart.id] ?? 0) + 1;
                });
                let allMatch = true;
                const rows: { id: number; name: string; requested: number; selected: number }[] = saleRequestedItems.map(item => {
                  const selected = selectedByAllPart[item.allPartId] ?? 0;
                  if (selected !== item.quantity) allMatch = false;
                  return { id: item.allPartId, name: item.allPartName, requested: item.quantity, selected };
                });
                return (
                  <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {rows.map(r => (
                      <Chip
                        key={r.id}
                        label={`${r.name}: ${r.selected}/${r.requested}`}
                        color={r.selected === r.requested ? 'success' : (r.selected > r.requested ? 'error' : 'warning')}
                        size="small"
                      />
                    ))}
                  </Box>
                );
              })()}

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox" />
                      <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Nom pièce</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Référence</TableCell>
                      <TableCell sx={{ fontWeight: 600 }} align="right">Prix HT</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Bin actuel</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stockParts.map(sp => (
                      <TableRow key={sp.id} hover selected={selectedStockPartIds.includes(sp.id)} onClick={() => toggleStockPart(sp.id)} sx={{ cursor: 'pointer' }}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedStockPartIds.includes(sp.id)} />
                        </TableCell>
                        <TableCell>{sp.id}</TableCell>
                        <TableCell>{sp.allPart?.description ?? '-'}</TableCell>
                        <TableCell>{sp.reference?.materialCode ?? '-'}</TableCell>
                        <TableCell align="right">{sp.price != null ? `${sp.price.toFixed(3)} DT` : '-'}</TableCell>
                        <TableCell>{sp.bin?.name ?? '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {defectBins.length > 0 && (
                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <InputLabel>Bin défectueux de destination</InputLabel>
                  <Select value={selectedDefectBinId} label="Bin défectueux de destination" onChange={e => setSelectedDefectBinId(Number(e.target.value))}>
                    <MenuItem value={0} disabled>Choisir un bin</MenuItem>
                    {defectBins.map(b => (
                      <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {!defectBins.length && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  Aucun bin défectueux trouvé pour cette agence.
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStockDialog(false)}>Fermer</Button>
          {!stockConfirmed && (
            <Button
              variant="contained"
              disabled={!selectedStockPartIds.length || !selectedDefectBinId || confirmingStock || saleRequestedItems.some(item => {
                const selected = selectedStockPartIds.filter(id => {
                  const sp = stockParts.find(p => p.id === id);
                  return sp?.allPart?.id === item.allPartId;
                }).length;
                return selected !== item.quantity;
              })}
              onClick={handleConfirmStockMovement}
            >
              {confirmingStock ? 'Confirmation...' : 'Confirmer le mouvement'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth>
        <DialogTitle>Modifier la vente N°{editSale?.id}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth size="small" label="Nom client" value={editCustomerName}
                onChange={e => setEditCustomerName(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth size="small" label="Tél client" type="number" value={editCustomerPhone}
                onChange={e => setEditCustomerPhone(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel>État</InputLabel>
                <Select value={editState} label="État" onChange={e => setEditState(e.target.value)}>
                  <MenuItem value="En attente">En attente</MenuItem>
                  <MenuItem value="Validé">Validé</MenuItem>
                  <MenuItem value="Annulé">Annulé</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Accessoires</InputLabel>
                <Select
                  multiple
                  value={editAccessoryIds}
                  onChange={e => {
                    const ids = e.target.value as number[];
                    setEditAccessoryIds(ids);
                    const newQty = { ...editQuantities };
                    ids.forEach(id => { if (!newQty[id]) newQty[id] = 1; });
                    setEditQuantities(newQty);
                  }}
                  input={<OutlinedInput label="Accessoires" />}
                  renderValue={selected => selected.map(id => accessories.find(a => a.id === id)?.description).join(', ')}
                  MenuProps={MenuProps}
                >
                  {accessories.map(a => (
                    <MenuItem key={a.id} value={a.id}>
                      <Checkbox checked={editAccessoryIds.includes(a.id)} />
                      <ListItemText primary={a.description} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {editAccessoryIds.map(id => {
              const name = accessories.find(a => a.id === id)?.description ?? `Pièce #${id}`;
              return (
                <Grid key={id} size={{ xs: 6, md: 4 }}>
                  <TextField
                    fullWidth size="small"
                    label={`Qté: ${name}`}
                    type="number"
                    value={editQuantities[id] ?? 1}
                    onChange={e => setEditQuantities({ ...editQuantities, [id]: Math.max(1, parseInt(e.target.value) || 1) })}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleUpdate}>Enregistrer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouvelle vente</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth size="small" label="Nom client" value={customerName}
                onChange={e => setCustomerName(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth size="small" label="Tél client" type="number" value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Accessoires</InputLabel>
                <Select
                  multiple
                  value={selectedAccessoryIds}
                  onChange={e => {
                    const ids = e.target.value as number[];
                    setSelectedAccessoryIds(ids);
                    const newQty = { ...quantities };
                    ids.forEach(id => { if (!newQty[id]) newQty[id] = 1; });
                    setQuantities(newQty);
                  }}
                  input={<OutlinedInput label="Accessoires" />}
                  renderValue={selected => selected.map(id => accessories.find(a => a.id === id)?.description).join(', ')}
                  MenuProps={MenuProps}
                >
                  {accessories.map(a => (
                    <MenuItem key={a.id} value={a.id}>
                      <Checkbox checked={selectedAccessoryIds.includes(a.id)} />
                      <ListItemText primary={a.description} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {selectedAccessoryIds.map(id => {
              const name = accessories.find(a => a.id === id)?.description ?? `Pièce #${id}`;
              return (
                <Grid key={id} size={{ xs: 6, md: 4 }}>
                  <TextField
                    fullWidth size="small"
                    label={`Qté: ${name}`}
                    type="number"
                    value={quantities[id] ?? 1}
                    onChange={e => setQuantities({ ...quantities, [id]: Math.max(1, parseInt(e.target.value) || 1) })}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Annuler</Button>
          <Button variant="contained" disabled={!selectedAccessoryIds.length} onClick={handleCreate}>
            Créer la vente
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}