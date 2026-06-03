import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Chip, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useAppDispatch, useAppSelector } from '../../../Redux/hooks'
import type { RootState } from '../../../Redux/store'
import { AddOneTransfert, FetchRepairTransfers, AcceptRepairTransfer, RefuseRepairTransfer, CancelRepairTransfer } from '../../../Redux/Actions/stock/TransfertAction'
import { getAgencies } from '../../../Redux/Actions/Administration/AgenciesActions'
import theme from '../../../Theme/theme'
import { useNotification } from '../../../Componants/NotificationContext'
import DynamicTable from '../../../Componants/Global/TableComponat'
import type { RepairForm } from '../../../Redux/Types/repairTypes'
import type { TransfertPR } from '../../../Redux/Types/Stock'

export default function MenuTransfert() {
  const dispatch = useAppDispatch()
  const { notify } = useNotification()
  const userr = useAppSelector((state: RootState) => state.auth.user)
  const { Transfert: transfers, loading } = useAppSelector((state: RootState) => state.Transfert)
  const branches = useAppSelector((state: RootState) => state.agencies.Agency)

  const branchId = useMemo(() => {
    if (!userr?.branch) return 0
    return typeof userr.branch === 'object' ? userr.branch.id : userr.branch
  }, [userr])

  const userId = userr?.id ?? 0

  const [tab, setTab] = useState(0)
  const [availableRepairs, setAvailableRepairs] = useState<RepairForm[]>([])
  const [selectedRepairIds, setSelectedRepairIds] = useState<number[]>([])
  const [selectedToBranch, setSelectedToBranch] = useState<number | ''>('')
  const [detailTransfer, setDetailTransfer] = useState<TransfertPR | null>(null)

  useEffect(() => {
    if (branchId) {
      dispatch(FetchRepairTransfers(branchId))
      dispatch(getAgencies())
    }
  }, [branchId, dispatch])

  useEffect(() => {
    if (!branchId) return
    const pendingIds = new Set<number>()
    for (const t of transfers) {
      if (t.state === 'Envoyé') {
        for (const r of t.repair ?? []) pendingIds.add(r.id)
      }
    }
    Promise.all([
      fetch(`http://localhost:3000/repair/byBranchAndStep?branchId=${branchId}&step=On affectation`, { credentials: 'include' }).then(r => r.json()),
      fetch(`http://localhost:3000/repair/byBranchAndStep?branchId=${branchId}&step=CQ`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([res1, res2]) => {
      const combined = [...(res1.data ?? []), ...(res2.data ?? [])]
      setAvailableRepairs(combined.filter((r: any) => !pendingIds.has(r.id)))
    })
  }, [branchId, transfers])

  const sentTransfers = useMemo(() => transfers.filter(t => t.frombranch === branchId), [transfers, branchId])
  const receivedTransfers = useMemo(() => transfers.filter(t => t.tobranch === branchId), [transfers, branchId])

  const handleCreate = async () => {
    if (selectedRepairIds.length === 0 || !selectedToBranch) {
      notify('Veuillez sélectionner au moins une réparation et une agence de destination.', 'error')
      return
    }
    const result = await dispatch(AddOneTransfert({
      repairIds: selectedRepairIds,
      frombranch: branchId,
      tobranch: Number(selectedToBranch),
      sendUser: userId,
      sendingDate: new Date(),
      state: 'Envoyé',
      type: 'Repair',
    }))
    if (AddOneTransfert.fulfilled.match(result)) {
      notify('Transfert créé avec succès.', 'success')
    } else {
      notify(result.payload as string || 'Erreur lors de la création du transfert.', 'error')
    }
    setSelectedRepairIds([])
    setSelectedToBranch('')
    dispatch(FetchRepairTransfers(branchId))
  }

  const handleAccept = async (id: number) => {
    const result = await dispatch(AcceptRepairTransfer({ id, userId }))
    if (AcceptRepairTransfer.fulfilled.match(result)) {
      notify('Transfert accepté.', 'success')
      dispatch(FetchRepairTransfers(branchId))
    } else {
      notify(result.payload as string || "Erreur lors de l'acceptation.", 'error')
    }
  }

  const handleRefuse = async (id: number) => {
    const result = await dispatch(RefuseRepairTransfer({ id, userId }))
    if (RefuseRepairTransfer.fulfilled.match(result)) {
      notify('Transfert refusé.', 'success')
      dispatch(FetchRepairTransfers(branchId))
    } else {
      notify(result.payload as string || 'Erreur lors du refus.', 'error')
    }
  }

  const handleCancel = async (id: number) => {
    const result = await dispatch(CancelRepairTransfer({ id, userId }))
    if (CancelRepairTransfer.fulfilled.match(result)) {
      notify('Transfert annulé.', 'success')
      dispatch(FetchRepairTransfers(branchId))
    } else {
      notify(result.payload as string || "Erreur lors de l'annulation.", 'error')
    }
  }

  const getBranchName = (id?: number) => {
    if (!id) return '—'
    return branches.find(b => b.id === id)?.name ?? `#${id}`
  }

  const statusChip = (status?: string) => {
    const colors: Record<string, 'warning' | 'success' | 'error' | 'default'> = {
      Envoyé: 'warning', Reçu: 'success', Refusé: 'error', Annulé: 'default',
    }
    return <Chip label={status ?? '—'} color={colors[status ?? ''] ?? 'default'} size="small" />
  }

  const transferTable = (list: TransfertPR[], isSent: boolean) => (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Transfert #</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Nb réparations</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>{isSent ? 'Destination' : 'Origine'}</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {list.length === 0 ? (
          <TableRow><TableCell colSpan={7} align="center">Aucun transfert</TableCell></TableRow>
        ) : list.map(t => (
          <TableRow key={t.id}>
            <TableCell>{t.id}</TableCell>
            <TableCell>{(t.repair ?? []).length}</TableCell>
            <TableCell>{isSent ? getBranchName(t.tobranch) : getBranchName(t.frombranch)}</TableCell>
            <TableCell>{t.sendingDate ? new Date(t.sendingDate).toLocaleString('fr-FR') : '—'}</TableCell>
            <TableCell>{statusChip(t.state)}</TableCell>
            <TableCell>
              <Button size="small" variant="outlined" sx={{ mr: 0.5 }} onClick={() => window.open(`http://localhost:3000/transfert/pdf/${t.id}`, '_blank')}>
                PDF
              </Button>
              <Button size="small" variant="outlined" sx={{ mr: 0.5 }} onClick={() => setDetailTransfer(t)}>Détail</Button>
              {t.state === 'Envoyé' && isSent && (
                <Button size="small" color="error" variant="outlined" onClick={() => handleCancel(t.id!)}>Annuler</Button>
              )}
              {t.state === 'Envoyé' && !isSent && (
                <>
                  <Button size="small" color="success" variant="contained" sx={{ mr: 0.5 }} onClick={() => handleAccept(t.id!)}>Accepter</Button>
                  <Button size="small" color="error" variant="outlined" onClick={() => handleRefuse(t.id!)}>Refuser</Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 3 }}>
        Transfert des réparations entre agences
      </Typography>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>
            Nouveau transfert — Sélectionnez les réparations
          </Typography>
          <DynamicTable
            rows={availableRepairs.map(r => {
              const hr = (r as any).historyRepair
              const lastStep = Array.isArray(hr) && hr.length > 0
                ? [...hr].sort((a: any, b: any) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())[0]?.step ?? '—'
                : '—'
              return {
                ...r,
                'customer.name': (r as any).customer?.name ?? '—',
                'customer.phone': (r as any).customer?.phone ?? '—',
                'device.model.brand.name': (r as any).device?.model?.brand?.name ?? '',
                'device.model.name': (r as any).device?.model?.name ?? '',
                'device.serialenumber': (r as any).device?.serialenumber ?? '',
                lastStep,
              }
            })}
            columnLabels={{
              id: 'N°',
              'customer.name': 'Client',
              'customer.phone': 'Tél',
              'device.model.brand.name': 'Marque',
              'device.model.name': 'Modèle',
              'device.serialenumber': 'NS',
              deviceStateReceive: 'État',
              lastStep: 'Dernier état',
            }}
            columnsToShow={['id', 'customer.name', 'customer.phone', 'device.model.brand.name', 'device.model.name', 'device.serialenumber', 'deviceStateReceive', 'lastStep']}
            enableChecked
            onChecked={setSelectedRepairIds}
          />
          <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <Grid size={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Agence de destination</InputLabel>
                <Select value={selectedToBranch} onChange={e => setSelectedToBranch(e.target.value as number)} label="Agence de destination">
                  {branches.filter(b => b.id !== branchId).map(b => (
                    <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={2}>
              <Button variant="contained" onClick={handleCreate} disabled={loading || selectedRepairIds.length === 0}>
                Transférer ({selectedRepairIds.length})
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label={`Envoyés (${sentTransfers.length})`} />
            <Tab label={`Reçus (${receivedTransfers.length})`} />
          </Tabs>
          {tab === 0 ? transferTable(sentTransfers, true) : transferTable(receivedTransfers, false)}
        </CardContent>
      </Card>

      <Dialog open={!!detailTransfer} onClose={() => setDetailTransfer(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          Détail du transfert #{detailTransfer?.id}
          <IconButton onClick={() => setDetailTransfer(null)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {detailTransfer && (
            <>
              <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <Chip label={`Statut : ${detailTransfer.state}`} color={detailTransfer.state === 'Envoyé' ? 'warning' : detailTransfer.state === 'Reçu' ? 'success' : 'error'} />
                <Chip label={`De : ${getBranchName(detailTransfer.frombranch)}`} variant="outlined" />
                <Chip label={`Vers : ${getBranchName(detailTransfer.tobranch)}`} variant="outlined" />
                <Chip label={`${detailTransfer.sendingDate ? new Date(detailTransfer.sendingDate).toLocaleString('fr-FR') : ''}`} variant="outlined" />
              </Box>
              <DynamicTable
                rows={(detailTransfer.repair ?? []).map(r => ({
                  ...r,
                  'customer.name': (r as any).customer?.name ?? '—',
                  'customer.phone': (r as any).customer?.phone ?? '—',
                  'device.model.brand.name': (r as any).device?.model?.brand?.name ?? '',
                  'device.model.name': (r as any).device?.model?.name ?? '',
                  'device.serialenumber': (r as any).device?.serialenumber ?? '',
                }))}
                columnLabels={{
                  id: 'N°',
                  'customer.name': 'Client',
                  'customer.phone': 'Tél',
                  'device.model.brand.name': 'Marque',
                  'device.model.name': 'Modèle',
                  'device.serialenumber': 'NS',
                }}
                columnsToShow={['id', 'customer.name', 'customer.phone', 'device.model.brand.name', 'device.model.name', 'device.serialenumber']}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
