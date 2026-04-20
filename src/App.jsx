import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Screen1 from './pages/Screen1';
import Screen2 from './pages/Screen2';
import Screen4 from './pages/Screen4';
import Screen5 from './pages/Screen5';
import Screen6 from './pages/Screen6';
import Screen7 from './pages/Screen7';
import Screen8 from './pages/Screen8';
import Screen9 from './pages/Screen9';
import Screen10 from './pages/Screen10';
import Screen11 from './pages/Screen11';
import Screen3 from './pages/Screen3';
import LogoutSuccess from './pages/LogoutSuccess';
import NotFound from './pages/NotFound';
import MobileMiddleware from './components/MobileMiddleware';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NavigationBlocker from './components/NavigationBlocker';

const RootRedirect = () => {
  const pageSearchParams = new URLSearchParams(window.location.search);
  const cabinetId = pageSearchParams.get('cabinetId') || pageSearchParams.get('chargerId');
  const target = cabinetId ? `/screen1?${pageSearchParams.toString()}` : '/screen1';

  return <Navigate to={target} replace />;
};

function App() {
  return (
    <HashRouter>
      {/* <NavigationBlocker> */}
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/screen1" element={<MobileMiddleware><Screen1 /></MobileMiddleware>} />
        <Route path="/logout-success" element={<MobileMiddleware><LogoutSuccess /></MobileMiddleware>} />


        {/* Mobile flow */}
        <Route path="/screen2" element={<MobileMiddleware><Screen2 /></MobileMiddleware>} />
        <Route path="/screen3" element={<MobileMiddleware><Screen3 /></MobileMiddleware>} />
        <Route path="/screen4" element={<MobileMiddleware><ProtectedRoute><Screen4 /></ProtectedRoute></MobileMiddleware>} />
        <Route path="/screen5" element={<MobileMiddleware><ProtectedRoute><Screen5 /></ProtectedRoute></MobileMiddleware>} />
        <Route path="/screen6" element={<MobileMiddleware><ProtectedRoute><Screen6 /></ProtectedRoute></MobileMiddleware>} />
        <Route path="/screen7" element={<MobileMiddleware><ProtectedRoute><Screen7 /></ProtectedRoute></MobileMiddleware>} />
        <Route path="/screen8" element={<MobileMiddleware><ProtectedRoute><Screen8 /></ProtectedRoute></MobileMiddleware>} />
        <Route path="/screen9" element={<MobileMiddleware><ProtectedRoute><Screen9 /></ProtectedRoute></MobileMiddleware>} />
        <Route path="/screen10" element={<MobileMiddleware><ProtectedRoute><Screen10 /></ProtectedRoute></MobileMiddleware>} />
        <Route path="/screen11" element={<MobileMiddleware><ProtectedRoute><Screen11 /></ProtectedRoute></MobileMiddleware>} />

        {/* 404 Route */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      {/* </NavigationBlocker> */}
    </HashRouter>
  );
}

export default App;
