# Overview

This is a smart contract deployment platform that provides a user-friendly interface for deploying various types of Ethereum contracts (ERC-20, ERC-721, and ERC-1155) to the Sepolia testnet. The application features a React frontend with modern UI components, an Express.js backend for contract compilation and deployment management, and integrates with blockchain development tools like Hardhat for smart contract compilation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system and Tailwind CSS for styling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Wallet Integration**: RainbowKit with Wagmi for Ethereum wallet connections
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Smart Contract Compilation**: Hardhat for Solidity contract compilation and artifact generation
- **File Storage**: In-memory storage implementation with interface for future database integration
- **Development Server**: Vite middleware integration for seamless development experience

## Database Schema
- **Deployments Table**: Stores contract deployment records including contract type, address, transaction hash, wallet address, contract configuration, deployment status, and gas metrics
- **Schema Validation**: Zod schemas for runtime type checking of contract configurations (ERC-20, ERC-721, ERC-1155)
- **Shared Types**: Common type definitions between frontend and backend using shared schema file

## Smart Contract Support
- **ERC-20 Tokens**: Fungible tokens with configurable name, symbol, supply, and decimals
- **ERC-721 NFTs**: Non-fungible tokens for unique digital assets with metadata support
- **ERC-1155 Multi-Tokens**: Multi-token standard supporting both fungible and non-fungible tokens
- **Contract Generation**: Dynamic Solidity contract generation based on user configuration
- **Compilation Pipeline**: Automated contract compilation using Hardhat with artifact extraction

## Authentication & Wallet Integration
- **Wallet Connection**: RainbowKit provides multiple wallet options for user authentication
- **Network Configuration**: Configured for Sepolia testnet deployment
- **Transaction Management**: Wagmi hooks for blockchain interactions and transaction monitoring

# External Dependencies

## Blockchain Infrastructure
- **Ethereum Network**: Sepolia testnet for contract deployments
- **Infura**: RPC provider for blockchain connectivity (configurable via environment variables)
- **Hardhat**: Ethereum development environment for contract compilation and testing

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)
- **Connection Pooling**: PostgreSQL connection management with connect-pg-simple for session storage

## File Storage & IPFS
- **Pinata**: IPFS pinning service for metadata and asset storage
- **IPFS Integration**: Decentralized storage for NFT metadata and contract-related files

## Development Tools
- **Replit Integration**: Specialized Vite plugins for Replit development environment
- **Build Tools**: ESBuild for production builds, TypeScript for type checking
- **Code Quality**: Prettier and ESLint configurations (implied from package structure)

## UI Component Libraries
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Class Variance Authority**: Type-safe component variant management

## Form & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation library
- **@hookform/resolvers**: Integration layer between React Hook Form and Zod

## Development Dependencies
- **Vite**: Fast build tool with HMR support
- **TypeScript**: Static type checking throughout the application
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins