export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const symbolMap: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥'
  };

  const symbol = symbolMap[currency.toUpperCase()] || '$';
  let convertedAmount = amount;

  // Simple hardcoded mock exchange rates (relative to base USD)
  if (currency.toUpperCase() === 'EUR') convertedAmount = amount * 0.92;
  else if (currency.toUpperCase() === 'GBP') convertedAmount = amount * 0.78;
  else if (currency.toUpperCase() === 'INR') convertedAmount = amount * 83.5;
  else if (currency.toUpperCase() === 'JPY') convertedAmount = amount * 155.0;

  return `${symbol}${convertedAmount.toLocaleString(undefined, {
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
