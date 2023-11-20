import useSWRImmutable from 'swr/immutable'
import { useMemo } from 'react'
import { gql } from 'graphql-request'
import { positionsSubgraphClient } from 'config/constants/elden'

const query = gql`
  query MyQuery {
    pools {
      id
      pairAddress
    }
  }
`

export default function useEsNftList(interval: number) {
  const { data, isLoading, error } = useSWRImmutable(
    `useEsNftList-1`,
    async () => {
      return positionsSubgraphClient.request(query, {})
    },
    {
      refreshInterval: interval,
    },
  )

  return useMemo(() => {
    return {
      error,
      isLoading,
      data,
    }
  }, [data, error, isLoading])
}
