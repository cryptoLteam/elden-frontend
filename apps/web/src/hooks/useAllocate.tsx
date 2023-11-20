import { useCallback } from 'react'
import { useSEldenContract } from 'hooks/useContract1'
import { useAccount } from 'wagmi'
import { getParseUnits } from 'utils/eldenHelper'

const options = {}

const allocate = async (sEldenContract, usageAddress, amountToAllocate, data) => {
  return sEldenContract.write.allocate([usageAddress, amountToAllocate, data], { ...options })
}

const deallocate = async (sEldenContract, usageAddress, amountToDeAllocate, data) => {
  return sEldenContract.write.deallocate([usageAddress, amountToDeAllocate, data], { ...options })
}

const useAllocate = () => {
  const { address } = useAccount()
  const sEldenContract = useSEldenContract()

  const handleAllocate = useCallback(
    async (usageAddress, amountToAllocate, data = '') => {
      return allocate(sEldenContract, usageAddress, getParseUnits(amountToAllocate), data)
    },
    [sEldenContract],
  )

  const handleDeAllocate = useCallback(
    async (usageAddress, amountToDeAllocate, data = '') => {
      return deallocate(sEldenContract, usageAddress, getParseUnits(amountToDeAllocate), data)
    },
    [sEldenContract],
  )

  return { onAllocate: handleAllocate, onDeallocate: handleDeAllocate }
}

export default useAllocate
