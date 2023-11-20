import useSWRImmutable from 'swr/immutable'
import { useEffect, useMemo, useState } from 'react'
import { gql } from 'graphql-request'
import { positionsSubgraphClient } from 'config/constants/elden'
import { STABLE_PAIRS } from 'config/constants/stablePairs'
import { TokenData } from './useRunePoolData'

const getRunePoolsQuery = gql`
  query MyQuery($owner: String!) {
    runePools(where: { published: true, nftPool_: { id_not: null } }) {
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
    _meta {
      block {
        number
      }
    }
    runePoolFactories {
      totalexemptedRunePool
      totalRunePools
      totalPublishedRunePools
    }
  }
`

export interface RunePoolData {
  totalPublishedRunePools: number
  totalRunePools: number
  totalexemptedRunePool: number
  pools: RunePoolDataRow[] | undefined
}
export interface RunePoolStakingPositionData {
  id: string
  runePool: `0x${string}`
  nftId: number
  depositedAmount: number
}

export interface RunePoolDataRow {
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
export default function useRunePools(account: string | undefined, interval: number) {
  const {
    data: runePoolsData,
    isLoading: isLoadingRunePoolsData,
    error: errorRunePoolsData,
  } = useSWRImmutable(
    account && positionsSubgraphClient ? `runePoolsData-${account}` : null,
    async () => {
      return positionsSubgraphClient.request(getRunePoolsQuery, {
        owner: account?.toLowerCase(),
      })
    },
    {
      refreshInterval: interval,
    },
  )

  const [pools, setPools] = useState<RunePoolData | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoadingRunePoolsData) return
    setIsLoading(false)
    if (!runePoolsData) return
    const _factoryData = runePoolsData.runePoolFactories
    const _runePools = runePoolsData.runePools
    if (!_runePools || !_factoryData || _runePools.length === 0 || _factoryData.length === 0) return

    const _runePoolDataRow = _runePools.map((item) => {
      let pair = item.nftPool.pair

      if (pair == null) {
        for (let i = 0; i < STABLE_PAIRS.length; i++) {
          if (STABLE_PAIRS[i].id.toLowerCase() === item.nftPool.pairAddress) {
            pair = STABLE_PAIRS[i]
            break
          }
        }
      }

      return {
        id: item.id,
        owner: item.owner,
        whitelist: item.whitelist,
        totalDepositedNfts: item.totalDepositedNfts,
        totalDepositAmount: item.totalDepositAmount,
        publishedAt: item.publishedAt,
        published: item.published,
        createdAt: item.createdAt,
        startTime: item.startTime,
        lockEndReq: item.lockEndReq,
        lockDurationReq: item.lockDurationReq,
        isExemptedFromFee: item.isExemptedFromFee,
        harvestStartTime: item.harvestStartTime,
        endTime: item.endTime,
        description: item.description,
        depositEndTime: item.depositEndTime,
        depositAmountReq: item.depositAmountReq,

        rewardsToken1: {
          id: item.rewardsToken1.id,
          name: item.rewardsToken1.name,
          symbol: item.rewardsToken1.symbol,
          decimals: item.rewardsToken1.decimals,
          isLp: false,
          rewardAmount: item.rewardsToken1Amount,
          rewardRemainingAmount: item.rewardsToken1RemainingAmount,
        },
        rewardsToken0: {
          id: item.rewardsToken0.id,
          name: item.rewardsToken0.name,
          symbol: item.rewardsToken0.symbol,
          decimals: item.rewardsToken0.decimals,
          isLp: false,
          rewardAmount: item.rewardsToken0Amount,
          rewardRemainingAmount: item.rewardsToken0RemainingAmount,
        },
        nftPoolAddress: item.nftPool?.id,
        pairAddress: item.nftPool?.pairAddress,
        pairName: pair.name,
        token0Address: pair.token0.id,
        token1Address: pair.token1.id,
        userStakingPositions: item.stakingPositions,
        pair,
      }
    })
    const _poolData: RunePoolData = {
      totalPublishedRunePools: _factoryData[0].totalPublishedRunePools,
      totalRunePools: _factoryData[0].totalRunePools,
      totalexemptedRunePool: _factoryData[0].totalexemptedRunePool,
      pools: _runePoolDataRow,
    }
    setPools(_poolData)
  }, [runePoolsData, isLoadingRunePoolsData, errorRunePoolsData])

  return { isLoading, pools }
}
