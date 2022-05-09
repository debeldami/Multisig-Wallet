import Web3 from 'web3';
import Wallet from './contract/wallet.json';

//instantiate web3 object
const getWeb3 = () => {
  // return new Web3('http://localhost:9545'); //urls to the node that runs the development blochain- genache

  return new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        resolve(window.web3);
      } else {
        reject('must install metamask');
      }
    });
  });
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
