'use client'

import { useState, useEffect } from 'react'
import { FileText, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Invoice } from '@/types'
import { StellarService } from '@/lib/stellar'

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const stellarService = new StellarService()

  useEffect(() => {
    // In a real app, you'd fetch user's invoices from the contract
    // For now, we'll use mock data
    const mockInvoices: Invoice[] = [
      {
        id: 1,
        owner: 'GBXKQWQW...',
        amount: 1000,
        discount_price: 950,
        due_date: Date.now() + 86400000, // 24 hours from now
        status: 'Open',
      },
      {
        id: 2,
        owner: 'GDXKQWQW...',
        amount: 500,
        discount_price: 475,
        due_date: Date.now() + 172800000, // 48 hours from now
        status: 'Funded',
        investor: 'GAXKQWQW...',
        funded_at: Date.now() - 3600000, // 1 hour ago
      },
    ]
    
    setTimeout(() => {
      setInvoices(mockInvoices)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'Funded':
        return <Clock className="w-4 h-4 text-blue-500" />
      case 'Settled':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-yellow-100 text-yellow-800'
      case 'Funded':
        return 'bg-blue-100 text-blue-800'
      case 'Settled':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading invoices...</div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">My Invoices</h2>
      
      {invoices.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No invoices found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium">Invoice #{invoice.id}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span>{invoice.status}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${invoice.amount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-gray-600">Discount Price:</span>
                      <span className="font-medium text-green-600">${invoice.discount_price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Due:</span>
                      <span className="font-medium">
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {invoice.investor && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Investor:</span>
                        <span className="font-medium">
                          {invoice.investor.slice(0, 8)}...{invoice.investor.slice(-8)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {invoice.funded_at && (
                    <div className="mt-3 text-sm text-gray-500">
                      Funded: {new Date(invoice.funded_at).toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  {invoice.status === 'Open' && (
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm">
                      Fund Invoice
                    </button>
                  )}
                  
                  {invoice.status === 'Funded' && new Date() >= new Date(invoice.due_date) && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                      Settle Invoice
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
