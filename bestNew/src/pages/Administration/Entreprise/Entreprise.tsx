import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { useAppDispatch } from '../../../Redux/hooks';
import { getCompany } from '../../../Redux/Actions/Administration/Company';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import theme from '../../../Theme/theme';
import UpdateEntreprise from './UpdateEntreprise';
import AdminCard from './AdminCard';
import { getusers } from '../../../Redux/Actions/Administration/EmployèesActions';
import type { User } from '../../../Redux/Types/authenTypes';
export default function Entreprise() {
     const dispatch = useAppDispatch();
       
      const company = useSelector((state: RootState) => state.company.company);
      const Employèes = useSelector( (state : RootState) => state.Employèes.Employèes)
     

      React.useEffect( () => {
        dispatch(getCompany());
        dispatch( getusers())
      }, [dispatch])
  return (
<>
        <Card sx={{ maxWidth: '90%', marginTop:'100px' }}>
      <CardMedia
        sx={{ height: 300 }}
        image={company?.logo ? `http://localhost:3000/upload/company/${company.logo}` : "https://via.placeholder.com/150"}
        title="green iguana"
      /> <br/>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {company?.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell sx={{ borderRight: `1px solid ${theme.palette.secondary.main}` }}> Adresse</TableCell>
                    <TableCell sx={{ borderRight: `1px solid ${theme.palette.secondary.main}` }}> MF </TableCell>
                    <TableCell sx={{ borderRight: `1px solid ${theme.palette.secondary.main}` }}> Banque </TableCell>
                    <TableCell sx={{ borderRight: `1px solid ${theme.palette.secondary.main}` }}> RIB </TableCell>
                    <TableCell sx={{ borderRight: `1px solid ${theme.palette.secondary.main}` }}> TVA (%) </TableCell>
                    <TableCell sx={{ borderRight: `1px solid ${theme.palette.secondary.main}` }}> Timbre fiscale </TableCell>
                    <TableCell> Quantitè alert stock </TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                <TableRow>
                    <TableCell sx={{ borderRight: `1px solid ${theme.palette.secondary.main}` }}> {company?.headquarterslocation}</TableCell>
                    <TableCell sx={{ borderRight: `1px solid ${theme.palette.secondary.main}` }}> {company?.taxRegisterNumber} </TableCell>
                    <TableCell sx={{ borderRight: `1px solid ${theme.palette.secondary.main}` }}> {company?.bank} </TableCell>
                    <TableCell sx={{ borderRight: `1px solid ${theme.palette.secondary.main}` }}> {company?.rib} </TableCell>
                    <TableCell sx={{ borderRight: `1px solid ${theme.palette.secondary.main}` }}> {company?.tva ?? 0}% </TableCell>
                    <TableCell sx={{ borderRight: `1px solid ${theme.palette.secondary.main}` }}> {company?.timbreFiscale ?? 0} </TableCell>
                    <TableCell> {company?.quantityAlertStock} </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </Typography>
      </CardContent>
      <CardActions sx={{marginLeft:'95%'}}>

        {company && (
               <UpdateEntreprise Company={company}/>
              )}
      
      </CardActions>
    </Card> <br/> <br/>

      {Array.isArray(Employèes) &&
  Employèes.filter((row) => row.role?.includes("Administrateur"))
    .map((row, index) => (
      <div key={index}>
        <AdminCard row={row} />
        <br />
      </div>
    ))}  
</>
  );
}
