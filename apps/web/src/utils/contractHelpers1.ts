import { Abi, PublicClient, WalletClient, getContract as viemGetContract } from 'viem'
import { Address, erc20ABI, erc721ABI } from 'wagmi'
import { ChainId } from '@pancakeswap/chains'
import { getViemClients, viemClients } from 'utils/viem'
import { eldenTokenABI } from 'config/abi/IEldenToken'
import {
  DIVIDENDS_ADDRESS,
  ELDEN_ADDRESS,
  RUNE_POOL_FACTORY_ADDRESS,
  SELDEN_ADDRESS,
  YIELD_BOOSTER_ADDRESS,
} from 'config/constants/elden'
import { sEldenTokenABI } from 'config/abi/ISEldenToken'
import { eldenDividendsABI } from 'config/abi/IEldenDividends'
import { nftPoolABI } from 'config/abi/nftPool'
import { eldenYieldBoosterABI } from 'config/abi/IEldenYieldBooster'
import { runePoolABI } from 'config/abi/runePool'
import { runePoolFactoryABI } from 'config/abi/runePoolFactory'
import { fairAuctionABI } from 'config/abi/fairAuction'
import { nftPoolFactoryABI } from 'config/abi/nftPoolFactory'

export const getContract = <TAbi extends Abi | unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.SCROLL_SEPOLIA,
  publicClient,
  signer,
}: {
  abi: TAbi
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    publicClient: publicClient ?? viemClients[chainId],
    walletClient: signer,
  })
  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export const getEldenContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: eldenTokenABI,
    address: ELDEN_ADDRESS,
    chainId,
    signer,
  })
}
export const getSEldenContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: sEldenTokenABI,
    address: SELDEN_ADDRESS,
    chainId,
    signer,
  })
}

export const getDividendsContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: eldenDividendsABI,
    address: DIVIDENDS_ADDRESS,
    chainId,
    signer,
  })
}

export const getYieldBoosterContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: eldenYieldBoosterABI,
    address: YIELD_BOOSTER_ADDRESS,
    chainId,
    signer,
  })
}

export const getRunePoolFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: runePoolFactoryABI,
    address: RUNE_POOL_FACTORY_ADDRESS,
    chainId,
    signer,
  })
}

export const getLaunchpadContract = (auctionAddress: string, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: fairAuctionABI,
    address: auctionAddress as `0x${string}`,
    chainId,
    signer,
  })
}

export const getEsNFTPoolContract = (poolAddress: string, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: nftPoolABI,
    address: poolAddress as `0x${string}`,
    chainId,
    signer,
  })
}

export const getEsNFTPoolFactoryContract = (poolFactoryAddress: string, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: nftPoolFactoryABI,
    address: poolFactoryAddress as `0x${string}`,
    chainId,
    signer,
  })
}

export const getRunePoolContract = (poolAddress: string, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: runePoolABI,
    address: poolAddress as `0x${string}`,
    chainId,
    signer,
  })
}
