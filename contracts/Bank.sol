// SPDX - License - Identifier : MIT
pragma solidity ^0.8.20;

contract Bank {
    struct Account {
        address owner;
        uint256 balance;
    }

    mapping ( address => Account ) public accounts ;

    function createAccount () public {
        // Ensure the account doesn't already exist
        require(accounts[msg.sender].owner == address(0), "Account already exists");

        // Create a new account and set the owner
        accounts[msg.sender] = Account({
            owner: msg.sender,
            balance: 0
        });
    }

    function deposit(uint256 amount) public {
        // Ensure the account exists
        require(accounts[msg.sender].owner != address(0), "Account does not exist");

        // Add the deposit amount to the user's balance
        accounts[msg.sender].balance += amount;
    }

    // Withdraw an amount from the sender's account
    function withdraw(uint256 amount) public {
        // Ensure the account exists
        require(accounts[msg.sender].owner != address(0), "Account does not exist");

        // Ensure the user has enough balance to withdraw the specified amount
        require(accounts[msg.sender].balance >= amount, "Insufficient balance");

        // Subtract the withdrawal amount from the user's balance
        accounts[msg.sender].balance -= amount;
    }
}