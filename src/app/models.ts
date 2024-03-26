export type Country = {
  name: {
    common: string
  };
  currencies: Record<string, Currency>
}

export type Currency = {
  name: string;
  symbol: string;
}
