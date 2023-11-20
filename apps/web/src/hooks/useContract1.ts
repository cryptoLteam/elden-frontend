import { useWalletClient } from 'wagmi'
import { useMemo } from 'react'
import {
  getDividendsContract,
  getEldenContract,
  getEsNFTPoolContract,
  getEsNFTPoolFactoryContract,
  getLaunchpadContract,
  getRunePoolContract,
  getRunePoolFactoryContract,
  getSEldenContract,
  getYieldBoosterContract,
} from 'utils/contractHelpers1'
import { useActiveChainId } from './useActiveChainId'

export const useEldenContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getEldenContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useSEldenContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getSEldenContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useDividendsContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getDividendsContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useYieldBoosterContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getYieldBoosterContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useRunePoolFactoryContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getRunePoolFactoryContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useLaunchpadContract = (auctionAddress: string) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getLaunchpadContract(auctionAddress, signer ?? undefined, chainId),
    [signer, chainId, auctionAddress],
  )
}

export const useEsNftPoolFactoryContract = (poolFactoryAddress: string) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getEsNFTPoolFactoryContract(poolFactoryAddress, signer ?? undefined, chainId),
    [signer, chainId, poolFactoryAddress],
  )
}

export const useEsNFTPoolContract = (poolAddress: string) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getEsNFTPoolContract(poolAddress, signer ?? undefined, chainId), [signer, chainId, poolAddress])
}

export const useRunePoolContract = (poolAddress: string) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getRunePoolContract(poolAddress, signer ?? undefined, chainId), [signer, chainId, poolAddress])
}
