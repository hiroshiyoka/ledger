import { useState, useEffect } from 'react';

import type { Wallet } from '../types';
import { STORAGE_KEYS, DEFAULT_WALLETS } from '../constants';

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WALLETS);
      
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load wallets from localStorage', error);
    }
    return DEFAULT_WALLETS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
  }, [wallets]);

  const addWallet = (wallet: Omit<Wallet, 'id'>) => {
    const newWallet: Wallet = { ...wallet, id: crypto.randomUUID() };
    setWallets(prev => [...prev, newWallet]);
  };

  const updateWallet = (updatedWallet: Wallet) => {
    setWallets(prev => prev.map(w => (w.id === updatedWallet.id ? updatedWallet : w)));
  };

  const deleteWallet = (id: string) => {
    setWallets(prev => prev.filter(w => w.id !== id));
  };

  return { wallets, addWallet, updateWallet, deleteWallet };
}
