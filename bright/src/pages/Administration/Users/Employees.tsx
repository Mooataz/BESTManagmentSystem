 import Table from '@mui/joy/Table';
import { getusers } from '../../../api/administration/user';
import { VscStarEmpty } from "react-icons/vsc";
import Button from '@mui/joy/Button';
 import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next';
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
    branch:  Agency
};
const roleColors: Record<string, string> = {
    Administarteur: 'gold',
    Reception: 'pink',
    Coordinateur: 'green',
    Technicien: 'blue',
    Gestionnaire_de_stocks: 'purple',
};


export default function TableHover() {
    const [users, setUsers] = React.useState<User[]>([]);
const { notify } = useNotification();
const { t } = useTranslation();
    const fetchUsers = async () => {
        try {
            const usersData = await getusers();
            setUsers(usersData);
        } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "danger");
        }
    };

    React.useEffect(() => {
        fetchUsers();
    }, []);
    return (
        <div>
            <h3 style={{ marginRight: '90%' }}>Employées</h3>
                <div style={{ marginLeft: '85%', marginBottom: '1%' }}>
                     
                    <AddUser onUserAdded={fetchUsers} />
                </div>            
                      
   

  
      
                <Table hoverRow>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Telephone</th>
                        <th>Date d'inscription</th>
                        <th>Status</th>
                        <th>Login</th>
                        <th>Role</th>
                        <th>Agence</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users
                        .filter((row: any) => !row.role?.includes("Administrateur"))
                        .map((row: any, index) => (
                        <tr key={row.id}>
                            <td>{row.name}</td>
                            <td>{row.phone}</td>
                            <td>
                                {new Date(row.createdDate).toISOString().split('T')[0]}<br />
                                {new Date(row.createdDate).toTimeString().split(' ')[0]}
                            </td>

                            <td>{row.status === 'Autoriser' ? (
                                <Button size="md" variant="outlined" color="success">
                                    {row.status}
                                </Button>
                                ) : (
                                <Button size="md" variant="outlined" color="danger">
                                    {row.status}
                                </Button>
                                )}


                            </td>
                            <td>{row.login}</td>
                            <td>
                                {Array.isArray(row.role)
                                    ? row.role.map((rl: string, idx: number) => (
                                        <div key={idx}><VscStarEmpty color={roleColors[rl]} />{rl}</div>
                                    ))
                                    : '-'}
                            </td>

     
                            <td>{row.branch?.name || '-'}</td>
                            <td> <Edit Employe={row} onUserUpdated={fetchUsers} />
 </td>
                        </tr>
                    ))}

                </tbody>
            </Table>
              
        </div>
    );
}


import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
 
interface Agency {
    id: number;
    name: string;
    phone: number;
    email: string;
    location: string;
}

type Users = {

    name: string;
    phone: number;
    password: string;
    createdDate: string;
    status: string;
    login: string;
    role: string[];
    branch?: number
};
 
 

 

 
import Autocomplete from '@mui/joy/Autocomplete';
 
import { AddUser } from './AddUser';
import Edit from './Edit';
import { useNotification } from '../../../Componants/NotificationContext';
 interface TypeAgencie{
    agencies: Agency[];
    onSelect: (agency: Agency | null) => void;
 }
 
export   function AgencieList({agencies, onSelect}:TypeAgencie) {
const [value, setValue] = React.useState<Agency | null>(agencies[0] ?? null);
const [inputValue, setInputValue] = React.useState<number | null>(agencies[0]?.id ?? null);
const { t } = useTranslation();
  return (
   <FormControl id="controllable-states-demo"  >
      <FormLabel>{t('Agence') }  </FormLabel>
     <Autocomplete
        placeholder="Sélectionnez une agence"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          onSelect(newValue);
          setInputValue(newValue ? newValue.id : null); // <-- Récupère l'ID
        }}
        options={agencies}
        getOptionLabel={(option) => option.name}
        sx={{ width: 300 }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
     
    </FormControl>
  );
}
 