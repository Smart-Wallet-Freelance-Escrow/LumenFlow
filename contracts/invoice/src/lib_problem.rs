#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, Vec, Map};

#[derive(Clone, Debug, Eq, PartialEq, contracttype)]
pub enum InvoiceStatus {
    Open = 0,
    Funded = 1,
    Settled = 2,
}

#[derive(Clone, Debug, Eq, PartialEq, contracttype)]
pub struct Invoice {
    pub id: u64,
    pub owner: Address,
    pub amount: i128,
    pub discount_price: i128,
    pub due_date: u64,
    pub status: InvoiceStatus,
    pub investor: Option<Address>,
    pub funded_at: Option<u64>,
    pub settled_at: Option<u64>,
}

#[derive(Clone, Debug, Eq, PartialEq, contracttype)]
pub struct InvoiceDataKey {
    pub invoice_id: u64,
}

#[derive(Clone, Debug, Eq, PartialEq, contracttype)]
pub struct ConfigDataKey;

#[derive(Clone, Debug, Eq, PartialEq, contracttype)]
pub struct Config {
    pub usdc_address: Address,
    pub registry_address: Address,
    pub next_invoice_id: u64,
    pub platform_fee_bps: u32,
}

#[contract]
pub struct InvoiceContract;

#[contractimpl]
impl InvoiceContract {
    pub fn initialize(env: Env, usdc_address: Address, registry_address: Address) {
        if env.storage().persistent().has(&ConfigDataKey) {
            panic!("already initialized");
        }

        let config = Config {
            usdc_address,
            registry_address,
            next_invoice_id: 1,
            platform_fee_bps: 50,
        };

        env.storage().persistent().set(&ConfigDataKey, &config);
    }

    pub fn mint_invoice(
        env: Env,
        amount: i128,
        discount_price: i128,
        due_date: u64,
    ) -> u64 {
        let config: Config = env.storage().persistent().get(&ConfigDataKey).unwrap();
        
        if discount_price >= amount {
            panic!("discount_price must be less than amount");
        }

        if due_date <= env.ledger().timestamp() {
            panic!("due_date must be in the future");
        }

        let invoice_id = config.next_invoice_id;
        
        let invoice = Invoice {
            id: invoice_id,
            owner: env.current_contract_address(),
            amount,
            discount_price,
            due_date,
            status: InvoiceStatus::Open,
            investor: None,
            funded_at: None,
            settled_at: None,
        };

        let key = InvoiceDataKey { invoice_id };
        env.storage().persistent().set(&key, &invoice);

        let mut updated_config = config;
        updated_config.next_invoice_id = invoice_id + 1;
        env.storage().persistent().set(&ConfigDataKey, &updated_config);

        invoice_id
    }

    pub fn fund_invoice(env: Env, invoice_id: u64) {
        let config: Config = env.storage().persistent().get(&ConfigDataKey).unwrap();
        let key = InvoiceDataKey { invoice_id };
        let mut invoice: Invoice = env.storage().persistent().get(&key).unwrap();

        if invoice.status != InvoiceStatus::Open {
            panic!("invoice not open for funding");
        }

        if env.ledger().timestamp() >= invoice.due_date {
            panic!("invoice expired");
        }

        invoice.status = InvoiceStatus::Funded;
        invoice.investor = Some(env.current_contract_address());
        invoice.funded_at = Some(env.ledger().timestamp());

        env.storage().persistent().set(&key, &invoice);
    }

    pub fn settle_invoice(env: Env, invoice_id: u64) {
        let config: Config = env.storage().persistent().get(&ConfigDataKey).unwrap();
        let key = InvoiceDataKey { invoice_id };
        let mut invoice: Invoice = env.storage().persistent().get(&key).unwrap();

        if invoice.status != InvoiceStatus::Funded {
            panic!("invoice not funded");
        }

        if env.ledger().timestamp() < invoice.due_date {
            panic!("invoice not due yet");
        }

        invoice.status = InvoiceStatus::Settled;
        invoice.settled_at = Some(env.ledger().timestamp());

        env.storage().persistent().set(&key, &invoice);
    }

    pub fn get_invoice(env: Env, invoice_id: u64) -> Invoice {
        let key = InvoiceDataKey { invoice_id };
        env.storage().persistent().get(&key).unwrap()
    }

    pub fn get_config(env: Env) -> Config {
        env.storage().persistent().get(&ConfigDataKey).unwrap()
    }

    pub fn get_user_invoices(env: Env, user: Address) -> Vec<Invoice> {
        let config: Config = env.storage().persistent().get(&ConfigDataKey).unwrap();
        let mut user_invoices = Vec::new(&env);

        for invoice_id in 1..config.next_invoice_id {
            let key = InvoiceDataKey { invoice_id };
            if let Some(invoice) = env.storage().persistent().get::<InvoiceDataKey, Invoice>(&key) {
                if invoice.owner == user || invoice.investor == Some(user) {
                    user_invoices.push_back(invoice);
                }
            }
        }

        user_invoices
    }
}
