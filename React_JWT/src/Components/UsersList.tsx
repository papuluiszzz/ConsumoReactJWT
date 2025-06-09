import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Card,
    CardContent,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface User {
    idUsuario: number;
    nombre: string;
    apellido: string;
    email: string;
}

interface UsersListProps {
    token: string;
}

const UsersList: React.FC<UsersListProps> = ({ token }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log('Obteniendo lista de usuarios...');
                
                const response = await fetch('http://localhost:8000/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                console.log('Respuesta de usuarios:', data);

                if (response.ok && data.success) {
                    setUsers(data.data);
                } else {
                    setError(data.message || 'Error al cargar usuarios');
                }
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
                setError('Error de conexión al obtener usuarios');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUsers();
        }
    }, [token]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Card sx={{ mt: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                        Lista de Usuarios ({users.length})
                    </Typography>
                </Box>

                {users.length === 0 ? (
                    <Alert severity="info">
                        No hay usuarios registrados
                    </Alert>
                ) : (
                    <TableContainer component={Paper} elevation={1}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><strong>Nombre</strong></TableCell>
                                    <TableCell><strong>Apellido</strong></TableCell>
                                    <TableCell><strong>Email</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow 
                                        key={user.idUsuario}
                                        sx={{ '&:hover': { bgcolor: 'grey.50' } }}
                                    >
                                        <TableCell>{user.idUsuario}</TableCell>
                                        <TableCell>{user.nombre}</TableCell>
                                        <TableCell>{user.apellido}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default UsersList;