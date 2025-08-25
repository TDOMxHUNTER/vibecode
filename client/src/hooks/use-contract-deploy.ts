import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ERC20Config, ERC721Config, ERC1155Config, InsertDeployment, Deployment } from '@shared/schema';

export interface DeploymentResult {
  txHash: string;
  contractAddress: string;
  status: 'success' | 'pending' | 'deploying' | 'error';
  error?: string;
}

export interface GasEstimateResult {
  gasLimit: string;
  gasPrice: string;
  totalCost: string;
}

export function useContractDeploy() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (deployment: { type: string; config: any }) => {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: deployment.type,
          config: deployment.config,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `Deployment failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success' && result.contractAddress && result.txHash) {
        return result;
      } else {
        throw new Error(result.error || 'Invalid deployment response');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
    },
  });

  return {
    deployContract: (data: { type: string; config: any }, callbacks?: {
      onSuccess?: (result: DeploymentResult) => void;
      onError?: (error: Error) => void;
    }) => {
      mutation.mutate(data, {
        onSuccess: callbacks?.onSuccess,
        onError: callbacks?.onError,
      });
    },
    isDeploying: mutation.isPending,
    deploymentError: mutation.error,
    deploymentData: mutation.data,
    deployMutation: mutation,
  };
}

export function useDeployments() {
  return useQuery<Deployment[]>({
    queryKey: ['deployments'],
    queryFn: async () => {
      const response = await fetch('/api/deployments');
      if (!response.ok) {
        throw new Error('Failed to fetch deployments');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    refetchInterval: 5000, // Refetch every 5 seconds
    retry: 3,
  });
}

export function useGasEstimate(contractType: string, contractData: any) {
  return useQuery<GasEstimateResult>({
    queryKey: ['gas-estimate', contractType, contractData],
    queryFn: async () => {
      const response = await fetch('/api/gas-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType, contractData }),
      });
      if (!response.ok) {
        throw new Error('Gas estimation failed');
      }
      return response.json();
    },
    enabled: !!contractType && !!contractData && contractType !== '' && Object.keys(contractData).length > 0,
    retry: 1,
  });
}