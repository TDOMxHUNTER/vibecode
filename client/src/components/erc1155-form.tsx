import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Layers, X, Plus } from 'lucide-react';
import type { ERC1155Config } from '@shared/schema';

interface ERC1155FormProps {
  onDeploy: (config: ERC1155Config) => void;
  isLoading: boolean;
  onConfigChange?: (config: ERC1155Config) => void;
}

export function ERC1155Form({ onDeploy, isLoading, onConfigChange }: ERC1155FormProps) {
  const [config, setConfig] = useState<ERC1155Config>({
    name: '',
    symbol: '',
    uri: '',
    mintable: false,
    burnable: false,
    tokens: [],
  });

  const [newToken, setNewToken] = useState({
    id: 0,
    name: '',
    maxSupply: 1000,
    mintPrice: '0',
  });

  const updateConfig = (updates: Partial<ERC1155Config>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const addToken = () => {
    if (newToken.name) {
      updateConfig({
        tokens: [...config.tokens, { ...newToken, id: config.tokens.length }],
      });
      setNewToken({
        id: 0,
        name: '',
        maxSupply: 1000,
        mintPrice: '0',
      });
    }
  };

  const removeToken = (index: number) => {
    updateConfig({
      tokens: config.tokens.filter((_, i) => i !== index),
    });
  };

  const handleDeploy = () => {
    if (config.name && config.symbol && config.uri) {
      onDeploy(config);
    }
  };

  useEffect(() => {
    onConfigChange?.(config);
  }, []);

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center">
          <Layers className="text-green-400 mr-2" size={20} />
          ERC-1155 Multi-Token Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="erc1155-name" className="text-slate-300">Collection Name</Label>
            <Input
              id="erc1155-name"
              value={config.name}
              onChange={(e) => updateConfig({ name: e.target.value })}
              placeholder="My Multi-Token Collection"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label htmlFor="erc1155-symbol" className="text-slate-300">Symbol</Label>
            <Input
              id="erc1155-symbol"
              value={config.symbol}
              onChange={(e) => updateConfig({ symbol: e.target.value.toUpperCase() })}
              placeholder="MMT"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="erc1155-uri" className="text-slate-300">Metadata URI</Label>
          <Input
            id="erc1155-uri"
            value={config.uri}
            onChange={(e) => updateConfig({ uri: e.target.value })}
            placeholder="https://api.example.com/metadata/{id}.json"
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="erc1155-mintable"
              checked={config.mintable}
              onCheckedChange={(checked) => updateConfig({ mintable: checked })}
            />
            <Label htmlFor="erc1155-mintable" className="text-slate-300">Mintable</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="erc1155-burnable"
              checked={config.burnable}
              onCheckedChange={(checked) => updateConfig({ burnable: checked })}
            />
            <Label htmlFor="erc1155-burnable" className="text-slate-300">Burnable</Label>
          </div>
        </div>

        <div>
          <Label className="text-slate-300">Token Types</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            <Input
              value={newToken.name}
              onChange={(e) => setNewToken(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Token name"
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Input
              value={newToken.maxSupply}
              onChange={(e) => setNewToken(prev => ({ ...prev, maxSupply: parseInt(e.target.value) || 1000 }))}
              placeholder="Max supply"
              type="number"
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Input
              value={newToken.mintPrice}
              onChange={(e) => setNewToken(prev => ({ ...prev, mintPrice: e.target.value }))}
              placeholder="Price (ETH)"
              type="number"
              step="0.001"
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Button
              onClick={addToken}
              size="sm"
              variant="outline"
              className="bg-green-600 hover:bg-green-700 border-green-500"
            >
              <Plus size={16} />
            </Button>
          </div>
          <div className="mt-2 space-y-2">
            {config.tokens.map((token, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-slate-700 rounded">
                <span className="text-green-400 font-mono text-sm">#{token.id}</span>
                <span className="text-white text-sm font-medium">{token.name}</span>
                <span className="text-slate-400 text-sm">Max: {token.maxSupply.toLocaleString()}</span>
                <span className="text-slate-400 text-sm">Price: {token.mintPrice} ETH</span>
                <Button
                  onClick={() => removeToken(index)}
                  size="sm"
                  variant="ghost"
                  className="ml-auto text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleDeploy}
          disabled={isLoading || !config.name || !config.symbol || !config.uri}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Deploying...' : 'Deploy Multi-Token Contract'}
        </Button>
      </CardContent>
    </Card>
  );
}