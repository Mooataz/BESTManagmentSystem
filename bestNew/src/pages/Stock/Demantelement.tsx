import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../Redux/hooks';
import type { RootState } from '../../Redux/store';
import { getModelsAuthorised, getOneModel } from '../../Redux/Actions/ModelAndAccessory/Models';
import { findByBranchType } from '../../Redux/Actions/stock/Bin';
import axios from 'axios';
import {
  Autocomplete, Box, Button, Card, CircularProgress,
  Table, TableBody, TableCell, TableHead, TableRow,
  TextField, Typography, Chip
} from '@mui/material';
import { useNotification } from '../../Componants/NotificationContext';

const API = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true,
});

export default function Demantelement() {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const user = useSelector((state: RootState) => state.auth.user);
  const models = useSelector((state: RootState) => state.models.models);
  const oneModel = useSelector((state: RootState) => state.models.Onemodel);

  const branchId = useMemo(() => {
    if (user?.branch) return typeof user.branch === 'object' ? user.branch.id : user.branch;
    return undefined;
  }, [user]);

  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [stockParts, setStockParts] = useState<any[]>([]);
  const [defectBins, setDefectBins] = useState<any[]>([]);
  const [goodBins, setGoodBins] = useState<any[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<number | null>(null);
  const [selectedBinId, setSelectedBinId] = useState<number | null>(null);
  const [dismantled, setDismantled] = useState(false);
  const [dismantledOriginalId, setDismantledOriginalId] = useState<number | null>(null);
  const [loadingParts, setLoadingParts] = useState(false);
  const [dismantling, setDismantling] = useState(false);
  const [references, setReferences] = useState<Record<number, any[]>>({});
  const [partConfigs, setPartConfigs] = useState<Record<number, { referenceId: number | null; binId: number | null; serialNumber: string }>>({});
  const [creating, setCreating] = useState(false);

  const allparts = useMemo(() => {
    if (!oneModel?.allpart || !Array.isArray(oneModel.allpart)) return [];
    return oneModel.allpart;
  }, [oneModel]);

  const displayParts = useMemo(() => {
    return allparts.filter((p: any) => {
      const desc = (p.description ?? '').toLowerCase();
      return !(desc.includes('appareil') && desc.includes('complet'));
    });
  }, [allparts]);

  const isCarteMere = (part: any) => {
    const desc = (part.description ?? '').toLowerCase();
    return desc.includes('carte') && desc.includes('mère');
  };

  useEffect(() => {
    dispatch(getModelsAuthorised());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedModelId) return;
    setStockParts([]);
    setDismantled(false);
    setDismantledOriginalId(null);
    dispatch(getOneModel(selectedModelId));
  }, [selectedModelId, dispatch]);

  const loadStockParts = async () => {
    if (!selectedModelId || !branchId) return;
    setLoadingParts(true);
    try {
      const res = await API.get(`stock-parts/demantelement/${selectedModelId}/${branchId}`);
      setStockParts(res.data.data ?? []);
    } catch {
      setStockParts([]);
      notify('Erreur chargement pièces', 'error');
    } finally {
      setLoadingParts(false);
    }
  };

  useEffect(() => {
    if (selectedModelId && branchId) {
      loadStockParts();
    }
  }, [selectedModelId, branchId]);

  const loadBins = async (type: string) => {
    if (!branchId) return [];
    try {
      const res = await API.get(`bin/find/${branchId}/${type}`);
      return res.data.data ?? [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (!branchId) return;
    loadBins('Défectueux').then(setDefectBins);
    loadBins('Bon').then(setGoodBins);
  }, [branchId]);

  const handleDismantle = async () => {
    if (!selectedPartId || !selectedBinId || !user?.id) {
      notify('Sélectionner une pièce et un bin', 'warning');
      return;
    }
    const sourceSerial = stockParts.find(p => p.id === selectedPartId)?.serialNumber ?? '';
    setDismantling(true);
    try {
      await API.post(`stock-parts/dismantle/${selectedPartId}`, {
        binId: selectedBinId,
        userId: typeof user.id === 'number' ? user.id : Number(user.id),
      });
      notify('Démantèlement réussi', 'success');
      setDismantled(true);
      setDismantledOriginalId(selectedPartId);
      setSelectedPartId(null);
      setSelectedBinId(null);
      loadStockParts();
      // Auto-fill Carte mère serial number
      displayParts.forEach((p: any) => {
        if (isCarteMere(p)) {
          updatePartConfig(p.id, 'serialNumber', sourceSerial);
        }
      });
    } catch {
      notify('Erreur lors du démantèlement', 'error');
    } finally {
      setDismantling(false);
    }
  };

  const loadReferences = async (allpartId: number) => {
    if (!selectedModelId) return;
    try {
      const res = await API.get(`references/getCompatibleReferences/${selectedModelId}/${allpartId}`);
      setReferences(prev => ({ ...prev, [allpartId]: res.data.data ?? [] }));
    } catch {
      setReferences(prev => ({ ...prev, [allpartId]: [] }));
    }
  };

  useEffect(() => {
    if (!dismantled || !selectedModelId) return;
    allparts.forEach((p: any) => {
      if (p.id) loadReferences(p.id);
    });
  }, [dismantled, selectedModelId, allparts.length]);

  const updatePartConfig = (allpartId: number, field: string, value: any) => {
    setPartConfigs(prev => ({
      ...prev,
      [allpartId]: { ...prev[allpartId], [field]: value },
    }));
  };

  const handleCreateParts = async () => {
    if (!user?.id || !selectedModelId) return;
    const originalId = dismantledOriginalId;
    if (!originalId) {
      notify('Aucune pièce source', 'warning');
      return;
    }

    const items = displayParts
      .filter((p: any) => partConfigs[p.id]?.referenceId && partConfigs[p.id]?.binId && partConfigs[p.id]?.serialNumber)
      .map((p: any) => ({
        dto: {
          userId: typeof user.id === 'number' ? user.id : Number(user.id),
          reference: partConfigs[p.id].referenceId,
          bin: partConfigs[p.id].binId,
          serialNumber: partConfigs[p.id].serialNumber,
        },
        originalStockPartId: originalId,
      }));

    if (items.length === 0) {
      notify('Configurer pièce, référence, bin et N° série pour au moins une pièce', 'warning');
      return;
    }

    // Warn about incomplete entries
    const incomplete = displayParts.filter((p: any) =>
      partConfigs[p.id] && (!partConfigs[p.id].referenceId || !partConfigs[p.id].binId || !partConfigs[p.id].serialNumber)
    );
    if (incomplete.length > 0) {
      notify(`${incomplete.length} pièce(s) incomplète(s) ignorée(s)`, 'info');
    }

    setCreating(true);
    let successCount = 0;
    for (const item of items) {
      try {
        await API.post('stock-parts/create-dismantled', item);
        successCount++;
      } catch {
        notify(`Erreur création pièce`, 'error');
      }
    }
    if (successCount > 0) {
      notify(`${successCount} pièce(s) créée(s) avec succès`, 'success');
      setPartConfigs({});
    }
    setCreating(false);
  };

  if (!branchId) {
    return (
      <Card sx={{ p: 3, width: '100%' }}>
        <Typography>Aucune agence sélectionnée</Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3, width: '100%' }}>
      <Typography variant="h5" mb={3}>Démantèlement</Typography>

      {/* Step 1: Model Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>1. Sélectionner le modèle</Typography>
        <Autocomplete
          options={models}
          getOptionLabel={(opt: any) => `${opt.brand?.name ?? ''} ${opt.name ?? ''}`}
          value={models.find((m: any) => m.id === selectedModelId) ?? null}
          onChange={(_e, val) => setSelectedModelId(val?.id ?? null)}
          renderInput={(params) => <TextField {...params} label="Modèle" size="small" />}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {selectedModelId && (
        <>
          {/* Stock Parts Table */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              2. Pièces "Appareil complet" en stock
            </Typography>
            {loadingParts ? (
              <CircularProgress size={24} />
            ) : stockParts.length === 0 ? (
              <Typography color="text.secondary" variant="body2">Aucune pièce trouvée</Typography>
            ) : (
              <Table size="small" sx={{ mb: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Sélection</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>N° Série</TableCell>
                    <TableCell>Référence</TableCell>
                    <TableCell>Bin actuel</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockParts.map((sp: any) => (
                    <TableRow
                      key={sp.id}
                      hover
                      selected={selectedPartId === sp.id}
                      onClick={() => setSelectedPartId(sp.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Chip
                          label={selectedPartId === sp.id ? 'Sélectionné' : 'Choisir'}
                          color={selectedPartId === sp.id ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{sp.id}</TableCell>
                      <TableCell>{sp.serialNumber ?? '-'}</TableCell>
                      <TableCell>{sp.reference?.materialCode ?? '-'}</TableCell>
                      <TableCell>{sp.bin?.name ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {selectedPartId && !dismantled && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Autocomplete
                  options={defectBins}
                  getOptionLabel={(opt: any) => opt.name}
                  value={defectBins.find((b: any) => b.id === selectedBinId) ?? null}
                  onChange={(_e, val) => setSelectedBinId(val?.id ?? null)}
                  renderInput={(params) => <TextField {...params} label="Bin défectueux" size="small" />}
                  sx={{ minWidth: 250 }}
                />
                <Button
                  variant="contained"
                  onClick={handleDismantle}
                  disabled={!selectedBinId || dismantling}
                >
                  {dismantling ? <CircularProgress size={20} /> : 'Démantèler'}
                </Button>
              </Box>
            )}
          </Box>

          <hr />

          {/* Step 2: Create dismantled parts */}
          {dismantled && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                3. Créer les pièces détachées
              </Typography>

              {allparts.length === 0 ? (
                <Typography color="text.secondary" variant="body2">
                  Aucune pièce dans la liste du modèle
                </Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Pièce</TableCell>
                      <TableCell>Référence</TableCell>
                      <TableCell>Bin (Bon)</TableCell>
                      <TableCell>N° Série</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayParts.map((part: any) => (
                      <TableRow key={part.id}>
                        <TableCell>{part.description}</TableCell>
                        <TableCell sx={{ minWidth: 200 }}>
                          <Autocomplete
                            options={references[part.id] ?? []}
                            getOptionLabel={(opt: any) => `${opt.materialCode ?? ''} - ${opt.description ?? ''}`}
                            value={(references[part.id] ?? []).find((r: any) => r.id === partConfigs[part.id]?.referenceId) ?? null}
                            onChange={(_e, val) => updatePartConfig(part.id, 'referenceId', val?.id ?? null)}
                            renderInput={(params) => <TextField {...params} label="Référence" size="small" />}
                            size="small"
                            disabled={!references[part.id]}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 200 }}>
                          <Autocomplete
                            options={goodBins}
                            getOptionLabel={(opt: any) => opt.name}
                            value={goodBins.find((b: any) => b.id === partConfigs[part.id]?.binId) ?? null}
                            onChange={(_e, val) => updatePartConfig(part.id, 'binId', val?.id ?? null)}
                            renderInput={(params) => <TextField {...params} label="Bin" size="small" />}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {isCarteMere(part) ? (
                            <TextField
                              size="small"
                              value={partConfigs[part.id]?.serialNumber ?? ''}
                              disabled
                              InputProps={{ readOnly: true }}
                            />
                          ) : (
                            <TextField
                              size="small"
                              required
                              value={partConfigs[part.id]?.serialNumber ?? ''}
                              onChange={(e) => updatePartConfig(part.id, 'serialNumber', e.target.value)}
                              placeholder="N° série *"
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleCreateParts}
                  disabled={creating}
                >
                  {creating ? <CircularProgress size={20} /> : 'Créer les pièces'}
                </Button>
              </Box>
            </Box>
          )}
        </>
      )}
    </Card>
  );
}
