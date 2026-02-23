import React, { useState, useEffect } from 'react';
import { formatUnits } from 'ethers/utils';
import { Loader2 } from 'lucide-react';

// Verified assets with their decimal places
const VERIFIED_ASSETS = {
  'ETH': { decimals: 18, symbol: 'ETH', name: 'Ether' },
  'USDC': { decimals: 6, symbol: 'USDC', name: 'USD Coin' },
  'USDT': { decimals: 6, symbol: 'USDT', name: 'Tether' },
  'sDAI': { decimals: 18, symbol: 'sDAI', name: 'Savings DAI' },
  'ezETH': { decimals: 18, symbol: 'ezETH', name: 'Easy ETH' }
};

const AssetRow = ({ assetSymbol, balance, usdPrice, isLoading }) => {
  const asset = VERIFIED_ASSETS[assetSymbol];
  const formattedBalance = formatUnits(balance, asset.decimals);
  const usdValue = parseFloat(formattedBalance) * usdPrice;

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="font-medium">{asset.name}</div>
        <div className="text-gray-500">({asset.symbol})</div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="font-medium">
          {formattedBalance} {asset.symbol}
        </div>
        <div className="text-sm text-gray-500">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            `$${usdValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`
          )}
        </div>
      </div>
    </div>
  );
};

const TransactionInput = ({ assetSymbol, amount, usdPrice, onChange }) => {
  const asset = VERIFIED_ASSETS[assetSymbol];
  const usdValue = amount ? parseFloat(amount) * usdPrice : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder={`Enter ${asset.symbol} amount`}
        />
        <div className="font-medium">{asset.symbol}</div>
      </div>
      <div className="text-sm text-gray-500">
        ≈ ${usdValue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </div>
    </div>
  );
};

const AssetDisplay = ({ balances, onSend }) => {
  const [prices, setPrices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [sendAmount, setSendAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    // Simulated price fetching - replace with actual price API
    const fetchPrices = async () => {
      setIsLoading(true);
      // Mock prices - replace with actual price fetching logic
      const mockPrices = {
        'ETH': 2150.75,
        'USDC': 1.00,
        'USDT': 1.00,
        'sDAI': 1.00,
        'ezETH': 2150.75
      };
      setPrices(mockPrices);
      setIsLoading(false);
    };

    fetchPrices();
    // Set up periodic price updates
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Balance Display */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        {Object.entries(balances).map(([symbol, balance]) => (
          VERIFIED_ASSETS[symbol] && (
            <AssetRow
              key={symbol}
              assetSymbol={symbol}
              balance={balance}
              usdPrice={prices[symbol]}
              isLoading={isLoading}
            />
          )
        ))}
      </div>

      {/* Send Transaction UI */}
      {selectedAsset && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="text-lg font-medium mb-4">Send {selectedAsset}</h3>
          <TransactionInput
            assetSymbol={selectedAsset}
            amount={sendAmount}
            usdPrice={prices[selectedAsset]}
            onChange={setSendAmount}
          />
          <button
            onClick={() => onSend(selectedAsset, sendAmount)}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default AssetDisplay;