import { nftPoolABI } from 'config/abi/nftPool'
import { runePoolABI } from 'config/abi/runePool'
import { useEffect, useMemo, useState } from 'react'
import { getFormattedUnits } from 'utils/eldenHelper'
import { useAccount, useContractReads } from 'wagmi'

interface EsNFTRewardData {
  nftId: number
  amount: number
}

export const useRewards = (
  poolId?: `0x${string}`,
  decimals1?: number,
  decimals2?: number,
  esNFTs?: any,
  runeStakingPositions?: any,
) => {
  const { address } = useAccount()
  const [pendingReward1, setPendingReward1] = useState<number | undefined>(undefined)
  const [pendingReward2, setPendingReward2] = useState<number | undefined>(undefined)

  const { data: contractResult, refetch: refetchRuneRewards } = useContractReads({
    contracts: [
      {
        address: poolId,
        abi: runePoolABI,
        functionName: 'pendingRewards',
        args: [address as `0x${string}`],
      },
    ],
  })

  useEffect(() => {
    if (!poolId) return
    if (!contractResult) return
    if (!contractResult[0].result) return
    setPendingReward1(getFormattedUnits(contractResult[0].result[0], decimals1))
    setPendingReward2(getFormattedUnits(contractResult[0].result[1], decimals2))
  }, [poolId, decimals1, decimals2, contractResult])

  const { data: esNFTContractResult, refetch: refetchEsNFTRewards } = useContractReads({
    contracts: useMemo(() => {
      const con1 = esNFTs?.map((item) => ({
        abi: nftPoolABI,
        address: item.pool.id,
        functionName: 'pendingRewards',
        args: [item.nftId],
      }))
      const con2 = runeStakingPositions?.map((item) => ({
        abi: nftPoolABI,
        address: item.nftStakingPosition.pool.id,
        functionName: 'pendingRewards',
        args: [item.nftId],
      }))
      let ret = []
      if (con1 && con1.length > 0) ret = con1
      if (con2 && con2.length > 0) ret = ret.concat(con2)
      return ret
    }, [esNFTs, runeStakingPositions]),
    cacheTime: 0,
  })

  const [esNFTRewards, setEsNFTRewards] = useState<EsNFTRewardData[]>([])

  useEffect(() => {
    if (!esNFTContractResult) return
    if (!esNFTs && !runeStakingPositions) return
    const _esNFTRewards = esNFTContractResult.map((item, index) => {
      return {
        nftId: index,
        amount: getFormattedUnits(item.result, 18),
      }
    })
    setEsNFTRewards(_esNFTRewards)
  }, [esNFTContractResult])

  return { pendingReward1, pendingReward2, esNFTRewards, refetchRuneRewards, refetchEsNFTRewards }
}
