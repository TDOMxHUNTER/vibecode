import { useGasEstimate } from '@/hooks/use-contract-deploy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Fuel, Loader2 } from 'lucide-react';

interface GasEstimationProps {
  contractType: string;
  contractData: any;
}

export function GasEstimation({ contractType, contractData }: GasEstimationProps) {
  const { data: gasEstimate, isLoading, error } = useGasEstimate(contractType, contractData);

  if (!contractType || !contractData) return null;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center">
          <Fuel className="text-orange-400 mr-2" size={20} />
          Gas Estimation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="animate-spin h-6 w-6 text-blue-400" />
            <span className="ml-2 text-slate-300">Estimating gas costs...</span>
          </div>
        ) : error ? (
          <div className="text-red-400 text-sm">
            Failed to estimate gas costs
          </div>
        ) : gasEstimate ? (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Gas Limit:</span>
              <span className="text-white font-mono">{gasEstimate.gasLimit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Gas Price:</span>
              <span className="text-white font-mono">{gasEstimate.gasPrice}</span>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-3">
              <span className="text-slate-300 font-medium">Estimated Cost:</span>
              <span className="text-orange-400 font-mono font-bold">{gasEstimate.totalCost}</span>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}