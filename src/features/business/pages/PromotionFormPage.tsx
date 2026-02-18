import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { useCreatePromotion, usePromotionsList } from '../../../services/hooks/usePromotions';

const schema = z.object({ name: z.string().min(2), description: z.string().min(3), target: z.coerce.number().positive(), bonus: z.string().min(1) });

export const PromotionFormPage = () => {
  const { promotionId } = useParams();
  const tenantId = useAuthStore((s) => s.user?.tenantId) ?? '';
  const query = usePromotionsList(tenantId);
  const selected = query.data?.find((p) => p.id === promotionId);
  const create = useCreatePromotion();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<{ name: string; description: string; target: number; bonus: string }>({
    resolver: zodResolver(schema),
    values: { name: selected?.name ?? '', description: selected?.description ?? '', target: selected?.goal.target ?? 1, bonus: selected?.bonus.value ?? '' },
  });
  return (
    <Stack spacing={2}>
      <Typography variant="h4">{promotionId ? 'Editar promoção' : 'Nova promoção'}</Typography>
      <TextField label="Nome" {...register('name')} />
      <TextField label="Descrição" {...register('description')} />
      <TextField label="Meta" type="number" {...register('target')} />
      <TextField label="Bônus" {...register('bonus')} />
      <Button onClick={handleSubmit(async (values) => {
        await create.mutateAsync({ tenantId, name: values.name, description: values.description, goal: { type: 'POINTS', target: values.target }, bonus: { type: 'DISCOUNT', value: values.bonus }, expiresAt: new Date(Date.now() + 30 * 86400000).toISOString() });
        navigate('/biz/promotions');
      })}>Salvar</Button>
    </Stack>
  );
};
