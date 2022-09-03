#![cfg_attr(not(feature = "std"), no_std)]

extern crate alloc;

use ink_lang as ink;

#[ink::contract]
mod dns {
    use alloc::string::String;
    use alloc::vec::Vec;
    use ink_storage::{
        traits::SpreadAllocate,
        Mapping,
    };

    /// Emitted whenever a new name is being registered.
    #[ink(event)]
    pub struct Register {
        #[ink(topic)]
        name: String,
        #[ink(topic)]
        from: ink_env::AccountId,
    }

    /// Emitted whenever a new name is being registered.
    #[ink(event)]
    pub struct Release {
        #[ink(topic)]
        name: String,
        #[ink(topic)]
        from: ink_env::AccountId,
    }

    /// Emitted whenever an address changes.
    #[ink(event)]
    pub struct SetAddress {
        #[ink(topic)]
        name: String,
        from: ink_env::AccountId,
        #[ink(topic)]
        old_address: Option<ink_env::AccountId>,
        #[ink(topic)]
        new_address: ink_env::AccountId,
    }

    /// Emitted whenever a name is being transferred.
    #[ink(event)]
    pub struct Transfer {
        #[ink(topic)]
        name: String,
        from: ink_env::AccountId,
        #[ink(topic)]
        old_owner: Option<ink_env::AccountId>,
        #[ink(topic)]
        new_owner: ink_env::AccountId,
    }

    /// Domain name service contract inspired by
    /// [this blog post](https://medium.com/@chainx_org/secure-and-decentralized-polkadot-domain-name-system-e06c35c2a48d).
    ///
    /// # Note
    ///
    /// This is a port from the blog post's ink! 1.0 based version of the contract
    /// to ink! 2.0.
    ///
    /// # Description
    ///
    /// The main function of this contract is domain name resolution which
    /// refers to the retrieval of numeric values corresponding to readable
    /// and easily memorable names such as "polka.dot" which can be used
    /// to facilitate transfers, voting and DApp-related operations instead
    /// of resorting to long IP addresses that are hard to remember.
    #[ink(storage)]
    #[derive(Default, SpreadAllocate)]
    pub struct DomainNameService {
        /// A Stringmap to store all name to addresses mapping.
        name_to_address: Mapping<String, ink_env::AccountId>,
        /// A Stringmap to store all name to owners mapping.
        name_to_owner: Mapping<String, ink_env::AccountId>,
        /// The default address.
        default_address: ink_env::AccountId,
        /// Fee to pay for domain registration
        fee: Balance,
        /// All names of an address
        owner_to_names: Mapping<ink_env::AccountId, Vec<String>>,
    }

    /// Errors that can occur upon calling this contract.
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(::scale_info::TypeInfo))]
    pub enum Error {
        /// Returned if the name already exists upon registration.
        NameAlreadyExists,
        /// Returned if caller is not owner while required to.
        CallerIsNotOwner,
        /// Returned if caller did not send fee
        FeeNotPaid,
        /// Returned if name is empty
        NameEmpty,
    }

    /// Type alias for the contract's result type.
    pub type Result<T> = core::result::Result<T, Error>;

    impl DomainNameService {
        /// Creates a new domain name service contract.
        #[ink(constructor)]
        pub fn new(fee: Option<Balance>) -> Self {
            // This call is required in order to correctly initialize the
            // `Mapping`s of our contract.
            ink_lang::utils::initialize_contract(|contract: &mut Self| {
                contract.default_address = Default::default();
                contract.fee = match fee {
                    Some(fee) => fee,
                    None => Default::default()
                }
            })
        }

        /// Register specific name with caller as owner.
        #[ink(message, payable)]
        pub fn register(&mut self, name: String) -> Result<()> {
            /* Name cannot be empty */
            if name.is_empty() {
                return Err(Error::NameEmpty);
            }

            /* Make sure the registrant is paid for */
            let _transferred = self.env().transferred_value();
            if _transferred < self.fee {
                return Err(Error::FeeNotPaid);
            }

            let caller = self.env().caller();
            if self.name_to_owner.contains(&name) {
                return Err(Error::NameAlreadyExists);
            }

            self.name_to_owner.insert(&name, &caller);
            let previous_names = self.owner_to_names.get(caller);
            if let Some(names) = previous_names {
                let mut new_names = names.clone();
                new_names.push(name.clone());
                self.owner_to_names.insert(caller, &new_names);
            } else {
                self.owner_to_names.insert(caller, &Vec::from([name.clone()]));
            }
            self.env().emit_event(Register { name, from: caller });

            Ok(())
        }

        /// Release domain from registration.
        #[ink(message)]
        pub fn release(&mut self, name: String) -> Result<()> {
            let caller = self.env().caller();
            let owner = self.get_owner_or_default(&name);
            if caller != owner {
                return Err(Error::CallerIsNotOwner);
            }

            self.name_to_owner.remove(&name);
            self.name_to_address.remove(&name);
            self.env().emit_event(Release { name, from: caller });

            Ok(())
        }

        /// Set address for specific name.
        #[ink(message)]
        pub fn set_address(&mut self, name: String, new_address: ink_env::AccountId) -> Result<()> {
            let caller = self.env().caller();
            let owner = self.get_owner_or_default(&name);
            if caller != owner {
                return Err(Error::CallerIsNotOwner);
            }

            let old_address = self.name_to_address.get(&name);
            self.name_to_address.insert(&name, &new_address);

            self.env().emit_event(SetAddress {
                name,
                from: caller,
                old_address,
                new_address,
            });
            Ok(())
        }

        /// Transfer owner to another address.
        #[ink(message)]
        pub fn transfer(&mut self, name: String, to: ink_env::AccountId) -> Result<()> {
            let caller = self.env().caller();
            let owner = self.get_owner_or_default(&name);
            if caller != owner {
                return Err(Error::CallerIsNotOwner);
            }

            let old_owner = self.name_to_owner.get(&name);
            self.name_to_owner.insert(&name, &to);

            self.env().emit_event(Transfer {
                name,
                from: caller,
                old_owner,
                new_owner: to,
            });

            Ok(())
        }

        /// Get address for specific name.
        #[ink(message)]
        pub fn get_address(&self, name: String) -> ink_env::AccountId {
            self.get_address_or_default(name)
        }

        /// Get owner of specific name.
        #[ink(message)]
        pub fn get_owner(&self, name: String) -> ink_env::AccountId {
            self.get_owner_or_default(&name)
        }

        /// Returns the owner given the String or the default address.
        fn get_owner_or_default(&self, name: &String) -> ink_env::AccountId {
            self.name_to_owner
                .get(&name)
                .unwrap_or(self.default_address)
        }

        /// Returns the address given the String or the default address.
        fn get_address_or_default(&self, name: String) -> ink_env::AccountId {
            self.name_to_address
                .get(&name)
                .unwrap_or(self.default_address)
        }

        /// Returns all names the address owns
        #[ink(message)]
        pub fn get_names_of_address(&self, owner: ink_env::AccountId) -> Option<Vec<String>> {
            return self.owner_to_names.get(owner);
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use ink_lang as ink;
        use ink_env::test::*;

        fn default_accounts() -> ink_env::test::DefaultAccounts<ink_env::DefaultEnvironment> {
            ink_env::test::default_accounts::<ink_env::DefaultEnvironment>()
        }

        fn set_next_caller(caller: ink_env::AccountId) {
            ink_env::test::set_caller::<ink_env::DefaultEnvironment>(caller);
        }

        #[ink::test]
        fn register_works() {
            let default_accounts = default_accounts();
            let name = String::from("test");

            set_next_caller(default_accounts.alice);
            let mut contract = DomainNameService::new(None);

            assert_eq!(contract.register(name.clone()), Ok(()));
            assert_eq!(contract.register(name), Err(Error::NameAlreadyExists));
        }

        #[ink::test]
        fn reverse_search_works() {
            let default_accounts = default_accounts();
            let name = String::from("test");
            let name2 = String::from("test2");

            set_next_caller(default_accounts.alice);
            let mut contract = DomainNameService::new(None);

            assert_eq!(contract.register(name.clone()), Ok(()));
            assert_eq!(contract.register(name2.clone()), Ok(()));
            assert!(contract.get_names_of_address(default_accounts.alice).unwrap().contains(&String::from("test")));
            assert!(contract.get_names_of_address(default_accounts.alice).unwrap().contains(&String::from("test2")));
        }


        #[ink::test]
        fn register_empty_reverts() {
            let default_accounts = default_accounts();
            let name = String::from("");

            set_next_caller(default_accounts.alice);
            let mut contract = DomainNameService::new(None);

            assert_eq!(contract.register(name.clone()), Err(Error::NameEmpty));
        }

        #[ink::test]
        fn register_with_fee_works() {
            let default_accounts = default_accounts();
            let name = String::from("test");

            set_next_caller(default_accounts.alice);
            let mut contract = DomainNameService::new(Some(50 ^ 12));

            set_value_transferred::<ink_env::DefaultEnvironment>(50 ^ 12);
            assert_eq!(contract.register(name.clone()), Ok(()));
            assert_eq!(contract.register(name), Err(Error::NameAlreadyExists));
        }

        #[ink::test]
        fn register_without_fee_reverts() {
            let default_accounts = default_accounts();
            let name = String::from("test");

            set_next_caller(default_accounts.alice);
            let mut contract = DomainNameService::new(Some(50 ^ 12));

            assert_eq!(contract.register(name), Err(Error::FeeNotPaid));
        }

        #[ink::test]
        fn release_works() {
            let default_accounts = default_accounts();
            let name = String::from("test");

            set_next_caller(default_accounts.alice);
            let mut contract = DomainNameService::new(None);

            assert_eq!(contract.register(name.clone()), Ok(()));
            assert_eq!(contract.set_address(name.clone(), default_accounts.alice), Ok(()));
            assert_eq!(contract.get_owner(name.clone()), default_accounts.alice);
            assert_eq!(contract.get_address(name.clone()), default_accounts.alice);
            assert_eq!(contract.release(name.clone()), Ok(()));
            assert_eq!(contract.get_owner(name.clone()), Default::default());
            assert_eq!(contract.get_address(name.clone()), Default::default());

            /* Another account can register again*/
            set_next_caller(default_accounts.bob);
            assert_eq!(contract.register(name.clone()), Ok(()));
            assert_eq!(contract.set_address(name.clone(), default_accounts.bob), Ok(()));
            assert_eq!(contract.get_owner(name.clone()), default_accounts.bob);
            assert_eq!(contract.get_address(name.clone()), default_accounts.bob);
            assert_eq!(contract.release(name.clone()), Ok(()));
            assert_eq!(contract.get_owner(name.clone()), Default::default());
            assert_eq!(contract.get_address(name.clone()), Default::default());
        }

        #[ink::test]
        fn set_address_works() {
            let accounts = default_accounts();
            let name = String::from("test");

            set_next_caller(accounts.alice);

            let mut contract = DomainNameService::new(None);
            assert_eq!(contract.register(name.clone()), Ok(()));

            // Caller is not owner, `set_address` should fail.
            set_next_caller(accounts.bob);
            assert_eq!(
                contract.set_address(name.clone(), accounts.bob),
                Err(Error::CallerIsNotOwner)
            );

            // Caller is owner, set_address will be successful
            set_next_caller(accounts.alice);
            assert_eq!(contract.set_address(name.clone(), accounts.bob), Ok(()));
            assert_eq!(contract.get_address(name.clone()), accounts.bob);
        }

        #[ink::test]
        fn transfer_works() {
            let accounts = default_accounts();
            let name = String::from("test");

            set_next_caller(accounts.alice);

            let mut contract = DomainNameService::new(None);
            assert_eq!(contract.register(name.clone()), Ok(()));

            // Test transfer of owner.
            assert_eq!(contract.transfer(name.clone(), accounts.bob), Ok(()));

            // Owner is bob, alice `set_address` should fail.
            assert_eq!(
                contract.set_address(name.clone(), accounts.bob),
                Err(Error::CallerIsNotOwner)
            );

            set_next_caller(accounts.bob);
            // Now owner is bob, `set_address` should be successful.
            assert_eq!(contract.set_address(name.clone(), accounts.bob), Ok(()));
            assert_eq!(contract.get_address(name.clone()), accounts.bob);
        }
    }
}
