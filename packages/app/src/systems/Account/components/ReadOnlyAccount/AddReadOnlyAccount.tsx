import { useInterpret } from '@xstate/react';
import React, { useState } from 'react';
import { editAccountMachine } from '../../machines/editAccountMachine';

export const AddReadOnlyAccount = ({ onClose }) => {
  const [publicAddress, setPublicAddress] = useState('');
  const accountService = useInterpret(editAccountMachine);

  const handleAdd = () => {
    accountService.send({
      type: 'ADD_READONLY_ACCOUNT',
      input: { address: publicAddress },
    });
    onClose();
  };

  return (
    <div>
      <input
        type="text"
        value={publicAddress}
        onChange={(e) => setPublicAddress(e.target.value)}
        placeholder="Enter public address"
      />
      <button type="button" onClick={handleAdd}>
        Add Read-Only Account
      </button>
    </div>
  );
};
