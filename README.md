# Blockchain Workshop Version 1

## UToken Smart Contract Deployment with Hardhat

This guide provides step-by-step instructions for deploying and testing the `UToken` ERC20 contract using Hardhat. It includes configuring networks, deploying tokens locally and on Sepolia, and interacting with deployed contracts.

---

## Prerequisites

1. Install [Hardhat](https://hardhat.org/tutorial/creating-a-new-hardhat-project).
2. Node.js and Yarn installed.
3. Metamask wallet set up and connected to Sepolia.

---

## Steps

### 1. Project Setup

1. Initialize a new Hardhat project:
   ```bash
   yarn add --dev hardhat
   npx hardhat init
   ```
2. Create a `deploy/` folder for deployment scripts.
3. Add OpenZeppelin contracts:
   ```bash
   yarn add @openzeppelin/contracts
   ```

---

### 2. Writing the ERC20 Token Contract

The `UToken` contract includes minting and burning functionality restricted to the owner.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UToken is ERC20, Ownable {
    error InvalidAddress();

    constructor(string memory name, string memory symbol, address initialOwner, uint256 initialSupply)
        ERC20(name, symbol) Ownable(initialOwner)
    {
        if (initialOwner == address(0)) revert InvalidAddress();
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert InvalidAddress();
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        if (from == address(0)) revert InvalidAddress();
        _burn(from, amount);
    }
}
```

---

### 3. Compiling the Contract

Compile the contract to generate the **ABI**:

```bash
npx hardhat compile
```

The **ABI** is a specification that defines how to interact with the deployed contract programmatically.

---

### 4. Hardhat Configuration

1. Install `dotenv` for environment variables:
   ```bash
   yarn add dotenv
   ```
2. Update `hardhat.config.ts` to include your network configuration:

   ```typescript
   import { HardhatUserConfig } from "hardhat/config";
   import "@nomicfoundation/hardhat-toolbox";

   const config: HardhatUserConfig = {
   	solidity: "0.8.27",
   	networks: {
   		sepolia: {
   			url: process.env.SEPOLIA_RPC_URL,
   			accounts: [process.env.DEPLOYER_PRIVATE_KEY],
   		},
   		hardhat: {
   			chainId: 8543,
   		},
   	},
   };

   export default config;
   ```

3. Add environment variables in `.env`:
   ```
   SEPOLIA_RPC_URL=<your_infura_url>
   DEPLOYER_PRIVATE_KEY=<your_private_key>
   ```

---

### 5. Deployment Script

Create `deployTokens.ts` inside the `deploy/` folder to deploy tokens:

```typescript
import { ethers } from "hardhat";

async function deployTokens() {
	const [deployer] = await ethers.getSigners();
	const deployedContracts: { [key: string]: string } = {};
	const initialSupply = ethers.parseEther("1000000");

	const UFVToken = await ethers.deployContract("UToken", [
		"UFV Token",
		"UFV",
		deployer.address,
		initialSupply,
	]);
	await UFVToken.waitForDeployment();
	deployedContracts["UFVToken"] = await UFVToken.getAddress();

	const SFUToken = await ethers.deployContract("UToken", [
		"SFU Token",
		"SFU",
		deployer.address,
		initialSupply,
	]);
	await SFUToken.waitForDeployment();
	deployedContracts["SFUToken"] = await SFUToken.getAddress();

	console.log(deployedContracts);
}

deployTokens()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
```

Run the script:

```bash
npx hardhat run deploy/deployTokens.ts --network sepolia
```

---

### 6. Interacting with the Deployed Contract

1. Add the contract address to Metamask under Sepolia.
2. Verify balances using the Hardhat console:
   ```bash
   npx hardhat console --network sepolia
   ```
   Example:
   ```javascript
   const token = await ethers.getContractAt(
   	"UToken",
   	"<deployed_contract_address>"
   );
   const balance = await token.balanceOf("<address>");
   console.log(balance.toString());
   ```

---

### 7. Testing Locally

- Run a local Hardhat node:
  ```bash
  npx hardhat node
  ```
- Deploy locally:
  ```bash
  npx hardhat run deploy/deployTokens.ts --network localhost
  ```

---

### 8. Further Enhancements

- **Test Scripts**: Write scripts to validate total supply, mint, and burn functionality.
- **Frontend Integration**: Create a web interface to interact with the token contract.
- **Exchange Platform**: Implement a simple exchange to trade tokens.
- **Use Case**: Explore pegging tokens to real-world assets, such as redeemable benefits at a university.

---

### References

- [Hardhat Documentation](https://hardhat.org/tutorial)
- [Infura Setup Guide](https://infura.io/)
