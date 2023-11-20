import { useEffect, useState } from 'react'
import { useAccount, useChainId, useContractReads } from 'wagmi'
import { getContractResult, getFormattedUnits } from 'utils/eldenHelper'
import {
  DIVIDENDS_ADDRESS,
  ELDEN_ADDRESS,
  LAUNCHPAD_ADDRESS,
  SELDEN_ADDRESS,
  YIELD_BOOSTER_ADDRESS,
} from 'config/constants/elden'
import { eldenTokenABI } from 'config/abi/IEldenToken'
import { sEldenTokenABI } from 'config/abi/ISEldenToken'
import { eldenDividendsABI } from 'config/abi/IEldenDividends'
import { eldenYieldBoosterABI } from 'config/abi/IEldenYieldBooster'
import { eldenLaunchpadABI } from 'config/abi/IEldenLaunchpad'

export const useDashboardData = () => {
  const { address } = useAccount()
  const chainId = useChainId()

  const [eldenWalletBalance, setEldenWalletBalance] = useState(0)
  const [sEldenWalletBalance, setSEldenWalletBalance] = useState(0)
  const [allocation, setAllocation] = useState(0)
  const [redeemingBalance, setRedeemingBalance] = useState(0)

  const [dividensAllocation, setDividensAllocation] = useState(0)
  const [boosterAllocation, setBoosterAllocation] = useState(0)
  const [launchpadAllocation, setLaunchpadAllocation] = useState(0)

  const [dividensProtocolAllocation, setDividensProtocolAllocation] = useState(0)
  const [boosterProtocolAllocation, setBoosterProtocolAllocation] = useState(0)
  const [launchpadProtocolAllocation, setLaunchpadProtocolAllocation] = useState(0)

  const [dividensDeAllocationFee, setDividensDeAllocationFee] = useState(0)
  const [boosterDeAllocationFee, setBoosterDeAllocationFee] = useState(0)
  const [launchpadDeAllocationFee, setLaunchpadDeAllocationFee] = useState(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: ELDEN_ADDRESS,
        abi: eldenTokenABI,
        chainId,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'getSEldenBalance',
        args: [address as `0x${string}`],
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'getUsageAllocation',
        args: [address as `0x${string}`, DIVIDENDS_ADDRESS],
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'getUsageAllocation',
        args: [address as `0x${string}`, YIELD_BOOSTER_ADDRESS],
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'getUsageAllocation',
        args: [address as `0x${string}`, LAUNCHPAD_ADDRESS],
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'usagesDeallocationFee',
        args: [DIVIDENDS_ADDRESS],
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'usagesDeallocationFee',
        args: [YIELD_BOOSTER_ADDRESS],
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'usagesDeallocationFee',
        args: [LAUNCHPAD_ADDRESS],
      },
      {
        address: DIVIDENDS_ADDRESS,
        abi: eldenDividendsABI,
        chainId,
        functionName: 'totalAllocation',
      },
      {
        address: YIELD_BOOSTER_ADDRESS,
        abi: eldenYieldBoosterABI,
        chainId,
        functionName: 'totalAllocation',
      },
      {
        address: LAUNCHPAD_ADDRESS,
        abi: eldenLaunchpadABI,
        chainId,
        functionName: 'totalAllocation',
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    setEldenWalletBalance(getContractResult(contractResult[0]))
    setSEldenWalletBalance(getContractResult(contractResult[1]))
    if (contractResult[2].status === 'success') {
      setAllocation(getFormattedUnits(contractResult[2].result[0]))
      setRedeemingBalance(getFormattedUnits(contractResult[2].result[1]))
    }
    setDividensAllocation(getContractResult(contractResult[3]))
    setBoosterAllocation(getContractResult(contractResult[4]))
    setLaunchpadAllocation(getContractResult(contractResult[5]))
    setDividensDeAllocationFee(getContractResult(contractResult[6], 2))
    setBoosterDeAllocationFee(getContractResult(contractResult[7], 2))
    setLaunchpadDeAllocationFee(getContractResult(contractResult[8], 2))
    setDividensProtocolAllocation(getContractResult(contractResult[9]))
    setBoosterProtocolAllocation(getContractResult(contractResult[10]))
    setLaunchpadProtocolAllocation(getContractResult(contractResult[11]))
  }, [contractResult])

  return {
    eldenWalletBalance,
    sEldenWalletBalance,
    allocation,
    redeemingBalance,
    dividensAllocation,
    boosterAllocation,
    launchpadAllocation,
    dividensProtocolAllocation,
    boosterProtocolAllocation,
    launchpadProtocolAllocation,
    dividensDeAllocationFee,
    boosterDeAllocationFee,
    launchpadDeAllocationFee,
    refetchContracts,
  }
}
