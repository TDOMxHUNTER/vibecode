import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const deployments = pgTable("deployments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contractType: text("contract_type").notNull(),
  contractAddress: text("contract_address"),
  transactionHash: text("transaction_hash"),
  walletAddress: text("wallet_address").notNull(),
  contractData: jsonb("contract_data").notNull(),
  status: text("status").notNull().default("pending"),
  gasUsed: integer("gas_used"),
  gasPrice: text("gas_price"),
  deployedAt: timestamp("deployed_at").defaultNow(),
});

export const insertDeploymentSchema = createInsertSchema(deployments).omit({
  id: true,
  deployedAt: true,
}).extend({
  contractData: z.any(),
});

export type InsertDeployment = z.infer<typeof insertDeploymentSchema>;
export type Deployment = typeof deployments.$inferSelect;

// Contract configuration schemas
export const ERC20ConfigSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Token symbol is required"),
  totalSupply: z.string().min(1, "Total supply is required"),
  decimals: z.number().default(18),
  imageUrl: z.string().optional(),
  mintable: z.boolean().default(false),
  burnable: z.boolean().default(false),
});

export const ERC721ConfigSchema = z.object({
  name: z.string().min(1, "Collection name is required"),
  symbol: z.string().min(1, "Collection symbol is required"),
  baseURI: z.string().url().optional(),
  maxSupply: z.number().positive().default(10000),
  mintPrice: z.string().default("0"),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  attributes: z.array(z.object({
    trait_type: z.string(),
    value: z.string(),
  })).default([]),
});

export const ERC1155ConfigSchema = z.object({
  name: z.string().min(1, "Collection name is required"),
  symbol: z.string().min(1, "Collection symbol is required"),
  uri: z.string().url('Must be a valid URI'),
  mintable: z.boolean().default(false),
  burnable: z.boolean().default(false),
  tokens: z.array(z.object({
    id: z.number(),
    name: z.string(),
    maxSupply: z.number(),
    mintPrice: z.string(),
  })).default([]),
});

export type ERC20Config = z.infer<typeof ERC20ConfigSchema>;
export type ERC721Config = z.infer<typeof ERC721ConfigSchema>;
export type ERC1155Config = z.infer<typeof ERC1155ConfigSchema>;

export const DeploymentSchema = z.object({
  type: z.enum(['ERC20', 'ERC721', 'ERC1155']),
  config: z.union([ERC20ConfigSchema, ERC721ConfigSchema, ERC1155ConfigSchema]),
});

export type DeploymentRequest = z.infer<typeof DeploymentSchema>;