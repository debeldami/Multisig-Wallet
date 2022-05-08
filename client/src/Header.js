import React from 'react';

function Header({ approvers, quorum }) {
  return (
    <header>
      <ul>
        <li>approvers: {approvers.join(' ')}</li>
        <li>quorum : {quorum}</li>
      </ul>
    </header>
  );
}

export default Header;
