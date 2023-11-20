import { WETH9, ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { ELDEN, USDC, USDT } from './common'

export const baseTestnetTokens = {
  weth: WETH9[ChainId.BASE_TESTNET],
  elden: ELDEN[ChainId.BASE_TESTNET],
  usdc: USDC[ChainId.BASE_TESTNET],
  usdt: USDT[ChainId.BASE_TESTNET],
}
