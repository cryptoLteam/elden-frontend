import { sEldenTokenABI } from 'config/abi/ISEldenToken'
import { SELDEN_ADDRESS } from 'config/constants/elden'
import { useEffect, useState } from 'react'
import { getContractResult } from 'utils/eldenHelper'
import { useAccount, useContractReads } from 'wagmi'

export const useAllowanceUsage = (usageAddress) => {
  const { address } = useAccount()
  const [allowanceUsage, setAllowanceUsage] = useState<number>(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
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
    setAllowanceUsage(getContractResult(contractResult[0]))
  }, [contractResult])
  return { allowanceUsage, refetchAllowance: refetchContracts }
}
