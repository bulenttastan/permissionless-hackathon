'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const WalletConnect = () => {
  const { isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return isConnected ? (
    <button
      onClick={handleDisconnect}
      className="absolute top-2 right-2 px-2 py-1 rounded-full bg-sky-200 transition-colors text-sky-500 text-xs"
      title="Disconnect"
    >
      &#10005;
    </button>
  ) : (
    <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow-md relative">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">Connect your wallet to Binance</p>
        <button
          onClick={handleConnect}
          disabled={isPending}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
};

export default WalletConnect;
