const RoleManager = artifacts.require("RoleManager");
const Auth = artifacts.require("Auth");
const Token = artifacts.require("Token");
const Membership = artifacts.require("Membership");
const GovernancePerposal = artifacts.require("GovernancePerposal");

(async () => {
  const chai = await import("chai");
  const assert = chai.assert;
  const expect = chai.expect;
})();

contract("GovernancePerposal", (accounts) => {
  let roles,auth, token, membership, perposal;
  const [owner, admin, member] = accounts;

  beforeEach(async () => {
    roles=await RoleManager.new();
    auth = await Auth.new(roles.address);
    token = await Token.new();
    membership = await Membership.new(auth.address);
    perposal = await GovernancePerposal.new(
      auth.address,
      token.address,
      membership.address
    );

    await auth.makeAdmin(admin);
    await membership.addMember(member);
  });

  it("it should be create by owner or admin", async () => {
    await perposal.createPerposal(
      "Perposal 1",
      "this is very improtant for Human Rigths",
      web3.utlis.toWei("1", "ether"),
      { from: owner }
    );

    const perposals = await perposal.getAllPerposal();

    expect(perposal.length).to.equal(1);
    expect(perposal[0].name).to.equal("Perposal 1");
  });
});
