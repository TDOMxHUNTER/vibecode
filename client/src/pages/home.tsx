import { ContractDeployer } from '@/components/contract-deployer';
import { WalletProvider } from '@/components/wallet-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <ContractDeployer />
        <Toaster />
      </WalletProvider>
    </QueryClientProvider>
  );
}