import { zodResolver } from '@hookform/resolvers/zod';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useLogin, useUsers } from '../../../services/hooks/useAuth';
import { useAuthStore } from '../store/authStore';

const schema = z.object({ userId: z.string().min(1) });

export const LoginPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const usersQuery = useUsers();
  const login = useLogin();
  const { register, handleSubmit } = useForm<{ userId: string }>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    const user = await login.mutateAsync(values.userId);
    setUser(user);
    navigate(user.role === 'CLIENT' ? '/app/discover' : user.role === 'BUSINESS' ? '/biz/dashboard' : '/admin/tenants');
  });

  return (
    <Stack spacing={2} maxWidth={420}>
      <Typography variant="h4">Login mock</Typography>
      <TextField select label="Selecione usuário" {...register('userId')}>
        {usersQuery.data?.map((user) => (
          <MenuItem key={user.id} value={user.id}>{user.name} ({user.role})</MenuItem>
        ))}
      </TextField>
      <Button variant="contained" onClick={onSubmit}>Entrar</Button>
    </Stack>
  );
};
