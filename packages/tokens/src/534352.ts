import { WETH9 } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { USDC, USDT, ELDEN } from './common'

export const scrollTokens = {
  weth: WETH9[ChainId.SCROLL],
  usdc: USDC[ChainId.SCROLL],
  usdt: USDT[ChainId.SCROLL],
  elden: ELDEN[ChainId.SCROLL],
}
