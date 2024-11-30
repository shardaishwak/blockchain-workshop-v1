import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import dotenv from "dotenv";

dotenv.config();

if (!process.env.MY_PRIVATE_KEY)
	throw new Error("you need to provide a private key to deploy on sepolia.");

const config: HardhatUserConfig = {
	solidity: "0.8.27",
	networks: {
		// mainnet: {},
		sepolia: {
			url: process.env.SEPOLIA_RPC_URL,
			accounts: [process.env.MY_PRIVATE_KEY as string],
		},
		hardhat: {
			chainId: 8453,
		},
	},
};

export default config;
