import { useCallback } from 'react'
import { useEldenContract } from 'hooks/useContract1'
import { useERC20 } from './useContract'

const options = {}

const approveToken = async (eldenContract, amountToApprove, spender) => {
  return eldenContract.write.approve([spender, amountToApprove], { ...options })
}

const useApproveToken = (tokenAddress) => {
  const eldenContract = useERC20(tokenAddress)

  const handleApprove = useCallback(
    async (amountToApprove, spender) => {
      return approveToken(eldenContract, amountToApprove, spender)
    },
    [eldenContract],
  )

  return { onApprove: handleApprove }
}

export default useApproveToken
