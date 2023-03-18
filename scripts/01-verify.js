const hre = require("hardhat")
require("dotenv").config();

async function main() {
    try {
        await hre.run("verify:verify", {
            contract: "contracts/Profile.sol:Profile",
            address: "0x3517941bCb3763b6eAf167FdA4e6430D1b475772",
            constructorArguments: [
                "FibariumProfile", "FIBA", "0x074442711c02Fc019C17cd2c01484D2f168b5Ea3"
            ],
        })
    } catch (error) {
        console.log("error:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })