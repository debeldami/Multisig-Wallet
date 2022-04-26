// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract wallet{

    address[] public approvers;

    uint public quorum;

    struct Transfer{
        uint id;
        uint amount;
        address payable to;
        uint approvals;
        bool sent;
    }

    Transfer[] public transfers;
    mapping(address => mapping(uint => bool)) approvals;

    constructor(address[] memory _approvers, uint _quorum){
      approvers = _approvers;
      quorum = _quorum;
    }


    function getApprovers() external view returns (address[] memory){
        return approvers;
    }

    function getTransfer() external view returns (Transfer[] memory){
        return transfers;
    }

    function createTransfer(uint amount, address payable to) external{
        transfers.push(Transfer(transfers.length, amount, to, 0, false));
    }

    function approveTransfer(uint id) external{
        require(transfers[id].sent == false, "transfer already completed");
        require(approvals[msg.sender][id] == false, "cannot approve transfer twice");

        approvals[msg.sender][id] = true;
        transfers[id].approvals++;

        if(transfers[id].approvals >= quorum){
            transfers[id].sent = true;
            address payable to = transfers[id].to;
            uint amount = transfers[id].amount;
            to.transfer(amount);
        }
    }
}