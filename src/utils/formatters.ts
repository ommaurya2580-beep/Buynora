export const formatCurrency = (amount: number, currency?: string): string => {
  const activeCurrency = currency || localStorage.getItem('currency') || 'INR';
  const symbolMap: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥'
  };

  const symbol = symbolMap[activeCurrency.toUpperCase()] || '₹';
  let convertedAmount = amount;

  // Base amounts are now assumed to be in INR.
  if (activeCurrency.toUpperCase() === 'USD') convertedAmount = amount / 83.5;
  else if (activeCurrency.toUpperCase() === 'EUR') convertedAmount = amount / 90.5;
  else if (activeCurrency.toUpperCase() === 'GBP') convertedAmount = amount / 105.2;
  else if (activeCurrency.toUpperCase() === 'JPY') convertedAmount = amount * 1.8;

  return `${symbol}${convertedAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const generateTrackingNumber = (): string => {
  return 'NORA-' + Math.random().toString(36).substring(2, 11).toUpperCase();
};
