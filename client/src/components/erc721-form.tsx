import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon, X, Plus } from 'lucide-react';
import type { ERC721Config } from '@shared/schema';

interface ERC721FormProps {
  onDeploy: (config: ERC721Config) => void;
  isLoading: boolean;
  onConfigChange?: (config: ERC721Config) => void;
}

export function ERC721Form({ onDeploy, isLoading, onConfigChange }: ERC721FormProps) {
  const [config, setConfig] = useState<ERC721Config>({
    name: '',
    symbol: '',
    baseURI: '',
    maxSupply: 10000,
    mintPrice: '0',
    imageUrl: '',
    description: '',
    attributes: [],
  });

  const [newAttribute, setNewAttribute] = useState({ trait_type: '', value: '' });

  const updateConfig = (updates: Partial<ERC721Config>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const addAttribute = () => {
    if (newAttribute.trait_type && newAttribute.value) {
      updateConfig({
        attributes: [...config.attributes, newAttribute],
      });
      setNewAttribute({ trait_type: '', value: '' });
    }
  };

  const removeAttribute = (index: number) => {
    updateConfig({
      attributes: config.attributes.filter((_, i) => i !== index),
    });
  };

  const handleDeploy = () => {
    if (config.name && config.symbol) {
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
          <ImageIcon className="h-5 w-5 text-blue-400" />
          ERC-721 NFT Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="erc721-name" className="text-slate-300">Collection Name</Label>
            <Input
              id="erc721-name"
              placeholder="e.g., My NFT Collection"
              value={config.name}
              onChange={(e) => updateConfig({ name: e.target.value })}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>
          <div>
            <Label htmlFor="erc721-symbol" className="text-slate-300">Symbol</Label>
            <Input
              id="erc721-symbol"
              placeholder="e.g., MNC"
              value={config.symbol}
              onChange={(e) => updateConfig({ symbol: e.target.value })}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="erc721-baseuri" className="text-slate-300">Base URI (Optional)</Label>
            <Input
              id="erc721-baseuri"
              placeholder="https://api.example.com/metadata/"
              value={config.baseURI}
              onChange={(e) => updateConfig({ baseURI: e.target.value })}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>
          <div>
            <Label htmlFor="erc721-maxsupply" className="text-slate-300">Max Supply</Label>
            <Input
              id="erc721-maxsupply"
              type="number"
              value={config.maxSupply}
              onChange={(e) => updateConfig({ maxSupply: parseInt(e.target.value) || 10000 })}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="erc721-price" className="text-slate-300">Mint Price (ETH)</Label>
            <Input
              id="erc721-price"
              placeholder="0.01"
              value={config.mintPrice}
              onChange={(e) => updateConfig({ mintPrice: e.target.value })}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>
          <div>
            <Label htmlFor="erc721-image" className="text-slate-300">Image URL (Optional)</Label>
            <Input
              id="erc721-image"
              placeholder="https://example.com/nft-image.png"
              value={config.imageUrl}
              onChange={(e) => updateConfig({ imageUrl: e.target.value })}
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="erc721-description" className="text-slate-300">Description (Optional)</Label>
          <Textarea
            id="erc721-description"
            placeholder="Describe your NFT collection..."
            value={config.description}
            onChange={(e) => updateConfig({ description: e.target.value })}
            className="bg-slate-600 border-slate-500 text-white"
            rows={3}
          />
        </div>

        <div>
          <Label className="text-slate-300">Metadata Attributes</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={newAttribute.trait_type}
              onChange={(e) => setNewAttribute(prev => ({ ...prev, trait_type: e.target.value }))}
              placeholder="Trait type"
              className="bg-slate-600 border-slate-500 text-white"
            />
            <Input
              value={newAttribute.value}
              onChange={(e) => setNewAttribute(prev => ({ ...prev, value: e.target.value }))}
              placeholder="Value"
              className="bg-slate-600 border-slate-500 text-white"
            />
            <Button
              onClick={addAttribute}
              size="sm"
              variant="outline"
              className="bg-blue-600 hover:bg-blue-700 border-blue-500"
            >
              <Plus size={16} />
            </Button>
          </div>
          <div className="mt-2 space-y-2">
            {config.attributes.map((attr, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-slate-700 rounded">
                <span className="text-blue-400 text-sm font-medium">{attr.trait_type}:</span>
                <span className="text-white text-sm">{attr.value}</span>
                <Button
                  onClick={() => removeAttribute(index)}
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
          disabled={isLoading || !config.name || !config.symbol}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Deploying...' : 'Deploy NFT Contract'}
        </Button>
      </CardContent>
    </Card>
  );
}