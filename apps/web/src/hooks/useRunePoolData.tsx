import useSWRImmutable from 'swr/immutable'
import { useEffect, useState } from 'react'
import { gql } from 'graphql-request'
import { positionsSubgraphClient } from 'config/constants/elden'
import { STABLE_PAIRS } from 'config/constants/stablePairs'

const getRunePoolsQuery = gql`
  query MyQuery($owner: String!, $id: ID!) {
    runePool(id: $id) {
      totalDepositedNfts
      totalDepositAmount
      owner
      id
      whitelist
      startTime
      rewardsToken1RemainingAmount
      rewardsToken1Amount
      rewardsToken0RemainingAmount
      rewardsToken0Amount
      publishedAt
      published
      lockEndReq
      lockDurationReq
      harvestStartTime
      endTime
      description
      depositEndTime
      depositAmountReq
      createdAt
      isExemptedFromFee
      rewardsToken0 {
        decimals
        symbol
        name
        id
      }
      rewardsToken1 {
        decimals
        id
        name
        symbol
      }
      stakingPositions(where: { owner: $owner }) {
        depositedAmount
        nftId
        id
      }
      nftPool {
        id
        pairAddress
        pair {
          token0 {
            id
          }
          token1 {
            id
          }
          name
        }
      }
    }
  }
`

export interface RunePoolStakingPositionData {
  id: string
  runePool: `0x${string}`
  nftId: number
  depositedAmount: number
}

export interface TokenData {
  id: string
  name: string
  symbol: string
  decimals: number
  rewardAmount: number
  rewardRemainingAmount: number
  isLp: boolean
}

export interface RunePoolPageData {
  id: `0x${string}`
  owner: `0x${string}`
  whitelist: boolean
  totalDepositedNfts: number
  totalDepositAmount: number

  publishedAt: number
  published: boolean
  createdAt: number

  // setting
  startTime: number
  lockEndReq: number
  lockDurationReq: number
  isExemptedFromFee: boolean
  harvestStartTime: number
  endTime: number
  description: string
  depositEndTime: number
  depositAmountReq: number

  rewardsToken1: TokenData
  rewardsToken0: TokenData
  nftPoolAddress: `0x${string}`
  pairAddress: `0x${string}`
  pairName: string
  token0Address: `0x${string}`
  token1Address: `0x${string}`
  userStakingPositions: RunePoolStakingPositionData[] | null

  pair
}

// Philip TODO: add FeeTierDistributionQuery type
export default function useRunePoolPageData(account: string | undefined, poolId: string, interval: number) {
  const {
    data: runePoolData,
    isLoading: isLoadingRunePoolData,
    error: errorRunePoolData,
  } = useSWRImmutable(
    account && positionsSubgraphClient ? `runePoolData-${poolId}` : null,
    async () => {
      return positionsSubgraphClient.request(getRunePoolsQuery, {
        owner: account?.toLowerCase(),
        id: poolId.toLowerCase(),
      })
    },
    {
      refreshInterval: interval,
    },
  )

  const [poolData, setPoolData] = useState<RunePoolPageData | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoadingRunePoolData) return
    setIsLoading(false)
    if (!runePoolData) return
    const _ret = runePoolData.runePool
    if (!_ret) return

    let _isStable = false
    let _pair = _ret.nftPool.pair

    if (_pair == null) {
      for (let i = 0; i < STABLE_PAIRS.length; i++) {
        if (STABLE_PAIRS[i].id.toLowerCase() === _ret.nftPool.pairAddress) {
          _pair = STABLE_PAIRS[i]
          _isStable = true
          break
        }
      }
    }

    const _runePoolData = {
      id: _ret.id,
      owner: _ret.owner,
      whitelist: _ret.whitelist,
      totalDepositedNfts: _ret.totalDepositedNfts,
      totalDepositAmount: _ret.totalDepositAmount,
      publishedAt: _ret.publishedAt,
      published: _ret.published,
      createdAt: _ret.createdAt,
      isExemptedFromFee: _ret.isExemptedFromFee,

      startTime: Number(_ret.startTime),
      endTime: Number(_ret.endTime),
      harvestStartTime: Number(_ret.harvestStartTime),
      description: _ret.description,
      depositEndTime: Number(_ret.depositEndTime),

      lockEndReq: Number(_ret.lockEndReq),
      lockDurationReq: Number(_ret.lockDurationReq),
      depositAmountReq: Number(_ret.depositAmountReq),

      rewardsToken1: {
        id: _ret.rewardsToken1.id,
        name: _ret.rewardsToken1.name,
        symbol: _ret.rewardsToken1.symbol,
        decimals: Number(_ret.rewardsToken1.decimals),
        isLp: false,
        rewardAmount: _ret.rewardsToken1Amount,
        rewardRemainingAmount: _ret.rewardsToken1RemainingAmount,
      },
      rewardsToken0: {
        id: _ret.rewardsToken0.id,
        name: _ret.rewardsToken0.name,
        symbol: _ret.rewardsToken0.symbol,
        decimals: Number(_ret.rewardsToken0.decimals),
        isLp: false,
        rewardAmount: _ret.rewardsToken0Amount,
        rewardRemainingAmount: _ret.rewardsToken0RemainingAmount,
      },
      nftPoolAddress: _ret.nftPool.id,
      pairAddress: _ret.nftPool.pairAddress,
      pairName: _pair.name,
      token0Address: _pair.token0.id,
      token1Address: _pair.token1.id,
      userStakingPositions: _ret.stakingPositions,

      isStable: _isStable,
      pair: _pair,
    }

    setPoolData(_runePoolData)
  }, [runePoolData, isLoadingRunePoolData, errorRunePoolData, poolId])

  return { isLoading, poolData }
}
