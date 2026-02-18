import { zodResolver } from '@hookform/resolvers/zod';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { useToast } from '../../../app/providers';
import { useCreatePointRequest } from '../../../services/hooks/usePointRequests';

const schema = z
  .object({
    origin: z.enum(['COUNTER', 'RECEIPT']),
    note: z.string().optional(),
    receiptName: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.origin === 'RECEIPT' && !v.receiptName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Comprovante obrigatório', path: ['receiptName'] });
    }
  });

export const PointRequestPage = () => {
  const { promotionId = '', tenantId = '' } = useParams();
  const user = useAuthStore((s) => s.user);
  const create = useCreatePointRequest();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<{
    origin: 'COUNTER' | 'RECEIPT';
    note?: string;
    receiptName?: string;
  }>({ resolver: zodResolver(schema), defaultValues: { origin: 'COUNTER' } });

  const origin = watch('origin');

  return (
    <Stack spacing={2} maxWidth={560}>
      <Typography variant="h4" fontWeight={700}>Solicitar pontuação</Typography>
      <TextField select label="Origem" {...register('origin')}>
        <MenuItem value="COUNTER">Balcão</MenuItem>
        <MenuItem value="RECEIPT">Comprovante</MenuItem>
      </TextField>

      {origin === 'RECEIPT' ? (
        <Stack spacing={1}>
          <Button component="label" variant="outlined" startIcon={<UploadFileOutlinedIcon />}>
            Selecionar comprovante (mock)
            <input
              hidden
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setValue('receiptName', file.name, { shouldValidate: true });
              }}
            />
          </Button>
          <TextField label="Arquivo" {...register('receiptName')} error={!!errors.receiptName} helperText={errors.receiptName?.message} />
        </Stack>
      ) : null}

      <TextField label="Observação" {...register('note')} multiline minRows={3} />
      <Button
        variant="contained"
        disabled={create.isPending}
        onClick={handleSubmit(async (values) => {
          await create.mutateAsync({
            tenantId,
            promotionId,
            clientId: user?.id ?? '',
            origin: values.origin,
            note: values.note,
            receiptUrl: values.origin === 'RECEIPT' ? `blob://receipts/${values.receiptName}` : undefined,
          });
          showToast('Solicitação criada');
          navigate('/app/my-promotions');
        })}
      >
        Enviar solicitação
      </Button>
    </Stack>
  );
};
