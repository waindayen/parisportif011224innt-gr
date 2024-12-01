import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Gamepad2, Trophy, LogIn, UserPlus, Home, Calculator, Phone, Ticket } from 'lucide-react';
import Logo from './Logo';
import DashboardMenu from '../DashboardMenu';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onToggleBetSlip: () => void;
  showBetSlip: boolean;
}

export default function Header({ onToggleBetSlip, showBetSlip }: HeaderProps) {
  const { bets } = useBetSlip();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleBetSlipClick = () => {
    if (window.innerWidth < 768) {
      navigate('/betslip');
    } else {
      onToggleBetSlip();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Home className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Accueil</span>
            </Link>
            <Link
              to="/football"
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Gamepad2 className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Football</span>
            </Link>
            <Link
              to="/lotto"
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Ticket className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Lotto</span>
            </Link>
            <Link
              to="/lotto/results"
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Trophy className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Résultats</span>
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Phone className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Contact</span>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <DashboardMenu />
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <LogIn className="w-5 h-5 text-blue-600" />
                  <span className="hidden sm:inline font-medium">Connexion</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Inscription</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-1 ${
              location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Accueil</span>
          </Link>
          <Link
            to="/football"
            className={`flex flex-col items-center justify-center gap-1 ${
              location.pathname === '/football' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Gamepad2 className="w-6 h-6" />
            <span className="text-xs">Football</span>
          </Link>
          <Link
            to="/lotto"
            className={`flex flex-col items-center justify-center gap-1 ${
              location.pathname === '/lotto' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Ticket className="w-6 h-6" />
            <span className="text-xs">Lotto</span>
          </Link>
          <Link
            to="/lotto/results"
            className={`flex flex-col items-center justify-center gap-1 ${
              location.pathname === '/lotto/results' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Trophy className="w-6 h-6" />
            <span className="text-xs">Résultats</span>
          </Link>
          <Link
            to="/contact"
            className={`flex flex-col items-center justify-center gap-1 ${
              location.pathname === '/contact' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Phone className="w-6 h-6" />
            <span className="text-xs">Contact</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}