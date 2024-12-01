import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BetSlipProvider } from './contexts/BetSlipContext';
import Header from './components/layout/Header';
import BetSlip from './components/betslip/BetSlip';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Unauthorized from './pages/Unauthorized';
import MobileBetSlip from './pages/MobileBetSlip';
import Football from './pages/Football';
import Lotto from './pages/Lotto';
import Contact from './pages/Contact';
import LottoResults from './pages/LottoResults';

// Dashboards
import ExternalDashboard from './pages/dashboards/ExternalDashboard';
import AgentDashboard from './pages/dashboards/AgentDashboard';
import StaffDashboard from './pages/dashboards/StaffDashboard';
import ManagerDashboard from './pages/dashboards/ManagerDashboard';
import DirectDashboard from './pages/dashboards/DirectDashboard';
import ApiDashboard from './pages/dashboards/ApiDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import UcierDashboard from './pages/dashboards/UcierDashboard';
import SiteConfig from './pages/dashboards/SiteConfig';
import LottoDraws from './pages/dashboards/LottoDraws';
import LottoList from './pages/dashboards/LottoList';
import SetupLotto from './pages/dashboards/SetupLotto';

// API Configuration Pages
import OddsConfigPage from './pages/dashboards/api/OddsConfigPage';
import SportsConfigPage from './pages/dashboards/api/SportsConfigPage';

// Extract MainLayout to a separate component to use hooks
const MainLayout: React.FC = () => {
  const [isBetSlipOpen, setIsBetSlipOpen] = React.useState(true);
  const location = useLocation();
  const showBetSlip = location.pathname === '/' || location.pathname === '/football';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onToggleBetSlip={() => setIsBetSlipOpen(!isBetSlipOpen)} showBetSlip={showBetSlip} />
      <div className={`pt-16 pb-16 md:pb-0 ${showBetSlip ? 'md:pr-80' : ''}`}>
        <Outlet />
      </div>
      {showBetSlip && (
        <div className="hidden md:block">
          <BetSlip isOpen={isBetSlipOpen} onToggle={() => setIsBetSlipOpen(!isBetSlipOpen)} />
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BetSlipProvider>
        <Router>
          <Routes>
            {/* Routes publiques avec AuthLayout */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Routes publiques avec MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/football" element={<Football />} />
              <Route path="/lotto" element={<Lotto />} />
              <Route path="/lotto/results" element={<LottoResults />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/betslip" element={<MobileBetSlip />} />
            </Route>

            {/* Routes protégées avec DashboardLayout */}
            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<Navigate to="/dashboard/external" replace />} />
                
                {/* Routes Admin */}
                <Route path="admin" element={<RoleRoute allowedRoles={['adminuser']}><AdminDashboard /></RoleRoute>} />
                <Route path="admin/site-config" element={<RoleRoute allowedRoles={['adminuser']}><SiteConfig /></RoleRoute>} />
                <Route path="admin/lotto-list" element={<RoleRoute allowedRoles={['adminuser']}><LottoList /></RoleRoute>} />
                <Route path="admin/lotto-draws" element={<RoleRoute allowedRoles={['adminuser']}><LottoDraws /></RoleRoute>} />
                <Route path="admin/setup-lotto" element={<RoleRoute allowedRoles={['adminuser']}><SetupLotto /></RoleRoute>} />

                {/* Routes API */}
                <Route path="api" element={<RoleRoute allowedRoles={['apiuser']}><ApiDashboard /></RoleRoute>} />
                <Route path="api/odds-config" element={<RoleRoute allowedRoles={['apiuser']}><OddsConfigPage /></RoleRoute>} />
                <Route path="api/sports-config" element={<RoleRoute allowedRoles={['apiuser']}><SportsConfigPage /></RoleRoute>} />

                {/* Routes Ucier */}
                <Route path="ucier" element={<RoleRoute allowedRoles={['ucieruser']}><UcierDashboard /></RoleRoute>} />
                <Route path="ucier/lotto-list" element={<RoleRoute allowedRoles={['ucieruser']}><LottoList /></RoleRoute>} />
                <Route path="ucier/lotto-draws" element={<RoleRoute allowedRoles={['ucieruser']}><LottoDraws /></RoleRoute>} />

                {/* Autres routes */}
                <Route path="external" element={<RoleRoute allowedRoles={['externaluser']}><ExternalDashboard /></RoleRoute>} />
                <Route path="agent" element={<RoleRoute allowedRoles={['agentuser']}><AgentDashboard /></RoleRoute>} />
                <Route path="staff" element={<RoleRoute allowedRoles={['staffuser']}><StaffDashboard /></RoleRoute>} />
                <Route path="manager" element={<RoleRoute allowedRoles={['manageruser']}><ManagerDashboard /></RoleRoute>} />
                <Route path="direct" element={<RoleRoute allowedRoles={['directUser']}><DirectDashboard /></RoleRoute>} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </BetSlipProvider>
    </AuthProvider>
  );
};

export default App;