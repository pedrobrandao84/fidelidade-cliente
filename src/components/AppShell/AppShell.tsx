import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';
import { NotificationsCenter } from './NotificationsCenter';

const drawerWidth = 260;

export const AppShell = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  const items = useMemo(() => {
    if (!user) return [{ label: 'Início', to: '/' }, { label: 'Login', to: '/login' }, { label: 'Registro', to: '/register' }];
    if (user.role === 'CLIENT') {
      return [
        { label: 'Descobrir', to: '/app/discover' },
        { label: 'Minhas promoções', to: '/app/my-promotions' },
        { label: 'Notificações', to: '/app/notifications' },
        { label: 'Preferências', to: '/app/preferences' },
      ];
    }
    if (user.role === 'BUSINESS') {
      return [
        { label: 'Dashboard', to: '/biz/dashboard' },
        { label: 'Onboarding', to: '/biz/onboarding' },
        { label: 'Promoções', to: '/biz/promotions' },
        { label: 'Solicitações de acesso', to: '/biz/join-requests' },
        { label: 'Solicitações de pontos', to: '/biz/point-requests' },
        { label: 'Clientes', to: '/biz/customers' },
        { label: 'Notificações', to: '/biz/notifications' },
        { label: 'Configurações', to: '/biz/settings' },
      ];
    }
    return [
      { label: 'Empresas', to: '/admin/tenants' },
      { label: 'Financeiro', to: '/admin/finance' },
      { label: 'Alertas', to: '/admin/alerts' },
    ];
  }, [user]);

  const drawer = (
    <Box sx={{ width: drawerWidth, p: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar>{user?.name?.[0] ?? 'G'}</Avatar>
          <Box>
            <Typography fontWeight={600}>{user?.name ?? 'Visitante'}</Typography>
            {user ? <Chip size="small" label={user.role} color="primary" /> : null}
          </Box>
        </Stack>
        <Divider />
        <List>
          {items.map((item) => (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={location.pathname === item.to}
              onClick={() => setOpen(false)}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f7f8fa' }}>
      {mobile ? (
        <Drawer open={open} onClose={() => setOpen(false)}>
          {drawer}
        </Drawer>
      ) : (
        <Drawer variant="permanent" open>
          {drawer}
        </Drawer>
      )}
      <Box sx={{ flex: 1, ml: mobile ? 0 : `${drawerWidth}px` }}>
        <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: '1px solid #eceff3' }}>
          <Toolbar>
            {mobile ? (
              <IconButton onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            ) : null}
            <Typography sx={{ flexGrow: 1, fontWeight: 600 }}>FidelityHub SaaS</Typography>
            {user ? <NotificationsCenter /> : null}
            {user ? (
              <Chip
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                label="Sair"
                variant="outlined"
              />
            ) : null}
          </Toolbar>
        </AppBar>
        <Container sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};
