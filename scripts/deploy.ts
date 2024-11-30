import { ethers } from "hardhat";

async function deploy() {
	const [deployer] = await ethers.getSigners();

	// Deploy the UNICoin
	const initialSupply = ethers.parseEther("100000");
	console.log(initialSupply);

	const ufvCoin = await ethers.deployContract("UNICoin", [
		"UFV Coin",
		"UFV",
		deployer.address,
		initialSupply,
	]);
	await ufvCoin.waitForDeployment();

	console.log("UFV coin deployed at", await ufvCoin.getAddress());

	console.log(deployer.address);
}

deploy()
	.then(() => process.exit(0))
	.then(() => console.log("Deployed successfully..."))
	.catch((err) => console.log(err.message));
