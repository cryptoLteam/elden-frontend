import { YEAR_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'
import { parseUnits } from '@pancakeswap/utils/viem/parseUnits'
import { eldenMasterABI } from 'config/abi/IEldenMaster'
import { eldenYieldBoosterABI } from 'config/abi/IEldenYieldBooster'
import { nftPoolABI } from 'config/abi/nftPool'
import { ELDEN_MASTER, YIELD_BOOSTER_ADDRESS } from 'config/constants/elden'
import { useEffect, useState } from 'react'
import { getContractArrayResult, getContractResult } from 'utils/eldenHelper'
import { useAccount, useContractReads } from 'wagmi'

export const useEsNFTAprs = (nftPoolId, eldenPrice, lpPrice, nftId = '0', lockDuration = '0', amount = 0) => {
  const { address: account } = useAccount()
  const [apr, setApr] = useState<number | undefined>(undefined)
  const [lockBonusAPR, setLockBonusApr] = useState<number | undefined>(undefined)
  const [boostBonusApr, setBoostBonusApr] = useState<number | undefined>(undefined)

  const { data: contractResult, refetch: refetchContracts } = useContractReads({
    contracts: [
      {
        // 2
        address: ELDEN_MASTER,
        abi: eldenMasterABI,
        functionName: 'getPoolInfo',
        args: [nftPoolId],
      },
      {
        // 3
        address: nftPoolId,
        abi: nftPoolABI,
        functionName: 'getPoolInfo',
      },
      {
        address: nftPoolId,
        abi: nftPoolABI,
        functionName: 'getMultiplierByLockDuration',
        args: [parseUnits(lockDuration, 0)],
      },
      {
        address: YIELD_BOOSTER_ADDRESS,
        abi: eldenYieldBoosterABI,
        functionName: 'getUserPositionAllocation',
        args: [account as `0x${string}`, nftPoolId, parseUnits(nftId, 0)],
      },
    ],
  })

  useEffect(() => {
    if (!contractResult) return
    if (!lpPrice) return
    const poolEmissionRate = getContractArrayResult(contractResult[0], 4)
    const totalDepositAmount = getContractArrayResult(contractResult[1], 5)

    if (!totalDepositAmount) return
    const _apr = ((poolEmissionRate * eldenPrice) / (totalDepositAmount * lpPrice)) * YEAR_IN_SECONDS * 100
    setApr(_apr)

    const _lockBonusAPR = (_apr * getContractResult(contractResult[2], 0)) / 10000
    setLockBonusApr(_lockBonusAPR)

    const _boostBonusAPR =
      lpPrice === 0 || amount === 0
        ? 0
        : ((getContractResult(contractResult[3]) * eldenPrice) / Number(amount) / lpPrice) * 100
    setBoostBonusApr(_boostBonusAPR)
  }, [contractResult, eldenPrice, lpPrice, amount])

  return {
    apr,
    lockBonusAPR,
    boostBonusApr,
  }
}
