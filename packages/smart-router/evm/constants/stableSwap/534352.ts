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
    lpAddress: '0x052b740736165E259C2cf9e48fa1ce5dD3eF7976',
    token: mockUSDT, // coins[0]
    quoteToken: scrollSepoliaTokens.usdc, // coins[1]
    stableSwapAddress: '0xB2Cd941819692AA8a52F203D3533F176422Cf14C',
    infoStableSwapAddress: '0xeDF82B3Cb2cAE4e6C4dEa3D804f25c1502161904',
    stableLpFee: 0.0004,
    stableLpFeeRateOfTotalFee: 0.5,
  },
  {
    lpSymbol: 'USDT-ELDEN LP',
    lpAddress: '0x507B451eec4A9a686aDd99BFA6f906Bb56a9c73b',
    token: mockUSDT, // coins[0]
    quoteToken: scrollSepoliaTokens.elden, // coins[1]
    stableSwapAddress: '0xf827502a3d9e5943468b1529fe2f02537bc59340',
    infoStableSwapAddress: '0xeDF82B3Cb2cAE4e6C4dEa3D804f25c1502161904',
    stableLpFee: 0.0004,
    stableLpFeeRateOfTotalFee: 0.5,
  },
]
