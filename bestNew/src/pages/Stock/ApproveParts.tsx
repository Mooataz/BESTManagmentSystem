import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import { useAppDispatch } from '../../Redux/hooks';
import {
  getApproveStockByBranch,
  updateApproveStockState,
  getAvailableParts,
  confirmApprovePart,
} from '../../Redux/Actions/Reception/repairAction';
import type { ApproveStockItem, AvailableStockPart } from '../../Redux/Actions/Reception/repairAction';
import { getAllPart } from '../../Redux/Actions/Administration/ListAllPart';
import type { FormAllParts } from '../../Redux/Types/administrationTypes';
import { Autocomplete, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import { useNotification } from '../../Componants/NotificationContext';
import DynamicTable from '../../Componants/Global/TableComponat';
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true,
});

export default function ApproveParts() {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const user = useSelector((state: RootState) => state.auth.user);
  const [items, setItems] = useState<ApproveStockItem[]>([]);
  const [allParts, setAllParts] = useState<FormAllParts[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedApproveStockId, setSelectedApproveStockId] = useState<number | null>(null);
  const [availableParts, setAvailableParts] = useState<AvailableStockPart[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
  const [loadingParts, setLoadingParts] = useState(false);
  const [defectBins, setDefectBins] = useState<{ id: number; name: string }[]>([]);
  const [selectedBinId, setSelectedBinId] = useState<number | null>(null);

  const visibleColumns = ['reparation', 'garantie', 'technicien', 'piece', 'date', 'serialenumber', 'brand', 'model', 'lastStep'];

  const handleFilterChange = (col: string, value: string) => {
    setFilters(prev => ({ ...prev, [col]: value }));
  };

  const branchId = useMemo(() => {
    if (user?.branch) return typeof user.branch === 'object' ? user.branch.id : user.branch;
    return undefined;
  }, [user]);

  const fetchItems = () => {
    if (!branchId) return;
    setLoading(true);
    dispatch(getApproveStockByBranch(branchId)).then((res) => {
      if (getApproveStockByBranch.fulfilled.match(res)) {
        setItems(res.payload);
      } else {
        setItems([]);
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
    dispatch(getAllPart()).then((res) => {
      if (getAllPart.fulfilled.match(res)) {
        setAllParts(res.payload);
      }
    });
  }, [dispatch, branchId]);

  const getLastStep = (history: any[] = []) => {
    if (!Array.isArray(history) || history.length === 0) return '-';
    const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted[0]?.step ?? '-';
  };

  const tableRows = useMemo(() =>
    items.map((item) => {
      const warrenty = item.repair?.warrenty;
      const history = item.repair?.historyRepair;
      const dateObj = item.date ? new Date(item.date) : null;
      return {
        id: item.id,
        reparation: item.repair?.id ?? '-',
        garantie: warrenty === true ? 'Sous garantie' : warrenty === false ? 'Hors garantie' : '-',
        technicien: item.repair?.user?.name ?? '-',
        piece: allParts.find((p) => p.id === Number(item.idPartRepair))?.description ?? `Pièce #${item.idPartRepair}`,
        etat: item.state,
        date: dateObj ? dateObj.toLocaleString() : '-',
        _dateOnly: dateObj ? dateObj.toLocaleDateString() : '-',
        serialenumber: item.repair?.device?.serialenumber ?? '-',
        brand: item.repair?.device?.model?.brand?.name ?? '-',
        model: item.repair?.device?.model?.name ?? '-',
        lastStep: getLastStep(history),
      };
    }),
  [items, allParts]);

  const filterOptions = useMemo(() => {
    const opts: Record<string, string[]> = {};
    visibleColumns.forEach((col) => {
      const values = tableRows.map((r) => {
        if (col === 'date') return String((r as any)['_dateOnly'] ?? '');
        const raw = String((r as any)[col] ?? '');
        return raw;
      }).filter(Boolean);
      opts[col] = [...new Set(values)].sort();
    });
    return opts;
  }, [tableRows]);

  const filteredRows = useMemo(() => {
    return tableRows.filter((row) =>
      visibleColumns.every((col) => {
        const fv = filters[col]?.toLowerCase() ?? '';
        if (!fv) return true;
        const raw = col === 'date' ? String((row as any)['_dateOnly'] ?? '') : String((row as any)[col] ?? '');
        return raw.toLowerCase().includes(fv);
      })
    );
  }, [tableRows, filters]);

  const handleStateChange = async (id: number, newState: string) => {
    if (newState === 'Confirmer') {
      setLoadingParts(true);
      const [partsResult, binsResult] = await Promise.all([
        dispatch(getAvailableParts({ approveStockId: id, branchId: branchId! })),
        API.get(`bin/find/${branchId}/Défectueux`),
      ]);
      if (getAvailableParts.fulfilled.match(partsResult) && partsResult.payload.length > 0) {
        setAvailableParts(partsResult.payload);
        setDefectBins(binsResult.data?.data ?? []);
        setSelectedApproveStockId(id);
        setSelectedPartId(null);
        setSelectedBinId(null);
        setConfirmDialogOpen(true);
      } else {
        notify('Aucune pièce disponible en stock pour cette réparation', 'error');
      }
      setLoadingParts(false);
      return;
    }
    const oldState = items.find((item) => item.id === id)?.state;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, state: newState } : item))
    );
    const result = await dispatch(updateApproveStockState({ id, state: newState }));
    if (updateApproveStockState.fulfilled.match(result)) {
      notify('État mis à jour', 'success');
    } else {
      if (oldState !== undefined) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, state: oldState } : item))
        );
      }
      notify('Erreur de mise à jour', 'error');
    }
  };

  const handleConfirmPart = async () => {
    if (!selectedPartId || !selectedApproveStockId || !selectedBinId || !user?.id) return;
    const result = await dispatch(confirmApprovePart({
      approveStockId: selectedApproveStockId,
      stockPartId: selectedPartId,
      binDefectId: selectedBinId,
      userId: typeof user.id === 'number' ? user.id : Number(user.id),
    }));
    if (confirmApprovePart.fulfilled.match(result)) {
      notify('Pièce confirmée et stock mis à jour', 'success');
      setConfirmDialogOpen(false);
      setAvailableParts([]);
      setSelectedPartId(null);
      setSelectedApproveStockId(null);
      setSelectedBinId(null);
      fetchItems();
    } else {
      notify('Erreur lors de la confirmation de la pièce', 'error');
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialogOpen(false);
    setAvailableParts([]);
    setSelectedPartId(null);
    setSelectedApproveStockId(null);
    setSelectedBinId(null);
    setDefectBins([]);
  };

  return (
    <Card sx={{ p: 3, width: '100%' }}>
      <Typography variant="h5" mb={2}>
        Pièces en approbation
      </Typography>
      {!branchId && (
        <Typography color="text.secondary">
          Aucune agence sélectionnée
        </Typography>
      )}
      {branchId && (loading && items.length === 0 ? (
        <Typography color="text.secondary">Chargement...</Typography>
      ) : (
        <>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {visibleColumns.map((col) => (
            <Autocomplete
              key={col}
              options={filterOptions[col] ?? []}
              value={filters[col] ?? null}
              onChange={(_e, val) => handleFilterChange(col, val ?? '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={({ 'reparation': 'Réparation #', 'garantie': 'Garantie', 'technicien': 'Technicien', 'piece': 'Pièce', 'date': 'Date', 'serialenumber': 'Imei', 'brand': 'Marque', 'model': 'Modèle', 'lastStep': 'Dernier état' } as Record<string, string>)[col] || col}
                  size="small"
                />
              )}
              sx={{ minWidth: 150 }}
              disableClearable={false}
              freeSolo
              size="small"
            />
          ))}
        </Box>
        <DynamicTable
          rows={filteredRows}
          columnLabels={{
                            'reparation': 'Réparation #',
                            'garantie': 'Garantie',
                            'technicien': 'Technicien',
                            'piece': 'Pièce',
                            'etat': 'État',
                            'date': 'Date',
                            'serialenumber': 'Imei',
                            'brand': 'Marque',
                            'model': 'Modèle',
                            'lastStep': 'Dernier état',
          }}
          columnsToShow={visibleColumns}
          actions={(row: any) => {
            const isEnabled = row.lastStep === 'On réparation';
            return [{
              icon: (
                <Select
                  value={row.etat ?? ''}
                  onChange={(e) => handleStateChange(row.id, e.target.value)}
                  size="small"
                  disabled={!isEnabled}
                >
                  <MenuItem value="En cours">En cours</MenuItem>
                  <MenuItem value="En attente">En attente</MenuItem>
                  <MenuItem value="Confirmer">Confirmer</MenuItem>
                  <MenuItem value="Pas disponible">Pas disponible</MenuItem>
                </Select>
              ),
              onClick: () => {},
            }];
          }}
        />
        <Dialog open={confirmDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Confirmer la pièce en stock</DialogTitle>
          <DialogContent>
            {loadingParts ? (
              <Typography>Chargement des pièces disponibles...</Typography>
            ) : availableParts.length === 0 ? (
              <Typography>Aucune pièce disponible</Typography>
            ) : (
              <>
                <Typography variant="subtitle2" gutterBottom>1. Sélectionner la pièce en stock</Typography>
                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <RadioGroup value={selectedPartId ?? ''} onChange={(e) => setSelectedPartId(Number(e.target.value))}>
                    {availableParts.map((part) => (
                      <FormControlLabel
                        key={part.id}
                        value={part.id}
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Typography variant="body2">
                              <strong>Réf:</strong> {part.reference?.materialCode ?? '-'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Série:</strong> {part.serialnumber ?? '-'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Bin:</strong> {part.bin?.name ?? '-'}
                            </Typography>
                          </Box>
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
                {selectedPartId && (
                  <>
                    <Typography variant="subtitle2" gutterBottom>2. Choisir le bin défectueux de destination</Typography>
                    <Autocomplete
                      options={defectBins}
                      getOptionLabel={(option) => option.name}
                      value={defectBins.find((b) => b.id === selectedBinId) ?? null}
                      onChange={(_e, val) => setSelectedBinId(val?.id ?? null)}
                      renderInput={(params) => (
                        <TextField {...params} label="Bin défectueux" size="small" />
                      )}
                      fullWidth
                    />
                  </>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button onClick={handleConfirmPart} variant="contained" disabled={!selectedPartId || !selectedBinId}>
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>
      </>
      ))}
    </Card>
  );
}
