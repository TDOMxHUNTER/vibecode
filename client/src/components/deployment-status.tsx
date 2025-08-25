import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface DeploymentStatusProps {
  status: 'pending' | 'deploying' | 'success' | 'error';
  txHash?: string;
  contractAddress?: string;
  error?: string;
}

export function DeploymentStatus({ status, txHash, contractAddress, error }: DeploymentStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'deploying':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Preparing deployment...';
      case 'deploying':
        return 'Deploying contract...';
      case 'success':
        return 'Contract deployed successfully!';
      case 'error':
        return 'Deployment failed';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'deploying':
        return 'default';
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Deployment Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Badge variant={getStatusColor() as any}>
          {getStatusText()}
        </Badge>

        {txHash && (
          <div>
            <p className="text-sm font-medium">Transaction Hash:</p>
            <p className="text-xs text-gray-600 font-mono break-all">{txHash}</p>
          </div>
        )}

        {contractAddress && (
          <div>
            <p className="text-sm font-medium">Contract Address:</p>
            <p className="text-xs text-gray-600 font-mono break-all">{contractAddress}</p>
          </div>
        )}

        {error && (
          <div>
            <p className="text-sm font-medium text-red-600">Error:</p>
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}