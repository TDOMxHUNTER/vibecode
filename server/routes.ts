
import { type Express } from "express";
import { createServer, type Server } from "http";
import { hardhatService } from "./services/hardhat";
import { ipfsService } from "./services/ipfs";
import type { DeploymentRequest } from "@shared/schema";

// In-memory storage for deployments (replace with database in production)
const deployments: any[] = [];
let deploymentCounter = 1;

export function registerRoutes(app: Express): Server {
  // Deploy contract endpoint
  app.post("/api/deploy", async (req, res) => {
    try {
      const { type, config } = req.body as DeploymentRequest;
      
      if (!type || !config) {
        return res.status(400).json({ 
          error: 'Missing required fields: type and config' 
        });
      }
      
      // Validate required fields based on contract type
      if (type === 'ERC20' && (!config.name || !config.symbol || !config.totalSupply)) {
        return res.status(400).json({ 
          error: 'Missing required ERC20 fields: name, symbol, totalSupply' 
        });
      }
      
      if (type === 'ERC721' && (!config.name || !config.symbol)) {
        return res.status(400).json({ 
          error: 'Missing required ERC721 fields: name, symbol' 
        });
      }
      
      if (type === 'ERC1155' && (!config.name || !config.symbol || !config.uri)) {
        return res.status(400).json({ 
          error: 'Missing required ERC1155 fields: name, symbol, uri' 
        });
      }

      // Simulate deployment process
      const result = await hardhatService.compileAndDeploy(type, config);
      
      // Store deployment in memory
      const deployment = {
        id: deploymentCounter.toString(),
        contractType: type,
        contractAddress: result.contractAddress,
        txHash: result.txHash,
        createdAt: new Date().toISOString(),
        status: 'deployed',
        config: config,
      };
      
      deployments.unshift(deployment);
      deploymentCounter++;
      
      res.json({
        txHash: result.txHash,
        contractAddress: result.contractAddress,
        status: 'success',
      });
    } catch (error) {
      console.error('Deployment error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Deployment failed' 
      });
    }
  });

  // Gas estimation endpoint
  app.post("/api/gas-estimate", async (req, res) => {
    try {
      const { type: contractType, config: contractData } = req.body;
      
      if (!contractType || !contractData) {
        return res.status(400).json({ 
          error: 'Missing contractType or contractData' 
        });
      }
      
      const gasEstimate = await hardhatService.estimateGas(contractType, contractData);
      
      res.json(gasEstimate);
    } catch (error) {
      console.error('Gas estimation error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Gas estimation failed' 
      });
    }
  });

  // Get deployments endpoint
  app.get("/api/deployments", async (req, res) => {
    try {
      // Return stored deployments, most recent first
      res.json(deployments.slice(0, 10)); // Return last 10 deployments
    } catch (error) {
      console.error('Fetch deployments error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch deployments' 
      });
    }
  });

  // IPFS upload endpoint
  app.post("/api/upload", async (req, res) => {
    try {
      const { data, filename } = req.body;
      
      if (!data) {
        return res.status(400).json({ error: 'No data provided' });
      }
      
      if (typeof data === 'object') {
        // Upload JSON metadata
        const ipfsUrl = await ipfsService.uploadJSON(data);
        res.json({ url: ipfsUrl });
      } else {
        // Upload file
        const buffer = Buffer.from(data, 'base64');
        const ipfsUrl = await ipfsService.uploadFile(buffer, filename || 'file');
        res.json({ url: ipfsUrl });
      }
    } catch (error) {
      console.error('IPFS upload error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Upload failed' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
