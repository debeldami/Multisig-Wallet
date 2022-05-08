import React from 'react';

const TransferList = ({ transfers }) => {
  return (
    <div>
      <h2>List of Transfer</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>To</th>
            <th>approvals</th>
            <th>Sent</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer) => (
            <tr key={transfer.id}>
              <td>{transfer.id}</td>
              <td>{transfer.amount}</td>
              <td>{transfer.to}</td>
              <td>{transfer.approval}</td>
              <td>{transfer.sent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransferList;
