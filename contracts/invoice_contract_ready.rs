#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, Vec, Map, String, U256, I256};

#[contract]
pub struct InvoiceContract;

#[contractimpl]
impl InvoiceContract {
    pub fn initialize(env: Env, usdc_address: Address, registry_address: Address) {
        let key = Symbol::new(&env, "config");
        if env.storage().persistent().has(&key) {
            panic!("already initialized");
        }

        let config = (
            usdc_address,
            registry_address,
            1u64, // next_invoice_id
            50u32, // platform_fee_bps
        );

        env.storage().persistent().set(&key, &config);
    }

    pub fn mint_invoice(
        env: Env,
        amount: i128,
        discount_price: i128,
        due_date: u64,
    ) -> u64 {
        let config_key = Symbol::new(&env, "config");
        let config: (Address, Address, u64, u32) = env.storage().persistent().get(&config_key).unwrap();
        
        if discount_price >= amount {
            panic!("discount_price must be less than amount");
        }

        if due_date <= env.ledger().timestamp() {
            panic!("due_date must be in the future");
        }

        let invoice_id = config.2;
        
        let invoice = (
            invoice_id,
            env.current_contract_address(),
            amount,
            discount_price,
            due_date,
            0u64, // status: Open
            Option::<Address>::None, // investor
            Option::<u64>::None, // funded_at
            Option::<u64>::None, // settled_at
        );

        let key = Symbol::new(&env, &invoice_id);
        env.storage().persistent().set(&key, &invoice);

        let mut updated_config = config;
        updated_config.2 = invoice_id + 1;
        env.storage().persistent().set(&config_key, &updated_config);

        invoice_id
    }

    pub fn fund_invoice(env: Env, invoice_id: u64) {
        let key = Symbol::new(&env, &invoice_id);
        let mut invoice: (u64, Address, i128, i128, u64, u64, Option<Address>, Option<u64>, Option<u64>) = 
            env.storage().persistent().get(&key).unwrap();

        if invoice.5 != 0 { // Not Open
            panic!("invoice not open for funding");
        }

        if env.ledger().timestamp() >= invoice.4 {
            panic!("invoice expired");
        }

        invoice.5 = 1; // Funded
        invoice.6 = Some(env.current_contract_address());
        invoice.7 = Some(env.ledger().timestamp());

        env.storage().persistent().set(&key, &invoice);
    }

    pub fn settle_invoice(env: Env, invoice_id: u64) {
        let key = Symbol::new(&env, &invoice_id);
        let mut invoice: (u64, Address, i128, i128, u64, u64, Option<Address>, Option<u64>, Option<u64>) = 
            env.storage().persistent().get(&key).unwrap();

        if invoice.5 != 1 { // Not Funded
            panic!("invoice not funded");
        }

        if env.ledger().timestamp() < invoice.4 {
            panic!("invoice not due yet");
        }

        invoice.5 = 2; // Settled
        invoice.8 = Some(env.ledger().timestamp());

        env.storage().persistent().set(&key, &invoice);
    }

    pub fn get_invoice(env: Env, invoice_id: u64) -> (u64, Address, i128, i128, u64, u64, Option<Address>, Option<u64>, Option<u64>) {
        let key = Symbol::new(&env, &invoice_id);
        env.storage().persistent().get(&key).unwrap()
    }

    pub fn get_config(env: Env) -> (Address, Address, u64, u32) {
        let key = Symbol::new(&env, "config");
        env.storage().persistent().get(&key).unwrap()
    }

    pub fn get_invoice_count(env: Env) -> u64 {
        let key = Symbol::new(&env, "config");
        let config: (Address, Address, u64, u32) = env.storage().persistent().get(&key).unwrap();
        config.2 - 1
    }
}
