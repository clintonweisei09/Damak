import React, { createContext, useContext, useState } from 'react';

export type Currency = 'KES' | 'USD' | 'EUR' | 'GBP';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInUSD: number) => string;
  convertPrice: (amountInUSD: number) => number;
}

// Exchange rates relative to base KES (Kenyan Shillings)
const EXCHANGE_RATES: Record<Currency, { rate: number; symbol: string; prefix: string; decimals: number }> = {
  KES: { rate: 1.0, symbol: 'KSh', prefix: 'KSh ', decimals: 0 },
  USD: { rate: 1 / 130, symbol: '$', prefix: '$', decimals: 2 },
  EUR: { rate: 0.92 / 130, symbol: '€', prefix: '€', decimals: 2 },
  GBP: { rate: 0.78 / 130, symbol: '£', prefix: '£', decimals: 2 },
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default currency is Kenyan Shillings (KES)
  const [currency, setCurrency] = useState<Currency>('KES');

  const convertPrice = (amountInKES: number): number => {
    const config = EXCHANGE_RATES[currency];
    const converted = amountInKES * config.rate;
    return config.decimals === 0 ? Math.round(converted) : Number(converted.toFixed(config.decimals));
  };

  const formatPrice = (amountInKES: number): string => {
    const config = EXCHANGE_RATES[currency];
    const converted = amountInKES * config.rate;
    if (config.decimals === 0) {
      return `${config.prefix}${Math.round(converted).toLocaleString('en-US')}`;
    }
    return `${config.prefix}${converted.toFixed(config.decimals)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
