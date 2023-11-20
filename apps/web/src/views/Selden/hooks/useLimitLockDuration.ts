import { useEffect, useState } from 'react'
import { useAccount, useChainId, useContractReads } from 'wagmi'
import { getContractResult } from 'utils/eldenHelper'
import { SELDEN_ADDRESS } from 'config/constants/elden'
import { sEldenTokenABI } from 'config/abi/ISEldenToken'
import { DAY_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'

export const useLimitLockDuration = () => {
  const chainId = useChainId()

  const [minDuration, setMinDuration] = useState(0)
  const [maxDuration, setMaxDuration] = useState(0)
  const [minRatio, setMinRatio] = useState(0)
  const [maxRatio, setMaxRatio] = useState(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'minRedeemDuration',
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'maxRedeemDuration',
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'minRedeemRatio',
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'maxRedeemRatio',
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    setMinDuration(getContractResult(contractResult[0], 0) / DAY_IN_SECONDS)
    setMaxDuration(getContractResult(contractResult[1], 0) / DAY_IN_SECONDS)
    setMinRatio(getContractResult(contractResult[2], 0))
    setMaxRatio(getContractResult(contractResult[3], 0))
  }, [contractResult])

  return {
    minDuration,
    maxDuration,
    minRatio,
    maxRatio,
  }
}
