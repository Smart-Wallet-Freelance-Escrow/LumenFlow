'use client'

import { useState } from 'react'
import { WalletConnect } from '@/components/WalletConnect'
import { InvoiceList } from '@/components/InvoiceList'
import { MintInvoice } from '@/components/MintInvoice'
import { FundInvoice } from '@/components/FundInvoice'
import { BusinessRegistry } from '@/components/BusinessRegistry'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'mint' | 'fund' | 'registry'>('invoices')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Invoice Tokenization Platform
            </h1>
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'invoices'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Invoices
            </button>
            <button
              onClick={() => setActiveTab('mint')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'mint'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mint Invoice
            </button>
            <button
              onClick={() => setActiveTab('fund')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'fund'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Fund Invoice
            </button>
            <button
              onClick={() => setActiveTab('registry')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'registry'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Business Registry
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'invoices' && <InvoiceList />}
          {activeTab === 'mint' && <MintInvoice />}
          {activeTab === 'fund' && <FundInvoice />}
          {activeTab === 'registry' && <BusinessRegistry />}
        </div>
      </main>
    </div>
  )
}
