import { useCallback } from 'react'
import { useSEldenContract } from 'hooks/useContract1'

const options = {}

const redeem = async (sEldenContract, amountToRedeem, duration) => {
  return sEldenContract.write.redeem([amountToRedeem, duration], { ...options })
}

const finalizeRedeem = async (sEldenContract, index) => {
  return sEldenContract.write.finalizeRedeem([index], { ...options })
}

const cancelRedeem = async (sEldenContract, index) => {
  return sEldenContract.write.cancelRedeem([index], { ...options })
}

export const useRedeem = () => {
  const sEldenContract = useSEldenContract()

  const handleRedeem = useCallback(
    async (amountToRedeem, duration) => {
      return redeem(sEldenContract, amountToRedeem, duration)
    },
    [sEldenContract],
  )

  return { onRedeem: handleRedeem }
}

export const useFinalizeRedeem = () => {
  const sEldenContract = useSEldenContract()

  const handleFinalizeRedeem = useCallback(
    async (index) => {
      return finalizeRedeem(sEldenContract, index)
    },
    [sEldenContract],
  )

  return { onFinalizeRedeem: handleFinalizeRedeem }
}

export const useCancelRedeem = () => {
  const sEldenContract = useSEldenContract()

  const handleCancelRedeem = useCallback(
    async (index) => {
      return cancelRedeem(sEldenContract, index)
    },
    [sEldenContract],
  )

  return { onCancelRedeem: handleCancelRedeem }
}
