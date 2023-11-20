import { useCallback } from 'react'
import { useEsNFTPoolContract, useRunePoolContract } from 'hooks/useContract1'

const options = {}

const harvestRunePoolRewards = async (runePoolContract) => {
  return runePoolContract.write.harvest({ ...options })
}

const harvestEsNFTRewards = async (esNFTContract, tokenIds, to) => {
  return esNFTContract.write.harvestPositionsTo([tokenIds, to], { ...options })
}

const withdraw = async (runePoolContract, tokenId) => {
  return runePoolContract.write.withdraw([tokenId], { ...options })
}

const deposit = async (esNFTPoolContract, from, to, tokenId) => {
  return esNFTPoolContract.write.safeTransferFrom([from, to, tokenId], { ...options })
}

const useRunePoolCalls = (runePool, nftPool = '', account = '') => {
  const runePoolContract = useRunePoolContract(runePool)
  const esNFTPoolContract = useEsNFTPoolContract(nftPool)

  const handleHarvestRunePoolRewards = useCallback(async () => {
    return harvestRunePoolRewards(runePoolContract)
  }, [runePoolContract])

  const handleHarvestEsNFTRewards = useCallback(
    async (tokenIds, to) => {
      return harvestEsNFTRewards(esNFTPoolContract, tokenIds, to)
    },
    [esNFTPoolContract],
  )

  const handleWithdraw = useCallback(
    async (tokenId) => {
      return withdraw(runePoolContract, tokenId)
    },
    [runePoolContract],
  )

  const handleDeposit = useCallback(
    async (tokenId) => {
      return deposit(esNFTPoolContract, account, runePool, tokenId)
    },
    [esNFTPoolContract, account, runePool],
  )

  return {
    onHarvestEsNFTReward: handleHarvestEsNFTRewards,
    onHarvestRunePoolReward: handleHarvestRunePoolRewards,
    onWithdraw: handleWithdraw,
    onDeposit: handleDeposit,
  }
}

export default useRunePoolCalls
