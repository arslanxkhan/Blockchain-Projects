const lottery = artifacts.require("./Lottery/Lottery.sol");

module.exports = function (deployer) {
  const ticketPriceInEther = "0.0000000005";
  const ticketPriceInWei = web3.utils.toWei(ticketPriceInEther.toString(), 'ether'); 


  return deployer.deploy(lottery, ticketPriceInWei).then((x) => {
    console.log("Lottery address", x.address);
  });
};
