import { zodResolver } from '@hookform/resolvers/zod';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { Alert, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { PageSkeleton } from '../../../components/Skeletons/PageSkeleton';
import { useLogin, useUsers } from '../../../services/hooks/useAuth';
import { useAuthStore } from '../store/authStore';

const schema = z.object({ userId: z.string().min(1, 'Selecione um usuário') });

export const LoginPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const usersQuery = useUsers();
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<{ userId: string }>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    const user = await login.mutateAsync(values.userId);
    setUser(user);
    navigate(user.role === 'CLIENT' ? '/app/discover' : user.role === 'BUSINESS' ? '/biz/dashboard' : '/admin/tenants');
  });

  if (usersQuery.isLoading) return <PageSkeleton />;

  return (
    <Card sx={{ maxWidth: 520 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight={700}>Entrar na plataforma</Typography>
          <Typography color="text.secondary">Selecione um perfil mock para navegar nas áreas Cliente, Empresa e Admin.</Typography>
          {login.isError ? <Alert severity="error">Falha ao autenticar. Tente novamente.</Alert> : null}
          <TextField select label="Selecione usuário" {...register('userId')} error={!!errors.userId} helperText={errors.userId?.message}>
            {usersQuery.data?.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} ({user.role})
              </MenuItem>
            ))}
          </TextField>
          <Button startIcon={<LoginOutlinedIcon />} variant="contained" onClick={onSubmit} disabled={login.isPending}>
            Entrar
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
