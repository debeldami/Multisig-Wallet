const expectRevert = require('@openzeppelin/test-helpers/src/expectRevert');

const Wallet = artifacts.require('wallet');

contract(Wallet, (accounts) => {
  let wallet;

  beforeEach(async () => {
    //call the construction of the smart contract
    wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);

    //transfer from account zero to the smart contract
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: wallet.address,
      value: 100,
    });
  });

  it('should have the correct approvers and qourum', async () => {
    const approvers = await wallet.getApprovers();
    const quorum = await wallet.quorum();

    assert(approvers[0] === accounts[0]);
    assert(approvers[1] === accounts[1]);
    assert(approvers[2] === accounts[2]);
    assert(quorum.toNumber() === 2);
  });

  it('should create transfers', async () => {
    await wallet.createTransfer(100, accounts[4], { from: accounts[0] });
    const transfers = await wallet.getTransfer();

    assert(transfers[0].to === accounts[4]);
    assert(transfers[0].amount === '100');
    assert(transfers[0].approvals === '0');
    assert(transfers[0].sent === false);
    assert(transfers.length === 1);
    assert(transfers[0].id === '0');
  });

  it('should not create transfer if sender is not approved', async () => {
    expectRevert(
      wallet.createTransfer(100, accounts[4], { from: accounts[5] }),
      'only approvers are allowed'
    );
  });
});
