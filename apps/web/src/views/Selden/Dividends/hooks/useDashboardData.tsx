import { eldenDividendsABI } from 'config/abi/IEldenDividends'
import { sEldenTokenABI } from 'config/abi/ISEldenToken'
import { DIVIDENDS_ADDRESS, SELDEN_ADDRESS } from 'config/constants/elden'
import { useEffect, useState } from 'react'
import { getContractResult, getFormattedUnits } from 'utils/eldenHelper'
import { useAccount, useChainId, useContractReads } from 'wagmi'
import { distributedTokenInfo } from '../config'

export const useDashboardData = (sEldenPrice, ethUsdtLpPrice) => {
  const { address } = useAccount()
  const chainId = useChainId()

  const [protocolAllocation, setProtocolAllocation] = useState(0)
  const [currentEpoch, setCurrentEpoch] = useState(0)
  const [apy, setApy] = useState(0)
  const [deAllocationFee, setDeAllocationFee] = useState(0)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        address: DIVIDENDS_ADDRESS,
        abi: eldenDividendsABI,
        chainId,
        functionName: 'totalAllocation',
      },
      {
        address: SELDEN_ADDRESS,
        abi: sEldenTokenABI,
        chainId,
        functionName: 'usagesDeallocationFee',
        args: [DIVIDENDS_ADDRESS],
      },
      {
        address: DIVIDENDS_ADDRESS,
        abi: eldenDividendsABI,
        chainId,
        functionName: 'dividendsInfo',
        args: [distributedTokenInfo[0].token as `0x${string}`],
      },
      {
        address: DIVIDENDS_ADDRESS,
        abi: eldenDividendsABI,
        chainId,
        functionName: 'dividendsInfo',
        args: [distributedTokenInfo[1].lp as `0x${string}`],
      },
      {
        address: DIVIDENDS_ADDRESS,
        abi: eldenDividendsABI,
        chainId,
        functionName: 'cycleDurationSeconds',
      },
    ],
  })

  useEffect(() => {
    if (!contractResult || !sEldenPrice || !ethUsdtLpPrice) return
    if (!contractResult[2].result || !contractResult[3].result) return
    const _currentDistributionAmount1 = getFormattedUnits(contractResult[2].result[0])
    const _currentDistributionAmount2 = getFormattedUnits(contractResult[3].result[0])

    // calculate apy
    const _totalAllocated = getContractResult(contractResult[0])
    const _deAllocationFee = getContractResult(contractResult[1], 2)
    const _currentEpoch = _currentDistributionAmount1 * sEldenPrice + _currentDistributionAmount2 * ethUsdtLpPrice

    let _apr = 0
    if (_totalAllocated !== 0 && sEldenPrice !== 0) _apr = _currentEpoch / (_totalAllocated * sEldenPrice)

    const _apy = Number(((1 + _apr / 7) ** 7 - 1) * 10000) / 100

    setProtocolAllocation(_totalAllocated)
    setDeAllocationFee(_deAllocationFee)
    setCurrentEpoch(_currentEpoch)
    setApy(_apy)
  }, [contractResult, sEldenPrice, ethUsdtLpPrice])

  return {
    protocolAllocation,
    currentEpoch,
    apy,
    deAllocationFee,
    refetchContracts,
  }
}
