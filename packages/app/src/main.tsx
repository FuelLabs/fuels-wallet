import '@fontsource/source-code-pro';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import { Sidebar } from './systems/Core/components/Sidebar';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Sidebar>
      <App />
    </Sidebar>
  </BrowserRouter>
);
