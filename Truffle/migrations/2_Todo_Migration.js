const todo = artifacts.require("./TodoList/Todo.sol");
const utility = artifacts.require("./Utility/Utility.sol");

module.exports = function (deployer) {
  deployer.deploy(utility).then((x) => {
    console.log("Utility Contract Address:", x.address);

  return  deployer.deploy(todo, x.address).then((z) => {
      console.log("Todo Contract Address:", z.address);
    });
  });
};
