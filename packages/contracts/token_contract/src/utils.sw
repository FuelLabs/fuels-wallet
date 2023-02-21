library utils;

dep errors;

use errors::AccessError;
use std::auth::{AuthError, msg_sender};

pub fn sender_as_address() -> Address {
    let sender = msg_sender();
    match sender.unwrap() {
        Identity::Address(address) => address,
        _ => revert(0),
    }
}

pub fn id_to_address(identity: Identity) -> Address {
    match identity {
        Identity::Address(address) => address,
        _ => revert(0),
    }
}

pub fn is_sender_owner(owner: Identity) {
    let sender = msg_sender();
    match sender {
        Result::Ok(sender) => {
            require(owner == sender, AccessError::NotOwner);
        }
        _ => {
            revert(0);
        }
    }
}
