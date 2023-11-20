import { useCallback } from 'react'
import { useEsNftPoolFactoryContract } from 'hooks/useContract1'
import { useAccount } from 'wagmi'
import { parseUnits } from 'viem'

const options = {}

const create = async (poolFactoryContract, pairAddress) => {
  return poolFactoryContract.write.createPool([pairAddress], { ...options })
}

const useEsNFTFactoryCalls = (poolFactoryAddress: string) => {
  const { address } = useAccount()
  const poolFactoryContract = useEsNftPoolFactoryContract(poolFactoryAddress)

  const handleCreatePool = useCallback(
    async (pairAddress) => {
      return create(poolFactoryContract, pairAddress)
    },
    [poolFactoryContract],
  )

  return {
    onCreatePool: handleCreatePool,
  }
}

export default useEsNFTFactoryCalls
