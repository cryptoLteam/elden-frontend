import { sEldenTokenABI } from 'config/abi/ISEldenToken'
import { SELDEN_ADDRESS } from 'config/constants/elden'
import { useSEldenContract } from 'hooks/useContract1'
import { useCallback, useEffect, useState } from 'react'
import { getContractResult } from 'utils/eldenHelper'
import { useAccount, useContractReads } from 'wagmi'

const options = {}

const approveUsage = async (sEldenContract, address, amountToAllocate) => {
  return sEldenContract.write.approveUsage([address, amountToAllocate], { ...options })
}

export const useAllowanceUsage = (usageAddress) => {
  const { address } = useAccount()
  const [allowance, setAllowance] = useState<number>(0)
  const [allowanceUsage, setAllowanceUsage] = useState<number>(0)
  const sEldenContract = useSEldenContract()

  const handleApproveUsage = useCallback(
    async (amountToApprove) => {
      return approveUsage(sEldenContract, usageAddress, amountToApprove)
    },
    [sEldenContract, usageAddress],
  )

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        functionName: 'allowance',
        args: [address as `0x${string}`, SELDEN_ADDRESS],
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        functionName: 'usageApprovals',
        args: [address as `0x${string}`, usageAddress],
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    setAllowance(getContractResult(contractResult[0]))
    setAllowanceUsage(getContractResult(contractResult[1]))
  }, [contractResult])

  return { allowanceUsage, allowance, refetchAllowance: refetchContracts, handleApproveUsage }
}
