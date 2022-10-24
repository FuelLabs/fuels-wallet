import { Routes, Route } from 'react-router-dom';

import { DApp } from './pages/DApp';
import Home from './pages/Home';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/dapp" element={<DApp />} />
    </Routes>
  );
}
