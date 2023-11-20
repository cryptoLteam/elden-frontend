import { eldenDividendsABI } from 'config/abi/IEldenDividends'
import { eldenLaunchpadABI } from 'config/abi/IEldenLaunchpad'
import { sEldenTokenABI } from 'config/abi/ISEldenToken'
import { DIVIDENDS_ADDRESS, LAUNCHPAD_ADDRESS, SELDEN_ADDRESS } from 'config/constants/elden'
import { useEffect, useState } from 'react'
import { getContractResult, getFormattedUnits } from 'utils/eldenHelper'
import { useAccount, useChainId, useContractReads } from 'wagmi'

export const useUserAllocationData = () => {
  const { address } = useAccount()
  const chainId = useChainId()

  const [allocated, setAllocated] = useState(0)
  const [allocatedTime, setAllocatedTime] = useState(0)
  const [sEldenBalance, setSEldenBalance] = useState(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: LAUNCHPAD_ADDRESS,
        abi: eldenLaunchpadABI,
        chainId,
        functionName: 'getUserInfo',
        args: [address as `0x${string}`],
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    if (contractResult[1].status === 'success' && contractResult[0].result) {
      const _allocated = getFormattedUnits(contractResult[0].result[0])
      const _allocatedTime = getFormattedUnits(contractResult[0].result[1], 0)
      setAllocated(_allocated)
      setAllocatedTime(_allocatedTime)
    }
    setSEldenBalance(getContractResult(contractResult[1]))
  }, [contractResult])

  return {
    allocated,
    allocatedTime,
    sEldenBalance,
    refetchContracts,
  }
}
