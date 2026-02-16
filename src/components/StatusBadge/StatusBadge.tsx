import { Chip } from '@mui/material';

export const StatusBadge = ({ value }: { value: string }) => <Chip size="small" label={value} color={value.includes('ACTIVE') || value.includes('APPROVED') ? 'success' : value.includes('PENDING') ? 'warning' : 'default'} />;
