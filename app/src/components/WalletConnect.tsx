'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow-md">
      {isConnected ? (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Connected to Binance Chain Testnet</p>
          <p className="text-xs text-gray-500 mb-4 font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Connect your wallet to Binance Chain Testnet</p>
          <button
            onClick={handleConnect}
            disabled={isPending}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
