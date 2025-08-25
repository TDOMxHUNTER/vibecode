import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractAddress: string;
  txHash: string;
  contractType: string;
}

export function SuccessModal({ isOpen, onClose, contractAddress, txHash, contractType }: SuccessModalProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-400" size={32} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white mb-2">
              Contract Deployed Successfully!
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-400 mb-6">
            Your {contractType} contract has been deployed to the Monad testnet.
          </p>

          <div className="bg-slate-700 rounded-lg p-4 mb-6 space-y-3">
            <div>
              <p className="text-sm text-slate-300 mb-2">Contract Address:</p>
              <p className="font-mono text-sm text-primary-400 break-all" data-testid="text-contract-address">
                {contractAddress}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(contractAddress, 'Contract address')}
                className="mt-2 text-xs text-slate-400 hover:text-slate-300"
                data-testid="button-copy-address"
              >
                <Copy size={12} className="mr-1" />
                Copy Address
              </Button>
            </div>

            <div>
              <p className="text-sm text-slate-300 mb-2">Transaction Hash:</p>
              <p className="font-mono text-sm text-primary-400 break-all">
                {txHash}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(txHash, 'Transaction hash')}
                className="mt-2 text-xs text-slate-400 hover:text-slate-300"
              >
                <Copy size={12} className="mr-1" />
                Copy Hash
              </Button>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank')}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
              data-testid="button-view-explorer"
            >
              <ExternalLink size={16} className="mr-2" />
              View on Explorer
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
              data-testid="button-close-modal"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}