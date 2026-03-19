'use client'

import { useState } from 'react'
import { Building2, CheckCircle, XCircle, Shield, Users } from 'lucide-react'
import { BusinessInfo } from '@/types'

export function BusinessRegistry() {
  const [businesses, setBusinesses] = useState<BusinessInfo[]>([
    {
      address: 'GBXKQWQW...',
      name: 'Acme Corporation',
      is_verified: true,
      verification_date: Date.now() - 86400000 * 7, // 7 days ago
      kyc_level: 2,
    },
    {
      address: 'GDXKQWQW...',
      name: 'Tech Startup Inc',
      is_verified: false,
      verification_date: undefined,
      kyc_level: 0,
    },
    {
      address: 'GEXKQWQW...',
      name: 'Global Trading Co',
      is_verified: true,
      verification_date: Date.now() - 86400000 * 3, // 3 days ago
      kyc_level: 1,
    },
  ])

  const [formData, setFormData] = useState({
    businessAddress: '',
    businessName: '',
  })

  const [selectedBusiness, setSelectedBusiness] = useState<string>('')
  const [kycLevel, setKycLevel] = useState('1')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newBusiness: BusinessInfo = {
      address: formData.businessAddress,
      name: formData.businessName,
      is_verified: false,
      verification_date: undefined,
      kyc_level: 0,
    }

    setBusinesses([...businesses, newBusiness])
    setFormData({ businessAddress: '', businessName: '' })
  }

  const handleVerify = async (businessAddress: string, level: number) => {
    setBusinesses(businesses.map(business => 
      business.address === businessAddress
        ? {
            ...business,
            is_verified: true,
            verification_date: Date.now(),
            kyc_level: level,
          }
        : business
    ))
    setSelectedBusiness('')
    setKycLevel('1')
  }

  const handleRevoke = async (businessAddress: string) => {
    setBusinesses(businesses.map(business => 
      business.address === businessAddress
        ? {
            ...business,
            is_verified: false,
            verification_date: undefined,
            kyc_level: 0,
          }
        : business
    ))
  }

  const getKycLevelText = (level: number) => {
    switch (level) {
      case 0:
        return 'None'
      case 1:
        return 'Basic'
      case 2:
        return 'Enhanced'
      default:
        return 'Unknown'
    }
  }

  const getKycLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-gray-100 text-gray-800'
      case 1:
        return 'bg-blue-100 text-blue-800'
      case 2:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Business Registry</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Register New Business */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Register New Business
          </h3>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Business Address
              </label>
              <input
                type="text"
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="G..."
                required
              />
            </div>
            
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Acme Corporation"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Register Business
            </button>
          </form>
        </div>

        {/* Verify Business */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Verify Business
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="verifyBusiness" className="block text-sm font-medium text-gray-700 mb-2">
                Select Business
              </label>
              <select
                id="verifyBusiness"
                value={selectedBusiness}
                onChange={(e) => setSelectedBusiness(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Choose a business...</option>
                {businesses
                  .filter(b => !b.is_verified)
                  .map(business => (
                    <option key={business.address} value={business.address}>
                      {business.name} ({business.address})
                    </option>
                  ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="kycLevel" className="block text-sm font-medium text-gray-700 mb-2">
                KYC Level
              </label>
              <select
                id="kycLevel"
                value={kycLevel}
                onChange={(e) => setKycLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                disabled={!selectedBusiness}
              >
                <option value="1">Basic KYC</option>
                <option value="2">Enhanced KYC</option>
              </select>
            </div>
            
            <button
              onClick={() => selectedBusiness && handleVerify(selectedBusiness, parseInt(kycLevel))}
              disabled={!selectedBusiness}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Verify Business
            </button>
          </div>
        </div>
      </div>

      {/* Business List */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Registered Businesses
        </h3>
        
        <div className="space-y-3">
          {businesses.map((business) => (
            <div key={business.address} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium">{business.name}</h4>
                    {business.is_verified ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-gray-400">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm">Not Verified</span>
                      </div>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKycLevelColor(business.kyc_level)}`}>
                      {getKycLevelText(business.kyc_level)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div>Address: {business.address}</div>
                    {business.verification_date && (
                      <div>Verified: {new Date(business.verification_date).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
                
                {business.is_verified && (
                  <button
                    onClick={() => handleRevoke(business.address)}
                    className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
