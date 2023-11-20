import { WETH9 } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { USDC, USDT, ELDEN, DAI } from './common'

export const scrollSepoliaTokens = {
  weth: WETH9[ChainId.SCROLL_SEPOLIA],
  usdc: USDC[ChainId.SCROLL_SEPOLIA],
  usdt: USDT[ChainId.SCROLL_SEPOLIA],
  elden: ELDEN[ChainId.SCROLL_SEPOLIA],
  dai: DAI[ChainId.SCROLL_SEPOLIA],
}
