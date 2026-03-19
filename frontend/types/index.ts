export interface Invoice {
  id: number;
  owner: string;
  amount: number;
  discount_price: number;
  due_date: number;
  status: 'Open' | 'Funded' | 'Settled';
  investor?: string;
  funded_at?: number;
  settled_at?: number;
}

export interface BusinessInfo {
  address: string;
  name: string;
  is_verified: boolean;
  verification_date?: number;
  kyc_level: number;
}

export interface StellarAccount {
  publicKey: string;
  secretKey?: string;
  balance?: string;
}
