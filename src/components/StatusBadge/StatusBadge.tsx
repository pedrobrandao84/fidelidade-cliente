import { Chip } from '@mui/material';

const mapColor = (value: string) => {
  if (value.includes('ACTIVE') || value.includes('APPROVED') || value.includes('COMPLETED')) return 'success';
  if (value.includes('PENDING')) return 'warning';
  if (value.includes('SUSPENDED') || value.includes('REJECTED') || value.includes('EXPIRED')) return 'error';
  return 'default';
};

export const StatusBadge = ({ value }: { value: string }) => (
  <Chip size="small" label={value.replaceAll('_', ' ')} color={mapColor(value)} />
);
