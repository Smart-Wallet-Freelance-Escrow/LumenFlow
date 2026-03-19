// Stellar Testnet Constants
export const STELLAR_NETWORK = 'TESTNET'
export const HORIZON_URL = 'https://horizon-testnet.stellar.org'
export const FRIENDBOT_URL = 'https://friendbot.stellar.org'

// Testnet USDC Asset (Circle's USDC on Stellar Testnet)
export const USDC_ASSET_CODE = 'USDC'
export const USDC_ISSUER = 'GBBD47IF6LWK7P7MJVSCUFI274NM5YCFA247JEC2HGJLMD2BDQD2XUJR'

// Contract Addresses (These will be populated after deployment)
export const CONTRACT_ADDRESSES = {
  INVOICE_CONTRACT: '',
  REGISTRY_CONTRACT: '',
} as const

// Default Platform Configuration
export const PLATFORM_CONFIG = {
  PLATFORM_FEE_BPS: 50, // 0.5% platform fee in basis points
  MIN_INVOICE_AMOUNT: 100, // Minimum invoice amount in USD
  MAX_INVOICE_AMOUNT: 1000000, // Maximum invoice amount in USD
  MIN_DISCOUNT_PERCENT: 0.1, // Minimum discount percentage
  MAX_DISCOUNT_PERCENT: 20, // Maximum discount percentage
  MIN_DUE_DATE_HOURS: 24, // Minimum hours until due date
  MAX_DUE_DATE_DAYS: 365, // Maximum days until due date
} as const

// KYC Levels
export const KYC_LEVELS = {
  NONE: 0,
  BASIC: 1,
  ENHANCED: 2,
} as const

// Invoice Status
export const INVOICE_STATUS = {
  OPEN: 'Open',
  FUNDED: 'Funded',
  SETTLED: 'Settled',
} as const

// Transaction Types
export const TRANSACTION_TYPES = {
  MINT_INVOICE: 'mint_invoice',
  FUND_INVOICE: 'fund_invoice',
  SETTLE_INVOICE: 'settle_invoice',
  REGISTER_BUSINESS: 'register_business',
  VERIFY_BUSINESS: 'verify_business',
  REVOKE_VERIFICATION: 'revoke_verification',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  CONTRACT_NOT_INITIALIZED: 'Contract not initialized',
  UNAUTHORIZED: 'Unauthorized action',
  BUSINESS_NOT_VERIFIED: 'Business not verified',
  INVALID_AMOUNT: 'Invalid amount',
  INVALID_DISCOUNT_PRICE: 'Discount price must be less than amount',
  INVALID_DUE_DATE: 'Due date must be in the future',
  INVOICE_NOT_FOUND: 'Invoice not found',
  INVOICE_NOT_OPEN: 'Invoice not open for funding',
  INVOICE_NOT_FUNDED: 'Invoice not funded',
  INVOICE_NOT_DUE: 'Invoice not due yet',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  TRANSACTION_FAILED: 'Transaction failed',
} as const

// UI Constants
export const UI_CONSTANTS = {
  PAGINATION_SIZE: 10,
  REFRESH_INTERVAL: 30000, // 30 seconds
  TOAST_DURATION: 5000, // 5 seconds
} as const
