'use client'

import { useState } from 'react'
import { Plus, Calculator } from 'lucide-react'

export function MintInvoice() {
  const [formData, setFormData] = useState({
    amount: '',
    discountPrice: '',
    dueDate: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const calculateDiscountPrice = (amount: string, discountPercent: string) => {
    const amt = parseFloat(amount) || 0
    const discount = parseFloat(discountPercent) || 0
    return (amt * (1 - discount / 100)).toFixed(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would call the StellarService to mint the invoice
      console.log('Minting invoice:', formData)
      
      // Reset form
      setFormData({
        amount: '',
        discountPrice: '',
        dueDate: '',
      })
    } catch (error) {
      console.error('Failed to mint invoice:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Mint New Invoice</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Invoice Amount (USD)
          </label>
          <input
            type="number"
            id="amount"
            value={formData.amount}
            onChange={(e) => {
              const newAmount = e.target.value
              const discountPercent = ((parseFloat(formData.amount) - parseFloat(formData.discountPrice || '0')) / parseFloat(formData.amount) * 100).toFixed(1)
              setFormData({
                ...formData,
                amount: newAmount,
                discountPrice: calculateDiscountPrice(newAmount, discountPercent),
              })
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="1000.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Discount Price (USD)
          </label>
          <div className="relative">
            <input
              type="number"
              id="discountPrice"
              value={formData.discountPrice}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  discountPrice: e.target.value,
                })
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="950.00"
              step="0.01"
              min="0"
              required
            />
            {formData.amount && formData.discountPrice && (
              <div className="absolute right-3 top-2.5 text-sm text-gray-500">
                <Calculator className="w-4 h-4 inline mr-1" />
                {((parseFloat(formData.amount) - parseFloat(formData.discountPrice)) / parseFloat(formData.amount) * 100).toFixed(1)}% discount
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => {
              setFormData({
                ...formData,
                dueDate: e.target.value,
              })
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>

        {formData.amount && formData.discountPrice && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Invoice Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Face Value:</span>
                <span className="font-medium">${parseFloat(formData.amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount Price:</span>
                <span className="font-medium text-green-600">${parseFloat(formData.discountPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Investor Yield:</span>
                <span className="font-medium text-blue-600">
                  {((parseFloat(formData.amount) - parseFloat(formData.discountPrice)) / parseFloat(formData.discountPrice) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Platform Fee (0.5%):</span>
                <span className="font-medium">${(parseFloat(formData.amount) * 0.005).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !formData.amount || !formData.discountPrice || !formData.dueDate}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>{isLoading ? 'Minting...' : 'Mint Invoice'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
