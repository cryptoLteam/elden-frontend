import useSWRImmutable from 'swr/immutable'
import { useEffect, useMemo, useState } from 'react'
import { gql } from 'graphql-request'
import { positionsSubgraphClient } from 'config/constants/elden'
import { STABLE_PAIRS } from 'config/constants/stablePairs'

const getRunePoolsQuery = gql`
  query MyQuery($owner: String) {
    runePoolStakingPositions(where: { depositedAmount_gt: "0", owner: $owner }) {
      owner
      nftId
      depositedAmount
      id
      runePool {
        id
        rewardsToken0 {
          decimals
          id
          name
          symbol
        }
        rewardsToken1 {
          decimals
          id
          name
          symbol
        }
      }
      nftStakingPosition {
        startLockTime
        owner
        nftId
        lockDuration
        id
        distroied
        boostPoints
        amount
        pool {
          id
          pairAddress
          totalLiquidity
          pair {
            volumeUSD
            volumeToken1
            volumeToken0
            untrackedVolumeUSD
            trackedReserveETH
            totalSupply
            token1Price
            token1 {
              id
              name
              symbol
            }
            token0Price
            token0 {
              id
              symbol
              name
            }
            name
          }
        }
      }
    }
    bundles {
      ethPrice
    }
  }
`
export interface StakingPositionData {
  id: string
  runePool: `0x${string}`
  nftPool: `0x${string}`
  nftId: number
  depositedAmount: number
  nftStakingPosition: any
  ethPrice: number
}

// Philip TODO: add FeeTierDistributionQuery type
export default function useRunePoolStakingPositions(
  account: string | undefined,
  interval: number,
  enableFilterByPoolId: boolean = false,
  poolId?: string,
) {
  const {
    data: queryResult,
    isLoading: isLoadingQuery,
    error,
  } = useSWRImmutable(
    account && positionsSubgraphClient ? `runePoolStakingPositions-${account}` : null,
    async () => {
      return positionsSubgraphClient.request(getRunePoolsQuery, {
        owner: account?.toLowerCase(),
      })
    },
    {
      refreshInterval: interval,
    },
  )
  const [stakingPositions, setStakingPositions] = useState<StakingPositionData[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoadingQuery) return
    setIsLoading(false)
    if (!queryResult) return
    const _stakingPositions = queryResult.runePoolStakingPositions
    if (!_stakingPositions || _stakingPositions.length === 0) return

    let _data = _stakingPositions.map((item) => {
      const _nftStakingPosition = item.nftStakingPosition
      let pair = item.nftStakingPosition.pool.pair
      let isStable = false

      if (pair == null) {
        for (let i = 0; i < STABLE_PAIRS.length; i++) {
          if (STABLE_PAIRS[i].id.toLowerCase() === item.nftStakingPosition.pool.pairAddress) {
            pair = STABLE_PAIRS[i]
            isStable = true
            break
          }
        }
      }
      _nftStakingPosition.pool.pair = pair
      _nftStakingPosition.isStable = isStable

      return {
        id: item.id,
        runePool: item.runePool,
        nftPool: _nftStakingPosition.pool.id,
        nftId: item.nftId,
        depositedAmount: Number(item.depositedAmount),
        nftStakingPosition: _nftStakingPosition,
        ethPrice: queryResult.bundles[0],
      }
    })

    if (enableFilterByPoolId && poolId) {
      _data = _data.filter((item) => item.runePool.id === poolId.toLocaleLowerCase())
    }

    setStakingPositions(_data)
  }, [queryResult, isLoadingQuery, enableFilterByPoolId, poolId])

  return { isLoading, stakingPositions }
}
