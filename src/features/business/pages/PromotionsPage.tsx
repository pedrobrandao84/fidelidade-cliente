import { Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { useDuplicatePromotion, useExtendPromotion, usePromotionsList } from '../../../services/hooks/usePromotions';

export const PromotionsPage = () => {
  const tenantId = useAuthStore((s) => s.user?.tenantId);
  const query = usePromotionsList(tenantId);
  const extend = useExtendPromotion();
  const duplicate = useDuplicatePromotion();
  return (
    <Stack spacing={2}>
      <Button variant="contained" component={Link} to="/biz/promotions/new">Nova promoção</Button>
      {query.data?.map((promo) => (
        <Stack key={promo.id} border={1} p={2} spacing={1}>
          <Typography>{promo.name} ({promo.status})</Typography>
          <Button component={Link} to={`/biz/promotions/${promo.id}`}>Editar</Button>
          <Button onClick={() => void extend.mutate({ id: promo.id, expiresAt: new Date(Date.now() + 20 * 86400000).toISOString() })}>Prorrogar/Reativar</Button>
          <Button onClick={() => void duplicate.mutate(promo.id)}>Duplicar</Button>
        </Stack>
      ))}
    </Stack>
  );
};
