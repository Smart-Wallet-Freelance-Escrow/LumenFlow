'use client'

import { useState } from 'react'
import { DollarSign, Search, TrendingUp } from 'lucide-react'

export function FundInvoice() {
  const [searchId, setSearchId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock available invoices for funding
  const availableInvoices = [
    {
      id: 3,
      owner: 'GDXKQWQW...',
      amount: 2000,
      discount_price: 1900,
      due_date: Date.now() + 86400000 * 3, // 3 days from now
      status: 'Open' as const,
    },
    {
      id: 4,
      owner: 'GEXKQWQW...',
      amount: 1500,
      discount_price: 1425,
      due_date: Date.now() + 86400000 * 7, // 7 days from now
      status: 'Open' as const,
    },
    {
      id: 5,
      owner: 'GFXKQWQW...',
      amount: 3000,
      discount_price: 2850,
      due_date: Date.now() + 86400000 * 14, // 14 days from now
      status: 'Open' as const,
    },
  ]

  const handleFundInvoice = async (invoiceId: number) => {
    setIsLoading(true)
    try {
      // Here you would call the StellarService to fund the invoice
      console.log('Funding invoice:', invoiceId)
    } catch (error) {
      console.error('Failed to fund invoice:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateYield = (amount: number, discountPrice: number) => {
    return ((amount - discountPrice) / discountPrice * 100).toFixed(2)
  }

  const calculateAPR = (amount: number, discountPrice: number, daysUntilDue: number) => {
    const yieldPercent = (amount - discountPrice) / discountPrice
    const apr = (yieldPercent / daysUntilDue) * 365 * 100
    return apr.toFixed(2)
  }

  const filteredInvoices = searchId 
    ? availableInvoices.filter(inv => inv.id.toString().includes(searchId))
    : availableInvoices

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Fund Invoice</h2>
      
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by Invoice ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No available invoices found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => {
            const daysUntilDue = Math.ceil((invoice.due_date - Date.now()) / (1000 * 60 * 60 * 24))
            const yieldPercent = calculateYield(invoice.amount, invoice.discount_price)
            const apr = calculateAPR(invoice.amount, invoice.discount_price, daysUntilDue)
            
            return (
              <div
                key={invoice.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-medium">Invoice #{invoice.id}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Available
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <div className="text-gray-500 mb-1">Face Value</div>
                        <div className="font-medium">${invoice.amount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Your Cost</div>
                        <div className="font-medium text-green-600">${invoice.discount_price.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Yield</div>
                        <div className="font-medium text-blue-600">{yieldPercent}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">APR</div>
                        <div className="font-medium text-purple-600">{apr}%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Due:</span> {new Date(invoice.due_date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Days Left:</span> {daysUntilDue}
                      </div>
                      <div>
                        <span className="font-medium">Business:</span> {invoice.owner}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <button
                      onClick={() => handleFundInvoice(invoice.id)}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>{isLoading ? 'Processing...' : 'Fund Invoice'}</span>
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      You'll receive <span className="font-medium">${invoice.amount.toLocaleString()}</span> on settlement,
                      earning <span className="font-medium text-green-600">${(invoice.amount - invoice.discount_price).toLocaleString()}</span> profit
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">How Invoice Funding Works</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Select an available invoice with your desired yield and timeframe</li>
          <li>Pay the discounted price in USDC to fund the invoice</li>
          <li>Wait for the invoice to reach its due date</li>
          <li>Receive the full invoice amount automatically via smart contract</li>
          <li>Platform fee (0.5%) is deducted from the settlement amount</li>
        </ol>
      </div>
    </div>
  )
}
