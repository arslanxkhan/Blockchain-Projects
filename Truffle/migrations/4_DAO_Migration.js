const Auth = artifacts.require("Auth");
const Token = artifacts.require("Token");
const Membership = artifacts.require("Membership");
const GovernancePerposal = artifacts.require("GovernancePerposal");
const GeneralPerposal = artifacts.require("GeneralPerposal");
const RoleManager = artifacts.require("RoleManager");

module.exports = async function (deployer) {
  try {
    // Deploy RoleManager
    await deployer.deploy(RoleManager, { gas: 10000000 });
    const roleManagerInstance = await RoleManager.deployed();
    console.log("RoleManager deployed at:", roleManagerInstance.address);

    // Deploy Auth with RoleManager address
    await deployer.deploy(Auth, roleManagerInstance.address, { gas: 10000000 });
    const authInstance = await Auth.deployed();
    console.log("Auth deployed at:", authInstance.address);

    // Deploy Membership with Auth address
    await deployer.deploy(Membership, authInstance.address, { gas: 10000000 });
    const membershipInstance = await Membership.deployed();
    console.log("Membership deployed at:", membershipInstance.address);

    // Deploy Token with initial supply
    const initialSupply = web3.utils.toBN("9000000000000000000000");
    await deployer.deploy(Token, initialSupply, { gas: 10000000 });
    const tokenInstance = await Token.deployed();
    console.log("Token deployed at:", tokenInstance.address);

    // Deploy GovernancePerposal with Auth, Token, and Membership addresses
    await deployer.deploy(
      GovernancePerposal,
      authInstance.address,
      tokenInstance.address,
      membershipInstance.address,
      { gas: 10000000 }
    );
    const governancePerposalInstance = await GovernancePerposal.deployed();
    console.log("GovernancePerposal deployed at:", governancePerposalInstance.address);

    // Deploy GeneralPerposal with Auth and Token addresses
    await deployer.deploy(
      GeneralPerposal,
      authInstance.address,
      tokenInstance.address,
      { gas: 10000000 }
    );
    const generalPerposalInstance = await GeneralPerposal.deployed();
    console.log("GeneralPerposal deployed at:", generalPerposalInstance.address);

  } catch (error) {
    console.error("Error deploying contracts:", error);
  }
};
