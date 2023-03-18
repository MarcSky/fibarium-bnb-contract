const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("FibariumProfile", function () {
    const baseURL = "http://localhost/"

    let owner, user;
    let fibariumProfile;

    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();

        const FibariumProfile = await ethers.getContractFactory("Profile", owner);
        fibariumProfile = await FibariumProfile.deploy("Profile", "Profile", owner.address);
        await fibariumProfile.deployed();
    });

    it("mint", async function () {
        await fibariumProfile.connect(owner).mint(user.address);
    });

    it("mint", async function () {
        await fibariumProfile.connect(owner).mint(user.address);
        let token = await fibariumProfile.connect(owner).balanceOf(user.address);
        expect(token).to.eq(1);
    });

    it("remint", async function () {
        await fibariumProfile.connect(owner).setBaseTokenURI(baseURL);

        // first SBT
        await fibariumProfile.connect(owner).mint(user.address);
        let token = await fibariumProfile.connect(owner).balanceOf(user.address);
        expect(token).to.eq(1);
        let tokenID = await fibariumProfile.connect(owner).tokenIdOf(user.address);
        expect(tokenID).to.eq(1);
        let tokenURL = await fibariumProfile.connect(owner).tokenURI(tokenID);
        expect(tokenURL).to.eq(baseURL + tokenID);
        console.log("first", baseURL + tokenID);

        // second SBT
        await fibariumProfile.connect(owner).mint(user.address);
        token = await fibariumProfile.connect(owner).balanceOf(user.address);
        expect(token).to.eq(1);
        tokenID = await fibariumProfile.connect(owner).tokenIdOf(user.address);
        expect(tokenID).to.eq(2);
        tokenURL = await fibariumProfile.connect(owner).tokenURI(tokenID);
        expect(tokenURL).to.eq(baseURL + tokenID);
        console.log("second", baseURL + tokenID)
    });

});
