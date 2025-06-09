import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    alpha,
    useTheme,
    Grid,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const Login: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Por favor, completa todos los campos');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Guardar token y nombre de usuario
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('userName', data.data);
                
                // Redirigir al inicio
                navigate('/');
            } else {
                setError(data.msg || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error en login:', error);
            setError('Error de conexión. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.grey[50], 0.5),
                px: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    maxWidth: 400,
                    width: '100%',
                }}
            >
                <Box textAlign="center" mb={3}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            p: 2,
                            borderRadius: '50%',
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            mb: 2
                        }}
                    >
                        <LoginIcon sx={{ fontSize: 30 }} />
                    </Box>
                    
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Iniciar Sesión
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary">
                        Accede a tu cuenta del sistema de inventario
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
                                }}
                                disabled={loading}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                name="password"
                                label="Contraseña"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
                                }}
                                disabled={loading}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                        sx={{
                            mt: 3,
                            py: 1.5,
                            fontWeight: 500,
                            borderRadius: 2,
                            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;