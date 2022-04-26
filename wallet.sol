// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract wallet{
    address[] public approvers;
    uint public quorum;

    constructor(address[] memory _approvers, uint _quorum){
      approvers = _approvers;
      quorum = _quorum;
    }
}