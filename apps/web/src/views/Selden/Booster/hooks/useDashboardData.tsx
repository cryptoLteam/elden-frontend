import { eldenDividendsABI } from 'config/abi/IEldenDividends'
import { eldenYieldBoosterABI } from 'config/abi/IEldenYieldBooster'
import { sEldenTokenABI } from 'config/abi/ISEldenToken'
import { SELDEN_ADDRESS, YIELD_BOOSTER_ADDRESS } from 'config/constants/elden'
import { useEffect, useState } from 'react'
import { getContractResult, getFormattedUnits } from 'utils/eldenHelper'
import { useAccount, useChainId, useContractReads } from 'wagmi'

export const useDashboardData = () => {
  const { address } = useAccount()
  const chainId = useChainId()

  const [totalAllocation, setTotalAllocation] = useState(0)
  const [userAllocation, setUserAllocation] = useState(0)
  const [deAllocationFee, setDeAllocationFee] = useState(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: YIELD_BOOSTER_ADDRESS,
        abi: eldenYieldBoosterABI,
        chainId,
        functionName: 'totalAllocation',
      },
      {
        address: YIELD_BOOSTER_ADDRESS,
        abi: eldenYieldBoosterABI,
        chainId,
        functionName: 'getUserTotalAllocation',
        args: [address as `0x${string}`],
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'usagesDeallocationFee',
        args: [YIELD_BOOSTER_ADDRESS],
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return

    // calculate apy
    const _totalAllocated = getContractResult(contractResult[0])
    const _userAllocated = getContractResult(contractResult[1])
    const _deAllocationFee = getContractResult(contractResult[2], 2)

    setTotalAllocation(_totalAllocated)
    setUserAllocation(_userAllocated)
    setDeAllocationFee(_deAllocationFee)
  }, [contractResult])

  return {
    totalAllocation,
    userAllocation,
    deAllocationFee,
    refetchContracts,
  }
}
