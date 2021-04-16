import { validateTZ, validateETH } from '@app/features/useAddresses';
import React, { FormEventHandler, useEffect, useState } from 'react';
import AddressPreview from './AddressPreview';

export type AddressInputType = {
  name?: string;
  address: string;
  type: string;
};

const AddressTextInputs = ({
  addresses,
  setAddresses
}: {
  addresses: AddressInputType[];
  setAddresses: React.Dispatch<React.SetStateAction<AddressInputType[]>>;
}) => {
  const [text, setText] = useState('');
  const onAddAddress: FormEventHandler = e => {
    e.preventDefault();
    if (!isValid) return;
    setAddresses(a => [...a, { address: text, type: 'collection' }]);
    setText('');
  };
  const onChangeType = (index: number, type: string) => {
    setAddresses(_arr => {
      const arr = [..._arr];
      arr[index].type = type;
      return arr;
    });
  };
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    if (text.length) setIsValid(validateETH(text) || validateTZ(text));
  }, [text]);
  return (
    <>
      <div className="addresses">
        {addresses.map((address, i) => (
          <AddressPreview
            key={i}
            number={i + 1}
            user={address}
            onChangeType={type => onChangeType(i, type)}
            updateName={name =>
              setAddresses(_addresses => {
                _addresses[i].name = name;
                return _addresses;
              })
            }
            onRemoveClick={() =>
              setAddresses(_addresses =>
                _addresses.filter(_address => _address != address)
              )
            }
          />
        ))}
      </div>
      {addresses.length < 10 && (
        <form onSubmit={onAddAddress}>
          <input
            type="text"
            required
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Address starting with 0x... or tz..."
          />
          <button disabled={!isValid} type="submit">
            Add to frame
          </button>{' '}
        </form>
      )}
      <style jsx>{`
        .address-text-area {
        }
        input {
          width: 100%;
          font-size: 18px;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid ${isValid || text.length == 0 ? '#ccc' : 'red'};
          border-radius: 3px;
          font-size: 16px;
        }
        button {
          width: 100%;
          background-color: black;
          color: white;
          padding: 10px;
          border-radius: 3px;
          outline: none;
          border: none;
          font-size: 16px;
        }
        button:disabled {
          color: #ccc;
        }
      `}</style>
    </>
  );
};

export default AddressTextInputs;