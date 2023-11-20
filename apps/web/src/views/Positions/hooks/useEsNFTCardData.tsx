import { getLpTokenPrice } from '@pancakeswap/farms/farmPrices'
import { ChainId, WETH9, pancakePairV2ABI } from '@pancakeswap/sdk'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { STABLE_COIN } from '@pancakeswap/tokens'
import { nftPoolABI } from 'config/abi/nftPool'
import { eldenMasterABI } from 'config/abi/IEldenMaster'
import { eldenYieldBoosterABI } from 'config/abi/IEldenYieldBooster'
import { ELDEN_ADDRESS, ELDEN_MASTER, YIELD_BOOSTER_ADDRESS } from 'config/constants/elden'
import { useCurrency } from 'hooks/Tokens'
import { useLpPrice } from 'hooks/useLpPirce'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useTokenPriceBaseStableCoin } from 'hooks/useTokenPriceBaseStableCoin'
import { useEffect, useMemo, useState } from 'react'
import { getContractArrayResult, getContractResult, parseNumber } from 'utils/eldenHelper'
import { useAccount, useContractReads } from 'wagmi'
import { useStableLpPrice } from 'hooks/useStableLpPirce'
import { BLOCKS_PER_YEAR } from '@pancakeswap/pools'
import { useEsNFTAprs } from 'hooks/useEsNFTAprs'

export interface EsNFTData {
  poolAddress: string
  name: string
  type: string
  nftId: number
  depositedLp: number
  totalLpInPool: number
  pending: number
  pendingUSD: number
  startLockTime: number
  lockDuration: number
  pairAddress: string
  lpTotalSupply: number
  boostPoints: number
  token0: Currency
  token1: Currency
  ethPrice: number
  lpBalanceInWallet: number
  value: number
  allocPoint: number
  farmBaseAPR: number
  boostBonusAPR: number
  lockBonusAPR: number
  eldenPrice: number
  lpPrice: number
  userAllocation: number
  poolAllocation: number
  totalAllocation: number
  boostMultiplier: number
}

export const useEsNFTCardData = ({ esNft, ethPrice }) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const [data, setData] = useState<EsNFTData | undefined>(undefined)

  const token0 = useCurrency(esNft.pool.pair?.token0.id)
  const token1 = useCurrency(esNft.pool.pair?.token1.id)

  const eldenPrice = useTokenPriceBaseStableCoin(ELDEN_ADDRESS)

  const { lpPrice: stableLpPrice } = useStableLpPrice(esNft.pool.pair)
  const { lpPrice: v2LpPrice } = useLpPrice(
    esNft.pool.pair?.token0.id.toLowerCase() === STABLE_COIN[chainId ?? ChainId.SCROLL_SEPOLIA].address.toLowerCase()
      ? esNft.pool.pair?.token1.id
      : esNft.pool.pair?.token0.id,
    esNft.pool.pairAddress,
  )

  const lpPrice = esNft.pool.pair?.router === undefined ? v2LpPrice : stableLpPrice

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: esNft.pool.id,
        abi: nftPoolABI,
        functionName: 'pendingRewards',
        args: [esNft.nftId],
      },
      {
        address: esNft.pool.pairAddress,
        abi: pancakePairV2ABI,
        functionName: 'balanceOf',
        args: [account as `0x${string}`],
      },
      {
        address: ELDEN_MASTER,
        abi: eldenMasterABI,
        functionName: 'getPoolInfo',
        args: [esNft.pool.id],
      },
      {
        address: ELDEN_MASTER,
        abi: eldenMasterABI,
        functionName: 'totalAllocPoint',
      },
      {
        address: ELDEN_MASTER,
        abi: eldenMasterABI,
        functionName: 'emissionRate',
      },
      {
        address: esNft.pool.id,
        abi: nftPoolABI,
        functionName: 'getMultiplierByLockDuration',
        args: [esNft.lockDuration],
      },
      {
        address: YIELD_BOOSTER_ADDRESS,
        abi: eldenYieldBoosterABI,
        functionName: 'getUserPositionAllocation',
        args: [account, esNft.pool.id, esNft.nftId],
      },
      {
        address: YIELD_BOOSTER_ADDRESS,
        abi: eldenYieldBoosterABI,
        functionName: 'getPoolTotalAllocation',
        args: [esNft.pool.id],
      },
      {
        address: YIELD_BOOSTER_ADDRESS,
        abi: eldenYieldBoosterABI,
        functionName: 'totalAllocation',
      },
      {
        address: esNft.pool.id,
        abi: nftPoolABI,
        functionName: 'getMultiplierByBoostPoints',
        args: [esNft.amount, (esNft.boostPoints * 10 ** 18) as unknown as bigint],
      },
    ],
  })

  const { apr, boostBonusApr, lockBonusAPR } = useEsNFTAprs(
    esNft.pool.id,
    eldenPrice,
    lpPrice,
    esNft.nftId,
    esNft.lockDuration,
    esNft.amount,
  )

  useEffect(() => {
    if (!token0 || !token1) return
    if (!contractResult) return
    if (!eldenPrice) return

    const getCardData = async () => {
      setData({
        poolAddress: esNft.pool.id,
        name: esNft.pool.pair?.name,
        type: esNft.pool.pair?.router === undefined ? 'v2' : 'stable',
        nftId: esNft.nftId,
        depositedLp: esNft.amount,
        totalLpInPool: esNft.pool.totalLiquidity,
        pending: getContractResult(contractResult[0]),
        pendingUSD:
          eldenPrice === null
            ? getContractResult(contractResult[0])
            : getContractResult(contractResult[0]) * eldenPrice,
        startLockTime: esNft.startLockTime,
        lockDuration: esNft.lockDuration,
        pairAddress: esNft.pool.pairAddress,
        lpTotalSupply: esNft.pool.pair?.totalSupply,
        boostPoints: esNft.boostPoints,
        token0: token0 as Currency,
        token1: token1 as Currency,
        ethPrice: ethPrice.ethPrice,
        lpBalanceInWallet: getContractResult(contractResult[1]),
        value: lpPrice * esNft.amount,
        allocPoint: getContractArrayResult(contractResult[2], 1, 0),
        eldenPrice,
        lpPrice,
        farmBaseAPR: apr ?? 0,
        boostBonusAPR: boostBonusApr ?? 0,
        lockBonusAPR: lockBonusAPR ?? 0,
        userAllocation: getContractResult(contractResult[6]),
        poolAllocation: getContractResult(contractResult[7]),
        totalAllocation: getContractResult(contractResult[8]),
        boostMultiplier: getContractResult(contractResult[9]) / 10000 + 1,
      })
    }

    getCardData()
  }, [contractResult, esNft, eldenPrice, token0, token1, apr, boostBonusApr, lockBonusAPR])

  return useMemo(() => {
    return {
      data,
      refetchContracts,
    }
  }, [data, refetchContracts])
}
