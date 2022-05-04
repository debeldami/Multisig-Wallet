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
      value: 1000,
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
    await expectRevert(
      wallet.createTransfer(100, accounts[4], { from: accounts[5] }),
      'only approvers are allowed'
    );
  });

  it('should increment approval', async () => {
    await wallet.createTransfer(100, accounts[4], { from: accounts[0] });
    await wallet.approveTransfer(0, { from: accounts[0] });

    const transfers = await wallet.getTransfer();
    const balance = await web3.eth.getBalance(wallet.address);

    assert(transfers[0].approvals === '1');
    assert(transfers[0].sent === false);
    assert(balance === '1000');
  });

  it('should create transfer when quorum is reached', async () => {
    const beforeTrans = web3.utils.toBN(
      await web3.eth.getBalance(wallet.address)
    );

    await wallet.createTransfer(100, accounts[4], { from: accounts[0] });

    await wallet.approveTransfer(0, { from: accounts[0] });
    await wallet.approveTransfer(0, { from: accounts[1] });

    const afterTrans = web3.utils.toBN(
      await web3.eth.getBalance(wallet.address)
    );

    assert(beforeTrans.sub(afterTrans).toNumber() === 100);
  });

  it('should not approve transaction', async () => {
    await wallet.createTransfer(100, accounts[4], { from: accounts[0] });
    await expectRevert(
      wallet.approveTransfer(0, { from: accounts[5] }),
      'only approvers are allowed'
    );
  });

  it('should not approve transaction if transfer is already sent', async () => {
    await wallet.createTransfer(100, accounts[4], { from: accounts[0] });

    await wallet.approveTransfer(0, { from: accounts[1] });
    await wallet.approveTransfer(0, { from: accounts[0] });

    await expectRevert(
      wallet.approveTransfer(0, { from: accounts[2] }),
      'transfer already completed'
    );
  });

  it('should not approve transaction twice', async () => {
    await wallet.createTransfer(100, accounts[4], { from: accounts[0] });
    await wallet.approveTransfer(0, { from: accounts[1] });
    await expectRevert(
      wallet.approveTransfer(0, { from: accounts[1] }),
      'cannot approve transfer twice'
    );
  });
});
