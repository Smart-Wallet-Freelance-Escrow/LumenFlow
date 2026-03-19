import * as StellarSdk from '@stellar/stellar-sdk'
import { Invoice, BusinessInfo } from '@/types'

export class StellarService {
  private server: StellarSdk.Horizon.Server
  private networkPassphrase: string

  constructor() {
    this.server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org')
    this.networkPassphrase = StellarSdk.Networks.TESTNET
  }

  async connectWallet(): Promise<{ publicKey: string; secretKey: string }> {
    const keypair = StellarSdk.Keypair.random()
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    }
  }

  async getAccount(publicKey: string): Promise<StellarSdk.Horizon.AccountResponse> {
    return await this.server.loadAccount(publicKey)
  }

  async fundAccount(publicKey: string): Promise<void> {
    try {
      const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`)
      const responseJSON = await response.json()
      console.log('SUCCESS! You have a new account :)\n', responseJSON)
    } catch (e) {
      console.error('ERROR!', e)
    }
  }

  async buildTransaction(
    sourceKeypair: StellarSdk.Keypair,
    contractAddress: string,
    functionName: string,
    args: any[]
  ): Promise<StellarSdk.Transaction> {
    const account = await this.getAccount(sourceKeypair.publicKey())
    
    const contract = new StellarSdk.Contract(contractAddress)
    const operation = contract.call(functionName, ...args)

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: this.networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build()

    return transaction
  }

  async signAndSubmitTransaction(
    transaction: StellarSdk.Transaction,
    secretKey: string
  ): Promise<StellarSdk.Horizon.SubmitTransactionResponse> {
    const keypair = StellarSdk.Keypair.fromSecret(secretKey)
    transaction.sign(keypair)
    
    return await this.server.submitTransaction(transaction)
  }

  async mintInvoice(
    secretKey: string,
    contractAddress: string,
    amount: number,
    discountPrice: number,
    dueDate: number
  ): Promise<StellarSdk.Horizon.SubmitTransactionResponse> {
    const keypair = StellarSdk.Keypair.fromSecret(secretKey)
    
    const transaction = await this.buildTransaction(
      keypair,
      contractAddress,
      'mint_invoice',
      [
        new StellarSdk.xdr.Int64(amount),
        new StellarSdk.xdr.Int64(discountPrice),
        new StellarSdk.xdr.Uint64(dueDate)
      ]
    )

    return await this.signAndSubmitTransaction(transaction, secretKey)
  }

  async fundInvoice(
    secretKey: string,
    contractAddress: string,
    invoiceId: number
  ): Promise<StellarSdk.Horizon.SubmitTransactionResponse> {
    const keypair = StellarSdk.Keypair.fromSecret(secretKey)
    
    const transaction = await this.buildTransaction(
      keypair,
      contractAddress,
      'fund_invoice',
      [new StellarSdk.xdr.Uint64(invoiceId)]
    )

    return await this.signAndSubmitTransaction(transaction, secretKey)
  }

  async settleInvoice(
    secretKey: string,
    contractAddress: string,
    invoiceId: number
  ): Promise<StellarSdk.Horizon.SubmitTransactionResponse> {
    const keypair = StellarSdk.Keypair.fromSecret(secretKey)
    
    const transaction = await this.buildTransaction(
      keypair,
      contractAddress,
      'settle_invoice',
      [new StellarSdk.xdr.Uint64(invoiceId)]
    )

    return await this.signAndSubmitTransaction(transaction, secretKey)
  }

  async getInvoice(
    contractAddress: string,
    invoiceId: number
  ): Promise<Invoice | null> {
    try {
      const contract = new StellarSdk.Contract(contractAddress)
      const result = await contract.get_invoice(new StellarSdk.xdr.Uint64(invoiceId))
      
      // Convert the result to our Invoice interface
      // This is a simplified conversion - you'll need to adapt based on actual contract response
      return {
        id: invoiceId,
        owner: result.owner.toString(),
        amount: Number(result.amount),
        discount_price: Number(result.discount_price),
        due_date: Number(result.due_date),
        status: result.status as 'Open' | 'Funded' | 'Settled',
        investor: result.investor?.toString(),
        funded_at: result.funded_at ? Number(result.funded_at) : undefined,
        settled_at: result.settled_at ? Number(result.settled_at) : undefined,
      }
    } catch (error) {
      console.error('Error fetching invoice:', error)
      return null
    }
  }

  async registerBusiness(
    secretKey: string,
    contractAddress: string,
    businessAddress: string,
    name: string
  ): Promise<StellarSdk.Horizon.SubmitTransactionResponse> {
    const keypair = StellarSdk.Keypair.fromSecret(secretKey)
    
    const transaction = await this.buildTransaction(
      keypair,
      contractAddress,
      'register_business',
      [new StellarSdk.Address(businessAddress), name]
    )

    return await this.signAndSubmitTransaction(transaction, secretKey)
  }

  async verifyBusiness(
    secretKey: string,
    contractAddress: string,
    businessAddress: string,
    kycLevel: number
  ): Promise<StellarSdk.Horizon.SubmitTransactionResponse> {
    const keypair = StellarSdk.Keypair.fromSecret(secretKey)
    
    const transaction = await this.buildTransaction(
      keypair,
      contractAddress,
      'verify_business',
      [new StellarSdk.Address(businessAddress), kycLevel]
    )

    return await this.signAndSubmitTransaction(transaction, secretKey)
  }
}
