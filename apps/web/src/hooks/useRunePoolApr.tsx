import { DAY_IN_SECONDS, YEAR_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'
import { runePoolABI } from 'config/abi/runePool'
import { useEffect, useState } from 'react'
import { getContractResult } from 'utils/eldenHelper'
import { useContractReads } from 'wagmi'

export const useRunePoolApr = (
  runePoolAddress,
  depositedAssetPrice,
  rewardsToken1Price,
  rewardsToken2Price,
  rewardsToken1Decimals,
  rewardsToken2Decimals,
) => {
  const [apr1, setApr1] = useState<number | undefined>(undefined)
  const [apr2, setApr2] = useState<number | undefined>(undefined)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: runePoolAddress,
        abi: runePoolABI,
        functionName: 'rewardsToken1PerSecond',
      },
      {
        address: runePoolAddress,
        abi: runePoolABI,
        functionName: 'rewardsToken2PerSecond',
      },
      {
        address: runePoolAddress,
        abi: runePoolABI,
        functionName: 'totalDepositAmount',
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    if (!runePoolAddress) return
    if (!depositedAssetPrice) return
    if (!rewardsToken1Price) return

    const rewardsToken1PerSecond = getContractResult(contractResult[0], rewardsToken1Decimals)
    const rewardsToken2PerSecond = getContractResult(contractResult[1], rewardsToken2Decimals)
    const totalDepositAmount = getContractResult(contractResult[2])

    if (totalDepositAmount === 0) return

    const _apr1 =
      ((rewardsToken1PerSecond * rewardsToken1Price) / (totalDepositAmount * depositedAssetPrice)) * YEAR_IN_SECONDS
    setApr1(_apr1)

    if (!rewardsToken2Price) return
    const _apr2 =
      ((rewardsToken2PerSecond * rewardsToken2Price) / (totalDepositAmount * depositedAssetPrice)) * YEAR_IN_SECONDS
    setApr2(_apr2)
  }, [
    contractResult,
    depositedAssetPrice,
    rewardsToken1Price,
    rewardsToken2Price,
    rewardsToken1Decimals,
    rewardsToken2Decimals,
    runePoolAddress,
  ])

  return {
    apr1,
    apr2,
  }
}
