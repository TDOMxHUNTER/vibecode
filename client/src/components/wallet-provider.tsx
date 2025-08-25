
import { createContext, useContext, ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAccount as useWagmiAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const queryClient = new QueryClient();

// Monad testnet configuration
const monadTestnet = {
  id: 10423,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://monad-testnet.socialscan.io/',
    },
  },
} as const;

const config = createConfig({
  chains: [monadTestnet],
  connectors: [injected()],
  transports: {
    [monadTestnet.id]: http(),
  },
});

interface WalletContextType {
  isConnected: boolean;
  address: string | undefined;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

function WalletProviderInner({ children }: { children: ReactNode }) {
  const { address, isConnected } = useWagmiAccount();
  const { connect: wagmiConnect, connectors } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  const connect = () => {
    if (connectors[0]) {
      wagmiConnect({ connector: connectors[0] });
    }
  };

  const disconnect = () => {
    wagmiDisconnect();
  };

  return (
    <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within WalletProvider');
  }
  return context;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <WalletProviderInner>
          {children}
        </WalletProviderInner>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
