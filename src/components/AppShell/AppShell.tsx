import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';
import { NotificationsCenter } from './NotificationsCenter';

export const AppShell = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>SaaS Fidelidade</Typography>
          {user ? <Typography sx={{ mr: 2 }}>{user.name}</Typography> : null}
          <NotificationsCenter />
          <Button color="inherit" component={Link} to="/">Home</Button>
          {user ? (
            <Button color="inherit" onClick={() => { logout(); navigate('/login'); }}>
              Sair
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
