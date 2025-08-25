import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class HardhatService {
  private contractsDir = path.join(__dirname, '../../contracts');
  private artifactsDir = path.join(__dirname, '../../artifacts');

  async compileAndDeploy(contractType: string, contractData: any): Promise<{ contractAddress: string; txHash: string }> {
    try {
      // Compile the contract first
      const { bytecode, abi } = await this.compileContract(contractType, contractData);
      
      // For now, return mock deployment data since real deployment requires wallet setup
      // In production, this would use ethers.js to deploy to Monad testnet
      const mockContractAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      return {
        contractAddress: mockContractAddress,
        txHash: mockTxHash,
      };
    } catch (error) {
      console.error('Deployment error:', error);
      throw new Error(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async compileContract(contractType: string, contractData: any): Promise<{ bytecode: string; abi: any[] }> {
    const contractPath = this.generateContract(contractType, contractData);
    
    // Compile using Hardhat
    await this.runHardhatCommand(['compile']);
    
    // Read the compiled artifact
    const artifactPath = path.join(
      this.artifactsDir,
      'contracts',
      path.basename(contractPath),
      `${contractData.name || 'Token'}.sol`,
      `${contractData.name || 'Token'}.json`
    );
    
    if (!fs.existsSync(artifactPath)) {
      throw new Error('Contract compilation failed');
    }
    
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    return {
      bytecode: artifact.bytecode,
      abi: artifact.abi,
    };
  }

  private generateContract(contractType: string, contractData: any): string {
    let contractContent = '';
    const contractName = contractData.name?.replace(/\s+/g, '') || 'Token';
    
    switch (contractType.toUpperCase()) {
      case 'ERC20':
        contractContent = this.generateERC20Contract(contractName, contractData);
        break;
      case 'ERC721':
        contractContent = this.generateERC721Contract(contractName, contractData);
        break;
      case 'ERC1155':
        contractContent = this.generateERC1155Contract(contractName, contractData);
        break;
      default:
        throw new Error('Unsupported contract type');
    }
    
    const contractPath = path.join(this.contractsDir, `${contractName}.sol`);
    fs.writeFileSync(contractPath, contractContent);
    return contractPath;
  }

  private generateERC20Contract(name: string, data: any): string {
    return `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${name} is ERC20, Ownable {
    constructor() ERC20("${data.name}", "${data.symbol}") Ownable(msg.sender) {
        _mint(msg.sender, ${data.totalSupply} * 10**decimals());
    }
}
    `.trim();
  }

  private generateERC721Contract(name: string, data: any): string {
    return `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${name} is ERC721, Ownable {
    uint256 private _nextTokenId;
    string private _baseTokenURI;
    uint256 public immutable maxSupply;
    
    constructor() ERC721("${data.name}", "${data.symbol}") Ownable(msg.sender) {
        _baseTokenURI = "${data.baseURI || ''}";
        maxSupply = ${data.maxSupply || '10000'};
    }
    
    function mint(address to) public onlyOwner {
        require(_nextTokenId < maxSupply, "Max supply reached");
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }
}
    `.trim();
  }

  private generateERC1155Contract(name: string, data: any): string {
    return `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${name} is ERC1155, Ownable {
    uint256 public constant TOKEN_ID = 0;
    uint256 public immutable initialSupply;
    
    constructor() ERC1155("${data.uri}") Ownable(msg.sender) {
        initialSupply = ${data.initialSupply || '1000'};
        _mint(msg.sender, TOKEN_ID, initialSupply, "");
    }
    
    function mint(address to, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        _mint(to, id, amount, data);
    }
    
    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }
    
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
}
    `.trim();
  }

  private runHardhatCommand(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const hardhat = spawn('npx', ['hardhat', ...args], {
        cwd: path.join(__dirname, '../..'),
        stdio: 'pipe',
      });

      let output = '';
      let errorOutput = '';

      hardhat.stdout.on('data', (data) => {
        output += data.toString();
      });

      hardhat.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      hardhat.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Hardhat command failed: ${errorOutput}`));
        }
      });
    });
  }

  async estimateGas(contractType: string, contractData: any): Promise<{ gasLimit: string; gasPrice: string; totalCost: string }> {
    // Gas estimation for Monad testnet
    const baseGas = {
      ERC20: 1800000,
      ERC721: 2400000,
      ERC1155: 2800000,
    };

    const gasLimit = baseGas[contractType.toUpperCase() as keyof typeof baseGas] || 1800000;
    const gasPrice = '1'; // 1 Gwei (Monad typically has lower gas prices)
    const totalCostWei = gasLimit * parseInt(gasPrice) * 1e9;
    const totalCostMon = (totalCostWei / 1e18).toFixed(6);

    return {
      gasLimit: gasLimit.toLocaleString(),
      gasPrice: `${gasPrice} Gwei`,
      totalCost: `~${totalCostMon} MON`,
    };
  }
}

export const hardhatService = new HardhatService();
