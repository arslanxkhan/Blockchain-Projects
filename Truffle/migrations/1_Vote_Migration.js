const Vote = artifacts.require("./VotingSystem/Vote.sol");

module.exports = function (deployer) {
  const proposals = ["Scorpion", "Sub-Zero", "Shao Kahn"];
  deployer.deploy(Vote, proposals);
};
