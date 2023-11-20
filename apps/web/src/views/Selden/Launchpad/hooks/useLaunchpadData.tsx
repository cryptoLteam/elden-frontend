import { eldenDividendsABI } from 'config/abi/IEldenDividends'
import { sEldenTokenABI } from 'config/abi/ISEldenToken'
import { DIVIDENDS_ADDRESS, LAUNCHPAD_ADDRESS, SELDEN_ADDRESS } from 'config/constants/elden'
import { useEffect, useState } from 'react'
import { getContractResult } from 'utils/eldenHelper'
import { useAccount, useChainId, useContractReads } from 'wagmi'
import { eldenLaunchpadABI } from 'config/abi/IEldenLaunchpad'

export const useLaunchpadData = () => {
  const chainId = useChainId()

  const [totalAllocated, setTotalAllocated] = useState(0)
  const [deAllocationCooldown, setDeAllocationCooldown] = useState(0)
  const [deAllocationFee, setDeAllocationFee] = useState(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: LAUNCHPAD_ADDRESS,
        abi: eldenLaunchpadABI,
        chainId,
        functionName: 'totalAllocation',
      },
      {
        address: LAUNCHPAD_ADDRESS,
        abi: eldenLaunchpadABI,
        chainId,
        functionName: 'deallocationCooldown',
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'usagesDeallocationFee',
        args: [LAUNCHPAD_ADDRESS],
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return

    const _totalAllocated = getContractResult(contractResult[0])
    const _deAllocationCooldown = getContractResult(contractResult[1], 0)
    const _deAllocationFee = getContractResult(contractResult[2], 2)

    setTotalAllocated(_totalAllocated)
    setDeAllocationCooldown(_deAllocationCooldown)
    setDeAllocationFee(_deAllocationFee)
  }, [contractResult])

  return {
    totalAllocated,
    deAllocationCooldown,
    deAllocationFee,
    refetchContracts,
  }
}
