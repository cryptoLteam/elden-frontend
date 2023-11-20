import { eldenTokenABI } from 'config/abi/IEldenToken'
import { sEldenTokenABI } from 'config/abi/ISEldenToken'
import { eldenMasterABI } from 'config/abi/IEldenMaster'
import { eldenNftFactoryABI } from 'config/abi/IEldenNftFactory'
import { eldenYieldBoosterABI } from 'config/abi/IEldenYieldBooster'
import { eldenLaunchpadABI } from 'config/abi/IEldenLaunchpad'
import { eldenDividendsABI } from 'config/abi/IEldenDividends'
import { positionHelperABI } from 'config/abi/IPositionHelper'

import {
  ELDEN_ADDRESS,
  SELDEN_ADDRESS,
  ELDEN_MASTER,
  NFT_POOL_FACTORY_ADDRESS,
  YIELD_BOOSTER_ADDRESS,
  DIVIDENDS_ADDRESS,
  LAUNCHPAD_ADDRESS,
  POSITION_HELPER_ADDRESS,
} from 'config/constants/elden'

import { useContract } from 'hooks/useContract'
import { publicClient } from './wagmi'

export function usePositionHelperContract() {
  return useContract(POSITION_HELPER_ADDRESS, positionHelperABI)
}

export function useNftFactoryContract() {
  return useContract(NFT_POOL_FACTORY_ADDRESS, eldenNftFactoryABI)
}

export async function getNftPoolAddress(chainId: number, lpAddress: `0x${string}`) {
  return publicClient({ chainId })
    .readContract({
      abi: eldenNftFactoryABI,
      address: NFT_POOL_FACTORY_ADDRESS,
      functionName: 'getPool',
      args: [lpAddress],
    })
    .then((response) => {
      return response
    })
    .catch((error) => {
      return undefined
    })
}
