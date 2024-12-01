import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { useOdds } from '../../hooks/useOdds';
import { oddsApi } from '../../services/odds';
import MatchCard from './MatchCard';

const FOOTBALL_LEAGUES = [
  { key: 'all', name: 'Tous les matchs' },
  { key: 'soccer_uefa_champs_league', name: 'Champions League' },
  { key: 'soccer_france_ligue_one', name: 'Ligue 1' },
  { key: 'soccer_epl', name: 'Premier League' },
  { key: 'soccer_spain_la_liga', name: 'La Liga' },
  { key: 'soccer_italy_serie_a', name: 'Serie A' },
  { key: 'soccer_germany_bundesliga', name: 'Bundesliga' }
].filter(league => {
  if (league.key === 'all') return true;
  const config = oddsApi.getSportConfig(league.key);
  return config.enabled;
});

export default function FootballMatches() {
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [allMatches, setAllMatches] = useState<any[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  
  // Charger les matchs pour la ligue sélectionnée
  const { data: leagueMatches, isLoading: isLoadingLeague, error, refetch } = useOdds(
    selectedLeague === 'all' ? 'soccer_uefa_champs_league' : selectedLeague
  );

  // Charger tous les matchs de toutes les ligues
  useEffect(() => {
    const fetchAllMatches = async () => {
      if (selectedLeague !== 'all') return;
      
      setIsLoadingAll(true);
      try {
        const promises = FOOTBALL_LEAGUES
          .filter(league => league.key !== 'all')
          .map(league => oddsApi.getOdds(league.key));
        
        const results = await Promise.all(promises);
        const allMatches = results.flat();
        setAllMatches(allMatches);
      } catch (err) {
        console.error('Error fetching all matches:', err);
      } finally {
        setIsLoadingAll(false);
      }
    };

    if (selectedLeague === 'all') {
      fetchAllMatches();
    }
  }, [selectedLeague]);

  const handleRefresh = () => {
    if (selectedLeague === 'all') {
      setSelectedLeague('all'); // Déclencher le useEffect
    } else {
      refetch();
    }
  };

  // Filtrer les matchs du jour
  const matches = selectedLeague === 'all' ? allMatches : leagueMatches;
  const todayMatches = matches?.filter(match => {
    const matchDate = new Date(match.commence_time);
    const today = new Date();
    return (
      matchDate.getDate() === today.getDate() &&
      matchDate.getMonth() === today.getMonth() &&
      matchDate.getFullYear() === today.getFullYear()
    );
  });

  const isLoading = selectedLeague === 'all' ? isLoadingAll : isLoadingLeague;

  const getErrorMessage = () => {
    if (!error) return '';
    
    switch (error.code) {
      case 'SPORT_DISABLED':
        return 'Ce championnat est temporairement indisponible';
      case 'API_CONNECTION_ERROR':
        return 'Impossible de se connecter au service des cotes';
      case 'API_RATE_LIMIT':
        return 'Trop de requêtes, veuillez réessayer dans quelques instants';
      default:
        return 'Une erreur est survenue lors du chargement des matchs';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Football</h2>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Actualiser</span>
        </button>
      </div>

      {/* League Selector */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="font-medium text-gray-700">Championnats</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {FOOTBALL_LEAGUES.map((league) => (
            <button
              key={league.key}
              onClick={() => setSelectedLeague(league.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedLeague === league.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {league.name}
            </button>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{getErrorMessage()}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      ) : !todayMatches || todayMatches.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {selectedLeague === 'all' 
              ? "Aucun match prévu aujourd'hui dans les championnats disponibles"
              : "Aucun match prévu aujourd'hui dans ce championnat"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todayMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}