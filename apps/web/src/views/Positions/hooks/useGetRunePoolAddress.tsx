import useSWRImmutable from 'swr/immutable'
import { useEffect, useMemo, useState } from 'react'
import { gql } from 'graphql-request'
import { positionsSubgraphClient } from 'config/constants/elden'
import { STABLE_PAIRS } from 'config/constants/stablePairs'

const getRunePools = gql`
  query MyQuery($nftPool: String) {
    runePools(where: { nftPool: $nftPool, published: true }) {
      id
      nftPool {
        id
        pairAddress
        pair {
          id
          name
          token0 {
            id
            name
            symbol
          }
          token1 {
            id
            name
            symbol
          }
        }
      }
    }
  }
`

// Philip TODO: add FeeTierDistributionQuery type
export default function useGetRunePoolAddress(nftPoolId: string | undefined, interval: number) {
  const {
    data: queryResult,
    isLoading: isLoadingRunePoolsData,
    error: errorRunePoolsData,
  } = useSWRImmutable(
    nftPoolId && positionsSubgraphClient ? `runePoolsData-${nftPoolId}` : null,
    async () => {
      return positionsSubgraphClient.request(getRunePools, {
        nftPool: nftPoolId?.toLowerCase(),
      })
    },
    {
      refreshInterval: interval,
    },
  )
  const [pools, setPools] = useState<string[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoadingRunePoolsData) return
    setIsLoading(false)
    if (!queryResult) return
    const _runePools = queryResult.runePools
    if (!_runePools || _runePools.length === 0) return

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
        nftPoolId: item.nftPool.id,
        pair,
      }
    })
    setPools(_runePoolDataRow)
  }, [queryResult, isLoadingRunePoolsData, errorRunePoolsData])

  return { isLoading, pools }
}
