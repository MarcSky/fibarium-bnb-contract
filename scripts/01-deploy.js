const hre = require("hardhat");
const ethers = hre.ethers;
require("dotenv").config();

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    const Profile = await ethers.getContractFactory("Profile", deployer);
    const profile = await Profile.deploy(
        "FibariumProfile", "FIBA", deployer.address
    );
    await profile.deployed();
    console.log("FibariumProfile deployed to:", profile.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });