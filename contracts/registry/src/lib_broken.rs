#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Map, Vec};

#[derive(Clone, Debug, Eq, PartialEq, contracttype)]
pub struct BusinessInfo {
    pub address: Address,
    pub name: String,
    pub is_verified: bool,
    pub verification_date: Option<u64>,
    pub kyc_level: u8, // 0: None, 1: Basic, 2: Enhanced
}

#[derive(Clone, Debug, Eq, PartialEq, contracttype)]
pub struct AdminDataKey;

#[contract]
pub struct RegistryContract;

#[contractimpl]
impl RegistryContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().persistent().has(&AdminDataKey) {
            panic!("already initialized");
        }

        env.storage().persistent().set(&AdminDataKey, &admin);
    }

    pub fn register_business(env: Env, business_address: Address, name: String) {
        let admin: Address = env.storage().persistent().get(&AdminDataKey).unwrap();
        
        if env.current_contract_address() != admin {
            panic!("only admin can register businesses");
        }

        let business_info = BusinessInfo {
            address: business_address.clone(),
            name,
            is_verified: false,
            verification_date: None,
            kyc_level: 0,
        };

        env.storage().persistent().set(&business_address, &business_info);
    }

    pub fn verify_business(env: Env, business_address: Address, kyc_level: u8) {
        let admin: Address = env.storage().persistent().get(&AdminDataKey).unwrap();
        
        if env.current_contract_address() != admin {
            panic!("only admin can verify businesses");
        }

        if kyc_level > 2 {
            panic!("invalid kyc level");
        }

        let mut business_info: BusinessInfo = env.storage().persistent()
            .get(&business_address)
            .unwrap_or_else(|| panic!("business not registered"));

        business_info.is_verified = true;
        business_info.verification_date = Some(env.ledger().timestamp());
        business_info.kyc_level = kyc_level;

        env.storage().persistent().set(&business_address, &business_info);
    }

    pub fn revoke_verification(env: Env, business_address: Address) {
        let admin: Address = env.storage().persistent().get(&AdminDataKey).unwrap();
        
        if env.current_contract_address() != admin {
            panic!("only admin can revoke verification");
        }

        let mut business_info: BusinessInfo = env.storage().persistent()
            .get(&business_address)
            .unwrap_or_else(|| panic!("business not registered"));

        business_info.is_verified = false;
        business_info.verification_date = None;
        business_info.kyc_level = 0;

        env.storage().persistent().set(&business_address, &business_info);
    }

    pub fn is_verified(env: Env, business_address: Address) -> bool {
        if let Some(business_info) = env.storage().persistent().get::<Address, BusinessInfo>(&business_address) {
            business_info.is_verified
        } else {
            false
        }
    }

    pub fn get_business_info(env: Env, business_address: Address) -> BusinessInfo {
        env.storage().persistent()
            .get(&business_address)
            .unwrap_or_else(|| panic!("business not found"))
    }

    pub fn get_all_verified_businesses(env: Env) -> Vec<BusinessInfo> {
        let mut verified_businesses = Vec::new(&env);
        
        // Note: In a real implementation, you'd want to maintain an index
        // For this example, we'll return empty Vec as we can't efficiently iterate all keys
        // In production, use a separate index or pagination
        verified_businesses
    }

    pub fn update_admin(env: Env, new_admin: Address) {
        let admin: Address = env.storage().persistent().get(&AdminDataKey).unwrap();
        
        if env.current_contract_address() != admin {
            panic!("only current admin can update admin");
        }

        env.storage().persistent().set(&AdminDataKey, &new_admin);
    }

    pub fn get_admin(env: Env) -> Address {
        env.storage().persistent().get(&AdminDataKey).unwrap()
    }
}
