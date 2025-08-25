
import { useState } from 'react';
import { useAccount } from '@/components/wallet-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Rocket, Wallet, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ERC20Form } from './erc20-form';
import { ERC721Form } from './erc721-form';
import { ERC1155Form } from './erc1155-form';
import { GasEstimation } from './gas-estimation';
import { DeploymentStatus } from './deployment-status';
import { SuccessModal } from './success-modal';
import { useContractDeploy, useDeployments } from '@/hooks/use-contract-deploy';
import type { ERC20Config, ERC721Config, ERC1155Config } from '@shared/schema';

export function ContractDeployer() {
  const { isConnected, address, connect } = useAccount();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('erc20');
  const [deploymentStatus, setDeploymentStatus] = useState<'pending' | 'deploying' | 'success' | 'error' | null>(null);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<{ type: string; config: any } | null>(null);

  const { deployContract, isDeploying, deploymentError, deploymentData } = useContractDeploy();
  const { data: deployments, refetch: refetchDeployments } = useDeployments();

  const handleDeploy = async (type: 'ERC20' | 'ERC721' | 'ERC1155', config: ERC20Config | ERC721Config | ERC1155Config) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setDeploymentStatus('deploying');
      setCurrentConfig({ type, config });
      
      deployContract({ type, config }, {
        onSuccess: (result) => {
          setDeploymentStatus('success');
          setDeploymentResult(result);
          setShowSuccessModal(true);
          refetchDeployments();
          toast({
            title: "Contract Deployed!",
            description: `Your ${type} contract has been deployed successfully.`,
          });
        },
        onError: (error) => {
          setDeploymentStatus('error');
          toast({
            title: "Deployment Failed",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      setDeploymentStatus('error');
      console.error('Deployment error:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard.",
    });
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Wallet className="h-6 w-6" />
              Connect Your Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Connect your wallet to start deploying smart contracts
            </p>
            <Button onClick={connect} className="bg-blue-600 hover:bg-blue-700">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Smart Contract Deployer</h1>
        <p className="text-slate-400">Deploy ERC-20, ERC-721, and ERC-1155 contracts to Sepolia testnet</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-300">
          <CheckCircle className="h-4 w-4 text-green-400" />
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      </div>

      {/* Contract Deployment */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Code className="h-6 w-6" />
            Deploy Smart Contract
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
              <TabsTrigger value="erc20" className="data-[state=active]:bg-slate-600">ERC-20</TabsTrigger>
              <TabsTrigger value="erc721" className="data-[state=active]:bg-slate-600">ERC-721</TabsTrigger>
              <TabsTrigger value="erc1155" className="data-[state=active]:bg-slate-600">ERC-1155</TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              <TabsContent value="erc20">
                <ERC20Form
                  onDeploy={(config) => handleDeploy('ERC20', config)}
                  isLoading={isDeploying}
                  onConfigChange={(config) => setCurrentConfig({ type: 'ERC20', config })}
                />
              </TabsContent>

              <TabsContent value="erc721">
                <ERC721Form
                  onDeploy={(config) => handleDeploy('ERC721', config)}
                  isLoading={isDeploying}
                  onConfigChange={(config) => setCurrentConfig({ type: 'ERC721', config })}
                />
              </TabsContent>

              <TabsContent value="erc1155">
                <ERC1155Form
                  onDeploy={(config) => handleDeploy('ERC1155', config)}
                  isLoading={isDeploying}
                  onConfigChange={(config) => setCurrentConfig({ type: 'ERC1155', config })}
                />
              </TabsContent>

              {/* Gas Estimation */}
              {currentConfig && currentConfig.config && (
                <GasEstimation
                  contractType={currentConfig.type}
                  contractData={currentConfig.config}
                />
              )}

              {/* Deployment Status */}
              {deploymentStatus && (
                <DeploymentStatus
                  status={deploymentStatus}
                  txHash={deploymentResult?.txHash}
                  contractAddress={deploymentResult?.contractAddress}
                  error={deploymentError?.message}
                />
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Deployments */}
      {deployments && deployments.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Rocket className="h-6 w-6" />
              Recent Deployments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deployments.slice(0, 5).map((deployment, index) => (
                <div key={deployment.id || index} className="flex items-center justify-between p-3 bg-slate-700 rounded">
                  <div>
                    <span className="font-medium text-white">{deployment.contractType}</span>
                    <span className="text-slate-400 ml-2 text-sm">
                      {new Date(deployment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-mono text-sm">
                      {deployment.contractAddress?.slice(0, 6)}...{deployment.contractAddress?.slice(-4)}
                    </span>
                    <Button
                      onClick={() => copyToClipboard(deployment.contractAddress || '')}
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white"
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Modal */}
      {showSuccessModal && deploymentResult && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          contractAddress={deploymentResult.contractAddress}
          txHash={deploymentResult.txHash}
          contractType={currentConfig?.type || 'Contract'}
        />
      )}
    </div>
  );
}
