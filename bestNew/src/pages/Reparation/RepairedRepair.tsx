import { API } from '../../services/api';
import React, { useEffect, useMemo, useState } from 'react'
import DynamicTable from '../../Componants/Global/TableComponat';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { RootState } from '../../Redux/store';
import { useAppDispatch } from '../../Redux/hooks';
import { DeleteRepairFile, getByUserStep, getOneRepair, UpdateOneRepair, UpdatePartFileRepair } from '../../Redux/Actions/Reception/repairAction';
import { Box, Button, Card, Divider, IconButton, Input, MenuItem, Paper, Select, Table, TableCell, TableRow, Typography, type SelectChangeEvent } from '@mui/material';
import ShowHeadRepair from './ShowHeadRepair';
import { CustomAutocomplete } from '../../Componants/Global/CustomAutocomplete';
import { getAllExpertiseRaisons } from '../../Redux/Actions/Administration/RaisonsExpertiseActions';
import type { RepairForm, TypeModel } from '../../Redux/Types/repairTypes';
import { CustomCheckboxSelector } from '../../Componants/Global/CustomCheckboxSelector';
import { useNotification } from '../../Componants/NotificationContext';
import theme from '../../Theme/theme';
import { addHistoryRepair } from '../../Redux/Actions/Reception/History';



export default function RepairedRepair() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const navigate = useNavigate()
  const userr = useSelector((state: RootState) => state.auth.user)
  const expertiseRaison = useSelector((state: RootState) => state.expertiseReasons);
  const NotesClient = useSelector((state: RootState) => state.NotesCustomer.notesCustomer);
  const repairActions = useSelector((state: RootState) => state.RepairAction.repairAction);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const oneRepair = useSelector((state: RootState) => state.repair.oneRepair);
  const [formRepair, setFormRepair] = useState<RepairForm>();


  useEffect(() => {
    if (oneRepair) {
      setFormRepair({
        warrenty: oneRepair.warrenty,
        remark: oneRepair.remark,
        expertiseReason: oneRepair.expertiseReason
          ?.map((r) => (typeof r === 'number' ? r : r.id))
          .filter((id): id is number => typeof id === 'number'),

        notesCustomer: oneRepair.notesCustomer
          ?.map((n) => (typeof n === 'number' ? n : n.id))
          .filter((id): id is number => typeof id === 'number'),


        repairAction: oneRepair.repairAction
          ?.map((a) => (typeof a === 'number' ? a : a.id))
          .filter((id): id is number => typeof id === 'number'),


        partsNeed: oneRepair.partsNeed,
      });
    }
  }, [oneRepair]);
  useEffect(() => {
    dispatch(getAllExpertiseRaisons())
  }, [dispatch])

  useEffect(() => {
    if (id) { dispatch(getOneRepair(Number(id))); }
  }, [dispatch, id]);



  const allParts: TypeModel[] =
  oneRepair?.device &&
  typeof oneRepair.device === 'object' &&
  oneRepair.device.model &&
  typeof oneRepair.device.model === 'object' &&
  Array.isArray(oneRepair.device.model.allpart)
  ? (oneRepair.device.model.allpart as any[]).filter(
      (p): p is TypeModel => p !== null && typeof p === 'object' && 'description' in p
    )
  : [];

  const nouvelleAppareillePartId = useMemo(() => {
    const part = allParts.find(p =>
      p.description?.toLowerCase().includes('nouvelle appareille') ||
      p.description?.toLowerCase().includes('appareil complet') ||
      p.description?.toLowerCase().includes('appareille complet') ||
      p.description?.toLowerCase().includes('complet')
    );
    return part?.id;
  }, [allParts]);

  const nouvelleAppareilleActionId = useMemo(() => {
    const action = (repairActions as any[]).find((a: any) =>
      a.name?.toLowerCase().includes('nouvelle appareille')
    );
    return action?.id;
  }, [repairActions]);

  const filteredParts: TypeModel[] = (() => {
    const selectedAction = Array.isArray(formRepair?.repairAction) ? formRepair.repairAction : [];
    const isNouvelleAppareille = nouvelleAppareilleActionId !== undefined &&
      selectedAction.some(id => Number(id) === Number(nouvelleAppareilleActionId));

    if (isNouvelleAppareille) {
      return nouvelleAppareillePartId !== undefined
        ? allParts.filter(p => Number(p.id) === Number(nouvelleAppareillePartId))
        : allParts;
    }
    return nouvelleAppareillePartId !== undefined
      ? allParts.filter(p => Number(p.id) !== Number(nouvelleAppareillePartId))
      : allParts;
  })();

  const lockedPartIds = useMemo(() => {
    if (!Array.isArray(oneRepair?.approveStock)) return [];
    return oneRepair.approveStock
      .filter((e: any) => e.state === 'Confirmer')
      .map((e: any) => Number(e.idPartRepair));
  }, [oneRepair?.approveStock]);

  const actionName = useMemo(() => {
    const ids = formRepair?.repairAction ?? [];
    if (!ids.length) return '';
    const action = repairActions.find((a: any) => a.id === ids[0]);
    return action?.name ?? '';
  }, [formRepair?.repairAction, repairActions]);

  const showPrice = useMemo(() => {
    return actionName === 'Devis' || (actionName === 'Réparation' && formRepair?.warrenty === false);
  }, [actionName, formRepair?.warrenty]);

  const [priceDetails, setPriceDetails] = useState<any>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  useEffect(() => {
    if (!showPrice || !oneRepair?.id) { setPriceDetails(null); return; }
    setLoadingPrice(true);
    API.get(`repair/price-details/${oneRepair.id}`)
      .then(r => setPriceDetails(r.data.data))
      .catch(() => setPriceDetails(null))
      .finally(() => setLoadingPrice(false));
  }, [showPrice, oneRepair?.id]);

  const approveStockRows = (() => {
    if (!Array.isArray(oneRepair?.approveStock)) return [];
    const garantie = oneRepair?.warrenty === true ? 'Sous garantie' : oneRepair?.warrenty === false ? 'Hors garantie' : '-';
    return oneRepair.approveStock.map((entry: any, idx: number) => ({
      id: entry.id ?? idx,
      garantie,
      device: typeof oneRepair?.device === 'object' ? oneRepair.device : null,
      piece: allParts.find((p) => p.id === Number(entry.idPartRepair))?.description ?? `Pièce #${entry.idPartRepair}`,
      etat: entry.state,
      date: entry.date ? new Date(entry.date).toLocaleString() : '-',
    }));
  })();

  const handleChange = (event: SelectChangeEvent) => {
    setFormRepair((prev) => ({
      ...prev!,
      warrenty: event.target.value === "true",
    }));
  };
  const SelectExpertise = (ids: number[]) => {

    setFormRepair((prev) => ({
      ...prev!,
      expertiseReason: ids,
    }));
  };
  const SelectNotes = (ids: number[]) => {

    setFormRepair((prev) => ({
      ...prev!,
      notesCustomer: ids,
    }));
  };
  const SelectAction = (ids: number) => {

    setFormRepair((prev) => ({
      ...prev!,
      repairAction: [ids],
    }));
  };
  /* ===============================
     IMAGES HANDLERS
  =============================== */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (selectedImages.length + files.length > 4) {
      notify('Maximum 4 images autorisées', 'warning');
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteImage = async (fileName: string) => {
    if (!oneRepair?.id || saving) return;
    const result = await dispatch(
      DeleteRepairFile({ id: oneRepair.id, fileName })
    );
    if (DeleteRepairFile.fulfilled.match(result)) {
      notify('Image supprimée', 'success');
    } else {
      notify('Erreur lors de la suppression', 'error');
    }
  };
  /* ===============================
       SAFE FILES ACCESS ✅
    =============================== */
  const files = oneRepair?.files ?? [];

  /* ===============================
   SAVE (DATA + IMAGES)
=============================== */
const [saving, setSaving] = useState(false);
  const handleSave = async () => {


          if (saving) return;
        setSaving(true);
        try {
              if (!oneRepair?.id || !formRepair) {
      notify('Réparation introuvable', 'error');
      return;
    }

    // ✅ 1. Sauvegarde données
    const updateResult = await dispatch(
      UpdateOneRepair({
        id: oneRepair.id,
        ...formRepair,
      })
    );

    if (!UpdateOneRepair.fulfilled.match(updateResult)) {
      notify('Erreur lors de la mise à jour', 'error');
      return;
    }

    // ✅ 2. Upload images (si présentes)
    if (selectedImages.length > 0) {
      const formData = new FormData();
      selectedImages.forEach(file => {
        formData.append('files', file);
      });

      const uploadResult = await dispatch(
        UpdatePartFileRepair({
          id: oneRepair.id,
          data: formData,
        })
      );

      if (!UpdatePartFileRepair.fulfilled.match(uploadResult)) {
        notify(
          'Réparation mise à jour mais erreur images',
          'warning'
        );
        return;
      }
    }

    notify('Réparation enregistrée avec succès ✅', 'success');
    setSelectedImages([]);
    await dispatch(getOneRepair(oneRepair.id));
        } finally {
          setSaving(false);
        }




  };



  const validateClosure = (): { ok: boolean; msg: string } => {
    if (formRepair?.warrenty === undefined) {
      return { ok: false, msg: 'Choisir l\'état de garantie' };
    }

    const actionIds = formRepair?.repairAction ?? [];
    if (!actionIds.length) {
      return { ok: false, msg: 'Choisir une action réparation' };
    }

    const actionNames = actionIds.map((id) => {
      const action = repairActions.find((a: any) => a.id === id);
      return action?.name;
    });

    const isDevis = actionNames.includes('Devis');
    const isReparation = actionNames.includes('Réparation');
    const partIds = Array.isArray(formRepair?.partsNeed) ? formRepair.partsNeed : [];

    if (isDevis && (!formRepair?.expertiseReason?.length)) {
      return { ok: false, msg: 'Remplir la raison d\'expertise pour Devis' };
    }

    if (isReparation) {
      if (!partIds.length) {
        return { ok: false, msg: 'Sélectionner des pièces pour Réparation' };
      }
      if (partIds.length > 0 && Array.isArray(oneRepair?.approveStock) && oneRepair.approveStock.length > 0) {
        const allConfirmed = oneRepair.approveStock.every((e: any) => e.state === 'Confirmer');
        if (!allConfirmed) {
          return { ok: false, msg: 'Toutes les pièces doivent être confirmées (état Confirmer)' };
        }
      }
    }

    return { ok: true, msg: '' };
  };

  const handleCloseRepair = async () => {
    if (saving || !oneRepair?.id || !userr?.id) return;

    const validation = validateClosure();
    if (!validation.ok) {
      notify(validation.msg, 'warning');
      return;
    }

    setSaving(true);
    try {
      const updateResult = await dispatch(
        UpdateOneRepair({
          id: oneRepair.id,
          ...formRepair,
        })
      );

      if (!UpdateOneRepair.fulfilled.match(updateResult)) {
        notify('Erreur lors de la sauvegarde', 'error');
        return;
      }

      const historyResult = await dispatch(
        addHistoryRepair({
          date: new Date(),
          step: 'Envoyé à CQ',
          user: { id: userr.id },
          repair: oneRepair.id,
        })
      );

      if (addHistoryRepair.fulfilled.match(historyResult)) {
        notify('Réparation clôturée avec succès', 'success');

        const branchId = typeof userr.branch === 'object' ? userr.branch.id : userr.branch;
        if (branchId && userr.id) {
          await dispatch(
            getByUserStep({
              branchId,
              userId: userr.id,
              step: 'On réparation',
            })
          );
        }
        navigate('/dashboard/listTotal');
      } else {
        notify('Erreur lors de la clôture', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', padding: 2 }}>
      <Card sx={{ width: '100%', height: '200%' }}>
        {id && <ShowHeadRepair idRep={id} />} <br />
        <Divider /><br />
        <Box sx={{ display: 'flex' }}>
          <Table>
            <TableRow>
              <TableCell>Garantie</TableCell>
              <TableCell>
                <Select onChange={handleChange} sx={{ width: '400px' }}>
                  <MenuItem value="true">Sous garantie</MenuItem>
                  <MenuItem value="false">Hors garantie</MenuItem>
                </Select>
              </TableCell>
              {formRepair?.warrenty === true ? <TableCell>Sous garantie</TableCell> : <TableCell>Hors garantie</TableCell>}
            </TableRow>

            <Divider sx={{ width: '300%' }} />

            <TableRow>
              <TableCell>La garantie ne couvre pas les cas suivant</TableCell>
              <TableCell>
                <CustomAutocomplete
                  data={expertiseRaison.ExpertiseRaisons}
                  displayFields={['name']}
                  idField="id"
                  label="Raison d'expertise"
                  multiple={true}
                  onChange={SelectExpertise}
                />
              </TableCell>
              <TableCell>
                {oneRepair?.expertiseReason && oneRepair.expertiseReason.length > 0 ? (
                  <ul>
                    {oneRepair.expertiseReason.map((item) => {
                      const itemId = typeof item === 'number' ? item : item.id;
                      const reason = expertiseRaison.ExpertiseRaisons.find((r) => r.id === itemId);
                      return reason ? <li key={itemId}>{reason.name}</li> : <li key={itemId}>Raison inconnue</li>;
                    })}
                  </ul>
                ) : (
                  <Box sx={{ color: 'gray' }}>Pas de cause sélectionnée</Box>
                )}
              </TableCell>
            </TableRow>

            <Divider sx={{ width: '300%' }} />

            <TableRow>
              <TableCell>Notes pour client</TableCell>
              <TableCell>
                <CustomAutocomplete
                  data={NotesClient}
                  displayFields={['name']}
                  idField="id"
                  label="Notes pour client"
                  multiple={true}
                  onChange={SelectNotes}
                />
              </TableCell>
              <TableCell>
                {oneRepair?.notesCustomer && oneRepair.notesCustomer.length > 0 ? (
                  <ul>
                    {oneRepair.notesCustomer.map((item) => {
                      const itemsId = typeof item === 'number' ? item : item.id;
                      const oneItem = NotesClient.find((r) => r.id === itemsId);
                      return oneItem ? <li key={itemsId}>{oneItem.name}</li> : <li key={itemsId}>note inconnue</li>;
                    })}
                  </ul>
                ) : (
                  <Box sx={{ color: 'gray' }}>Pas de note sélectionnée</Box>
                )}
              </TableCell>
            </TableRow>

            <Divider sx={{ width: '300%' }} />

            <TableRow>
              <TableCell>Remarque</TableCell>
              <TableCell>
                <Input sx={{ width: '400px' }} value={formRepair?.remark ?? ''} onChange={(e) => setFormRepair({ ...formRepair, remark: e.target.value })} />
              </TableCell>
              <TableCell>{formRepair?.remark}</TableCell>
            </TableRow>

            <Divider sx={{ width: '300%' }} />

            <TableRow>
              <TableCell>Action sur l'appareille</TableCell>
              <TableCell>
                <CustomAutocomplete
                  data={repairActions}
                  displayFields={['name']}
                  idField="id"
                  label="Action après diagnostique"
                  multiple={false}
                  onChange={SelectAction}
                />
              </TableCell>
              <TableCell>
                {oneRepair?.repairAction && oneRepair.repairAction.length > 0 ? (
                  <ul>
                    {oneRepair.repairAction.map((item) => {
                      const itemsId = typeof item === 'number' ? item : item.id;
                      const oneItem = repairActions.find((r) => r.id === itemsId);
                      return oneItem ? <li key={itemsId}>{oneItem.name}</li> : <Box sx={{ color: 'gray' }} key={itemsId}>Action inconnue</Box>;
                    })}
                  </ul>
                ) : (
                  <Box sx={{ color: 'gray' }}>Pas d'action sélectionnée</Box>
                )}
              </TableCell>
            </TableRow>

            <Divider sx={{ width: '300%' }} />

            <TableRow>
              <TableCell sx={{ width: '25%' }}>Besoin des pièces</TableCell>
              <TableCell sx={{ width: '40%' }}>
                  <CustomCheckboxSelector
                    data={filteredParts}
                    displayFields={['description']}
                    returnField="id"
                    title="Pièces"
                    disabledIds={lockedPartIds}
                    value={Array.isArray(formRepair?.partsNeed) ? formRepair.partsNeed : []}
                    onChange={(values) => setFormRepair({ ...formRepair, partsNeed: values })}
                  />
              </TableCell>
              <TableCell>
                {Array.isArray(oneRepair?.partsNeed) && oneRepair.partsNeed.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {oneRepair.partsNeed.map((itemId: any) => {
                      const part = allParts.find((p) => p.id === Number(itemId));
                      return <li key={itemId}>{part?.description}</li>;
                    })}
                  </ul>
                ) : (
                  <Box sx={{ color: 'gray' }}>Pas de pièce sélectionnée</Box>
                )}
              </TableCell>
            </TableRow>

          </Table>
        </Box>

        <Divider />

        {/* APPROVE STOCK - standalone */}
        <Box sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.primary.main }}>Pièces en approbation</Typography>
          <DynamicTable
            rows={approveStockRows}
            columnLabels={{ garantie: 'Garantie', 'device.model.brand.name': 'Marque', 'device.model.name': 'Modèle', piece: 'Pièce', etat: 'État', date: 'Date' }}
            columnsToShow={['garantie', 'device.model.brand.name', 'device.model.name', 'piece', 'etat', 'date']}
          />
        </Box>

        {showPrice && priceDetails && (
          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 1, color: theme.palette.primary.main }}>Détail des prix</Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              {priceDetails.parts?.length > 0 && (
                <Table size="small" sx={{ mb: 1 }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Pièce</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Prix HT</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Main-d'œuvre</TableCell>
                  </TableRow>
                  {priceDetails.parts.map((p: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell>{p.partName}</TableCell>
                      <TableCell align="right">{p.price.toFixed(3)} DT</TableCell>
                      <TableCell align="right">{p.levelRepairPrice > 0 ? `${p.levelRepairPrice.toFixed(3)} DT` : '-'}</TableCell>
                    </TableRow>
                  ))}
                </Table>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                <Typography variant="body2">Total pièces: {priceDetails.partsTotal.toFixed(3)} DT</Typography>
                {priceDetails.levelRepairPrice > 0 && (
                  <Typography variant="body2">Main-d'œuvre: {priceDetails.levelRepairPrice.toFixed(3)} DT</Typography>
                )}
                <Typography variant="body2">Total HT: {priceDetails.totalHT.toFixed(3)} DT</Typography>
                <Typography variant="body2">TVA ({priceDetails.tva}%): {priceDetails.tvaAmount.toFixed(3)} DT</Typography>
                <Typography variant="body2">Timbre fiscale: {priceDetails.timbreFiscale.toFixed(3)} DT</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                  Total TTC: {priceDetails.totalTTC.toFixed(3)} DT
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        <Divider />

        <Box sx={{ display: 'flex' }}>
          <Table>
            {/* IMAGES */}
            <TableRow>
              <TableCell>Images (max 4)</TableCell>
              <TableCell>
                <Button variant="outlined" component="label">
                  Ajouter des images
                  <input hidden type="file" accept="image/*" multiple onChange={handleImageSelect} />
                </Button>
                {selectedImages.length > 0 && (
                  <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                    {selectedImages.map((file, index) => (
                      <Box key={index} position="relative">
                        <img src={URL.createObjectURL(file)} alt="preview" width={100} height={100} style={{ objectFit: 'cover', borderRadius: 4 }} />
                        <IconButton size="small" onClick={() => removeImage(index)} sx={{ position: 'absolute', top: -8, right: -8, background: 'white' }}>✖</IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </TableCell>
              <TableCell>
                {files.length > 0 ? (
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {files.map((f: any, index: number) => (
                      <Box key={f.id ?? index} position="relative">
                        <img src={`http://localhost:3000/upload/repairs/${f}`} alt="uploaded" width={100} height={100} style={{ objectFit: 'cover', borderRadius: 4 }} />
                        <IconButton size="small" onClick={() => handleDeleteImage(f)} sx={{ position: 'absolute', top: -8, right: -8, background: 'white' }}>✖</IconButton>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box color="gray">Aucune image existante</Box>
                )}
              </TableCell>
            </TableRow>

            <Divider sx={{ width: '300%' }} />

            <br /><br />
            <Box display="flex" gap={2} justifyContent="center">
              <Button disabled={saving} onClick={handleSave} sx={{ background: '#ECEFF1', minWidth: 200 }}>Enregistrer</Button>
              <Button disabled={saving} onClick={handleCloseRepair} sx={{ backgroundColor: theme.palette.primary.main, color: 'white', minWidth: 200, ':hover': { backgroundColor: theme.palette.secondary.main } }}>Clôturer la réparation</Button>
            </Box>
          </Table>
        </Box>
      </Card>
    </Box>
  )
}
