import { Link, useNavigate } from "react-router-dom"
import { AppBar, Box, Toolbar, IconButton, Typography, Drawer, Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useState } from "react"

const navItems = [
    { text: 'Inicio', path: '/', icon: <HomeIcon sx={{ color: '#fff' }} /> },
    { text: 'Usuarios', path: '/usuarios', icon: <PersonIcon sx={{ color: '#fff' }} /> },
    { text: 'Subida Masiva', path: '/subida-masiva', icon: <CloudUploadIcon sx={{ color: '#fff' }} /> },
]

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    
    // Obtener información del usuario
    const userName = localStorage.getItem('userName') || 'Usuario';
    
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        navigate('/login');
    }

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2, color: '#fff' }}>
                Sistema Inventario
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <Button
                            component={Link}
                            to={item.path}
                            fullWidth
                            startIcon={item.icon}
                            sx={{
                                color: '#fff',
                                textTransform: 'none',
                                justifyContent: 'flex-start',
                                px: 2,
                                py: 1,
                                '&:hover': {
                                    backgroundColor: '#333'
                                }
                            }}
                        >
                            {item.text}
                        </Button>
                    </ListItem>
                ))}
                
                {/* Logout en el drawer móvil */}
                <ListItem disablePadding>
                    <Button
                        onClick={handleLogout}
                        fullWidth
                        startIcon={<LogoutIcon sx={{ color: '#fff' }} />}
                        sx={{
                            color: '#fff',
                            textTransform: 'none',
                            justifyContent: 'flex-start',
                            px: 2,
                            py: 1,
                            '&:hover': {
                                backgroundColor: '#333'
                            }
                        }}
                    >
                        Cerrar Sesión
                    </Button>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar sx={{ width: '100%', backgroundColor: '#1e1e1e' }}>
                <Toolbar>
                    <IconButton 
                        color="inherit" 
                        edge="start" 
                        onClick={handleDrawerToggle} 
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    > 
                        <MenuIcon/> 
                    </IconButton>
                    
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Sistema de Inventario
                    </Typography>

                    {/* Menú desktop */}
                    <Box sx={{ display: { xs: 'none', sm: 'flex', gap: 2, alignItems: 'center' } }}>
                        {navItems.map((item) => (
                            <Button 
                                key={item.text} 
                                component={Link} 
                                to={item.path} 
                                startIcon={item.icon} 
                                sx={{ 
                                    color: '#fff', 
                                    textTransform: 'none', 
                                    '&:hover': { 
                                        backgroundColor: '#333' 
                                    } 
                                }}
                            >
                                {item.text}
                            </Button>
                        ))}
                        
                        {/* Información del usuario y logout */}
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                            <AccountCircleIcon sx={{ mr: 1 }} />
                            <Typography variant="body2" sx={{ mr: 2 }}>
                                {userName}
                            </Typography>
                            
                            <Button
                                onClick={handleLogout}
                                startIcon={<LogoutIcon />}
                                sx={{
                                    color: '#fff',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#333'
                                    }
                                }}
                            >
                                Salir
                            </Button>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Menú para móviles */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 240,
                        backgroundColor: '#1e1e1e',
                        color: '#fff',
                    },
                }}
            >
                {drawer}
            </Drawer>
            
            <Toolbar />
        </Box>
    )
}

export default Navbar