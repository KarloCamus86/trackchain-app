import localDeployments   from '../../blockchain/deployments/local.json'
import sepoliaDeployments from '../../blockchain/deployments/sepolia.json'

// ─── Addresses ───────────────────────────────────────────────────────────────
// VITE_NETWORK=sepolia  → use Sepolia testnet addresses
// VITE_NETWORK=<any>    → use local Hardhat addresses (default)

const deployments =
  import.meta.env.VITE_NETWORK === 'sepolia' ? sepoliaDeployments : localDeployments

export const REGISTRY_ADDRESS  = deployments.ProductRegistry
export const TRACE_LOG_ADDRESS = deployments.TraceabilityLog

// ─── ABIs (only functions used by the frontend) ──────────────────────────────

export const REGISTRY_ABI = [
  {
    name: 'createProduct',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'name',         type: 'string' },
      { name: 'category',     type: 'string' },
      { name: 'manufacturer', type: 'string' },
    ],
    outputs: [{ name: 'newId', type: 'uint256' }],
  },
  {
    name: 'getProduct',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'id',           type: 'uint256' },
          { name: 'name',         type: 'string'  },
          { name: 'category',     type: 'string'  },
          { name: 'manufacturer', type: 'string'  },
          { name: 'createdAt',    type: 'uint256' },
          { name: 'owner',        type: 'address' },
          { name: 'exists',       type: 'bool'    },
        ],
      },
    ],
  },
  {
    name: 'getProductCount',
    type: 'function',
    stateMutability: 'view',
    inputs:  [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'registerManufacturer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs:  [{ name: 'manufacturer', type: 'address' }],
    outputs: [],
  },
]

export const TRACE_LOG_ABI = [
  {
    name: 'addEvent',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'productId',   type: 'uint256' },
      { name: 'stage',       type: 'string'  },
      { name: 'location',    type: 'string'  },
      { name: 'actor',       type: 'string'  },
      { name: 'description', type: 'string'  },
    ],
    outputs: [],
  },
  {
    name: 'getEvents',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'productId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple[]',
        components: [
          { name: 'stage',        type: 'string'  },
          { name: 'location',     type: 'string'  },
          { name: 'actor',        type: 'string'  },
          { name: 'description',  type: 'string'  },
          { name: 'timestamp',    type: 'uint256' },
          { name: 'verified',     type: 'bool'    },
          { name: 'registeredBy', type: 'address' },
        ],
      },
    ],
  },
  {
    name: 'getEventCount',
    type: 'function',
    stateMutability: 'view',
    inputs:  [{ name: 'productId', type: 'uint256' }],
    outputs: [{ type: 'uint256' }],
  },
]
