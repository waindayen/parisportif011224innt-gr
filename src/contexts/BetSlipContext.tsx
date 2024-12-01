import React, { createContext, useContext, useState } from 'react';

export interface Bet {
  id: string;
  match: string;
  selection: string;
  odds: number;
  stake?: number;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  type: '1' | 'X' | '2';
}

interface BetSlipContextType {
  bets: Bet[];
  addBet: (bet: Bet) => void;
  removeBet: (id: string) => void;
  clearBets: () => void;
  updateStake: (id: string, stake: number) => void;
  hasBet: (matchId: string, type: '1' | 'X' | '2') => boolean;
}

const BetSlipContext = createContext<BetSlipContextType | undefined>(undefined);

export function BetSlipProvider({ children }: { children: React.ReactNode }) {
  const [bets, setBets] = useState<Bet[]>([]);

  const addBet = (bet: Bet) => {
    setBets(prev => {
      // Check if bet already exists
      const existingBet = prev.find(b => b.matchId === bet.matchId && b.type === bet.type);
      if (existingBet) {
        // Remove existing bet if it exists
        return prev.filter(b => b.id !== existingBet.id);
      }
      // Add new bet
      return [...prev, bet];
    });
  };

  const removeBet = (id: string) => {
    setBets(prev => prev.filter(bet => bet.id !== id));
  };

  const clearBets = () => {
    setBets([]);
  };

  const updateStake = (id: string, stake: number) => {
    setBets(prev => prev.map(bet => 
      bet.id === id ? { ...bet, stake } : bet
    ));
  };

  const hasBet = (matchId: string, type: '1' | 'X' | '2') => {
    return bets.some(bet => bet.matchId === matchId && bet.type === type);
  };

  return (
    <BetSlipContext.Provider value={{ bets, addBet, removeBet, clearBets, updateStake, hasBet }}>
      {children}
    </BetSlipContext.Provider>
  );
}

export function useBetSlip() {
  const context = useContext(BetSlipContext);
  if (context === undefined) {
    throw new Error('useBetSlip must be used within a BetSlipProvider');
  }
  return context;
}