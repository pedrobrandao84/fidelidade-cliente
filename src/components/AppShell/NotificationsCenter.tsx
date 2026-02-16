import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useAuthStore } from '../../features/auth/store/authStore';
import { useNotifications } from '../../services/hooks/useNotifications';

export const NotificationsCenter = () => {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const user = useAuthStore((s) => s.user);
  const query = useNotifications({ audience: user?.role, clientId: user?.role === 'CLIENT' ? user.id : undefined, tenantId: user?.tenantId });
  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchor(e.currentTarget)}>
        <Badge badgeContent={query.data?.length ?? 0} color="error"><NotificationsIcon /></Badge>
      </IconButton>
      <Menu open={!!anchor} anchorEl={anchor} onClose={() => setAnchor(null)}>
        {(query.data ?? []).slice(0, 5).map((item) => <MenuItem key={item.id}>{item.title}</MenuItem>)}
      </Menu>
    </>
  );
};
