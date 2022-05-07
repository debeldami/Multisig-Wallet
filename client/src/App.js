import react, { useEffect, useState } from 'react';
import { getWeb3, getWallet } from 'util';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      const wallet = await getWallet(web3);
      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);
    };
    init();
  });

  return <div className='App'>MultiSig Wallet</div>;
}

export default App;
