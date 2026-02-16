import { zodResolver } from '@hookform/resolvers/zod';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { useCreatePointRequest } from '../../../services/hooks/usePointRequests';
import { useToast } from '../../../app/providers';

const schema = z.object({
  origin: z.enum(['COUNTER', 'RECEIPT']),
  note: z.string().optional(),
  receiptName: z.string().optional(),
}).superRefine((v, ctx) => {
  if (v.origin === 'RECEIPT' && !v.receiptName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Comprovante obrigatório', path: ['receiptName'] });
});

export const PointRequestPage = () => {
  const { promotionId = '', tenantId = '' } = useParams();
  const user = useAuthStore((s) => s.user);
  const create = useCreatePointRequest();
  const { showToast } = useToast();
  const { register, handleSubmit, watch } = useForm<{ origin: 'COUNTER' | 'RECEIPT'; note?: string; receiptName?: string }>({ resolver: zodResolver(schema), defaultValues: { origin: 'COUNTER' } });
  const origin = watch('origin');
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Solicitar pontuação</Typography>
      <TextField select label="Origem" {...register('origin')}><MenuItem value="COUNTER">Balcão</MenuItem><MenuItem value="RECEIPT">Comprovante</MenuItem></TextField>
      {origin === 'RECEIPT' ? <TextField label="Nome do arquivo" {...register('receiptName')} /> : null}
      <TextField label="Observação" {...register('note')} />
      <Button onClick={handleSubmit(async (values) => {
        await create.mutateAsync({ tenantId, promotionId, clientId: user?.id ?? '', origin: values.origin, note: values.note, receiptUrl: values.origin === 'RECEIPT' ? `blob://receipts/${values.receiptName}` : undefined });
        showToast('Solicitação criada');
      })}>Enviar</Button>
    </Stack>
  );
};
