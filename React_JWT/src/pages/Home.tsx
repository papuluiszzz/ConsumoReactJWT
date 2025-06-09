import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Alert,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface HomeProps {
    onLogout: () => void; // Callback para notificar al App del logout
}

const Home: React.FC<HomeProps> = ({ onLogout }) => {
    const [loading, setLoading] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const validateSession = async () => {
            const token = localStorage.getItem('token');
            const storedUserName = localStorage.getItem('userName');

            console.log('Validando sesión...');
            console.log('Token:', token ? 'Presente' : 'No encontrado');
            console.log('Usuario:', storedUserName);

            if (!token || !storedUserName) {
                console.log('No hay token o usuario');
                setTokenValid(false);
                setLoading(false);
                return;
            }

            try {
                console.log('Verificando token con el servidor...');
                const response = await fetch('http://localhost:8000/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Respuesta del servidor:', response.status);

                if (response.ok) {
                    console.log('Token válido');
                    setTokenValid(true);
                    setUserName(storedUserName);
                } else {
                    console.log('Token inválido');
                    setTokenValid(false);
                    // Limpiar localStorage si el token es inválido
                    localStorage.removeItem('token');
                    localStorage.removeItem('userName');
                    // Notificar al App que el usuario ya no está autenticado
                    onLogout();
                }
            } catch (error) {
                console.error('Error verificando token:', error);
                // Si hay error de conexión, asumir que es válido
                setTokenValid(true);
                setUserName(storedUserName);
            }

            setLoading(false);
        };

        validateSession();
    }, [onLogout]);

    const handleLogout = () => {
        console.log('Cerrando sesión...');
        
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        
        // Notificar al App que el usuario cerró sesión
        onLogout();
    };

    if (loading) {
        return (
            <Box
                sx={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff',
                }}
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: '100vw',
                minHeight: '100vh',
                backgroundColor: '#ffffff',
                padding: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 2,
                    textAlign: 'center',
                }}
            >
                <CheckCircleIcon 
                    sx={{ 
                        fontSize: 60, 
                        color: 'success.main', 
                        mb: 2 
                    }} 
                />

                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    ¡Bienvenido!
                </Typography>

                <Typography variant="h5" color="text.secondary" mb={3}>
                    {userName}
                </Typography>

                <Typography variant="body1" color="text.secondary" mb={2}>
                    Has iniciado sesión correctamente en el
                </Typography>

                <Typography variant="h6" fontWeight="bold" color="primary.main" mb={4}>
                    Sistema de Inventario
                </Typography>

                {tokenValid ? (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        ✅ Sesión autenticada correctamente
                    </Alert>
                ) : (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        ❌ Error de autenticación
                    </Alert>
                )}

                <Button
                    variant="contained"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                    }}
                >
                    Cerrar Sesión
                </Button>
            </Paper>
        </Box>
    );
};

export default Home;