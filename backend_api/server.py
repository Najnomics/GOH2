from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import logging
import asyncio
import json
from web3 import Web3
from eth_abi import encode, decode
from dotenv import load_dotenv
import uuid

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="Gas Optimization Hook API", version="1.0.0")

# Create API router with prefix
api_router = APIRouter(prefix="/api")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Web3 connection to Anvil
anvil_url = "http://localhost:8545"
w3 = Web3(Web3.HTTPProvider(anvil_url))

# Contract addresses (will be set after deployment)
CONTRACT_ADDRESSES = {
    "gas_optimization_hook": None,
    "cost_calculator": None,
    "gas_price_oracle": None,
    "cross_chain_manager": None
}

# Pydantic models
class TokenInfo(BaseModel):
    address: str
    symbol: str
    decimals: int
    name: str

class SwapParams(BaseModel):
    token_in: str
    token_out: str
    amount_in: str
    slippage_tolerance: float = 0.5
    deadline_minutes: int = 30

class UserPreferences(BaseModel):
    min_savings_threshold_bps: int = 500  # 5%
    min_absolute_savings_usd: float = 10.0
    max_bridge_time_seconds: int = 1800  # 30 minutes
    enable_cross_chain_optimization: bool = True
    enable_usd_display: bool = True

class OptimizationQuote(BaseModel):
    original_chain_id: int
    optimized_chain_id: int
    original_cost_usd: float
    optimized_cost_usd: float
    savings_usd: float
    savings_percentage: float
    estimated_bridge_time: int
    should_optimize: bool
    cost_breakdown: Dict[str, float]

class ChainInfo(BaseModel):
    chain_id: int
    name: str
    symbol: str
    gas_price_gwei: float
    gas_price_usd: float
    is_active: bool

class SwapExecution(BaseModel):
    swap_id: str
    status: str
    transaction_hash: Optional[str] = None
    estimated_completion_time: Optional[int] = None

# Chain configuration
SUPPORTED_CHAINS = {
    1: {"name": "Ethereum", "symbol": "ETH", "rpc_url": "http://localhost:8545"},
    42161: {"name": "Arbitrum", "symbol": "ETH", "rpc_url": "http://localhost:8545"},
    10: {"name": "Optimism", "symbol": "ETH", "rpc_url": "http://localhost:8545"},
    137: {"name": "Polygon", "symbol": "MATIC", "rpc_url": "http://localhost:8545"},
    8453: {"name": "Base", "symbol": "ETH", "rpc_url": "http://localhost:8545"}
}

# Mock gas prices for demo (in gwei)
MOCK_GAS_PRICES = {
    1: 20.0,      # Ethereum
    42161: 0.1,   # Arbitrum
    10: 0.001,    # Optimism
    137: 100.0,   # Polygon
    8453: 0.01    # Base
}

# Mock ETH price in USD
ETH_PRICE_USD = 2000.0

# Contract ABIs (simplified for demo)
GAS_OPTIMIZATION_HOOK_ABI = [
    {
        "inputs": [
            {
                "components": [
                    {"name": "amountSpecified", "type": "int256"},
                    {"name": "zeroForOne", "type": "bool"},
                    {"name": "sqrtPriceLimitX96", "type": "uint160"}
                ],
                "name": "params",
                "type": "tuple"
            },
            {
                "components": [
                    {"name": "currency0", "type": "address"},
                    {"name": "currency1", "type": "address"},
                    {"name": "fee", "type": "uint24"},
                    {"name": "tickSpacing", "type": "int24"},
                    {"name": "hooks", "type": "address"}
                ],
                "name": "key",
                "type": "tuple"
            }
        ],
        "name": "getOptimizationQuote",
        "outputs": [
            {
                "components": [
                    {"name": "originalChainId", "type": "uint256"},
                    {"name": "optimizedChainId", "type": "uint256"},
                    {"name": "originalCostUSD", "type": "uint256"},
                    {"name": "optimizedCostUSD", "type": "uint256"},
                    {"name": "savingsUSD", "type": "uint256"},
                    {"name": "savingsPercentageBPS", "type": "uint256"},
                    {"name": "estimatedBridgeTime", "type": "uint256"},
                    {"name": "shouldOptimize", "type": "bool"}
                ],
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

# API Endpoints

@api_router.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Gas Optimization Hook API is running", "version": "1.0.0"}

@api_router.get("/status")
async def get_system_status():
    """Get system status including blockchain connection"""
    try:
        is_connected = w3.is_connected()
        latest_block = w3.eth.block_number if is_connected else None
        
        return {
            "blockchain_connected": is_connected,
            "latest_block": latest_block,
            "supported_chains": len(SUPPORTED_CHAINS),
            "contracts_deployed": any(CONTRACT_ADDRESSES.values())
        }
    except Exception as e:
        logger.error(f"Error getting system status: {e}")
        return {
            "blockchain_connected": False,
            "error": str(e)
        }

@api_router.get("/chains", response_model=List[ChainInfo])
async def get_supported_chains():
    """Get list of supported chains with current gas prices"""
    chains = []
    
    for chain_id, info in SUPPORTED_CHAINS.items():
        gas_price_gwei = MOCK_GAS_PRICES.get(chain_id, 0)
        # Calculate USD gas price (simplified calculation)
        gas_price_usd = (gas_price_gwei * ETH_PRICE_USD) / 1e9
        
        chains.append(ChainInfo(
            chain_id=chain_id,
            name=info["name"],
            symbol=info["symbol"],
            gas_price_gwei=gas_price_gwei,
            gas_price_usd=gas_price_usd,
            is_active=True
        ))
    
    return chains

@api_router.get("/gas-prices")
async def get_gas_prices():
    """Get current gas prices for all supported chains"""
    gas_prices = {}
    
    for chain_id, gas_price_gwei in MOCK_GAS_PRICES.items():
        chain_info = SUPPORTED_CHAINS.get(chain_id, {})
        gas_price_usd = (gas_price_gwei * ETH_PRICE_USD) / 1e9
        
        gas_prices[str(chain_id)] = {
            "chain_name": chain_info.get("name", f"Chain {chain_id}"),
            "gas_price_gwei": gas_price_gwei,
            "gas_price_usd": gas_price_usd,
            "timestamp": "2024-01-01T00:00:00Z"  # Mock timestamp
        }
    
    return gas_prices

@api_router.post("/optimization-quote", response_model=OptimizationQuote)
async def get_optimization_quote(swap_params: SwapParams):
    """Get optimization quote for a potential swap"""
    try:
        # Calculate costs for all chains
        current_chain_id = 1  # Assume Ethereum as default
        best_chain_id = current_chain_id
        best_cost = float('inf')
        
        # Mock calculation logic
        costs = {}
        for chain_id, gas_price_gwei in MOCK_GAS_PRICES.items():
            # Estimate gas cost (mock calculation)
            estimated_gas = 120000  # Standard swap gas
            gas_cost_eth = (estimated_gas * gas_price_gwei) / 1e9
            gas_cost_usd = gas_cost_eth * ETH_PRICE_USD
            
            # Add bridge fee if different chain
            bridge_fee_usd = 2.0 if chain_id != current_chain_id else 0.0
            total_cost_usd = gas_cost_usd + bridge_fee_usd
            
            costs[chain_id] = {
                "gas_cost_usd": gas_cost_usd,
                "bridge_fee_usd": bridge_fee_usd,
                "total_cost_usd": total_cost_usd
            }
            
            if total_cost_usd < best_cost:
                best_cost = total_cost_usd
                best_chain_id = chain_id
        
        original_cost = costs[current_chain_id]["total_cost_usd"]
        optimized_cost = costs[best_chain_id]["total_cost_usd"]
        savings_usd = max(0, original_cost - optimized_cost)
        savings_percentage = (savings_usd / original_cost * 100) if original_cost > 0 else 0
        
        # Check if optimization is beneficial
        should_optimize = (
            best_chain_id != current_chain_id and 
            savings_usd >= 10.0 and  # Min $10 savings
            savings_percentage >= 5.0  # Min 5% savings
        )
        
        return OptimizationQuote(
            original_chain_id=current_chain_id,
            optimized_chain_id=best_chain_id,
            original_cost_usd=original_cost,
            optimized_cost_usd=optimized_cost,
            savings_usd=savings_usd,
            savings_percentage=savings_percentage,
            estimated_bridge_time=300 if should_optimize else 0,  # 5 minutes
            should_optimize=should_optimize,
            cost_breakdown={
                "original_gas_cost": costs[current_chain_id]["gas_cost_usd"],
                "optimized_gas_cost": costs[best_chain_id]["gas_cost_usd"],
                "bridge_fee": costs[best_chain_id]["bridge_fee_usd"],
                "total_original": original_cost,
                "total_optimized": optimized_cost
            }
        )
        
    except Exception as e:
        logger.error(f"Error calculating optimization quote: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to calculate quote: {str(e)}")

@api_router.post("/execute-swap", response_model=SwapExecution)
async def execute_swap(swap_params: SwapParams, user_preferences: Optional[UserPreferences] = None):
    """Execute a swap (either local or cross-chain optimized)"""
    try:
        # Generate unique swap ID
        swap_id = str(uuid.uuid4())
        
        # Get optimization quote first
        quote = await get_optimization_quote(swap_params)
        
        if quote.should_optimize:
            # Execute cross-chain swap
            status = "cross_chain_initiated"
            estimated_completion = 300  # 5 minutes
        else:
            # Execute local swap
            status = "local_executed"
            estimated_completion = 30  # 30 seconds
        
        # Mock transaction hash
        tx_hash = f"0x{''.join(['a' if i % 2 == 0 else 'b' for i in range(64)])}"
        
        return SwapExecution(
            swap_id=swap_id,
            status=status,
            transaction_hash=tx_hash,
            estimated_completion_time=estimated_completion
        )
        
    except Exception as e:
        logger.error(f"Error executing swap: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to execute swap: {str(e)}")

@api_router.get("/swap-status/{swap_id}")
async def get_swap_status(swap_id: str):
    """Get status of a swap execution"""
    # Mock implementation
    return {
        "swap_id": swap_id,
        "status": "completed",
        "transaction_hash": f"0x{''.join(['a' if i % 2 == 0 else 'b' for i in range(64)])}",
        "completion_time": "2024-01-01T00:05:00Z",
        "gas_used": 120000,
        "gas_price_gwei": 20.0,
        "total_cost_usd": 15.50
    }

@api_router.get("/tokens")
async def get_supported_tokens():
    """Get list of supported tokens"""
    # Mock token list
    tokens = [
        {
            "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            "symbol": "WETH",
            "name": "Wrapped Ether",
            "decimals": 18,
            "price_usd": ETH_PRICE_USD
        },
        {
            "address": "0xA0b86a33E6c4b4C2Cc6c1c4CdbBD0d8C7B4e5d2A",
            "symbol": "USDC",
            "name": "USD Coin",
            "decimals": 6,
            "price_usd": 1.0
        },
        {
            "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            "symbol": "USDT",
            "name": "Tether USD",
            "decimals": 6,
            "price_usd": 1.0
        }
    ]
    return tokens

@api_router.get("/analytics/system")
async def get_system_analytics():
    """Get system-wide analytics"""
    return {
        "total_swaps_processed": 1250,
        "total_savings_usd": 125000.0,
        "cross_chain_swap_percentage": 65.5,
        "average_savings_percentage": 45.2,
        "most_popular_chains": [
            {"chain_id": 42161, "name": "Arbitrum", "usage_percentage": 35.0},
            {"chain_id": 10, "name": "Optimism", "usage_percentage": 25.0},
            {"chain_id": 8453, "name": "Base", "usage_percentage": 20.0}
        ],
        "last_24h_volume_usd": 2500000.0
    }

@api_router.get("/analytics/user/{user_address}")
async def get_user_analytics(user_address: str):
    """Get user-specific analytics"""
    return {
        "user_address": user_address,
        "total_swaps": 15,
        "total_savings_usd": 450.0,
        "average_savings_percentage": 42.0,
        "favorite_chains": ["Arbitrum", "Optimism"],
        "total_volume_usd": 25000.0,
        "member_since": "2024-01-01"
    }

# Include the API router
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)