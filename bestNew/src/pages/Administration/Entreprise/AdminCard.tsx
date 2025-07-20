import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton  from '@mui/material/IconButton';
import type { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import theme from '../../../Theme/theme';
import UpdateAdmin from './UpdateAdmin';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));
interface Agency {
    id: number;
    name: string;
    phone: number;
    email: string;
    location: string;
}
type User = {
    id: number;
    name: string;
    phone: number;
    password: string;
    createdDate: string;
    status: string;
    login: string;
    role: string[];
    branch: Agency
};
export default function AdminCard({ row  }: { row: User  }) {
      const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <div>
       <Card sx={{ width: 400}}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: theme.palette.secondary.main }} aria-label="recipe">
            {row.name[0]}
          </Avatar>
        }
      
        title={row.name}
        subheader="Administrateur"
      />
       <br/>
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Téléphone: {row.phone} <br/>
             login: {row.login}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ marginLeft:'90%' }}>
         
        <UpdateAdmin row={row} />
         
      </CardActions>
 
    </Card>
    </div>
  )
}
