import { ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { scrollSepoliaTokens } from '@pancakeswap/tokens'

import { StableSwapPool } from './types'

export const pools: StableSwapPool[] = [
  {
    lpSymbol: 'USDT-USDC LP',
    lpAddress: '0xF850744C9fA41a65B0F60919370EE50928D45527',
    token: scrollSepoliaTokens.usdt, // coins[0]
    quoteToken: scrollSepoliaTokens.usdc, // coins[1]
    stableSwapAddress: '0x76e1DDCc322fd8eff292184420b02bBbe2211078',
    infoStableSwapAddress: '0x3417aaF50fBff099CBc198A48F2896e28d3d8052',
    stableLpFee: 0.0004,
    stableLpFeeRateOfTotalFee: 0.5,
  },
]
