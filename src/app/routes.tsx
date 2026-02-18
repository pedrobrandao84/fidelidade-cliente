import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Button, Card, CardContent, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AppShell } from '../components/AppShell/AppShell';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { useAuthStore } from '../features/auth/store/authStore';
import { DiscoverPage } from '../features/client/pages/DiscoverPage';
import { TenantDetailsPage } from '../features/client/pages/TenantDetailsPage';
import { MyPromotionsPage } from '../features/client/pages/MyPromotionsPage';
import { PromotionDetailsPage } from '../features/client/pages/PromotionDetailsPage';
import { PointRequestPage } from '../features/client/pages/PointRequestPage';
import { PreferencesPage } from '../features/client/pages/PreferencesPage';
import { NotificationsPage } from '../features/client/pages/NotificationsPage';
import { OnboardingPage } from '../features/business/pages/OnboardingPage';
import { DashboardPage } from '../features/business/pages/DashboardPage';
import { PromotionsPage } from '../features/business/pages/PromotionsPage';
import { PromotionFormPage } from '../features/business/pages/PromotionFormPage';
import { JoinRequestsPage } from '../features/business/pages/JoinRequestsPage';
import { PointRequestsPage } from '../features/business/pages/PointRequestsPage';
import { CustomersPage } from '../features/business/pages/CustomersPage';
import { BusinessNotificationsPage } from '../features/business/pages/BusinessNotificationsPage';
import { BusinessSettingsPage } from '../features/business/pages/BusinessSettingsPage';
import { AlertsPage } from '../features/admin/pages/AlertsPage';
import { FinancePage } from '../features/admin/pages/FinancePage';
import { TenantsPage } from '../features/admin/pages/TenantsPage';
import type { UserRole } from '../services/types';

const Landing = () => (
  <Stack spacing={3}>
    <Typography variant="h3" fontWeight={700}>
      Fidelidade com experiência SaaS moderna
    </Typography>
    <Typography color="text.secondary">
      Plataforma única para clientes, empresas e administradores gerenciarem campanhas de fidelidade com notificações inteligentes.
    </Typography>
    <Grid container spacing={2}>
      {[
        ['Cliente', 'Descubra empresas próximas e acompanhe progresso.'],
        ['Empresa', 'Crie campanhas, valide solicitações e retenha clientes.'],
        ['Admin', 'Monitore indicadores sem acessar PII.'],
      ].map(([title, text]) => (
        <Grid size={{ xs: 12, md: 4 }} key={title}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">{title}</Typography>
              <Typography color="text.secondary">{text}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    <Stack direction="row" spacing={2}>
      <Button component={Link} to="/login" variant="contained">
        Entrar
      </Button>
      <Button component={Link} to="/register" variant="outlined">
        Criar conta
      </Button>
    </Stack>
  </Stack>
);
const Register = () => <Typography>Registro em breve (mock).</Typography>;
const Forbidden = () => <Typography>Acesso proibido.</Typography>;

const RequireRole = ({ roles, children }: { roles: UserRole[]; children: React.ReactNode }) => {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/forbidden" replace />;
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <Register /> },
      { path: 'forbidden', element: <Forbidden /> },
      { path: 'app', element: <Navigate to="/app/discover" replace /> },
      { path: 'app/discover', element: <RequireRole roles={['CLIENT']}><DiscoverPage /></RequireRole> },
      { path: 'app/tenant/:tenantId', element: <RequireRole roles={['CLIENT']}><TenantDetailsPage /></RequireRole> },
      { path: 'app/my-promotions', element: <RequireRole roles={['CLIENT']}><MyPromotionsPage /></RequireRole> },
      { path: 'app/promotion/:promotionId', element: <RequireRole roles={['CLIENT']}><PromotionDetailsPage /></RequireRole> },
      { path: 'app/promotion/:promotionId/tenant/:tenantId/request', element: <RequireRole roles={['CLIENT']}><PointRequestPage /></RequireRole> },
      { path: 'app/preferences', element: <RequireRole roles={['CLIENT']}><PreferencesPage /></RequireRole> },
      { path: 'app/notifications', element: <RequireRole roles={['CLIENT']}><NotificationsPage /></RequireRole> },
      { path: 'biz', element: <Navigate to="/biz/dashboard" replace /> },
      { path: 'biz/onboarding', element: <RequireRole roles={['BUSINESS']}><OnboardingPage /></RequireRole> },
      { path: 'biz/dashboard', element: <RequireRole roles={['BUSINESS']}><DashboardPage /></RequireRole> },
      { path: 'biz/promotions', element: <RequireRole roles={['BUSINESS']}><PromotionsPage /></RequireRole> },
      { path: 'biz/promotions/new', element: <RequireRole roles={['BUSINESS']}><PromotionFormPage /></RequireRole> },
      { path: 'biz/promotions/:promotionId', element: <RequireRole roles={['BUSINESS']}><PromotionFormPage /></RequireRole> },
      { path: 'biz/join-requests', element: <RequireRole roles={['BUSINESS']}><JoinRequestsPage /></RequireRole> },
      { path: 'biz/point-requests', element: <RequireRole roles={['BUSINESS']}><PointRequestsPage /></RequireRole> },
      { path: 'biz/customers', element: <RequireRole roles={['BUSINESS']}><CustomersPage /></RequireRole> },
      { path: 'biz/notifications', element: <RequireRole roles={['BUSINESS']}><BusinessNotificationsPage /></RequireRole> },
      { path: 'biz/settings', element: <RequireRole roles={['BUSINESS']}><BusinessSettingsPage /></RequireRole> },
      { path: 'admin', element: <Navigate to="/admin/tenants" replace /> },
      { path: 'admin/tenants', element: <RequireRole roles={['ADMIN']}><TenantsPage /></RequireRole> },
      { path: 'admin/finance', element: <RequireRole roles={['ADMIN']}><FinancePage /></RequireRole> },
      { path: 'admin/alerts', element: <RequireRole roles={['ADMIN']}><AlertsPage /></RequireRole> },
    ],
  },
]);
