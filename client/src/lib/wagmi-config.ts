
import { http, createConfig } from 'wagmi'
import { createPublicClient } from 'viem'

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
}

export const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
  ssr: false,
})

export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
})
