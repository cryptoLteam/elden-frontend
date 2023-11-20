import { ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { scrollSepoliaTokens } from '@pancakeswap/tokens'

import { StableSwapPool } from './types'

const mockUSDT = new ERC20Token(
  ChainId.SCROLL_SEPOLIA,
  '0xa2EB04Bff2Ac8b9EFa47403F8dA213aCa809cECE',
  6,
  'USDT',
  'MOCK Token',
)

export const pools: StableSwapPool[] = [
  {
    lpSymbol: 'USDT-USDC LP',
    lpAddress: '0x10efe0ab874a140ad1960b01b61ac1823b29d88e',
    token: mockUSDT, // coins[0]
    quoteToken: scrollSepoliaTokens.usdc, // coins[1]
    stableSwapAddress: '0x2c87f78f26c2462545259b6514074e9d8686cdba',
    infoStableSwapAddress: '0xB7AE96320DdAfB0d700A8ef4B98e5b04C71Cd520',
    stableLpFee: 0.0004,
    stableLpFeeRateOfTotalFee: 0.5,
  },
]
