import { API } from '../../services/api';
import React, { useEffect, useMemo, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary,
  Box, Button, Card, CardContent, Checkbox, Chip, Dialog, DialogContent, DialogTitle, FormControl, Grid,
  IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import theme from '../../Theme/theme';
import ShowRepair from '../Reparation/ShowRepair';

interface TracabilityUser {
  id: number;
  name?: string;
  branch?: { id: number; name?: string };
}

interface HistoryRepairItem {
  id: number;
  date: string;
  step: string;
  tracability?: {
    id: number;
    user?: TracabilityUser;
  }[];
}

interface DeviceRepair {
  id: number;
  serialenumber: string;
  purchaseDate: string;
  model: {
    id: number;
    name: string;
    brand: { name: string };
    typeModel: { name: string };
  };
  repair: {
    id: number;
    warrenty?: boolean;
    approveRepair?: boolean;
    newserialnumber?: string;
    actuellybranch: number;
    remark?: string;
    deviceStateReceive: string;
    customer?: { id: number; name?: string; phone?: number; distributer?: { id: number; name: string } };
    historyRepair?: HistoryRepairItem[];
    repairAction?: { id: number; name: string }[];
    listFault?: { id: number; name: string }[];
  }[];
}

function getFirstBranch(hr: HistoryRepairItem[] | undefined): string | null {
  if (!hr || hr.length === 0) return null;
  const sorted = [...hr].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return sorted[0]?.tracability?.[0]?.user?.branch?.name ?? null;
}

function getLastBranch(hr: HistoryRepairItem[] | undefined): string | null {
  if (!hr || hr.length === 0) return null;
  const sorted = [...hr].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return sorted[0]?.tracability?.[0]?.user?.branch?.name ?? null;
}

function getFirstDate(hr: HistoryRepairItem[] | undefined): string | null {
  if (!hr || hr.length === 0) return null;
  const sorted = [...hr].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return sorted[0]?.date ?? null;
}

export default function ShowProductState() {
  const [devices, setDevices] = useState<DeviceRepair[]>([]);
  const [filters, setFilters] = useState<Record<string, string[]>>({
    marque: [], modele: [], warrenty: [], branche: []
  });
  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);
  const [textFilters, setTextFilters] = useState({
    serialenumber: '', deviceId: '', repairId: '', customerName: '', customerPhone: ''
  });

  useEffect(() => {
    API.get('/devices/history')
      .then(r => r.data)
      .then(res => setDevices(res.data ?? []))
      .catch(() => setDevices([]));
  }, []);

  const handleFilterChange = (field: string, value: string[]) => {
    setFilters({ ...filters, [field]: value });
  };

  const getUniqueOptions = (field: string): string[] => {
    switch (field) {
      case 'marque': {
        const v = devices.map(d => d.model?.brand?.name).filter(Boolean) as string[];
        return Array.from(new Set(v)).sort();
      }
      case 'modele': {
        const v = devices.map(d => d.model?.name).filter(Boolean) as string[];
        return Array.from(new Set(v)).sort();
      }
      case 'warrenty':
        return ['Oui', 'Non'];
      case 'branche': {
        const v = devices.flatMap(d =>
          (d.repair ?? []).flatMap(r =>
            (r.historyRepair ?? []).flatMap(h =>
              (h.tracability ?? []).map(t => t.user?.branch?.name)
            )
          )
        ).filter(Boolean) as string[];
        return Array.from(new Set(v)).sort();
      }
      default:
        return [];
    }
  };

  const renderMultiSelect = (label: string, field: string) => (
    <Grid sx={{ width: '180px' }} key={field}>
      <FormControl fullWidth size="small">
        <InputLabel>{label}</InputLabel>
        <Select
          multiple
          value={filters[field] ?? []}
          onChange={(e) => handleFilterChange(field, e.target.value as string[])}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={{
            PaperProps: { style: { maxHeight: 260, width: '200px' } }
          }}
        >
          {getUniqueOptions(field).map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={(filters[field] ?? []).includes(option)} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );

  const filteredDevices = useMemo(() => {
    return devices.filter(d => {
      const brand = d.model?.brand?.name ?? '';
      const model = d.model?.name ?? '';

      if (filters.marque.length > 0 && !filters.marque.includes(brand)) return false;
      if (filters.modele.length > 0 && !filters.modele.includes(model)) return false;

      if (textFilters.serialenumber) {
        const q = textFilters.serialenumber.toLowerCase();
        if (!d.serialenumber?.toLowerCase().includes(q)) return false;
      }

      if (textFilters.deviceId) {
        if (String(d.id) !== textFilters.deviceId) return false;
      }

      const filterRepairIds = textFilters.repairId ? textFilters.repairId.split(',').map(s => s.trim()).filter(Boolean) : [];

      const matchesAnyRepair = (d.repair ?? []).some(r => {
        if (filterRepairIds.length > 0 && !filterRepairIds.includes(String(r.id))) return false;

        if (textFilters.customerName) {
          const q = textFilters.customerName.toLowerCase();
          if (!r.customer?.name?.toLowerCase().includes(q)) return false;
        }

        if (textFilters.customerPhone) {
          if (!String(r.customer?.phone ?? '').includes(textFilters.customerPhone)) return false;
        }

        if (filters.warrenty.length > 0) {
          const w = r.warrenty ? 'Oui' : 'Non';
          if (!filters.warrenty.includes(w)) return false;
        }

        if (filters.branche.length > 0) {
          const firstBranch = getFirstBranch(r.historyRepair);
          const lastBranch = getLastBranch(r.historyRepair);
          const hasBranch = (r.historyRepair ?? []).some(h =>
            (h.tracability ?? []).some(t =>
              filters.branche.includes(t.user?.branch?.name ?? '')
            )
          );
          if (!hasBranch) return false;
        }

        return true;
      });

      return matchesAnyRepair;
    });
  }, [devices, filters, textFilters]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 3 }}>
        Historique des réparations
      </Typography>

      <Grid container spacing={1} sx={{ mb: 2 }}>
        {renderMultiSelect('Marque', 'marque')}
        {renderMultiSelect('Modèle', 'modele')}
        {renderMultiSelect('Garantie', 'warrenty')}
        {renderMultiSelect('Branche', 'branche')}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={2.4}>
          <TextField fullWidth size="small" label="Numéro de série"
            value={textFilters.serialenumber}
            onChange={e => setTextFilters({ ...textFilters, serialenumber: e.target.value })}
          />
        </Grid>
        <Grid size={2.4}>
          <TextField fullWidth size="small" label="ID Appareil"
            value={textFilters.deviceId}
            onChange={e => setTextFilters({ ...textFilters, deviceId: e.target.value })}
          />
        </Grid>
        <Grid size={2.4}>
          <TextField fullWidth size="small" label="ID Réparation"
            value={textFilters.repairId}
            onChange={e => setTextFilters({ ...textFilters, repairId: e.target.value })}
          />
        </Grid>
        <Grid size={2.4}>
          <TextField fullWidth size="small" label="Client"
            value={textFilters.customerName}
            onChange={e => setTextFilters({ ...textFilters, customerName: e.target.value })}
          />
        </Grid>
        <Grid size={2.4}>
          <TextField fullWidth size="small" label="Téléphone client"
            value={textFilters.customerPhone}
            onChange={e => setTextFilters({ ...textFilters, customerPhone: e.target.value })}
          />
        </Grid>
      </Grid>

      {filteredDevices.map(device => (
        <Accordion key={device.id} sx={{ mb: 2 , width: '100%' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ width: '100%' }}>
            <Grid container spacing={2} alignItems="center" sx={{ width: '100%' }}>
              <Grid size={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                  {device.model?.brand?.name} {device.model?.name}
                </Typography>
              </Grid>
              <Grid size={3}>
                <Typography>SN: {device.serialenumber}</Typography>
              </Grid>
              <Grid size={2}>
                <Typography>{device.model?.typeModel?.name}</Typography>
              </Grid>
              <Grid size={4} sx={{ display: 'flex', marginLeft: 'auto', justifyContent: 'flex-end' }}> 
                <Chip label={`${device.repair?.length ?? 0} réparation(s)`} color="primary" size="small" />
              </Grid>
            </Grid>
          </AccordionSummary>
 
          <AccordionDetails>
            {(!device.repair || device.repair.length === 0) ? (
              <Typography sx={{ color: 'gray', fontStyle: 'italic' }}>Aucune réparation</Typography>
            ) : (
              [...device.repair].sort((a, b) => {
                const aDate = getFirstDate(a.historyRepair);
                const bDate = getFirstDate(b.historyRepair);
                if (!aDate && !bDate) return 0;
                if (!aDate) return 1;
                if (!bDate) return -1;
                return new Date(bDate).getTime() - new Date(aDate).getTime();
              }).map(rep => (
                <Card key={rep.id} variant="outlined" sx={{ mb: 2, bgcolor: '#fafafa' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: theme.palette.secondary.main, fontWeight: 'bold' }}>
                        Réparation #{rep.id}
                      </Typography>
                      <Button size="small" variant="outlined" onClick={() => setSelectedRepairId(String(rep.id))}>
                        Détail
                      </Button>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid size={4}>
                        <Typography><strong>Client:</strong> {rep.customer?.name ?? '—'}</Typography>
                        <Typography><strong>Tél:</strong> {rep.customer?.phone ?? '—'}</Typography>
                        <Typography><strong>Distributeur:</strong> {rep.customer?.distributer?.name ?? '—'}</Typography>
                      </Grid>
                      <Grid size={4}>
                        <Typography><strong>État reçu:</strong> {rep.deviceStateReceive}</Typography>
                        <Typography><strong>Garantie:</strong> {rep.warrenty ? 'Oui' : 'Non'}</Typography>
                        <Typography><strong>Date création:</strong> {getFirstDate(rep.historyRepair) ? new Date(getFirstDate(rep.historyRepair)!).toLocaleString() : '—'}</Typography>
                      </Grid>
                      <Grid size={4}>
                        <Typography><strong>Branche départ:</strong> {getFirstBranch(rep.historyRepair) ?? '—'}</Typography>
                        <Typography><strong>Branche actuelle:</strong> {getLastBranch(rep.historyRepair) ?? '—'}</Typography>
                      </Grid>
                    </Grid>

                    {rep.repairAction && rep.repairAction.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Actions: </Typography>
                        {rep.repairAction.map(a => (
                          <Chip key={a.id} label={a.name} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                        ))}
                      </Box>
                    )}

                    {rep.listFault && rep.listFault.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Pannes: </Typography>
                        {rep.listFault.map(f => (
                          <Chip key={f.id} label={f.name} size="small" color="error" variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                        ))}
                      </Box>
                    )}

                    {rep.historyRepair && rep.historyRepair.length > 0 && (
                      <Box sx={{ mt: 1.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Historique des étapes:</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                          {[...rep.historyRepair]
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                            .map(h => (
                              <Chip
                                key={h.id}
                                label={`${new Date(h.date).toLocaleString()} — ${h.step}${h.tracability?.[0]?.user?.branch?.name ? ` (${h.tracability[0].user.branch.name})` : ''}`}
                                size="small"
                                variant="filled"
                                color="info"
                                sx={{ fontWeight: 500 }}
                              />
                            ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </AccordionDetails>
        </Accordion>
      ))}
      <Dialog open={!!selectedRepairId} onClose={() => setSelectedRepairId(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          Détail de la réparation
          <IconButton onClick={() => setSelectedRepairId(null)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedRepairId && <ShowRepair repairId={selectedRepairId} />}
        </DialogContent>
      </Dialog>
    </Box>
  )
}