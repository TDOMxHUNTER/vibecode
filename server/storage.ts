import { type Deployment, type InsertDeployment } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  createDeployment(deployment: InsertDeployment): Promise<Deployment>;
  updateDeployment(id: string, updates: Partial<Deployment>): Promise<Deployment>;
  getDeploymentsByWallet(walletAddress: string): Promise<Deployment[]>;
  getAllDeployments(): Promise<Deployment[]>;
  getDeployment(id: string): Promise<Deployment | undefined>;
}

export class MemStorage implements IStorage {
  private deployments: Map<string, Deployment>;

  constructor() {
    this.deployments = new Map();
  }

  async createDeployment(insertDeployment: InsertDeployment): Promise<Deployment> {
    const id = randomUUID();
    const deployment: Deployment = { 
      ...insertDeployment, 
      id,
      deployedAt: new Date(),
    };
    this.deployments.set(id, deployment);
    return deployment;
  }

  async updateDeployment(id: string, updates: Partial<Deployment>): Promise<Deployment> {
    const existing = this.deployments.get(id);
    if (!existing) {
      throw new Error(`Deployment ${id} not found`);
    }
    const updated = { ...existing, ...updates };
    this.deployments.set(id, updated);
    return updated;
  }

  async getDeploymentsByWallet(walletAddress: string): Promise<Deployment[]> {
    return Array.from(this.deployments.values()).filter(
      (deployment) => deployment.walletAddress === walletAddress,
    );
  }

  async getAllDeployments(): Promise<Deployment[]> {
    return Array.from(this.deployments.values());
  }

  async getDeployment(id: string): Promise<Deployment | undefined> {
    return this.deployments.get(id);
  }
}

export const storage = new MemStorage();
