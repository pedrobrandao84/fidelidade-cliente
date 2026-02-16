import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import { AppProviders } from './app/providers';

async function enableMocks() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' }).catch(() => undefined);
  }
}

enableMocks().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <AppProviders>
      <App />
    </AppProviders>,
  );
});
