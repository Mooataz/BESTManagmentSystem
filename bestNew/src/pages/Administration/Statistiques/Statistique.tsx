import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios';
import {
  Box, Card, CardContent, Chip, CircularProgress,
  Grid, TextField, Typography
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';

interface WeekStat {
  weekStart: string;
  total: number;
  [key: string]: string | number | null | undefined;
}

interface BranchStat {
  branchId: number;
  branchName: string;
  total: number;
  sousGarantie: number;
  horsGarantie: number;
  [key: string]: string | number | null | undefined;
}

interface TechnicianStat {
  userId: number;
  userName: string;
  total: number;
  sousGarantie: number;
  horsGarantie: number;
  [key: string]: string | number | null | undefined;
}

interface TechnicianByBranch {
  branchId: number;
  branchName: string;
  technicians: TechnicianStat[];
}

interface StatsData {
  byWeek: WeekStat[];
  byBranch: BranchStat[];
  byTechnicianByBranch: TechnicianByBranch[];
}

const API = axios.create({ baseURL: 'http://localhost:3000/', withCredentials: true });

const defaultStats: StatsData = { byWeek: [], byBranch: [], byTechnicianByBranch: [] };

const BRANCH_COLORS = ['#0D47A1', '#66BB6A', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4', '#FF5722', '#607D8B'];
const GARANTIE_COLORS = ['#1565C0', '#66BB6A', '#EF5350'];

export default function Statistique() {
  const today = new Date().toISOString().split('T')[0];
  const firstDay = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

  const [dateFrom, setDateFrom] = useState(firstDay);
  const [dateTo, setDateTo] = useState(today);
  const [stats, setStats] = useState<StatsData>(defaultStats);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('repair/stats', { params: { dateFrom, dateTo } });
      setStats(res.data.data ?? defaultStats);
    } catch {
      setStats(defaultStats);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => { fetchStats() }, [fetchStats]);

  const totalSousGarantie = stats.byBranch.reduce((s, b) => s + b.sousGarantie, 0);
  const totalHorsGarantie = stats.byBranch.reduce((s, b) => s + b.horsGarantie, 0);
  const totalGlobal = stats.byBranch.reduce((s, b) => s + b.total, 0);

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' , width: '100%'}}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Statistiques des réparations
      </Typography>

      <Card sx={{ mb: 3, p: 2, width: '80%' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Date début"
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Date fin"
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip label={`Total: ${totalGlobal}`} color="primary" />
              <Chip label={`Sous garantie: ${totalSousGarantie}`} color="success" />
              <Chip label={`Hors garantie: ${totalHorsGarantie}`} color="default" />
            </Box>
          </Grid>
        </Grid>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Card sx={{ mb: 3, width: '80%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Réparations par semaine
              </Typography>
              {stats.byWeek.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 4 }} align="center">
                  Aucune donnée
                </Typography>
              ) : (
                <LineChart
                  dataset={stats.byWeek.map(w => ({ ...w, weekStart: new Date(w.weekStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }))}
                  series={[{ dataKey: 'total', label: 'Réparations', color: GARANTIE_COLORS[0], showMark: true }]}
                  xAxis={[{ scaleType: 'band', dataKey: 'weekStart' }]}
                  height={250}
                  margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                  hideLegend
                />
              )}
            </CardContent>
          </Card>

          <Card sx={{ mb: 3, width: '80%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Par agence
              </Typography>
              {stats.byBranch.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 4 }} align="center">
                  Aucune donnée
                </Typography>
              ) : (
                <>
                  <BarChart
                    dataset={stats.byBranch}
                    series={[
                      { dataKey: 'sousGarantie', label: 'Sous garantie', color: GARANTIE_COLORS[1] },
                      { dataKey: 'horsGarantie', label: 'Hors garantie', color: GARANTIE_COLORS[2] },
                    ]}
                    xAxis={[{ scaleType: 'band', dataKey: 'branchName' }]}
                    layout="vertical"
                    height={350}
                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                    hideLegend
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
                    {stats.byBranch.map((b, i) => (
                      <Box key={b.branchId} sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" display="block" fontWeight={600}>
                          {b.branchName}
                        </Typography>
                        <Typography variant="h6" sx={{ color: BRANCH_COLORS[i % BRANCH_COLORS.length] }}>
                          {b.total}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          <Box sx={{ width: '80%' }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Par technicien
            </Typography>
            {stats.byTechnicianByBranch.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 4 }} align="center">
                Aucune donnée
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {stats.byTechnicianByBranch.map((group) => (
                  <Grid key={group.branchId} size={{ xs: 12, sm: 6 }}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom fontWeight={600} sx={{ textAlign: 'center' }}>
                          {group.branchName}
                        </Typography>
                        {group.technicians.length <= 3 ? (
                          <PieChart
                            series={[{
                              data: group.technicians.map((t, i) => ({
                                id: t.userId,
                                value: t.total,
                                label: t.userName,
                                color: BRANCH_COLORS[i % BRANCH_COLORS.length],
                              })),
                              arcLabel: (v) => `${v.value}`,
                              arcLabelMinAngle: 15,
                            }]}
                            height={180}
                            margin={{ top: 5, bottom: 5, left: 5, right: 5 }}
                            hideLegend
                          />
                        ) : (
                          <BarChart
                            dataset={group.technicians}
                            series={[{ dataKey: 'total', label: 'Total', color: BRANCH_COLORS[0] }]}
                            xAxis={[{ scaleType: 'band', dataKey: 'userName' }]}
                            height={180}
                            margin={{ top: 5, bottom: 20, left: 30, right: 10 }}
                            hideLegend
                          />
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          {group.technicians.map(t => (
                            <Chip key={t.userId} label={`${t.userName}: ${t.total}`} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
