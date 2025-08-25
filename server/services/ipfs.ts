import FormData from 'form-data';
import fetch from 'node-fetch';

const PINATA_API_KEY = process.env.PINATA_API_KEY || '';
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || '';

export class IPFSService {
  async uploadFile(file: Buffer, filename: string): Promise<string> {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error('Pinata API keys not configured');
    }

    const formData = new FormData();
    formData.append('file', file, filename);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`IPFS upload failed: ${response.statusText}`);
    }

    const result = await response.json() as { IpfsHash: string };
    return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
  }

  async uploadJSON(metadata: any): Promise<string> {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error('Pinata API keys not configured');
    }

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_KEY,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: 'contract-metadata.json',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`IPFS JSON upload failed: ${response.statusText}`);
    }

    const result = await response.json() as { IpfsHash: string };
    return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
  }
}

export const ipfsService = new IPFSService();
