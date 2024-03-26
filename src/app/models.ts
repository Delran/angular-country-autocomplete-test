export type Country = {
  name: {
    common: string
  };
  currencies: Record<string, Currency>
}

export type Currency = {
  code: string;
  name: string;
  symbol: string;
}
