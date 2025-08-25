
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Coins } from 'lucide-react';
import type { ERC20Config } from '@shared/schema';

interface ERC20FormProps {
  onDeploy: (config: ERC20Config) => void;
  isLoading: boolean;
  onConfigChange?: (config: ERC20Config) => void;
}

export function ERC20Form({ onDeploy, isLoading, onConfigChange }: ERC20FormProps) {
  const [config, setConfig] = useState<ERC20Config>({
    name: '',
    symbol: '',
    totalSupply: '',
    decimals: 18,
    imageUrl: '',
    mintable: false,
    burnable: false,
  });

  const updateConfig = (updates: Partial<ERC20Config>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const handleDeploy = () => {
    if (config.name && config.symbol && config.totalSupply) {
      onDeploy(config);
    }
  };

  useEffect(() => {
    onConfigChange?.(config);
  }, []);

  return (
    <Card className="bg-slate-700 border-slate-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Coins className="h-5 w-5 text-yellow-400" />
          ERC-20 Token Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="erc20-name" className="text-slate-300">Token Name</Label>
            <Input
              id="erc20-name"
              placeholder="e.g., My Token"
              value={config.name}
              onChange={(e) => updateConfig({ name: e.target.value })}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>
          <div>
            <Label htmlFor="erc20-symbol" className="text-slate-300">Symbol</Label>
            <Input
              id="erc20-symbol"
              placeholder="e.g., MTK"
              value={config.symbol}
              onChange={(e) => updateConfig({ symbol: e.target.value })}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="erc20-supply" className="text-slate-300">Total Supply</Label>
            <Input
              id="erc20-supply"
              placeholder="e.g., 1000000"
              value={config.totalSupply}
              onChange={(e) => updateConfig({ totalSupply: e.target.value })}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>
          <div>
            <Label htmlFor="erc20-decimals" className="text-slate-300">Decimals</Label>
            <Input
              id="erc20-decimals"
              type="number"
              value={config.decimals}
              onChange={(e) => updateConfig({ decimals: parseInt(e.target.value) || 18 })}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="erc20-image" className="text-slate-300">Image URL (Optional)</Label>
          <Input
            id="erc20-image"
            placeholder="https://example.com/token-image.png"
            value={config.imageUrl}
            onChange={(e) => updateConfig({ imageUrl: e.target.value })}
            className="bg-slate-600 border-slate-500 text-white"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="erc20-mintable"
              checked={config.mintable}
              onCheckedChange={(checked) => updateConfig({ mintable: checked })}
            />
            <Label htmlFor="erc20-mintable" className="text-slate-300">Mintable</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="erc20-burnable"
              checked={config.burnable}
              onCheckedChange={(checked) => updateConfig({ burnable: checked })}
            />
            <Label htmlFor="erc20-burnable" className="text-slate-300">Burnable</Label>
          </div>
        </div>

        <Button
          onClick={handleDeploy}
          disabled={isLoading || !config.name || !config.symbol || !config.totalSupply}
          className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
        >
          {isLoading ? 'Deploying...' : 'Deploy Token Contract'}
        </Button>
      </CardContent>
    </Card>
  );
}
