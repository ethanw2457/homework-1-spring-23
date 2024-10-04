// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const Bank = await hre.ethers.getContractFactory("Bank");
  const bank = await Bank.deploy();
  await bank.waitForDeployment();
  console.log("Bank contract deployed to:", bank.address);

  // Connect to the contract with the first signer (default account)
  const [signer] = await hre.ethers.getSigners();

  // Call the createAccount function
  let tx = await bank.connect(signer).createAccount();
  await tx.wait();
  console.log("Account created for:", signer.address);

  // Optional: Check if the account was created successfully
  var account = await bank.accounts(signer.address);
  console.log("Account Owner:", account.owner);

  // Deposit 50 into the account
  tx = await bank.connect(signer).deposit(50);
  await tx.wait();
  console.log("Deposited 50 into account");

  // Withdraw 30 from the account
  tx = await bank.connect(signer).withdraw(30);
  await tx.wait();
  console.log("Withdrew 30 from account");

  // Optional: Check final account balance
  account = await bank.accounts(signer.address);
  console.log("Final Balance:", account.balance.toString());



  const lockedAmount = hre.ethers.parseEther("0.001");

  const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  await lock.waitForDeployment();

  console.log(
    `Lock with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
