import Web3 from 'web3';
import Wallet from '/contracts/wallet.sol';

//instantiate web3 object
const getWeb3 = () => {
  return new Web3('http://localhost:9545'); //urls to the node that runs the development blochain- genache
};

//contract instance - this is an object that is produce by web3 that allows us to directly interact with a smart contract

const getWallet = async (web3) => {
  const networkId = await web3.eth.net.getId(); //extract network ID from contract abstraction

  const contractDeployment = Wallet.networks[networkId];

  return new web3.eth.Contract(
    Wallet.abi,
    contractDeployment && contractDeployment.address
  );
};

export { getWeb3, getWallet };
