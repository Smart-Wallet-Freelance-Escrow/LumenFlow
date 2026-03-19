'use client'

import { useState } from 'react'
import { Wallet, LogOut } from 'lucide-react'
import { StellarService } from '@/lib/stellar'
import { StellarAccount } from '@/types'

export function WalletConnect() {
  const [account, setAccount] = useState<StellarAccount | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const stellarService = new StellarService()

  const connectWallet = async () => {
    setIsLoading(true)
    try {
      const { publicKey, secretKey } = await stellarService.connectWallet()
      
      // Fund the account with testnet lumens
      await stellarService.fundAccount(publicKey)
      
      // Get account balance
      const accountData = await stellarService.getAccount(publicKey)
      
      setAccount({
        publicKey,
        secretKey,
        balance: accountData.balances
          .filter((b: any) => b.asset_type === 'native')
          .map((b: any) => b.balance)
          .join(', ') || '0',
      })
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
  }

  return (
    <div className="flex items-center space-x-4">
      {account ? (
        <div className="flex items-center space-x-3">
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {account.publicKey.slice(0, 8)}...{account.publicKey.slice(-8)}
            </div>
            <div className="text-gray-500">
              Balance: {parseFloat(account.balance || '0').toFixed(2)} XLM
            </div>
          </div>
          <button
            onClick={disconnect}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <Wallet className="w-4 h-4" />
          <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
      )}
    </div>
  )
}
