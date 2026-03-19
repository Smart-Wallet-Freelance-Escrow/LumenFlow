#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, Symbol, Vec, Map, String};

#[contract]
pub struct RegistryContract;

#[contractimpl]
impl RegistryContract {
    pub fn initialize(env: Env, admin: Address) {
        let key = Symbol::new(&env, "admin");
        if env.storage().persistent().has(&key) {
            panic!("already initialized");
        }

        env.storage().persistent().set(&key, &admin);
    }

    pub fn register_business(env: Env, business_address: Address, name: String) {
        let admin_key = Symbol::new(&env, "admin");
        let admin: Address = env.storage().persistent().get(&admin_key).unwrap();
        
        if env.current_contract_address() != admin {
            panic!("only admin can register businesses");
        }

        let business_info = (
            business_address.clone(),
            name,
            false, // is_verified
            Option::<u64>::None, // verification_date
            0u8, // kyc_level
        );

        env.storage().persistent().set(&business_address, &business_info);
    }

    pub fn verify_business(env: Env, business_address: Address, kyc_level: u8) {
        let admin_key = Symbol::new(&env, "admin");
        let admin: Address = env.storage().persistent().get(&admin_key).unwrap();
        
        if env.current_contract_address() != admin {
            panic!("only admin can verify businesses");
        }

        if kyc_level > 2 {
            panic!("invalid kyc level");
        }

        let key = business_address.clone();
        let mut business_info: (Address, String, bool, Option<u64>, u8) = env.storage().persistent()
            .get(&key)
            .unwrap_or_else(|| panic!("business not registered"));

        business_info.2 = true; // is_verified
        business_info.3 = Some(env.ledger().timestamp()); // verification_date
        business_info.4 = kyc_level; // kyc_level

        env.storage().persistent().set(&key, &business_info);
    }

    pub fn revoke_verification(env: Env, business_address: Address) {
        let admin_key = Symbol::new(&env, "admin");
        let admin: Address = env.storage().persistent().get(&admin_key).unwrap();
        
        if env.current_contract_address() != admin {
            panic!("only admin can revoke verification");
        }

        let key = business_address.clone();
        let mut business_info: (Address, String, bool, Option<u64>, u8) = env.storage().persistent()
            .get(&key)
            .unwrap_or_else(|| panic!("business not registered"));

        business_info.2 = false; // is_verified
        business_info.3 = Option::<u64>::None; // verification_date
        business_info.4 = 0u8; // kyc_level

        env.storage().persistent().set(&key, &business_info);
    }

    pub fn is_verified(env: Env, business_address: Address) -> bool {
        if let Some(business_info) = env.storage().persistent().get::<Address, (Address, String, bool, Option<u64>, u8)>(&business_address) {
            business_info.2
        } else {
            false
        }
    }

    pub fn get_business_info(env: Env, business_address: Address) -> (Address, String, bool, Option<u64>, u8) {
        env.storage().persistent()
            .get(&business_address)
            .unwrap_or_else(|| panic!("business not found"))
    }

    pub fn get_admin(env: Env) -> Address {
        let key = Symbol::new(&env, "admin");
        env.storage().persistent().get(&key).unwrap()
    }
}
